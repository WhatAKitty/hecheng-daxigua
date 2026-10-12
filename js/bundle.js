"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __decorateClass = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
    for (var i = decorators.length - 1, decorator; i >= 0; i--)
      if (decorator = decorators[i])
        result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result) __defProp(target, key, result);
    return result;
  };
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // src/FruitDef.ts
  var FRUITS = [
    { level: 0, name: "樱桃", radius: 21, color: "#e5484d", dark: "#a8242a", light: "#ff9a9e", score: 1 },
    { level: 1, name: "草莓", radius: 30, color: "#f2668b", dark: "#bd3d63", light: "#ffa8c0", score: 3 },
    { level: 2, name: "葡萄", radius: 40, color: "#9b6bdf", dark: "#6d43b0", light: "#c8a9f4", score: 6 },
    { level: 3, name: "柠檬", radius: 52, color: "#f7ce46", dark: "#c19a15", light: "#ffea96", score: 10 },
    { level: 4, name: "橘子", radius: 66, color: "#ff9838", dark: "#c96f14", light: "#ffc985", score: 15 },
    { level: 5, name: "苹果", radius: 81, color: "#ee5040", dark: "#b72d20", light: "#ff9080", score: 21 },
    { level: 6, name: "梨", radius: 98, color: "#c5dd66", dark: "#8fa934", light: "#e4f3a0", score: 28 },
    { level: 7, name: "桃子", radius: 116, color: "#ffb3a7", dark: "#d17c6d", light: "#ffd9d0", score: 36 },
    { level: 8, name: "菠萝", radius: 136, color: "#f5c65a", dark: "#bd8f22", light: "#ffe9a3", score: 45 },
    { level: 9, name: "哈密瓜", radius: 158, color: "#b8e05e", dark: "#7fa72e", light: "#d9f4a0", score: 55 },
    { level: 10, name: "西瓜", radius: 182, color: "#5fb75f", dark: "#357f37", light: "#9ed99e", score: 66 }
  ];
  var DROPPABLE_LEVELS = [0, 0, 0, 1, 1, 2, 2, 3, 4];
  var MAX_LEVEL = FRUITS.length - 1;
  var DOUBLE_MELO_BONUS = 100;

  // src/Fruit.ts
  var Fruit = class extends Laya.Sprite {
    constructor(level) {
      super();
      this.level = 0;
      /** 是否在场（未销毁） */
      this.alive = true;
      /** 已进入合成队列（防重复配对） */
      this.merging = false;
      /** 持续压线时长(ms) */
      this.overSince = 0;
      this.bornAt = 0;
      /** 实时速度(px/s)，由主循环计算：落定判定（合成/判负）用 */
      this.speed = 0;
      /** 上一帧位置 */
      this.lastX = 0;
      this.lastY = 0;
      this.level = level;
      const def = FRUITS[level];
      const r = def.radius;
      this.size(r * 2, r * 2);
      const g = this.graphics;
      g.drawCircle(r, r, r - 1, def.color, def.dark, Math.max(2, r * 0.06));
      g.drawCircle(r * 0.62, r * 0.6, r * 0.26, def.light);
      const eyeR = Math.max(2, r * 0.09);
      g.drawCircle(r * 0.66, r * 0.92, eyeR, "#40342e");
      g.drawCircle(r * 1.34, r * 0.92, eyeR, "#40342e");
      g.drawCircle(r * 0.66 + eyeR * 0.35, r * 0.92 - eyeR * 0.35, eyeR * 0.35, "#ffffff");
      g.drawCircle(r * 1.34 + eyeR * 0.35, r * 0.92 - eyeR * 0.35, eyeR * 0.35, "#ffffff");
      g.drawPath(0, 0, [
        ["moveTo", r * 0.7, r * 1.2],
        ["quadraticCurveTo", r, r * 1.42, r * 1.3, r * 1.2]
      ], null, { strokeStyle: "#40342e", lineWidth: Math.max(2, r * 0.07) });
      g.drawCircle(r * 0.48, r * 1.12, r * 0.11, "#ffffff66");
      g.drawCircle(r * 1.52, r * 1.12, r * 0.11, "#ffffff66");
    }
    get radius() {
      return FRUITS[this.level].radius;
    }
  };

  // src/Daily.ts
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function() {
      a |= 0;
      a = a + 1831565813 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function dailySeed() {
    const d = /* @__PURE__ */ new Date();
    return d.getFullYear() * 1e4 + (d.getMonth() + 1) * 100 + d.getDate();
  }
  function dailyLabel() {
    const d = /* @__PURE__ */ new Date();
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  }

  // src/effects.ts
  function popIn(target, delayMs = 0) {
    target.scale(0.2, 0.2);
    const grow = () => {
      Laya.Tween.to(
        target,
        { scaleX: 1.12, scaleY: 1.12 },
        140,
        Laya.Ease.quadOut,
        Laya.Handler.create(null, () => {
          Laya.Tween.to(target, { scaleX: 1, scaleY: 1 }, 110, Laya.Ease.backOut);
        })
      );
    };
    if (delayMs > 0) Laya.timer.once(delayMs, null, grow);
    else grow();
  }
  function squash(target) {
    target.scale(0.8, 1.24);
    Laya.Tween.to(target, { scaleX: 1, scaleY: 1 }, 200, Laya.Ease.backOut);
  }
  function shockwave(parent, x, y, color, scale = 3.2) {
    const mk = (radius, lineW, dur, delay) => {
      const ring = new Laya.Sprite();
      ring.size(radius * 2, radius * 2);
      ring.graphics.drawCircle(radius, radius, radius - lineW / 2, null, color, lineW);
      ring.pivot(radius, radius);
      ring.pos(x, y);
      ring.scale(0.25, 0.25);
      parent.addChild(ring);
      const fire = () => {
        Laya.Tween.to(
          ring,
          { scaleX: scale, scaleY: scale, alpha: 0 },
          dur,
          Laya.Ease.quadOut,
          Laya.Handler.create(null, () => ring.destroy())
        );
      };
      if (delay > 0) Laya.timer.once(delay, null, fire);
      else fire();
    };
    mk(56, 9, 420, 0);
    mk(56, 4, 500, 90);
  }
  function rays(parent, x, y, color) {
    const sp = new Laya.Sprite();
    const R = 90;
    sp.size(R * 2, R * 2);
    const g = sp.graphics;
    for (let i = 0; i < 12; i++) {
      const ang = i / 12 * Math.PI * 2 + Math.random() * 0.2;
      const r0 = 34 + Math.random() * 14;
      const r1 = r0 + 26 + Math.random() * 22;
      g.drawPath(0, 0, [
        ["moveTo", R + Math.cos(ang) * r0, R + Math.sin(ang) * r0],
        ["lineTo", R + Math.cos(ang) * r1, R + Math.sin(ang) * r1]
      ], null, { strokeStyle: color, lineWidth: 5, lineCap: "round" });
    }
    sp.pivot(R, R);
    sp.pos(x, y);
    sp.rotation = Math.random() * 360;
    parent.addChild(sp);
    Laya.Tween.to(
      sp,
      { scaleX: 2.1, scaleY: 2.1, alpha: 0, rotation: sp.rotation + 30 },
      380,
      Laya.Ease.quadOut,
      Laya.Handler.create(null, () => sp.destroy())
    );
  }
  var CONFETTI_COLORS = ["#e5484d", "#f7ce46", "#5fb75f", "#9b6bdf", "#ff9838", "#5aa9e5", "#f2668b"];
  function confetti(parent, count = 42) {
    for (let i = 0; i < count; i++) {
      const w = 10 + Math.random() * 8;
      const h = 6 + Math.random() * 6;
      const p = new Laya.Sprite();
      p.size(w, h);
      p.graphics.drawRect(0, 0, w, h, CONFETTI_COLORS[i % CONFETTI_COLORS.length]);
      p.pos(Math.random() * 750, -30 - Math.random() * 160);
      p.rotation = Math.random() * 360;
      parent.addChild(p);
      const dur = 1400 + Math.random() * 1200;
      const targetY = 200 + Math.random() * 1100;
      const drift = (Math.random() - 0.5) * 260;
      Laya.Tween.to(p, {
        y: targetY,
        x: p.x + drift,
        rotation: p.rotation + (Math.random() > 0.5 ? 540 : -540),
        alpha: 0
      }, dur, Laya.Ease.quadIn, Laya.Handler.create(null, () => p.destroy()));
    }
  }
  function pulse(target, peak = 1.35, dur = 160) {
    const ox = target.pivotX, oy = target.pivotY;
    const w = target.width, h = target.height;
    if (ox === 0 && oy === 0) {
      target.pivot(w / 2, h / 2);
      target.x += w / 2;
      target.y += h / 2;
    }
    target.scale(peak, peak);
    Laya.Tween.to(
      target,
      { scaleX: 1, scaleY: 1 },
      dur,
      Laya.Ease.backOut,
      Laya.Handler.create(null, () => {
        if (ox === 0 && oy === 0) {
          target.pivot(0, 0);
          target.x -= w / 2;
          target.y -= h / 2;
        }
      })
    );
  }

  // src/Leaderboard.ts
  var WORKER_URL = "https://hecheng-leaderboard.hecheng-daxigua.workers.dev";
  var BOT_NAMES = [
    "西瓜骑士",
    "吃瓜群众",
    "瓜田里的猹",
    "每日一瓜",
    "瓜农老王",
    "甜瓜刺客",
    "熬夜冠军",
    "摸鱼大师",
    "半糖去冰",
    "波霸奶茶",
    "三点水加瓜",
    "躺平选手",
    "宇宙无敌",
    "柠檬精本精"
  ];
  function localBots() {
    const rng = mulberry32(dailySeed() + 777);
    return BOT_NAMES.map((name) => ({ name, score: Math.floor(rng() * 1500) + 120 }));
  }
  function playerName() {
    try {
      return Laya.LocalStorage.getItem("sg_name") || "无名瓜农";
    } catch (e) {
      return "无名瓜农";
    }
  }
  function setPlayerName(name) {
    try {
      Laya.LocalStorage.setItem("sg_name", name);
    } catch (e) {
    }
  }
  function getPlayerName() {
    return playerName();
  }
  function randomName(exclude) {
    const pool = ["瓜界新星", "连击之王", "水果博士生", "合成大师", "西瓜预备役", "爆汁选手", "跨国吃瓜团"].filter((n) => n !== exclude);
    return pool[Math.floor(Math.random() * pool.length)];
  }
  function submitScore(score) {
    const name = playerName();
    if (WORKER_URL && typeof fetch === "function") {
      return fetch(`${WORKER_URL}/api/leaderboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ day: dailySeed(), name, score })
      }).then((res) => {
        if (!res.ok) throw new Error("remote failed");
        return fetchRemote();
      }).then((entries) => {
        const rank = entries.findIndex((e) => e.me) + 1;
        return { rank, entries };
      }).catch(() => submitLocal(score));
    }
    return Promise.resolve(submitLocal(score));
  }
  function submitLocal(score) {
    const myBest = Math.max(score, localMyBest());
    const entries = localBots().filter((b) => b.name !== playerName());
    entries.push({ name: playerName(), score: myBest, me: true });
    entries.sort((a, b) => b.score - a.score);
    const rank = entries.findIndex((e) => e.me) + 1;
    return { rank, entries };
  }
  function fetchTop(n = 10) {
    if (WORKER_URL && typeof fetch === "function") {
      return fetchRemote().then((entries) => entries.slice(0, n)).catch(() => fetchLocal(n));
    }
    return Promise.resolve(fetchLocal(n));
  }
  function fetchLocal(n) {
    const myBest = localMyBest();
    const entries = myBest > 0 ? localBots().filter((b) => b.name !== playerName()) : localBots();
    if (myBest > 0) entries.push({ name: playerName(), score: myBest, me: true });
    entries.sort((a, b) => b.score - a.score);
    return entries.slice(0, n);
  }
  function fetchRemote() {
    return __async(this, null, function* () {
      const res = yield fetch(`${WORKER_URL}/api/leaderboard?day=${dailySeed()}`);
      const list = yield res.json();
      return list.map((e) => __spreadProps(__spreadValues({}, e), { me: e.name === playerName() }));
    });
  }
  function localMyBest() {
    try {
      const obj = JSON.parse(Laya.LocalStorage.getItem("sg_daily") || "{}");
      return obj && obj.day === dailySeed() ? obj.best || 0 : 0;
    } catch (e) {
      return 0;
    }
  }

  // src/AdService.ts
  var AD_UNITS = {
    revive: "",
    doubleScore: "",
    dailyExtra: "",
    bigStart: ""
  };
  var GM_GAME_ID = "btex3y0n9vbh92sdvoet28xwpof0lpu6";
  function platform() {
    const g = globalThis;
    if (typeof g.wx !== "undefined" && g.wx && g.wx.createRewardedVideoAd) return "wx";
    if (typeof g.tt !== "undefined" && g.tt && g.tt.createRewardedVideoAd) return "tt";
    return "web";
  }
  function isMock() {
    return platform() === "web" && !GM_GAME_ID;
  }
  var gmReady = null;
  var gmDead = false;
  var advPauseHook = null;
  var advResumeHook = null;
  function setPauseHooks(pause, resume) {
    advPauseHook = pause;
    advResumeHook = resume;
  }
  function initGm() {
    if (gmReady) return gmReady;
    gmReady = new Promise((resolve, reject) => {
      let settled = false;
      const done = (ok) => {
        if (!settled) {
          settled = true;
          ok ? resolve() : reject(new Error("gm init fail"));
        }
      };
      const arm = () => {
        let n = 0;
        const t = setInterval(() => {
          if (typeof window.SDK === "function") {
            clearInterval(t);
            done(true);
            return;
          }
          if (++n > 25) {
            clearInterval(t);
            gmDead = true;
            done(false);
          }
        }, 200);
      };
      if (document.querySelector('script[src*="gamemonetize"]')) {
        arm();
        return;
      }
      const s = document.createElement("script");
      s.src = `https://html5.gamemonetize.com/embed.js?g=${GM_GAME_ID}`;
      s.onload = arm;
      s.onerror = () => {
        gmDead = true;
        done(false);
      };
      document.head.appendChild(s);
      setTimeout(() => {
        if (!settled) {
          gmDead = true;
          done(false);
        }
      }, 8e3);
    });
    return gmReady;
  }
  var mockReward = (onReward) => setTimeout(onReward, 1200);
  function showRewardedVideo(placement, onReward, onFail) {
    const pf = platform();
    if (pf === "web") {
      if (!GM_GAME_ID || gmDead) {
        mockReward(onReward);
        return;
      }
      let finished = false;
      const finish = (rewarded, reason) => {
        if (finished) return;
        finished = true;
        advResumeHook && advResumeHook();
        rewarded ? onReward() : onFail(reason);
      };
      initGm().then(() => {
        advPauseHook && advPauseHook();
        try {
          const sdk = window.SDK();
          sdk.adv.show("rewarded", {
            onClose: (wasRewarded) => finish(!!wasRewarded, wasRewarded ? "" : "未完整观看"),
            onError: () => finish(false, "广告播放失败")
          });
        } catch (e) {
          finish(false, "SDK 异常");
        }
      }).catch(() => mockReward(onReward));
      return;
    }
    const api = pf === "wx" ? globalThis.wx : globalThis.tt;
    const id = AD_UNITS[placement];
    if (!api.createRewardedVideoAd || !id) {
      onFail("广告位未配置");
      return;
    }
    let ad = adCache[placement];
    if (!ad) {
      ad = api.createRewardedVideoAd({ adUnitId: id });
      adCache[placement] = ad;
    }
    const onClose = (res) => {
      ad.offClose(onClose);
      if (res && (res.isEnded === void 0 || res.isEnded)) onReward();
      else onFail("未完整观看");
    };
    ad.onClose(onClose);
    ad.show().catch(() => {
      ad.load().then(() => ad.show()).catch(() => {
        ad.offClose(onClose);
        onFail("广告加载失败");
      });
    });
  }
  function testRewardedAd(onStep, onDone) {
    onStep("平台", true, platform() === "web" ? "Web" : platform());
    if (platform() !== "web") {
      onStep("仅 Web 端可测", false, "小游戏端请在开发者工具调试");
      onDone();
      return;
    }
    onStep("游戏 ID", !!GM_GAME_ID, GM_GAME_ID || "未配置");
    if (!GM_GAME_ID) {
      onDone();
      return;
    }
    fetch(`https://html5.gamemonetize.com/embed.js?g=${GM_GAME_ID}&t=${Date.now()}`, { mode: "no-cors", cache: "no-store" }).then(() => onStep("网络", true, "可达")).catch(() => onStep("网络", false, "不可达（DNS/防火墙/代理拦截）"));
    const s = document.createElement("script");
    s.src = `https://html5.gamemonetize.com/embed.js?g=${GM_GAME_ID}&t=${Date.now()}`;
    let settled = false;
    const fail = (msg) => {
      if (settled) return;
      settled = true;
      onStep("SDK 加载", false, msg);
      onDone();
    };
    s.onerror = () => fail("服务器拒绝(404)：游戏未过审或 ID 有误（去 GM 后台看状态）");
    s.onload = () => {
      let n = 0;
      const t = setInterval(() => {
        if (typeof window.SDK === "function") {
          clearInterval(t);
          if (settled) return;
          settled = true;
          onStep("SDK 加载", true, "就绪");
          try {
            const sdk = window.SDK();
            if (!sdk || !sdk.adv || !sdk.adv.show) {
              onStep("激励视频", false, "adv 接口缺失");
              onDone();
              return;
            }
            onStep("激励视频", true, "请求中…（看完/关闭后出结果）");
            sdk.adv.show("rewarded", {
              onClose: (wasRewarded) => {
                onStep("广告结果", !!wasRewarded, wasRewarded ? "完整观看 ✓（计费有效）" : "中途关闭（不计费）");
                onDone();
              },
              onError: (err) => {
                onStep("广告结果", false, "错误: " + String(err && err.message || err).slice(0, 80));
                onDone();
              }
            });
          } catch (e) {
            onStep("激励视频", false, "SDK 异常");
            onDone();
          }
          return;
        }
        if (++n > 20) {
          clearInterval(t);
          fail("加载超时（多为审核未过，SDK 未开通）");
        }
      }, 250);
    };
    setTimeout(() => fail("加载超时（多为审核未过，SDK 未开通）"), 1e4);
    document.head.appendChild(s);
  }
  var adCache = {};

  // src/Main.ts
  var { regClass } = Laya;
  var Main = class extends Laya.Script {
    constructor() {
      super(...arguments);
      // ---- 布局常量（设计分辨率 750x1334）----
      this.WALL_L = 58;
      // 容器内壁左
      this.WALL_R = 692;
      // 容器内壁右
      this.WALL_T = 400;
      // 容器顶部
      this.FLOOR_Y = 1180;
      // 地板上表面
      this.DANGER_Y = 430;
      // 危险线
      this.DROP_Y = 300;
      // 投放高度
      this.WALL_THICK = 26;
      // 墙厚（视觉）
      /** 落定速度阈值(px/s)：低于它视为"落定"（合成/判负的前提） */
      this.SETTLE_SPEED = 220;
      // HUD / 结算
      // ---- 游戏状态 ----
      this.fruits = [];
      this.mergeQueue = [];
      this.currentFruit = null;
      // 瞄准中的预览水果（无物理）
      this.nextLevel = 0;
      this.dropCooldown = 0;
      this.score = 0;
      this.bestScore = 0;
      this.maxLevelAchieved = 0;
      this.gameOver = false;
      this.restartAt = 0;
      this.shakeT = 0;
      /** 物理引擎就绪标志 */
      this.physicsReady = false;
      // (unused) enable() 进行中标志
      /** 容器（含物理组件）是否已构建 */
      this.containerBuilt = false;
      /** 当前瞄准的活动触点 id（多点触控过滤，-1 表示桌面鼠标） */
      this.activeTouchId = -1;
      /** 输入锁：面板关闭瞬间吞掉同一次点击的残余事件（如排行榜关闭后误投放） */
      this.inputLockUntil = 0;
      // ---- 每日挑战 ----
      /** 日期种子驱动的投放序列 RNG（同一天全球玩家序列一致） */
      this.rng = Math.random;
      this.dailyBest = 0;
      this.dailyDay = 0;
      this.shareCard = null;
      // ---- 连击 / 动效状态 ----
      this.comboCount = 0;
      this.comboExpireAt = 0;
      this.scoreShown = 0;
      this.comboText = null;
      this.lbPanel = null;
      this.lbContent = null;
      this.nameCard = null;
      this.nameContent = null;
      this.overContent = null;
      // ---- 广告激励状态 ----
      this.reviveUsed = false;
      // 每局限一次复活
      this.doubledUsed = false;
      // 每局限一次得分翻倍
      this.reviveDim = null;
      this.reviveContent = null;
      this.mockAdDim = null;
      this.goScoreText = null;
      this.goBestText = null;
      // ---- 新手引导 ----
      this.tourDim = null;
      this.tourContent = null;
      this.tourRing = null;
      this.tourStep = 0;
      this.adTestPanel = null;
      this.adTestContent = null;
      this.adTestLines = [];
      this.physicsPaused = false;
      this.bubbles = [];
      this.evoDots = [];
      this.overPanel = null;
      // ---- 音效（WebAudio 免素材）----
      this.audioCtx = null;
      // ==================================================================
      // 新手引导 / 玩法介绍
      // ==================================================================
      this.TOUR_STEPS = [
        { x: 375, y: 250, w: 300, h: 300, round: true, title: "投放水果", text: "按住屏幕左右拖动瞄准\n松手投放水果" },
        { x: 375, y: 430, w: 660, h: 90, round: false, title: "危险线", text: "水果堆过红色虚线 2 秒\n本局就结束了" },
        { x: 375, y: 196, w: 620, h: 70, round: false, title: "合成升级", text: "相同水果相碰合成更大的\n从樱桃一路合到西瓜" },
        { x: 96, y: 40, w: 170, h: 66, round: true, title: "每日挑战", text: "全球玩家每天同一序列\n点排行榜看你的排名" }
      ];
    }
    onStart() {
      try {
        const g = globalThis;
        const wxApi = g.wx || g.tt;
        if (wxApi && wxApi.setStorageSync) wxApi.setStorageSync("sg_boot", `${Date.now()}`);
      } catch (e) {
      }
      this.bestScore = this.loadBest();
      this.loadDaily();
      this.world = new Laya.Sprite();
      this.gameLayer = new Laya.Sprite();
      this.fxLayer = new Laya.Sprite();
      this.uiLayer = new Laya.Sprite();
      const root = this.owner;
      root.addChild(this.world);
      this.world.addChild(this.gameLayer);
      this.world.addChild(this.fxLayer);
      this.world.addChild(this.uiLayer);
      this.buildAmbience();
      root.mouseEnabled = true;
      if (root.parent) root.parent.mouseEnabled = true;
      this.world.mouseEnabled = true;
      this.uiLayer.mouseEnabled = true;
      this.centerWorld();
      Laya.stage.on(Laya.Event.RESIZE, this, this.centerWorld);
      this.buildHUD();
      setPauseHooks(
        () => this.setPhysicsPaused(true),
        () => {
          if (!this.gameOver && !this.lbPanel && !this.tourDim) this.setPhysicsPaused(false);
        }
      );
      Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
      Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
      Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
    }
    /** 游戏内容列在扩展舞台中水平居中（fixedauto 宽屏下 stage.width > 750） */
    centerWorld() {
      if (!this.world) return;
      this.world.pos(Math.max(0, (Laya.stage.width - 750) / 2), 0);
    }
    /** 背景氛围：缓慢上浮的半透明气泡（深度感） */
    buildAmbience() {
      const rng = mulberry32(20261012);
      for (let i = 0; i < 10; i++) {
        const r = 8 + rng() * 22;
        const b = new Laya.Sprite();
        b.size(r * 2, r * 2);
        b.graphics.drawCircle(r, r, r, "#ffffff");
        b.alpha = 0.05 + rng() * 0.06;
        b.pos(rng() * 750, rng() * 1500);
        this.uiLayer.addChildAt(b, 0);
        this.bubbles.push({ sp: b, speed: 0.15 + rng() * 0.3 });
      }
    }
    /**
     * 物理就绪信号：轮询 factory._box2d（wasm 模块加载完成的标志）。
     * 引擎启动时会自动调 Physics2D.I.enable() 异步初始化 wasm——绝不能自己再调
     * （Box2D 加载器不记忆化，二次调用会实例化第二份 wasm，函数表错乱）。
     * 也不能只看 start()——那只是翻标志位，wasm 未就绪时创建的刚体收不到接触回调。
     */
    tryStartPhysics() {
      if (this.physicsReady) return;
      const factory = Laya.Physics2D.I._factory;
      if (factory && factory._box2d) {
        this.physicsReady = true;
      }
    }
    onDestroy() {
      Laya.stage.offAllCaller(this);
    }
    // ==================================================================
    // 场景搭建
    // ==================================================================
    buildContainer() {
      const wood = "#d9a15c", woodDark = "#a9763b";
      const t = this.WALL_THICK;
      const g = this.gameLayer.graphics;
      g.drawRect(this.WALL_L - t, this.WALL_T, t, this.FLOOR_Y - this.WALL_T + t, wood, woodDark, 2);
      g.drawRect(this.WALL_R, this.WALL_T, t, this.FLOOR_Y - this.WALL_T + t, wood, woodDark, 2);
      g.drawRect(this.WALL_L - t, this.FLOOR_Y, this.WALL_R - this.WALL_L + t * 2, t, wood, woodDark, 2);
      const wall = new Laya.Sprite();
      this.gameLayer.addChild(wall);
      const col = wall.addComponent(Laya.StaticCollider);
      const chain = new Laya.ChainShape2D();
      chain.datas = [
        this.WALL_L,
        this.WALL_T,
        this.WALL_L,
        this.FLOOR_Y,
        this.WALL_R,
        this.FLOOR_Y,
        this.WALL_R,
        this.WALL_T
      ];
      col.shapes = [chain];
    }
    buildHUD() {
      this.scoreText = this.makeText(0, 84, 750, 64, 50, "#5a4632", true);
      const dayText = this.makeText(0, 150, 750, 28, 24, "#e5484d", true);
      dayText.text = `每日挑战 · ${dailyLabel()}`;
      this.bestText = this.makeText(0, 182, 750, 30, 24, "#a08b6f", false);
      const dotAreaW = 560;
      const startX = (750 - dotAreaW) / 2;
      for (let i = 0; i <= MAX_LEVEL; i++) {
        const r = 10 + i * 0.9;
        const dot = new Laya.Sprite();
        dot.size(r * 2, r * 2);
        const def = FRUITS[i];
        dot.graphics.drawCircle(r, r, r - 1, def.color, def.dark, 2);
        dot.pos(startX + dotAreaW / MAX_LEVEL * i - r, 240);
        dot.alpha = 0.22;
        this.uiLayer.addChild(dot);
        this.evoDots.push(dot);
      }
      const nextTitle = this.makeText(750 - 170, 84, 120, 30, 26, "#a08b6f", false);
      nextTitle.text = "下一个";
      this.nextLabel = new Laya.Sprite();
      this.nextLabel.pos(750 - 110, 146);
      this.uiLayer.addChild(this.nextLabel);
      this.dangerLine = new Laya.Sprite();
      const dg = this.dangerLine.graphics;
      for (let x = this.WALL_L; x < this.WALL_R; x += 34) {
        dg.drawRect(x, this.DANGER_Y, 20, 4, "#e5484d");
      }
      this.dangerLine.alpha = 0;
      this.uiLayer.addChild(this.dangerLine);
      this.aimLine = new Laya.Sprite();
      for (let y = this.DROP_Y + 74; y < this.FLOOR_Y; y += 26) {
        this.aimLine.graphics.drawRect(-1.5, y, 3, 14, "#5a4632");
      }
      this.aimLine.pos(375, 0);
      this.aimLine.alpha = 0.5;
      this.uiLayer.addChild(this.aimLine);
      const lbBtn = this.makePillButton(96, 40, 152, 60, "#f7ce46", "#5a4632", "排行榜");
      lbBtn.on(Laya.Event.MOUSE_DOWN, this, (e) => {
        e.stopPropagation();
        this.showLeaderboard();
      });
      this.uiLayer.addChild(lbBtn);
      const helpBtn = this.makePillButton(262, 40, 132, 60, "#5fb75f", "#ffffff", "玩法");
      helpBtn.on(Laya.Event.MOUSE_DOWN, this, (e) => {
        e.stopPropagation();
        this.showTour();
      });
      this.uiLayer.addChild(helpBtn);
      const adBtn = this.makePillButton(410, 40, 132, 60, "#5aa9e5", "#ffffff", "广告测试");
      adBtn.on(Laya.Event.MOUSE_DOWN, this, (e) => {
        e.stopPropagation();
        this.showAdTest();
      });
      this.uiLayer.addChild(adBtn);
    }
    /** 广告诊断面板：逐步显示真实链路状态（不走降级链） */
    showAdTest() {
      if (this.adTestPanel) return;
      if (!this.gameOver) this.setPhysicsPaused(true);
      const dim = new Laya.Sprite();
      dim.size(Laya.stage.width, Laya.stage.height);
      dim.pos(-this.world.x, 0);
      dim.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000b3");
      dim.mouseEnabled = true;
      this.uiLayer.addChild(dim);
      const content = new Laya.Sprite();
      this.uiLayer.addChild(content);
      this.adTestPanel = dim;
      this.adTestContent = content;
      const card = new Laya.Sprite();
      card.size(660, 760).pos(45, 260);
      card.mouseEnabled = true;
      card.graphics.drawRect(0, 0, 660, 760, "#fff8ea", "#d9a15c", 4);
      content.addChild(card);
      card.on(Laya.Event.MOUSE_DOWN, this, (e) => e.stopPropagation());
      const title = new Laya.Text();
      title.pos(0, 20).size(660, 40);
      title.fontSize = 34;
      title.color = "#5a4632";
      title.bold = true;
      title.align = "center";
      title.text = "广告链路诊断";
      card.addChild(title);
      const mkLine = () => {
        const t = new Laya.Text();
        t.pos(40, 80 + this.adTestLines.length * 76).size(580, 72);
        t.fontSize = 24;
        t.color = "#5a4632";
        t.valign = "middle";
        t.text = "…";
        card.addChild(t);
        this.adTestLines.push(t);
        return t;
      };
      const closeBtn = this.makePillButton(330, 640, 260, 84, "#5fb75f", "#ffffff", "关闭");
      closeBtn.on(Laya.Event.MOUSE_DOWN, this, (e) => {
        e.stopPropagation();
        dim.destroy();
        content.destroy();
        this.adTestPanel = null;
        this.adTestContent = null;
        this.adTestLines = [];
        this.setPhysicsPaused(false);
      });
      card.addChild(closeBtn);
      testRewardedAd((step, ok, detail) => {
        const t = mkLine();
        t.text = (ok ? "✓ " : "✗ ") + step + ": " + detail;
        t.color = ok ? "#3d8f3f" : "#e5484d";
      }, () => {
      });
    }
    /** 冻结/恢复物理与游戏节奏（排行榜面板打开时暂停） */
    setPhysicsPaused(paused) {
      if (this.physicsPaused === paused) return;
      this.physicsPaused = paused;
      Laya.physicsTimer.scale = paused ? 0 : 1;
    }
    /** 首次进入自动触发；「玩法」按钮可随时重看 */
    showTour() {
      if (this.tourDim) return;
      try {
        Laya.LocalStorage.setItem("sg_toured", "1");
      } catch (e) {
      }
      this.tourStep = 0;
      const dim = new Laya.Sprite();
      dim.pos(-this.world.x, 0);
      dim.size(Laya.stage.width, Laya.stage.height);
      dim.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000b0");
      dim.mouseEnabled = true;
      dim.on(Laya.Event.MOUSE_DOWN, this, (e) => {
        e.stopPropagation();
        this.nextTourStep();
      });
      this.uiLayer.addChild(dim);
      this.tourDim = dim;
      const content = new Laya.Sprite();
      this.uiLayer.addChild(content);
      this.tourContent = content;
      this.tourRing = new Laya.Sprite();
      content.addChild(this.tourRing);
      const card = new Laya.Sprite();
      card.graphics.drawRoundRect(0, 0, 600, 220, 24, 24, 24, 24, "#fff8ea", "#d9a15c", 4);
      card.pos(75, 990);
      content.addChild(card);
      const title = new Laya.Text();
      title.pos(0, 28).size(600, 46);
      title.fontSize = 36;
      title.color = "#5a4632";
      title.bold = true;
      title.align = "center";
      card.addChild(title);
      card.__title = title;
      const body = new Laya.Text();
      body.pos(0, 92).size(600, 80);
      body.fontSize = 28;
      body.color = "#7a684e";
      body.align = "center";
      body.valign = "middle";
      card.addChild(body);
      card.__body = body;
      const counter = new Laya.Text();
      counter.pos(0, 178).size(600, 26);
      counter.fontSize = 22;
      counter.color = "#c9bda2";
      counter.align = "center";
      counter.text = "轻点任意位置继续";
      card.addChild(counter);
      card.__counter = counter;
      this.applyTourStep();
    }
    applyTourStep() {
      if (!this.tourContent || !this.tourRing) return;
      const s = this.TOUR_STEPS[this.tourStep];
      const ring = this.tourRing;
      ring.graphics.clear();
      ring.pos(s.x - s.w / 2, s.y - s.h / 2);
      if (s.round) {
        ring.graphics.drawCircle(s.w / 2, s.h / 2, Math.min(s.w, s.h) / 2 - 4, null, "#ffe08a", 6);
      } else {
        ring.graphics.drawRoundRect(0, 0, s.w, s.h, 16, 16, 16, 16, null, "#ffe08a", 6);
      }
      ring.scale(1, 1);
      Laya.Tween.to(ring, { scaleX: 1.05, scaleY: 1.05 }, 500, Laya.Ease.sineInOut, Laya.Handler.create(null, () => {
        Laya.Tween.to(ring, { scaleX: 1, scaleY: 1 }, 500, Laya.Ease.sineInOut);
      }));
      const card = this.tourContent.getChildAt(1);
      if (card) {
        card.__title.text = `${this.tourStep + 1}/${this.TOUR_STEPS.length} · ${s.title}`;
        card.__body.text = s.text;
      }
    }
    nextTourStep() {
      this.tourStep++;
      if (this.tourStep >= this.TOUR_STEPS.length) {
        this.closeTour();
      } else {
        this.applyTourStep();
      }
    }
    closeTour() {
      if (this.tourDim) {
        this.tourDim.destroy();
        this.tourDim = null;
      }
      if (this.tourContent) {
        this.tourContent.destroy();
        this.tourContent = null;
      }
      this.tourRing = null;
    }
    makeText(x, y, w, h, size, color, bold) {
      const t = new Laya.Text();
      t.pos(x, y).size(w, h);
      t.fontSize = size;
      t.color = color;
      t.bold = bold;
      t.align = "center";
      t.valign = "middle";
      this.uiLayer.addChild(t);
      return t;
    }
    // ==================================================================
    // 回合控制
    // ==================================================================
    resetRound() {
      this.rng = mulberry32(dailySeed());
      this.comboCount = 0;
      this.comboExpireAt = 0;
      this.scoreShown = 0;
      if (this.comboText) {
        this.comboText.destroy();
        this.comboText = null;
      }
      for (const f of this.fruits) f.destroy();
      this.fruits.length = 0;
      this.mergeQueue.length = 0;
      if (this.currentFruit) {
        this.currentFruit.destroy();
        this.currentFruit = null;
      }
      this.score = 0;
      this.maxLevelAchieved = 0;
      this.gameOver = false;
      this.dropCooldown = 600;
      this.updateScoreUI();
      this.updateEvoBar();
      if (this.overPanel) {
        this.overPanel.destroy();
        this.overPanel = null;
      }
      if (this.overContent) {
        this.overContent.destroy();
        this.overContent = null;
      }
      if (this.shareCard) {
        this.shareCard.destroy();
        this.shareCard = null;
      }
      if (this.lbPanel) {
        this.lbPanel.destroy();
        this.lbPanel = null;
      }
      if (this.lbContent) {
        this.lbContent.destroy();
        this.lbContent = null;
      }
      if (this.nameCard) {
        this.nameCard.destroy();
        this.nameCard = null;
      }
      if (this.nameContent) {
        this.nameContent.destroy();
        this.nameContent = null;
      }
      if (this.adTestPanel) {
        this.adTestPanel.destroy();
        this.adTestPanel = null;
      }
      if (this.adTestContent) {
        this.adTestContent.destroy();
        this.adTestContent = null;
      }
      this.adTestLines = [];
      if (this.reviveDim) {
        this.reviveDim.destroy();
        this.reviveDim = null;
      }
      if (this.reviveContent) {
        this.reviveContent.destroy();
        this.reviveContent = null;
      }
      if (this.mockAdDim) {
        this.mockAdDim.destroy();
        this.mockAdDim = null;
      }
      this.reviveUsed = false;
      this.doubledUsed = false;
      this.goScoreText = null;
      this.goBestText = null;
      this.setPhysicsPaused(false);
      this.prepareNext();
    }
    prepareNext() {
      this.nextLevel = this.pickCurrent();
      this.drawNextPreview();
      this.showCurrent(this.pickCurrent());
    }
    pickCurrent() {
      return DROPPABLE_LEVELS[Math.floor(this.rng() * DROPPABLE_LEVELS.length)];
    }
    showCurrent(level) {
      if (this.currentFruit) this.currentFruit.destroy();
      this.currentFruit = new Fruit(level);
      this.currentFruit.pos(375 - this.currentFruit.radius, this.DROP_Y - this.currentFruit.radius);
      this.uiLayer.addChild(this.currentFruit);
      this.aimLine.pos(375, 0);
      this.aimLine.visible = true;
    }
    drawNextPreview() {
      this.nextLabel.removeChildren();
      const def = FRUITS[this.nextLevel];
      const r = Math.min(def.radius, 34);
      const sp = new Laya.Sprite();
      sp.size(r * 2, r * 2);
      sp.graphics.drawCircle(r, r, r - 1, def.color, def.dark, 2);
      sp.pos(-r, -r);
      this.nextLabel.addChild(sp);
    }
    // ==================================================================
    // 输入
    // ==================================================================
    onMouseDown(e) {
      var _a;
      if (this.lbPanel || this.tourDim || Date.now() < this.inputLockUntil) return;
      this.ensureAudio();
      if (this.gameOver) {
        if (this.shareCard) return;
        if (Date.now() > this.restartAt) this.resetRound();
        return;
      }
      this.activeTouchId = (_a = e.touchId) != null ? _a : -1;
      this.moveCurrent(e.stageX);
    }
    onMouseMove(e) {
      if (this.gameOver || this.lbPanel || this.tourDim || Date.now() < this.inputLockUntil || !this.isPrimaryTouch(e)) return;
      this.moveCurrent(e.stageX);
    }
    onMouseUp(e) {
      if (this.gameOver || this.lbPanel || this.tourDim || Date.now() < this.inputLockUntil || !this.physicsReady || !this.isPrimaryTouch(e) || !this.currentFruit || this.dropCooldown > 0) return;
      const c = this.fruitCenter(this.currentFruit);
      const f = this.spawnFruit(this.currentFruit.level, c.x, this.DROP_Y, true, "none");
      squash(f);
      this.currentFruit.destroy();
      this.currentFruit = null;
      this.aimLine.visible = false;
      this.dropCooldown = 450;
    }
    /** 只响应按下时记录的那根手指（桌面鼠标事件无 touchId，始终放行） */
    isPrimaryTouch(e) {
      var _a;
      const id = (_a = e.touchId) != null ? _a : -1;
      return id === -1 || this.activeTouchId === -1 || id === this.activeTouchId;
    }
    moveCurrent(stageX) {
      if (!this.currentFruit) return;
      const r = this.currentFruit.radius;
      const localX = stageX - (this.world ? this.world.x : 0);
      const x = Math.max(this.WALL_L + r, Math.min(this.WALL_R - r, localX));
      this.currentFruit.pos(x - r, this.DROP_Y - r);
      this.aimLine.pos(x, 0);
    }
    /** 水果圆心（考虑刚体旋转导致 sprite 原点绕质心摆动） */
    fruitCenter(f) {
      const r = f.radius;
      const rad = f.rotation * Math.PI / 180;
      const cos = Math.cos(rad), sin = Math.sin(rad);
      return { x: f.x + r * cos - r * sin, y: f.y + r * sin + r * cos };
    }
    // ==================================================================
    // 水果生成 / 合成
    // ==================================================================
    spawnFruit(level, x, y, alive = true, anim = "pop") {
      const f = new Fruit(level);
      const r = f.radius;
      f.pos(x - r, y - r);
      f.bornAt = Date.now();
      f.lastX = f.x;
      f.lastY = f.y;
      this.gameLayer.addChild(f);
      if (alive && anim === "pop") popIn(f);
      const rb = f.addComponent(Laya.RigidBody);
      const shape = new Laya.CircleShape2D();
      shape.radius = r;
      shape.x = r;
      shape.y = r;
      shape.density = 1;
      shape.friction = 0.4;
      shape.restitution = 0.12;
      rb.shapes = [shape];
      if (alive) {
        this.fruits.push(f);
        f.on(Laya.Event.TRIGGER_ENTER, this, this.onFruitCollision);
      }
      return f;
    }
    onFruitCollision(colliderB, colliderA) {
      const listener = (colliderB == null ? void 0 : colliderB.owner) instanceof Fruit ? colliderB.owner : (colliderA == null ? void 0 : colliderA.owner) instanceof Fruit ? colliderA.owner : null;
      if (!listener) return;
      const otherCol = (colliderB == null ? void 0 : colliderB.owner) === listener ? colliderA : colliderB;
      const other = otherCol == null ? void 0 : otherCol.owner;
      if (!(other instanceof Fruit)) return;
      if (other === listener) return;
      if (!listener.alive || !other.alive) return;
      if (listener.merging || other.merging) return;
      if (listener.level !== other.level) return;
      listener.merging = true;
      other.merging = true;
      this.mergeQueue.push([listener, other]);
    }
    processMerges() {
      while (this.mergeQueue.length > 0) {
        const [a, b] = this.mergeQueue.shift();
        if (!a.alive || !b.alive || !a.parent || !b.parent) {
          a.merging = false;
          b.merging = false;
          continue;
        }
        const level = a.level;
        const pa = this.fruitCenter(a);
        const pb = this.fruitCenter(b);
        const cxm = (pa.x + pb.x) / 2;
        const cy = (pa.y + pb.y) / 2;
        this.removeFruit(a);
        this.removeFruit(b);
        if (Date.now() > this.comboExpireAt) this.comboCount = 0;
        this.comboCount++;
        this.comboExpireAt = Date.now() + 2500;
        const mult = Math.min(this.comboCount, 5);
        this.sfx(level, this.comboCount);
        shockwave(this.fxLayer, cxm, cy, FRUITS[level].light, 2.2 + level * 0.12);
        if (this.comboCount >= 2) rays(this.fxLayer, cxm, cy, FRUITS[level].color);
        if (this.comboCount >= 2) this.showComboText(this.comboCount);
        if (level >= MAX_LEVEL) {
          this.addScore(DOUBLE_MELO_BONUS * mult, cxm, cy, mult);
          this.burst(cxm, cy, 24, "#5fb75f");
          shockwave(this.fxLayer, cxm, cy, "#5fb75f", 4.5);
          confetti(this.fxLayer);
          this.shakeT = 0.35;
        } else {
          const newDef = FRUITS[level + 1];
          const cx = Math.max(
            this.WALL_L + newDef.radius,
            Math.min(this.WALL_R - newDef.radius, cxm)
          );
          const newFruit = this.spawnFruit(level + 1, cx, cy);
          this.addScore(newDef.score * mult, cx, cy - newDef.radius, mult);
          this.burst(cx, cy, 8 + level, newDef.light);
          if (level + 1 >= 8) confetti(this.fxLayer, 26);
          if (level + 1 > this.maxLevelAchieved) {
            this.maxLevelAchieved = level + 1;
            this.updateEvoBar();
            if (level + 1 >= 6) this.shakeT = 0.25;
          }
        }
      }
    }
    removeFruit(f) {
      f.alive = false;
      f.offAllCaller(this);
      Laya.Tween.clearAll(f);
      f.destroy();
      const i = this.fruits.indexOf(f);
      if (i >= 0) this.fruits.splice(i, 1);
    }
    // ==================================================================
    // 每帧更新
    // ==================================================================
    onUpdate() {
      if (!this.gameLayer) return;
      this.tryStartPhysics();
      if (!this.physicsReady) return;
      if (this.lbPanel) return;
      if (!this.containerBuilt) {
        this.containerBuilt = true;
        this.buildContainer();
        this.resetRound();
        try {
          if (!Laya.LocalStorage.getItem("sg_toured")) this.showTour();
        } catch (e) {
        }
      }
      const dt = Math.min(Laya.timer.delta, 50);
      if (!this.gameOver) this.processMerges();
      if (this.dropCooldown > 0) {
        this.dropCooldown -= dt;
        if (this.dropCooldown <= 0 && !this.gameOver) {
          this.showCurrent(this.nextLevel);
          this.nextLevel = this.pickCurrent();
          this.drawNextPreview();
        }
      }
      for (const f of this.fruits) {
        const dx = f.x - f.lastX, dy = f.y - f.lastY;
        const inst = Math.sqrt(dx * dx + dy * dy) * 1e3 / Math.max(dt, 1);
        f.speed = f.speed * 0.6 + inst * 0.4;
        f.lastX = f.x;
        f.lastY = f.y;
      }
      let danger = false;
      if (!this.gameOver) {
        for (const f of this.fruits) {
          if (Date.now() - f.bornAt < 500) continue;
          const cy = this.fruitCenter(f).y;
          if (cy < this.DANGER_Y && f.speed < this.SETTLE_SPEED) {
            f.overSince += dt;
            danger = true;
            if (f.overSince > 2e3) {
              this.doGameOver();
              break;
            }
          } else {
            f.overSince = 0;
          }
        }
      }
      this.dangerLine.alpha = danger ? 0.35 + 0.65 * (Math.sin(Date.now() / 90) * 0.5 + 0.5) : Math.max(0, this.dangerLine.alpha - 0.05);
      if (this.shakeT > 0) {
        this.shakeT -= dt / 1e3;
        const s = Math.max(0, this.shakeT) * 40;
        this.gameLayer.pos((Math.random() - 0.5) * s, (Math.random() - 0.5) * s);
        if (this.shakeT <= 0) this.gameLayer.pos(0, 0);
      }
      if (this.scoreShown !== this.score) {
        const diff = this.score - this.scoreShown;
        this.scoreShown += Math.sign(diff) * Math.max(1, Math.ceil(Math.abs(diff) * 0.2));
        if (diff > 0 && this.scoreShown > this.score || diff < 0 && this.scoreShown < this.score) {
          this.scoreShown = this.score;
        }
        this.scoreText.text = `${Math.round(this.scoreShown)}`;
      }
      for (const b of this.bubbles) {
        b.sp.y -= b.speed * dt / 16.7;
        if (b.sp.y < -60) b.sp.y = Laya.stage.height + 60;
      }
    }
    /** 死亡爆场：分数落袋 → 场上水果从上往下逐个爆掉 → 弹结算面板 */
    /** 死亡流程入口：每局限一次的复活机会 → 放弃则爆场结算 */
    doGameOver() {
      this.gameOver = true;
      if (this.currentFruit) {
        this.currentFruit.destroy();
        this.currentFruit = null;
      }
      this.aimLine.visible = false;
      this.comboCount = 0;
      if (this.score > this.bestScore) {
        this.bestScore = this.score;
        this.saveBest(this.bestScore);
      }
      if (this.score > this.dailyBest) {
        this.dailyBest = this.score;
        this.saveDaily();
      }
      if (!this.reviveUsed && this.fruits.length > 0) {
        this.setPhysicsPaused(true);
        this.showReviveOffer();
        return;
      }
      this.continueDeathSequence();
    }
    /** 复活邀请面板（每局限一次） */
    showReviveOffer() {
      const dim = new Laya.Sprite();
      dim.pos(-this.world.x, 0);
      dim.size(Laya.stage.width, Laya.stage.height);
      dim.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000cc");
      dim.mouseEnabled = true;
      dim.on(Laya.Event.MOUSE_DOWN, this, (e) => {
        e.stopPropagation();
        this.closeRevive();
        this.continueDeathSequence();
      });
      this.uiLayer.addChild(dim);
      this.reviveDim = dim;
      const content = new Laya.Sprite();
      this.uiLayer.addChild(content);
      this.reviveContent = content;
      const tx = (y, size, color, bold, text) => {
        const t = new Laya.Text();
        t.pos(0, y).size(750, size + 26);
        t.fontSize = size;
        t.color = color;
        t.bold = bold;
        t.align = "center";
        t.valign = "middle";
        t.text = text;
        content.addChild(t);
        return t;
      };
      tx(200, 56, "#ffe08a", true, "要复活吗？");
      tx(290, 30, "#e0d6c2", false, "看广告清除危险线上方的水果");
      tx(334, 30, "#e0d6c2", false, "继续本局，分数保留");
      const btnRevive = this.makePillButton(375, 480, 380, 96, "#e5484d", "#ffffff", "看广告复活");
      btnRevive.on(Laya.Event.MOUSE_DOWN, this, (e) => {
        e.stopPropagation();
        this.playReviveAd();
      });
      content.addChild(btnRevive);
      const btnGiveUp = this.makePillButton(375, 610, 300, 84, "#fff8ea", "#a08b6f", "直接结束");
      btnGiveUp.graphics.drawRoundRect(0, 0, 300, 84, 42, 42, 42, 42, "#fff8ea", "#d9a15c", 3);
      btnGiveUp.on(Laya.Event.MOUSE_DOWN, this, (e) => {
        e.stopPropagation();
        this.closeRevive();
        this.continueDeathSequence();
      });
      content.addChild(btnGiveUp);
    }
    closeRevive() {
      if (this.reviveDim) {
        this.reviveDim.destroy();
        this.reviveDim = null;
      }
      if (this.reviveContent) {
        this.reviveContent.destroy();
        this.reviveContent = null;
      }
    }
    playReviveAd() {
      const closeMock = isMock() ? this.showMockAd() : null;
      showRewardedVideo(
        "revive",
        () => {
          if (closeMock) closeMock();
          this.applyRevive();
        },
        () => {
          if (closeMock) closeMock();
          this.continueDeathSequence();
        }
      );
    }
    /** 复活：关闭邀请面板，清除危险线上方的水果，继续本局 */
    applyRevive() {
      this.closeRevive();
      this.reviveUsed = true;
      const doomed = this.fruits.filter((f) => this.fruitCenter(f).y < this.DANGER_Y);
      for (const f of doomed) {
        const c = this.fruitCenter(f);
        const light = FRUITS[f.level].light;
        this.removeFruit(f);
        this.burst(c.x, c.y, 6, light);
      }
      this.setPhysicsPaused(false);
      this.gameOver = false;
      this.dropCooldown = 600;
      this.sfx(0);
    }
    /** 死亡爆场：场上水果从上往下逐个爆掉 → 弹结算面板 */
    continueDeathSequence() {
      this.setPhysicsPaused(false);
      this.restartAt = Date.now() + 999999;
      const doomed = [...this.fruits].sort((a, b) => a.y - b.y);
      doomed.forEach((f, i) => {
        Laya.timer.once(i * 70, this, () => {
          if (!f.alive) return;
          const c = this.fruitCenter(f);
          const light = FRUITS[f.level].light;
          this.removeFruit(f);
          this.burst(c.x, c.y, 6, light);
          this.sfx(Math.min(f.level, 6), 0);
        });
      });
      Laya.timer.once(doomed.length * 70 + 400, this, () => this.showGameOverPanel());
    }
    /** Web 端模拟广告面板：1.2s 后由 AdService 回调关闭 */
    showMockAd() {
      const dim = new Laya.Sprite();
      dim.pos(-this.world.x, 0);
      dim.size(Laya.stage.width, Laya.stage.height);
      dim.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000e6");
      dim.mouseEnabled = true;
      dim.on(Laya.Event.MOUSE_DOWN, this, (e) => e.stopPropagation());
      const t = new Laya.Text();
      t.pos(0, 0).size(750, Laya.stage.height);
      t.fontSize = 40;
      t.color = "#ffe08a";
      t.align = "center";
      t.valign = "middle";
      t.text = "广告模拟中...\n\n（小游戏端为真实激励视频）";
      dim.addChild(t);
      this.uiLayer.addChild(dim);
      this.mockAdDim = dim;
      return () => {
        if (this.mockAdDim) {
          this.mockAdDim.destroy();
          this.mockAdDim = null;
        }
      };
    }
    showGameOverPanel() {
      this.restartAt = Date.now() + 800;
      this.scoreText.text = `${this.score}`;
      const dim = new Laya.Sprite();
      dim.pos(-this.world.x, 0);
      dim.size(Laya.stage.width, Laya.stage.height);
      dim.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000b3");
      dim.mouseEnabled = true;
      dim.on(Laya.Event.MOUSE_DOWN, this, () => {
        if (!this.shareCard && !this.lbPanel && Date.now() > this.restartAt) this.resetRound();
      });
      this.uiLayer.addChild(dim);
      this.overPanel = dim;
      const content = new Laya.Sprite();
      this.uiLayer.addChild(content);
      this.overContent = content;
      const mk = (y, size, color, bold, text) => {
        const t = this.makeText(0, y, 750, size + 30, size, color, bold);
        t.text = text;
        content.addChild(t);
        return t;
      };
      mk(310, 68, "#ffffff", true, "游戏结束");
      this.goScoreText = mk(415, 44, "#ffe08a", true, `本局得分 ${this.score}`);
      this.goBestText = mk(485, 30, "#e0d6c2", false, `今日最高 ${this.dailyBest} · 历史最高 ${this.bestScore}`);
      const def = FRUITS[this.maxLevelAchieved];
      const r = 64;
      const icon = new Laya.Sprite();
      icon.size(r * 2, r * 2);
      const iconInner = new Fruit(this.maxLevelAchieved);
      const k = r / def.radius;
      iconInner.scale(k, k);
      icon.addChild(iconInner);
      icon.pos(375 - r, 570);
      content.addChild(icon);
      mk(718, 32, "#ffffff", true, `最大合成：${def.name}`);
      if (!this.doubledUsed && this.score > 0) {
        const btn2x = this.makePillButton(375, 806, 340, 84, "#9b6bdf", "#ffffff", "看广告 得分×2");
        btn2x.on(Laya.Event.MOUSE_DOWN, this, (e) => {
          e.stopPropagation();
          this.playDoubleAd(btn2x);
        });
        content.addChild(btn2x);
      }
      const btnShare = this.makePillButton(222, 930, 280, 92, "#e5484d", "#ffffff", "战绩卡");
      btnShare.on(Laya.Event.MOUSE_DOWN, this, (e) => {
        e.stopPropagation();
        this.openShareCard();
      });
      content.addChild(btnShare);
      const btnLb = this.makePillButton(528, 930, 280, 92, "#f7ce46", "#5a4632", "排行榜");
      btnLb.on(Laya.Event.MOUSE_DOWN, this, (e) => {
        e.stopPropagation();
        this.showLeaderboard();
      });
      content.addChild(btnLb);
      mk(1060, 30, "#ffffff", true, "点击屏幕 重新开始");
      if (platform() === "web") {
        mk(1112, 24, "#a08b6f", false, "抖音/微信搜《合成大西瓜》· 排行榜全球同服");
      }
      const ensureNameAndSubmit = () => {
        if (getPlayerName() === "无名瓜农" && !Laya.LocalStorage.getItem("sg_named")) {
          this.showNameCard(() => this.submitScore());
        } else {
          this.submitScore();
        }
      };
      Laya.timer.once(600, this, ensureNameAndSubmit);
    }
    /** 激励点②：看广告本局得分×2（排行榜按最高分记名，重复提交幂等） */
    playDoubleAd(btn) {
      if (this.doubledUsed) return;
      this.doubledUsed = true;
      const closeMock = isMock() ? this.showMockAd() : null;
      showRewardedVideo(
        "doubleScore",
        () => {
          if (closeMock) closeMock();
          this.applyDouble(btn);
        },
        () => {
          if (closeMock) closeMock();
          this.doubledUsed = false;
        }
      );
    }
    applyDouble(btn) {
      this.score *= 2;
      if (this.score > this.bestScore) {
        this.bestScore = this.score;
        this.saveBest(this.bestScore);
      }
      if (this.score > this.dailyBest) {
        this.dailyBest = this.score;
        this.saveDaily();
      }
      this.updateScoreUI();
      if (this.goScoreText) this.goScoreText.text = `本局得分 ${this.score}（已翻倍）`;
      if (this.goBestText) this.goBestText.text = `今日最高 ${this.dailyBest} · 历史最高 ${this.bestScore}`;
      pulse(this.goScoreText ? this.goScoreText : this.scoreText, 1.3, 200);
      if (btn && !btn.destroyed) btn.destroy();
      confetti(this.fxLayer, 30);
      this.submitScore();
    }
    /** 提交本局分数到排行榜（远程未配置时自动走本地 bot 榜） */
    submitScore() {
      submitScore(this.score).catch(() => {
      });
    }
    // ==================================================================
    // 排行榜（今日榜 / 本地 bot 冷启动 / Worker 部署后自动切全球真榜）
    // ==================================================================
    showLeaderboard() {
      if (this.lbPanel) return;
      if (!this.gameOver) this.setPhysicsPaused(true);
      const dim = new Laya.Sprite();
      dim.pos(-this.world.x, 0);
      dim.size(Laya.stage.width, Laya.stage.height);
      dim.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000b3");
      dim.mouseEnabled = true;
      this.uiLayer.addChild(dim);
      this.lbPanel = dim;
      const card = new Laya.Sprite();
      const W = 660, H = 1080;
      card.pos(45, Math.max(60, (1334 - H) / 2 - 40));
      card.mouseEnabled = true;
      card.graphics.drawRect(0, 0, W, H, "#fff8ea", "#d9a15c", 4);
      this.uiLayer.addChild(card);
      this.lbContent = card;
      card.on(Laya.Event.MOUSE_DOWN, this, (e) => e.stopPropagation());
      card.on(Laya.Event.MOUSE_UP, this, (e) => e.stopPropagation());
      const tx = (parent, x, y, w, size, color, bold, text, align = "center") => {
        const t = new Laya.Text();
        t.pos(x, y).size(w, size + 22);
        t.fontSize = size;
        t.color = color;
        t.bold = bold;
        t.align = align;
        t.valign = "middle";
        t.text = text;
        parent.addChild(t);
        return t;
      };
      tx(card, 0, 52, W, 50, "#5a4632", true, "今日排行榜");
      tx(card, 0, 122, W, 26, "#a08b6f", false, `每日挑战 · ${dailyLabel()} · 同一天全球同序列`);
      const listStart = 190;
      const rowH = 66;
      const loading = tx(card, 0, listStart + 100, W, 28, "#c9bda2", false, "加载中...");
      const closeBtn = this.makePillButton(W / 2, H - 110, 260, 84, "#5fb75f", "#ffffff", "关闭");
      closeBtn.on(Laya.Event.MOUSE_DOWN, this, (e) => {
        e.stopPropagation();
        this.setPhysicsPaused(false);
        dim.destroy();
        card.destroy();
        this.lbPanel = null;
        this.lbContent = null;
        this.inputLockUntil = Date.now() + 300;
      });
      card.addChild(closeBtn);
      fetchTop(10).then((entries) => {
        if (this.lbPanel !== dim || dim.destroyed || card.destroyed) return;
        loading.text = "";
        if (entries.length === 0) {
          loading.text = "还没有人上榜，快来抢第一！";
          return;
        }
        const rankColors = ["#f7ce46", "#c0c0c8", "#d0995c"];
        entries.forEach((en, i) => {
          const y = listStart + i * rowH;
          if (en.me) card.graphics.drawRect(30, y - 4, W - 60, rowH - 6, "#ffe08a55");
          const rankColor = i < 3 ? rankColors[i] : "#a08b6f";
          tx(card, 34, y, 76, 34, rankColor, true, `${i + 1}`, "center");
          tx(card, 118, y, 300, 30, en.me ? "#e5484d" : "#5a4632", en.me, en.me ? `${en.name}(我)` : en.name, "left");
          tx(card, 400, y, 226, 32, en.me ? "#e5484d" : "#5a4632", true, `${en.score}`, "right");
        });
      }).catch(() => {
        loading.text = "加载失败";
      });
    }
    /** 首次游玩昵称卡：随机名点击切换，避免弹键盘打断手感 */
    showNameCard(onDone) {
      if (this.nameCard) return;
      try {
        Laya.LocalStorage.setItem("sg_named", "1");
      } catch (e) {
      }
      const dim = new Laya.Sprite();
      dim.pos(-this.world.x, 0);
      dim.size(Laya.stage.width, Laya.stage.height);
      dim.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000b3");
      dim.mouseEnabled = true;
      this.uiLayer.addChild(dim);
      this.nameCard = dim;
      const card = new Laya.Sprite();
      const W = 640, H = 560;
      card.pos(55, Math.max(120, (1334 - H) / 2 - 60));
      card.mouseEnabled = true;
      card.graphics.drawRect(0, 0, W, H, "#fff8ea", "#d9a15c", 4);
      this.uiLayer.addChild(card);
      this.nameContent = card;
      card.on(Laya.Event.MOUSE_DOWN, this, (e) => e.stopPropagation());
      card.on(Laya.Event.MOUSE_UP, this, (e) => e.stopPropagation());
      const title = new Laya.Text();
      title.pos(0, 70).size(W, 50);
      title.fontSize = 44;
      title.color = "#5a4632";
      title.bold = true;
      title.align = "center";
      title.text = "给自己起个名字";
      card.addChild(title);
      const sub = new Laya.Text();
      sub.pos(0, 136).size(W, 30);
      sub.fontSize = 24;
      sub.color = "#a08b6f";
      sub.align = "center";
      sub.text = "名字会出现在今日排行榜上";
      card.addChild(sub);
      let name = getPlayerName() === "无名瓜农" ? randomName("无名瓜农") : getPlayerName();
      const nameText = new Laya.Text();
      nameText.pos(0, 220).size(W, 70);
      nameText.fontSize = 52;
      nameText.color = "#e5484d";
      nameText.bold = true;
      nameText.align = "center";
      nameText.text = name;
      card.addChild(nameText);
      const btnShuffle = this.makePillButton(W / 2 - 150, 380, 240, 88, "#fff8ea", "#5a4632", "换一个");
      btnShuffle.graphics.drawRoundRect(0, 0, 240, 88, 44, 44, 44, 44, "#fff8ea", "#d9a15c", 3);
      btnShuffle.on(Laya.Event.MOUSE_DOWN, this, (e) => {
        e.stopPropagation();
        name = randomName(name);
        nameText.text = name;
        pulse(nameText, 1.2, 140);
      });
      card.addChild(btnShuffle);
      const btnOk = this.makePillButton(W / 2 + 150, 380, 240, 88, "#e5484d", "#ffffff", "就用这个");
      btnOk.on(Laya.Event.MOUSE_DOWN, this, (e) => {
        e.stopPropagation();
        setPlayerName(name);
        dim.destroy();
        card.destroy();
        this.nameCard = null;
        this.nameContent = null;
        onDone();
      });
      card.addChild(btnOk);
    }
    // ==================================================================
    // 战绩分享卡（截图/保存后自带传播）
    // ==================================================================
    openShareCard() {
      if (this.shareCard) return;
      const card = new Laya.Sprite();
      const W = 750, H = 1150;
      const Y = Math.max(40, (Laya.stage.height - H) / 2);
      card.pos(0, Y);
      card.mouseEnabled = true;
      const g = card.graphics;
      g.drawRect(0, 0, W, H, "#fff8ea", "#d9a15c", 4);
      const tx = (y, size, color, bold, text, hh = size + 24) => {
        const t = new Laya.Text();
        t.pos(0, y).size(W, hh);
        t.fontSize = size;
        t.color = color;
        t.bold = bold;
        t.align = "center";
        t.valign = "middle";
        t.text = text;
        card.addChild(t);
        return t;
      };
      tx(56, 58, "#5a4632", true, "合成大西瓜");
      tx(146, 30, "#a08b6f", false, `每日挑战 · ${dailyLabel()}`);
      tx(226, 110, "#e5484d", true, `${this.score}`, 150);
      tx(396, 30, "#a08b6f", false, `今日最高 ${this.dailyBest} · 历史最高 ${this.bestScore}`);
      g.drawRect(80, 462, W - 160, 2, "#e6d9bd");
      const def = FRUITS[this.maxLevelAchieved];
      const r = 62;
      const icon = new Laya.Sprite();
      const inner = new Fruit(this.maxLevelAchieved);
      inner.scale(r / def.radius, r / def.radius);
      icon.addChild(inner);
      icon.size(r * 2, r * 2);
      icon.pos(W / 2 - r, 510);
      card.addChild(icon);
      tx(650, 34, "#5a4632", true, `最大合成：${def.name}`);
      tx(724, 32, "#e5484d", true, "来和我比一比，看谁先合成西瓜 →");
      let host = "";
      try {
        host = location.host || "";
      } catch (e) {
      }
      if (host) tx(790, 26, "#a08b6f", false, host, 36);
      tx(838, 30, "#5a4632", true, `@${getPlayerName()}`);
      const url = this.exportCardDataUrl();
      if (url) {
        const saveBtn = this.makePillButton(W / 2, 920, 320, 84, "#5fb75f", "#ffffff", "保存图片");
        saveBtn.on(Laya.Event.MOUSE_DOWN, this, (e) => {
          e.stopPropagation();
          this.downloadDataUrl(url, `合成大西瓜-${dailyLabel()}.png`);
        });
        card.addChild(saveBtn);
        tx(1024, 26, "#a08b6f", false, "长按或截图 分享给好友", 34);
      } else {
        tx(920, 30, "#5a4632", true, "长按或截图 分享给好友", 40);
      }
      const close = new Laya.Sprite();
      close.size(72, 72);
      close.mouseEnabled = true;
      close.graphics.drawCircle(36, 36, 30, "#e6d9bd");
      const cx = new Laya.Text();
      cx.text = "✕";
      cx.fontSize = 34;
      cx.color = "#5a4632";
      cx.bold = true;
      cx.pos(36 - 12, 36 - 24);
      close.addChild(cx);
      close.pos(W - 84, 16);
      close.on(Laya.Event.MOUSE_DOWN, this, (e) => {
        e.stopPropagation();
        card.destroy();
        this.shareCard = null;
      });
      card.addChild(close);
      card.on(Laya.Event.MOUSE_DOWN, this, (e) => e.stopPropagation());
      card.on(Laya.Event.MOUSE_UP, this, (e) => e.stopPropagation());
      this.uiLayer.addChild(card);
      this.shareCard = card;
    }
    /**
     * 原生 2D canvas 渲染战绩卡并返回 PNG dataURL。
     * 不能用 Sprite.drawToCanvas：它只重放 graphics 命令，Text 子节点走独立渲染路径
     * 不会被捕获（导出的图会丢掉所有文字）。此渲染器与屏幕卡片共用布局常量。
     */
    exportCardDataUrl() {
      try {
        const W = 750, H = 1150, S = 2;
        const cv = document.createElement("canvas");
        cv.width = W * S;
        cv.height = H * S;
        const ctx = cv.getContext("2d");
        if (!ctx) return null;
        ctx.scale(S, S);
        ctx.fillStyle = "#fff8ea";
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = "#d9a15c";
        ctx.lineWidth = 6;
        ctx.strokeRect(3, 3, W - 6, H - 6);
        const center = (text, y, size, color, bold = false) => {
          ctx.fillStyle = color;
          ctx.font = `${bold ? "bold " : ""}${size}px Arial, "PingFang SC", "Microsoft YaHei", sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(text, W / 2, y);
        };
        center("合成大西瓜", 88, 58, "#5a4632", true);
        center(`每日挑战 · ${dailyLabel()}`, 160, 30, "#a08b6f");
        center(`${this.score}`, 300, 110, "#e5484d", true);
        center(`今日最高 ${this.dailyBest} · 历史最高 ${this.bestScore}`, 408, 30, "#a08b6f");
        ctx.strokeStyle = "#e6d9bd";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(80, 462);
        ctx.lineTo(W - 80, 462);
        ctx.stroke();
        this.drawFruitOnCanvas(ctx, W / 2, 572, 62, this.maxLevelAchieved);
        center(`最大合成：${FRUITS[this.maxLevelAchieved].name}`, 678, 34, "#5a4632", true);
        center("来和我比一比，看谁先合成西瓜 →", 750, 32, "#e5484d", true);
        let host = "";
        try {
          host = location.host || "";
        } catch (e) {
        }
        if (host) center(host, 808, 26, "#a08b6f");
        center(`@${getPlayerName()}`, 856, 30, "#5a4632", true);
        return cv.toDataURL("image/png");
      } catch (e) {
        return null;
      }
    }
    /** 原生 canvas 画可爱水果（与 Fruit.ts 屏幕视觉一致的离屏版） */
    drawFruitOnCanvas(ctx, cx, cy, r, level) {
      const def = FRUITS[level];
      ctx.save();
      ctx.fillStyle = def.color;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = Math.max(2, r * 0.06);
      ctx.strokeStyle = def.dark;
      ctx.stroke();
      ctx.fillStyle = def.light;
      ctx.beginPath();
      ctx.arc(cx - r * 0.38, cy - r * 0.4, r * 0.26, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#40342e";
      const eyeR = Math.max(2, r * 0.09);
      for (const dx of [-r * 0.34, r * 0.34]) {
        ctx.beginPath();
        ctx.arc(cx + dx, cy - r * 0.08, eyeR, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(cx + dx + eyeR * 0.35, cy - r * 0.08 - eyeR * 0.35, eyeR * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#40342e";
      }
      ctx.strokeStyle = "#40342e";
      ctx.lineWidth = Math.max(2, r * 0.07);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.3, cy + r * 0.2);
      ctx.quadraticCurveTo(cx, cy + r * 0.42, cx + r * 0.3, cy + r * 0.2);
      ctx.stroke();
      ctx.fillStyle = "#ffffff66";
      for (const dx of [-r * 0.52, r * 0.52]) {
        ctx.beginPath();
        ctx.arc(cx + dx, cy + r * 0.12, r * 0.11, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    downloadDataUrl(dataUrl, filename) {
      try {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (e) {
      }
    }
    /** 程序化胶囊按钮（无图片资源） */
    makePillButton(cx, cy, w, h, bg, textColor, label) {
      const btn = new Laya.Sprite();
      btn.size(w, h);
      btn.mouseEnabled = true;
      btn.graphics.drawRoundRect(0, 0, w, h, h / 2, h / 2, h / 2, h / 2, bg);
      const t = new Laya.Text();
      t.pos(0, 0).size(w, h);
      t.fontSize = Math.round(h * 0.42);
      t.color = textColor;
      t.bold = true;
      t.align = "center";
      t.valign = "middle";
      t.text = label;
      btn.addChild(t);
      btn.pos(cx - w / 2, cy - h / 2);
      return btn;
    }
    // ==================================================================
    // 表现层
    // ==================================================================
    addScore(v, x, y, mult = 1) {
      this.score += v;
      pulse(this.scoreText, 1.18, 130);
      const t = new Laya.Text();
      t.text = mult > 1 ? `+${v} ×${mult}` : `+${v}`;
      t.fontSize = Math.min(64, 26 + v);
      t.color = mult >= 3 ? "#9b6bdf" : mult >= 2 ? "#ff9838" : "#e5484d";
      t.bold = true;
      t.pos(x - 40, y);
      this.fxLayer.addChild(t);
      Laya.Tween.to(t, { y: y - 90, alpha: 0 }, 700, null, Laya.Handler.create(this, () => t.destroy()));
    }
    /** 连击飘字：中屏弹跳出现，档位越高颜色越炸 */
    showComboText(combo) {
      if (this.comboText) {
        this.comboText.destroy();
        this.comboText = null;
      }
      const t = new Laya.Text();
      t.text = `COMBO ×${combo}`;
      t.width = 750;
      t.align = "center";
      t.fontSize = Math.min(96, 52 + combo * 8);
      t.color = combo >= 6 ? "#9b6bdf" : combo >= 4 ? "#e5484d" : "#ff9838";
      t.bold = true;
      t.strokeColor = "#ffffff";
      t.stroke = 6;
      t.pos(0, 268);
      this.uiLayer.addChild(t);
      this.comboText = t;
      t.scale(0.3, 0.3);
      t.pivot(375, t.height / 2);
      t.x = 375;
      t.y = 268 + t.height / 2;
      Laya.Tween.to(
        t,
        { scaleX: 1.15, scaleY: 1.15 },
        130,
        Laya.Ease.quadOut,
        Laya.Handler.create(null, () => {
          Laya.Tween.to(t, { scaleX: 1, scaleY: 1 }, 100, Laya.Ease.backOut);
        })
      );
      Laya.Tween.to(t, { alpha: 0 }, 650, null, Laya.Handler.create(null, () => {
        if (this.comboText === t) this.comboText = null;
        t.destroy();
      }), 750);
    }
    updateScoreUI() {
      this.scoreText.text = `${this.score}`;
      this.bestText.text = `今日 ${this.dailyBest} · 最高 ${this.bestScore}`;
    }
    updateEvoBar() {
      for (let i = 0; i < this.evoDots.length; i++) {
        if (i <= this.maxLevelAchieved) {
          if (this.evoDots[i].alpha < 1) {
            this.evoDots[i].alpha = 1;
            pulse(this.evoDots[i], 1.8, 220);
          }
        } else {
          this.evoDots[i].alpha = 0.22;
        }
      }
    }
    burst(x, y, count, color) {
      const R = 60;
      const ring = new Laya.Sprite();
      ring.size(R * 2, R * 2);
      ring.graphics.drawCircle(R, R, R - 4, null, color, 6);
      ring.pivot(R, R);
      ring.pos(x, y);
      this.fxLayer.addChild(ring);
      Laya.Tween.to(ring, { scaleX: 2.4, scaleY: 2.4, alpha: 0 }, 380, null, Laya.Handler.create(this, () => ring.destroy()));
      for (let i = 0; i < count; i++) {
        const r = 5 + Math.random() * 5;
        const p = new Laya.Sprite();
        p.size(r * 2, r * 2);
        p.graphics.drawCircle(r, r, r, color);
        p.pivot(r, r);
        p.pos(x, y);
        this.fxLayer.addChild(p);
        const ang = Math.random() * Math.PI * 2;
        const dist = 60 + Math.random() * 110;
        Laya.Tween.to(p, {
          x: x + Math.cos(ang) * dist,
          y: y + Math.sin(ang) * dist + 50,
          alpha: 0
        }, 450 + Math.random() * 200, Laya.Ease.quadOut, Laya.Handler.create(this, () => p.destroy()));
      }
    }
    // ==================================================================
    // 音效 / 存储
    // ==================================================================
    /** iOS/移动端要求：AudioContext 必须在用户手势回调中创建/恢复，否则全程静默 */
    ensureAudio() {
      try {
        if (!this.audioCtx) {
          const AC = window.AudioContext || window.webkitAudioContext;
          if (!AC) return;
          this.audioCtx = new AC();
        }
        if (this.audioCtx.state === "suspended") this.audioCtx.resume();
      } catch (e) {
      }
    }
    sfx(level, combo = 0) {
      try {
        if (!this.audioCtx || this.audioCtx.state !== "running") return;
        const ac = this.audioCtx;
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.type = "sine";
        const base = 340 + level * 52 + Math.min(combo, 8) * 24;
        const t0 = ac.currentTime;
        o.frequency.setValueAtTime(base, t0);
        o.frequency.exponentialRampToValueAtTime(base * 1.9, t0 + 0.03);
        o.frequency.exponentialRampToValueAtTime(base * 0.85, t0 + 0.1);
        g.gain.setValueAtTime(0.22, t0);
        g.gain.exponentialRampToValueAtTime(1e-3, t0 + 0.14);
        o.connect(g);
        g.connect(ac.destination);
        o.start(t0);
        o.stop(t0 + 0.15);
      } catch (e) {
      }
    }
    loadBest() {
      try {
        const v = parseInt(Laya.LocalStorage.getItem("sg_best") || "0", 10);
        return isNaN(v) ? 0 : v;
      } catch (e) {
        return 0;
      }
    }
    saveBest(v) {
      try {
        Laya.LocalStorage.setItem("sg_best", `${v}`);
      } catch (e) {
      }
    }
    /** 今日最高分（单键存 {day,best}，跨天自动重置） */
    loadDaily() {
      try {
        const raw = Laya.LocalStorage.getItem("sg_daily");
        const today = dailySeed();
        if (raw) {
          const obj = JSON.parse(raw);
          if (obj && obj.day === today) {
            this.dailyDay = obj.day;
            this.dailyBest = obj.best || 0;
            return;
          }
        }
        this.dailyDay = today;
        this.dailyBest = 0;
      } catch (e) {
        this.dailyDay = dailySeed();
        this.dailyBest = 0;
      }
    }
    saveDaily() {
      try {
        this.dailyDay = dailySeed();
        Laya.LocalStorage.setItem("sg_daily", JSON.stringify({ day: this.dailyDay, best: this.dailyBest }));
      } catch (e) {
      }
    }
  };
  Main = __decorateClass([
    regClass("e60XQm7tTY2BwFAdxb8D1g")
  ], Main);
})();
