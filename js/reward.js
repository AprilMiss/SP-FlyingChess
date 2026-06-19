window.Reward = {
  saveFromUI(){ STATE.libraries.reward=Utils.lines(Utils.el("rewardInput").value); },
  random(){ return Utils.pick(STATE.libraries.reward); }
};
