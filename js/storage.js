window.Storage = {
  key:"SP_FLYING_CHESS_UI_CONFIG",
  autoSave(){
    try{ localStorage.setItem(Storage.key,JSON.stringify(STATE)); }catch(e){ console.warn(e); }
  },
  loadAutoSave(){
    try{
      const raw=localStorage.getItem(Storage.key);
      if(!raw) return false;
      Storage.applyConfig(JSON.parse(raw));
      return true;
    }catch(e){ console.warn(e); return false; }
  },
  exportConfig(){
    Editor.saveAllFromUI();
    Utils.downloadText("SP-FlyingChess-config.json",JSON.stringify(STATE,null,2));
  },
  importFile(file){
    const reader=new FileReader();
    reader.onload=()=>{
      try{
        Storage.applyConfig(JSON.parse(reader.result));
        Storage.autoSave();
        Renderer.renderAll();
        Renderer.showEvent("配置导入成功");
      }catch(e){ alert("导入失败：不是有效 JSON"); }
    };
    reader.readAsText(file,"utf-8");
  },
  applyConfig(data){
    if(!data || typeof data!=="object") return;
    if(Array.isArray(data.players)) STATE.players=data.players;
    if(Array.isArray(data.bodyParts)) STATE.bodyParts=data.bodyParts;
    if(data.libraries) STATE.libraries=data.libraries;
    if(data.boardConfig) STATE.boardConfig=data.boardConfig;
    if(Array.isArray(data.board)) STATE.board=data.board;
    if(data.game) STATE.game=data.game;
    if(Array.isArray(data.history)) STATE.history=data.history;
  },
  reset(){
    localStorage.removeItem(Storage.key);
    location.reload();
  },
  bind(){
    Utils.el("exportConfigBtn").addEventListener("click",()=>Storage.exportConfig());
    Utils.el("importConfigInput").addEventListener("change",e=>{
      const file=e.target.files[0];
      if(file) Storage.importFile(file);
    });
    Utils.el("resetConfigBtn").addEventListener("click",()=>{
      if(confirm("确定恢复默认配置？")) Storage.reset();
    });
  }
};
