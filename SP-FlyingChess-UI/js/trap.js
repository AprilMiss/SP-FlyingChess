window.Trap = {
  saveFromUI(){ STATE.libraries.trap=Utils.lines(Utils.el("trapInput").value); },
  random(){ return Utils.pick(STATE.libraries.trap); }
};
