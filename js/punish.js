window.Punish = {
  saveFromUI(){
    STATE.libraries.tools=Utils.lines(Utils.el("toolsInput").value);
    STATE.libraries.postures=Utils.lines(Utils.el("posturesInput").value);
    STATE.maxCount=Number(Utils.el("maxCountInput").value)||1;
  },
  generate(player){
    const part=Body.pickForPlayer(player);
    if(!part) return {text:`${player.name}\n❗ 没有可用身体部位`};
    const tool=Utils.pick(STATE.libraries.tools)||"未设置工具";
    const posture=Utils.pick(STATE.libraries.postures)||"未设置姿势";
    const max=Math.max(1,Number(Utils.el("maxCountInput").value||STATE.maxCount||1));
    const count=Math.max(1,Math.floor(Math.random()*max*Number(part.strength||1))+1);
    return {text:`${player.name}\n❗ ${tool}\n${part.name}\n${count}次\n${posture}`};
  }
};
