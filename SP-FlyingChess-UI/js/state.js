window.STATE = {
  players: [],
  bodyParts: [
    { name: "屁股", weight: 70, strength: 1.0, enabled: true, femaleOnly: false },
    { name: "背部", weight: 10, strength: 0.5, enabled: true, femaleOnly: false },
    { name: "大腿", weight: 10, strength: 0.7, enabled: true, femaleOnly: false },
    { name: "臀缝", weight: 10, strength: 0.3, enabled: true, femaleOnly: false },
    { name: "脚心", weight: 10, strength: 0.3, enabled: true, femaleOnly: false },
    { name: "胸部", weight: 5, strength: 0.3, enabled: true, femaleOnly: true },
    { name: "脸部", weight: 5, strength: 0.2, enabled: true, femaleOnly: false },
    { name: "私处", weight: 5, strength: 0.2, enabled: true, femaleOnly: true }
  ],
  libraries: {
    tools: ["绳子", "冰块", "羽毛"],
    postures: ["站立", "跪姿", "俯身"],
    reward: ["前进3格", "再掷一次", "免疫一次惩罚", "交换位置"],
    trap: ["后退3格", "跳过一回合", "回到起点", "随机换位"],
    special: ["传送", "换位", "跳过一回合", "额外移动2格"]
  },
  boardConfig: {
    size: 50,
    columns: 10,
    weights: {
      reward: 30,
      punish: 30,
      special: 20,
      trap: 20
    }
  },
  board: [],
  game: {
    started: false,
    turn: 0,
    finished: false,
    animating: false
  },
  history: []
};
