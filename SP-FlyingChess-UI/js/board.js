window.Board = {
  saveFromUI() {
    STATE.boardConfig.size = Utils.clamp(Number(Utils.el("boardSizeInput").value) || 50, 5, 300);

    const columnsInput = Utils.el("boardColumnsInput");
    STATE.boardConfig.columns = Utils.clamp(Number(columnsInput ? columnsInput.value : STATE.boardConfig.columns) || 10, 5, 14);

    STATE.boardConfig.weights.reward = Number(Utils.el("rewardWeightInput").value) || 0;
    STATE.boardConfig.weights.punish = Number(Utils.el("punishWeightInput").value) || 0;
    STATE.boardConfig.weights.special = Number(Utils.el("specialWeightInput").value) || 0;
    STATE.boardConfig.weights.trap = Number(Utils.el("trapWeightInput").value) || 0;
  },

  generate() {
    Board.saveFromUI();

    const types = [
      { type: "reward", weight: STATE.boardConfig.weights.reward },
      { type: "punish", weight: STATE.boardConfig.weights.punish },
      { type: "special", weight: STATE.boardConfig.weights.special },
      { type: "trap", weight: STATE.boardConfig.weights.trap }
    ].filter(x => Number(x.weight) > 0);

    if (!types.length) {
      alert("至少需要一个格子类型的权重大于 0");
      return;
    }

    STATE.board = [];

    for (let i = 0; i < STATE.boardConfig.size; i++) {
      const picked = Utils.weightedPick(types, "weight");
      STATE.board.push({
        index: i,
        type: picked.type
      });
    }

    // 起点和终点固定，不参与事件触发。
    STATE.board[0] = { index: 0, type: "start" };
    STATE.board[STATE.board.length - 1] = {
      index: STATE.board.length - 1,
      type: "goal"
    };

    STATE.game.started = false;
    STATE.game.finished = false;
    STATE.game.turn = 0;
    STATE.game.animating = false;

    Players.resetPositions();

    Utils.setStatus("boardStatus", "已生成");
    Renderer.renderBoard();
    Renderer.renderTurnInfo();
    Renderer.showEvent("棋盘已生成。\n不满意可以重新生成，满意后点击开始游戏。");

    Storage.autoSave();
  }
};
