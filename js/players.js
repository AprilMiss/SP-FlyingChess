window.Players = {
  init(count){
    const n=Utils.clamp(Number(count)||1,1,12);
    STATE.players=[];
    for(let i=0;i<n;i++){
      STATE.players.push({name:"P"+(i+1),gender:"male",pos:0,skipTurn:false,shield:false});
    }
    STATE.game.turn=0; STATE.game.started=false; STATE.game.finished=false;
    Renderer.renderPlayers(); Renderer.renderBoard(); Renderer.renderTurnInfo();
  },
  update(index,patch){
    if(!STATE.players[index]) return;
    STATE.players[index]={...STATE.players[index],...patch};
    Renderer.renderBoard(); Renderer.renderTurnInfo();
  },
  current(){
    if(!STATE.players.length) return null;
    return STATE.players[STATE.game.turn % STATE.players.length];
  },
  resetPositions(){
    STATE.players.forEach(p=>{ p.pos=0; p.skipTurn=false; p.shield=false; });
  }
};
