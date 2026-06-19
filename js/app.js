window.App = {
  init() {
    Players.init(2);

    Storage.loadAutoSave();

    App.normalizeRandomMoveText();

    Editor.init();
    Storage.bind();

    Renderer.renderAll();

    if (!STATE.board.length) {
      Renderer.showEvent("请按左侧流程设置：玩家 → 惩罚词库 → 身体部位 → 奖励/陷阱/特殊 → 生成棋盘。");
    }

    Storage.autoSave();
  },

  normalizeRandomMoveText() {
    const normalizeLine = (line) => {
      let text = String(line || "").trim();

      // 把旧词库里类似“前进3格 / 后退3格 / 额外移动2格”
      // 显示层面也改成随机 1-4 格，避免界面看起来没变化。
      text = text.replace(/前进\s*\d+\s*格/g, "随机前进1-4格");
      text = text.replace(/后退\s*\d+\s*格/g, "随机后退1-4格");
      text = text.replace(/额外移动\s*\d+\s*格/g, "随机前进1-4格");
      text = text.replace(/移动\s*\d+\s*格/g, "随机前进1-4格");

      return text;
    };

    if (STATE.libraries) {
      if (Array.isArray(STATE.libraries.reward)) {
        STATE.libraries.reward = STATE.libraries.reward.map(normalizeLine);
      }

      if (Array.isArray(STATE.libraries.trap)) {
        STATE.libraries.trap = STATE.libraries.trap.map(normalizeLine);
      }

      if (Array.isArray(STATE.libraries.special)) {
        STATE.libraries.special = STATE.libraries.special.map(normalizeLine);
      }
    }
  }
};

window.addEventListener("load", () => App.init());
