window.PWAHelper = {
  deferredPrompt: null,

  init() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      PWAHelper.deferredPrompt = e;
      PWAHelper.showInstallButton();
    });

    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js").catch(console.warn);
      });
    }

    PWAHelper.injectMobileTools();
  },

  showInstallButton() {
    if (document.getElementById("pwaInstallBtn")) return;

    const btn = document.createElement("button");
    btn.id = "pwaInstallBtn";
    btn.textContent = "📱 安装到手机桌面";
    btn.addEventListener("click", async () => {
      if (!PWAHelper.deferredPrompt) return;
      PWAHelper.deferredPrompt.prompt();
      await PWAHelper.deferredPrompt.userChoice;
      PWAHelper.deferredPrompt = null;
      btn.remove();
    });

    const topBar = document.querySelector(".topBar") || document.body;
    topBar.appendChild(btn);
  },

  injectMobileTools() {
    if (document.getElementById("mobileTools")) return;

    const box = document.createElement("div");
    box.id = "mobileTools";
    box.innerHTML = `
      <button id="soundToggleBtn" type="button">🔊 音效开</button>
      <button id="fitBoardBtn" type="button">🔍 适配棋盘</button>
    `;

    const topBar = document.querySelector(".topBar");
    if (topBar) topBar.appendChild(box);

    const soundBtn = document.getElementById("soundToggleBtn");
    if (soundBtn) {
      soundBtn.addEventListener("click", () => {
        SoundFX.enabled = !SoundFX.enabled;
        soundBtn.textContent = SoundFX.enabled ? "🔊 音效开" : "🔇 音效关";
        localStorage.setItem("SP_SOUND_ENABLED", SoundFX.enabled ? "1" : "0");
      });
    }

    const fitBtn = document.getElementById("fitBoardBtn");
    if (fitBtn) {
      fitBtn.addEventListener("click", () => {
        if (window.Renderer && Renderer.fitBoardToScreen) Renderer.fitBoardToScreen();
      });
    }
  }
};

window.SoundFX = {
  enabled: localStorage.getItem("SP_SOUND_ENABLED") !== "0",

  beep(freq = 440, duration = 0.08, type = "sine", gain = 0.045) {
    if (!SoundFX.enabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = SoundFX.ctx || (SoundFX.ctx = new AudioContext());
      const osc = ctx.createOscillator();
      const vol = ctx.createGain();

      osc.type = type;
      osc.frequency.value = freq;
      vol.gain.value = gain;

      osc.connect(vol);
      vol.connect(ctx.destination);
      osc.start();

      vol.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  },

  roll() {
    SoundFX.beep(520, 0.06, "triangle", 0.035);
    setTimeout(() => SoundFX.beep(720, 0.06, "triangle", 0.035), 80);
  },

  event() {
    SoundFX.beep(660, 0.08, "sine", 0.04);
  },

  win() {
    SoundFX.beep(523, 0.12, "triangle", 0.045);
    setTimeout(() => SoundFX.beep(659, 0.12, "triangle", 0.045), 140);
    setTimeout(() => SoundFX.beep(784, 0.18, "triangle", 0.045), 280);
  }
};

PWAHelper.init();
