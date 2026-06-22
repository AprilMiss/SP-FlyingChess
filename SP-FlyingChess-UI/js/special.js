window.Special = {
  saveFromUI(){ STATE.libraries.special=Utils.lines(Utils.el("specialInput").value); },
  random(){ return Utils.pick(STATE.libraries.special); }
};
