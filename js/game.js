window.Game = {
  start() {
    if (!STATE.board.length) {
      alert("请先生成棋盘");
      return;
    }

    if (!STATE.players.length) {
      alert("请先初始化玩家");
      return;
    }

    STATE.game.started = true;
    STATE.game.finished = false;
    STATE.game.turn = 0;
    STATE.game.animating = false;

    Players.resetPositions();

    Renderer.renderBoard();
    Renderer.renderTurnInfo();
    Renderer.showEvent("游戏开始。\n轮到 " + Players.current().name);
    Renderer.addLog("游戏开始");
  },

  async roll() {
    if (STATE.game.animating) return;

    if (!STATE.game.started) {
      Renderer.showEvent("请先开始游戏");
      return;
    }

    if (STATE.game.finished) {
      Renderer.showEvent("游戏已结束，请重新生成棋盘或重新开始。");
      return;
    }

    const player = Players.current();
    if (!player) return;

    if (player.skipTurn) {
      player.skipTurn = false;
      Renderer.showEvent(`${player.name}\n跳过本回合`);
      Renderer.addLog(`${player.name} 跳过本回合`);
      STATE.game.turn++;
      Renderer.renderTurnInfo();
      Storage.autoSave();
      return;
    }

    if (window.SoundFX) SoundFX.roll();

    const step = Math.floor(Math.random() * 6) + 1;
    const from = player.pos;
    const to = Utils.clamp(player.pos + step, 0, STATE.board.length - 1);

    STATE.game.animating = true;
    await Renderer.animateMove(player, from, to);
    player.pos = to;
    STATE.game.animating = false;

    let eventText = `${player.name}\n🎲 前进 ${step} 格`;
    eventText += await Game.resolveCurrentCell(player, 0);

    if (player.pos >= STATE.board.length - 1) {
      STATE.game.finished = true;
      eventText += `\n\n🏁 ${player.name} 到达终点`;
      Renderer.showWinnerModal(player);
    }

    const hasExtraRoll = !!player.extraRoll && !STATE.game.finished;
    if (hasExtraRoll) {
      player.extraRoll = false;
      eventText += `\n\n🎲 ${player.name} 获得额外一次掷骰机会\n仍由 ${player.name} 行动`;
    }

    Renderer.showEvent(eventText);
    Renderer.addLog(eventText.replace(/\n/g, " / "));

    if (!hasExtraRoll) {
      STATE.game.turn++;
    }

    Renderer.renderBoard();
    Renderer.renderTurnInfo();
    Storage.autoSave();
  },

  async resolveCurrentCell(player, depth = 0) {
    if (depth > 8) {
      return "\n\n⚠ 连锁触发过多，已自动停止";
    }

    const cell = STATE.board[player.pos];
    if (!cell) return "";

    if (cell.type === "start") {
      return `\n\n${player.name}\n💗 START`;
    }

    if (cell.type === "goal") {
      return `\n\n${player.name}\n🏁 GOAL`;
    }

    let resultText = "";

    if (cell.type === "reward") {
      const text = Reward.random() || "未设置奖励";
      resultText += `\n\n${player.name}\n🎁 ${text}`;
      resultText += await Game.applyTextEffectAndTrigger(player, text, depth);
      return resultText;
    }

    if (cell.type === "trap") {
      const text = Trap.random() || "未设置陷阱";

      if (player.shield) {
        player.shield = false;
        return `\n\n${player.name}\n🛡 护盾抵消陷阱：${text}`;
      }

      resultText += `\n\n${player.name}\n⚠ ${text}`;
      resultText += await Game.applyTextEffectAndTrigger(player, text, depth);
      return resultText;
    }

    if (cell.type === "special") {
      const text = Special.random() || "未设置特殊事件";
      resultText += `\n\n${player.name}\n✨ ${text}`;
      resultText += await Game.applyTextEffectAndTrigger(player, text, depth);
      return resultText;
    }

    if (cell.type === "punish") {
      if (player.shield) {
        player.shield = false;
        return `\n\n${player.name}\n🛡 护盾抵消惩罚`;
      }

      return "\n\n" + Punish.generate(player).text;
    }

    return "";
  },

  async applyTextEffectAndTrigger(player, text, depth) {
    const before = player.pos;
    const effectText = Game.tryApplyTextEffect(player, text);

    if (player.pos !== before) {
      STATE.game.animating = true;
      await Renderer.animateMove(player, before, player.pos);
      STATE.game.animating = false;

      let chainText = effectText ? `\n${effectText}` : "";
      chainText += await Game.resolveCurrentCell(player, depth + 1);
      return chainText;
    }

    return effectText ? `\n${effectText}` : "";
  },

  tryApplyTextEffect(player, text) {
    const s = String(text || "");
    let effectInfo = "";

    // 额外掷骰：支持多种写法
    // “再掷一次 / 再摇一次 / 额外摇色子 / 额外掷骰 / 再掷 / 再摇”
    if (
      s.includes("再掷一次") ||
      s.includes("再摇一次") ||
      s.includes("额外摇色子") ||
      s.includes("额外摇骰子") ||
      s.includes("额外掷骰") ||
      s.includes("额外骰子") ||
      s.includes("再掷") ||
      s.includes("再摇")
    ) {
      player.extraRoll = true;
      effectInfo = "🎲 获得额外一次掷骰机会";
    }

    // 只要出现“前进”，实际随机前进 1-4 格
    if (s.includes("前进")) {
      const n = Math.floor(Math.random() * 4) + 1;
      player.pos = Utils.clamp(player.pos + n, 0, STATE.board.length - 1);
      effectInfo = `↪ 随机前进 ${n} 格`;
    }

    // 只要出现“后退”，实际随机后退 1-4 格
    if (s.includes("后退")) {
      const n = Math.floor(Math.random() * 4) + 1;
      player.pos = Utils.clamp(player.pos - n, 0, STATE.board.length - 1);
      effectInfo = `↩ 随机后退 ${n} 格`;
    }

    if (s.includes("回到起点")) {
      player.pos = 0;
      effectInfo = "↩ 回到起点";
    }

    if (s.includes("跳过一回合")) {
      player.skipTurn = true;
      effectInfo = effectInfo || "⏸ 跳过一回合";
    }

    if (s.includes("免疫") || s.includes("护盾")) {
      player.shield = true;
      effectInfo = effectInfo || "🛡 获得一次免疫";
    }

    if (s.includes("交换位置") || s.includes("换位")) {
      const other = Utils.pick(STATE.players.filter(p => p !== player));
      if (other) {
        const oldPlayerPos = player.pos;
        player.pos = other.pos;
        other.pos = oldPlayerPos;
        effectInfo = `⇄ 与 ${other.name} 交换位置`;
      }
    }

    return effectInfo;
  }
};
