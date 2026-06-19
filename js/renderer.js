window.Renderer = {
  renderAll() {
    Renderer.renderInputs();
    Renderer.renderPlayers();
    Renderer.renderBody();
    Renderer.renderBoard();
    Renderer.renderTurnInfo();
    Renderer.renderLog();
  },

  renderInputs() {
    Utils.el("playerCountInput").value = STATE.players.length || 2;

    Utils.el("toolsInput").value = STATE.libraries.tools.join("\n");
    Utils.el("posturesInput").value = STATE.libraries.postures.join("\n");
    Utils.el("maxCountInput").value = STATE.maxCount || 3;

    Utils.el("rewardInput").value = STATE.libraries.reward.join("\n");
    Utils.el("trapInput").value = STATE.libraries.trap.join("\n");
    Utils.el("specialInput").value = STATE.libraries.special.join("\n");

    Utils.el("boardSizeInput").value = STATE.boardConfig.size;

    const columnsInput = Utils.el("boardColumnsInput");
    if (columnsInput) columnsInput.value = STATE.boardConfig.columns || 10;

    Utils.el("rewardWeightInput").value = STATE.boardConfig.weights.reward;
    Utils.el("punishWeightInput").value = STATE.boardConfig.weights.punish;
    Utils.el("specialWeightInput").value = STATE.boardConfig.weights.special;
    Utils.el("trapWeightInput").value = STATE.boardConfig.weights.trap;
  },

  renderPlayers() {
    const root = Utils.el("playersEditor");
    root.innerHTML = "";

    STATE.players.forEach((player, index) => {
      const div = document.createElement("div");
      div.className = "playerCard";
      div.innerHTML = `
        <div class="playerHeader">
          <strong>玩家 ${index + 1}</strong>
          <span>当前位置：${player.pos}</span>
        </div>
        <label>名字</label>
        <input value="${player.name}" data-player-name="${index}">
        <label>性别</label>
        <select data-player-gender="${index}">
          <option value="male" ${player.gender === "male" ? "selected" : ""}>男</option>
          <option value="female" ${player.gender === "female" ? "selected" : ""}>女</option>
        </select>
      `;
      root.appendChild(div);
    });

    root.querySelectorAll("[data-player-name]").forEach(input => {
      input.addEventListener("input", e => {
        Players.update(Number(e.target.dataset.playerName), {
          name: e.target.value || "玩家"
        });
      });
    });

    root.querySelectorAll("[data-player-gender]").forEach(select => {
      select.addEventListener("change", e => {
        Players.update(Number(e.target.dataset.playerGender), {
          gender: e.target.value
        });
      });
    });
  },

  renderBody() {
    const root = Utils.el("bodyEditor");
    root.innerHTML = "";

    STATE.bodyParts.forEach((part, index) => {
      const percent = Body.percent(part);
      const div = document.createElement("div");
      div.className = "bodyCard";
      div.innerHTML = `
        <div class="bodyHeader">
          <strong>${part.name}</strong>
          <span class="bodyMeta">${part.enabled ? percent + "%" : "已禁用"} ${part.femaleOnly ? "｜女性限定" : ""}</span>
        </div>

        <label>
          <input type="checkbox" ${part.enabled ? "checked" : ""} data-body-enabled="${index}">
          启用
        </label>

        <label>
          <input type="checkbox" ${part.femaleOnly ? "checked" : ""} data-body-female="${index}">
          女性限定
        </label>

        <div class="bodyControls">
          <div>
            <label>权重：${part.weight}</label>
            <input type="range" min="1" max="100" value="${part.weight}" data-body-weight="${index}">
            <div class="percentBar"><div class="percentFill" style="width:${percent}%"></div></div>
          </div>
          <div>
            <label>强度：${part.strength}</label>
            <input type="range" min="0.1" max="2" step="0.1" value="${part.strength}" data-body-strength="${index}">
          </div>
        </div>

        <button class="danger" data-body-remove="${index}">删除部位</button>
      `;
      root.appendChild(div);
    });

    root.querySelectorAll("[data-body-enabled]").forEach(input => {
      input.addEventListener("change", e => {
        Body.update(Number(e.target.dataset.bodyEnabled), {
          enabled: e.target.checked
        });
      });
    });

    root.querySelectorAll("[data-body-female]").forEach(input => {
      input.addEventListener("change", e => {
        Body.update(Number(e.target.dataset.bodyFemale), {
          femaleOnly: e.target.checked
        });
      });
    });

    root.querySelectorAll("[data-body-weight]").forEach(input => {
      input.addEventListener("input", e => {
        Body.update(Number(e.target.dataset.bodyWeight), {
          weight: Number(e.target.value)
        });
      });
    });

    root.querySelectorAll("[data-body-strength]").forEach(input => {
      input.addEventListener("input", e => {
        Body.update(Number(e.target.dataset.bodyStrength), {
          strength: Number(e.target.value)
        });
      });
    });

    root.querySelectorAll("[data-body-remove]").forEach(button => {
      button.addEventListener("click", e => {
        Body.remove(Number(e.target.dataset.bodyRemove));
      });
    });
  },

  pathPosition(index) {
    const cols = STATE.boardConfig.columns || 10;
    const gapX = 82;
    const gapY = 78;
    const padX = 20;
    const padY = 18;

    const row = Math.floor(index / cols);
    const colInRow = index % cols;

    // 蛇形：偶数行从左到右，奇数行从右到左。
    const col = row % 2 === 0 ? colInRow : cols - 1 - colInRow;

    return {
      x: padX + col * gapX,
      y: padY + row * gapY,
      row,
      col
    };
  },

  iconFor(cell) {
    if (cell.type === "start") return { html: "💗", label: "START", extraClass: "startIcon" };
    if (cell.type === "goal") return { html: "🏁", label: "GOAL", extraClass: "goalIcon" };

    // 按你的要求：
    // 奖励 = √
    // 陷阱 = 小 ×
    // 特殊 = 上传的翅膀图标
    if (cell.type === "reward") return { html: "✓", label: "", extraClass: "rewardCheckIcon" };
    if (cell.type === "trap") return { html: "×", label: "", extraClass: "trapCrossIcon" };
    if (cell.type === "special") {
      return {
        html: '<img class="specialWingIcon" src="assets/special-wing.png" alt="特殊">',
        label: "",
        extraClass: "specialWingIconWrap"
      };
    }

    if (cell.type === "punish") return { html: "💣", label: "", extraClass: "punishBombIcon" };
    return { html: "", label: "", extraClass: "" };
  },

  renderPathLines() {
    const maxIndex = STATE.board.length - 1;
    if (maxIndex < 1) return "";

    let lines = "";

    for (let i = 0; i < maxIndex; i++) {
      const a = Renderer.pathPosition(i);
      const b = Renderer.pathPosition(i + 1);

      const x1 = a.x + 29;
      const y1 = a.y + 29;
      const x2 = b.x + 29;
      const y2 = b.y + 29;

      lines += `<line class="pathLine" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
    }

    return `<svg class="pathLineSvg" width="100%" height="100%">${lines}</svg>`;
  },

  renderBoard() {
    const board = Utils.el("board");
    const cols = STATE.boardConfig.columns || 10;
    const rows = Math.ceil(Math.max(STATE.board.length, 1) / cols);

    board.style.width = (cols * 82 + 70) + "px";
    board.style.height = (rows * 78 + 80) + "px";

    board.innerHTML = Renderer.renderPathLines();

    STATE.board.forEach((cell, index) => {
      const pos = Renderer.pathPosition(index);
      const meta = Renderer.iconFor(cell);

      const div = document.createElement("div");
      div.className = "cell " + cell.type;
      div.dataset.index = index;
      div.style.left = pos.x + "px";
      div.style.top = pos.y + "px";

      const playersHere = STATE.players
        .filter(p => p.pos === index)
        .map(p => `<span class="playerToken">${p.name}</span>`)
        .join("");

      div.innerHTML = `
        ${playersHere ? `<div class="playerStack">${playersHere}</div>` : ""}
        <div class="cellIcon ${meta.extraClass || ""}">${meta.html}</div>
        ${meta.label ? `<div class="cellLabel">${meta.label}</div>` : ""}
        <div class="cellIndex">${index}</div>
      `;

      board.appendChild(div);
    });

    setTimeout(() => Renderer.fitBoardToScreen && Renderer.fitBoardToScreen(), 0);
  },

  cellCenter(index) {
    const cell = document.querySelector(`.cell[data-index="${index}"]`);
    if (!cell) return null;

    return {
      left: cell.offsetLeft + cell.offsetWidth / 2,
      top: cell.offsetTop + cell.offsetHeight / 2
    };
  },

  animateMove(player, from, to) {
    return new Promise(resolve => {
      Renderer.renderBoard();

      const board = Utils.el("board");
      const start = Renderer.cellCenter(from);
      const end = Renderer.cellCenter(to);

      if (!start || !end || from === to) {
        resolve();
        return;
      }

      const token = document.createElement("div");
      token.className = "movingToken";
      token.textContent = player.name;
      board.appendChild(token);

      token.style.left = (start.left - 20) + "px";
      token.style.top = (start.top - 17) + "px";

      requestAnimationFrame(() => {
        token.style.left = (end.left - 20) + "px";
        token.style.top = (end.top - 17) + "px";
      });

      setTimeout(() => {
        token.remove();
        resolve();
      }, 280);
    });
  },

  renderTurnInfo() {
    const info = Utils.el("turnInfo");

    if (!STATE.game.started) {
      info.textContent = STATE.board.length ? "棋盘已生成，等待开始" : "等待生成棋盘";
      return;
    }

    if (STATE.game.finished) {
      info.textContent = "游戏结束";
      return;
    }

    const current = Players.current();
    info.textContent = current ? `当前回合：${current.name}` : "无玩家";
  },

  showEvent(text) {
    Utils.el("eventContent").textContent = text;
    if (window.SoundFX) SoundFX.event();
  },

  addLog(text) {
    STATE.history.unshift({
      time: new Date().toLocaleTimeString(),
      text
    });
    Renderer.renderLog();
  },

  renderLog() {
    const root = Utils.el("logList");
    root.innerHTML = "";

    STATE.history.slice(0, 60).forEach(item => {
      const div = document.createElement("div");
      div.className = "logItem";
      div.textContent = `[${item.time}] ${item.text}`;
      root.appendChild(div);
    });
  },

  showWinnerModal(player) {
    let overlay = document.getElementById("winnerOverlay");

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "winnerOverlay";
      overlay.innerHTML = `
        <div class="winnerModal">
          <button class="winnerClose" id="winnerCloseBtn">×</button>
          <div class="winnerCrown">👑</div>
          <div class="winnerAvatar">
            <span class="winnerHeart">❤</span>
            <span id="winnerName"></span>
          </div>
          <div class="winnerTitle">胜者诞生</div>
          <div class="winnerPrize">
            奖品：至高无上的权利<br>
            玩家获得任意处置其余玩家的权利
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      overlay.addEventListener("click", (e) => {
        if (e.target.id === "winnerOverlay" || e.target.id === "winnerCloseBtn") {
          overlay.classList.remove("show");
        }
      });
    }

    const name = document.getElementById("winnerName");
    if (name) name.textContent = player.name;

    overlay.classList.add("show");
    if (window.SoundFX) SoundFX.win();
  }
,

  fitBoardToScreen() {
    const board = Utils.el("board");
    const wrap = Utils.el("boardWrap");
    if (!board || !wrap) return;

    board.style.transform = "";
    board.classList.remove("boardFit");

    const boardRect = board.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();

    const scaleX = (wrapRect.width - 24) / boardRect.width;
    const scaleY = (wrapRect.height - 24) / boardRect.height;
    const scale = Math.min(1, scaleX, scaleY);

    if (scale < 1) {
      board.classList.add("boardFit");
      board.style.transform = `scale(${scale})`;
      wrap.style.minHeight = (boardRect.height * scale + 36) + "px";
    }
  }

};
