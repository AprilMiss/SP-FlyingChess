window.Body = {
  totalWeight(){
    return STATE.bodyParts.filter(p=>p.enabled).reduce((s,p)=>s+Number(p.weight||0),0);
  },
  percent(part){
    const total=Body.totalWeight();
    if(!total || !part.enabled) return "0.0";
    return ((Number(part.weight||0)/total)*100).toFixed(1);
  },
  add(name){
    const clean=String(name||"").trim();
    if(!clean) return;
    STATE.bodyParts.push({name:clean,weight:10,strength:1,enabled:true,femaleOnly:false});
    Renderer.renderBody(); Storage.autoSave();
  },
  remove(index){
    STATE.bodyParts.splice(index,1);
    Renderer.renderBody(); Storage.autoSave();
  },
  update(index,patch){
    if(!STATE.bodyParts[index]) return;
    STATE.bodyParts[index]={...STATE.bodyParts[index],...patch};
    Renderer.renderBody(); Storage.autoSave();
  },
  availableForPlayer(player){
    return STATE.bodyParts.filter(part=>{
      if(!part.enabled) return false;
      if(part.femaleOnly && player.gender!=="female") return false;
      return Number(part.weight)>0;
    });
  },
  pickForPlayer(player){
    return Utils.weightedPick(Body.availableForPlayer(player),"weight");
  }
};
