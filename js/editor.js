window.Editor = {
  init(){
    document.querySelectorAll(".sectionHeader").forEach(btn=>{
      btn.addEventListener("click",()=>{
        const target=Utils.el(btn.dataset.target);
        if(target) target.classList.toggle("collapsed");
      });
    });
    Utils.el("initPlayersBtn").addEventListener("click",()=>{
      Players.init(Utils.el("playerCountInput").value);
      Utils.setStatus("playersStatus","已生成");
      Storage.autoSave();
    });
    Utils.el("addBodyPartBtn").addEventListener("click",()=>{
      Body.add(Utils.el("newBodyNameInput").value);
      Utils.el("newBodyNameInput").value="";
    });
    Utils.el("generateBoardBtn").addEventListener("click",()=>Board.generate());
    Utils.el("regenerateBoardBtn").addEventListener("click",()=>Board.generate());
    Utils.el("startGameBtn").addEventListener("click",()=>Game.start());
    Utils.el("rollDiceBtn").addEventListener("click",()=>Game.roll());
    document.querySelectorAll(".saveBtn").forEach(btn=>{
      btn.addEventListener("click",()=>Editor.saveSection(btn.dataset.save));
    });
  },

  saveSection(name){
    if(name==="players") Utils.setStatus("playersStatus","已保存");
    if(name==="punish"){ Punish.saveFromUI(); Utils.setStatus("punishStatus","已保存"); }
    if(name==="body") Utils.setStatus("bodyStatus","已保存");
    if(name==="reward"){ Reward.saveFromUI(); Utils.setStatus("rewardStatus","已保存"); }
    if(name==="trap"){ Trap.saveFromUI(); Utils.setStatus("trapStatus","已保存"); }
    if(name==="special"){ Special.saveFromUI(); Utils.setStatus("specialStatus","已保存"); }
    if(name==="board"){ Board.saveFromUI(); Utils.setStatus("boardStatus",STATE.board.length?"已生成":"已保存"); }
    Storage.autoSave();
    const btn=document.querySelector(`[data-save="${name}"]`);
    const content=btn?btn.closest(".sectionContent"):null;
    if(content) content.classList.add("collapsed");
  },

  saveAllFromUI(){
    Punish.saveFromUI(); Reward.saveFromUI(); Trap.saveFromUI(); Special.saveFromUI(); Board.saveFromUI();
  }
};
