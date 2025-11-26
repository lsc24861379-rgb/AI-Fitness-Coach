// api/generate-plan.js
// 不再调用 OpenAI，纯规则生成版

export default async function handler(req, res) {
  // 处理 CORS 预检
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      gender,
      age,
      height,
      weight,
      experience,
      frequency,
      equipment,
      goal,
      diet,
    } = req.body || {};

    // 防御：如果前端没传东西
    if (!height || !weight || !frequency || !goal) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    // 简单推一个训练强度
    let levelText = "中等强度";
    if (experience === "Beginner") levelText = "偏保守";
    if (experience === "Advanced") levelText = "高强度";

    // 训练天数文字
    const daysText = `${frequency} 天/周`;

    // 目标
    let goalText = "综合健康";
    if (goal === "Fat Loss") goalText = "减脂";
    if (goal === "Muscle Gain") goalText = "增肌";

    // 器械
    let equipText = "仅徒手训练";
    if (equipment && equipment.toLowerCase().includes("gym")) {
      equipText = "健身房器械为主，结合徒手训练";
    }

    // 饮食限制
    const dietText = diet && diet.trim() !== "" ? diet : "无特别限制，注意干净饮食";

    // 估算一下基础情况
    const bmi = (weight / ((height / 100) ** 2)).toFixed(1);

    // 这里拼一个 7 天训练 + 饮食计划（你可以自己改文案）
    const planText = `
你的基础信息：
- 性别：${gender || "未填写"}
- 年龄：${age || "未填写"} 岁
- 身高：${height} cm
- 体重：${weight} kg
- BMI：约 ${bmi}
- 训练经验：${experience || "未填写"}
- 每周训练频率：${daysText}
- 主要目标：${goalText}
- 器械条件：${equipText}
- 饮食偏好 / 限制：${dietText}

【整体训练策略】
- 训练强度：${levelText}
- 建议每次训练时长：60–75 分钟
- 安排 1–2 天完全休息，用于恢复
- 每次训练前 5–10 分钟热身，结束后 5–10 分钟拉伸

【一周训练安排示例】

周一（下肢力量 + 有氧）
- 深蹲 / 45° 推腿 3–4 组 × 8–12 次
- 罗马尼亚硬拉 / 直腿硬拉 3 组 × 8–12 次
- 弓步蹲 3 组 × 10–12 次/腿
- 腿举或腿屈伸 3 组 × 12–15 次
- 最后加 15–20 分钟中等强度有氧（跑步机快走、椭圆机等）

周二（上肢推：胸 + 肩 + 三头）
- 卧推或哑铃卧推 3–4 组 × 8–12 次
- 上斜卧推 3 组 × 8–12 次
- 坐姿肩推 3 组 × 10–12 次
- 侧平举 3 组 × 12–15 次
- 三头臂屈伸或下压 3 组 × 10–12 次

周三（有氧 + 核心）
- 30–40 分钟有氧（跑步机、椭圆机、自行车任选）
- 平板支撑 3 组 × 30–60 秒
- 仰卧卷腹 3 组 × 15–20 次
- 俄罗斯转体 3 组 × 20 次（双侧）

周四（上肢拉：背 + 二头）
- 引体向上 / 高位下拉 3–4 组 × 8–12 次
- 划船（器械 / 哑铃 / 杠铃）3 组 × 8–12 次
- 面拉 3 组 × 12–15 次
- 哑铃弯举 3 组 × 10–12 次
- 交替弯举或牧师凳弯举 3 组 × 10–12 次

周五（下肢 + 臀部强化）
- 深蹲 / 杠铃臀推 3–4 组 × 8–12 次
- 硬拉变式 3 组 × 8–12 次
- 箱式登阶 3 组 × 10–12 次/腿
- 臀桥 / 绳索后踢腿 3 组 × 12–15 次
- 最后 10–15 分钟轻度有氧

周六（轻度活动 / 户外）
- 选择你喜欢的低强度活动：散步、瑜伽、拉伸、骑车等 30–60 分钟
- 目的：促进恢复，而不是再增加疲劳

周日（完全休息）
- 睡眠充足，多喝水，做简单拉伸
- 总结本周训练，记录体重、围度和感受

【饮食建议（${goalText} 方向）】

- 总热量控制：略低于维持（减脂） / 略高于维持（增肌）
- 蛋白质：每天约 ${Math.round(weight * 1.6)}–${Math.round(
      weight * 2
    )} g，来源：鸡胸肉、鱼、鸡蛋、牛肉、牛奶、酸奶、豆制品等
- 碳水：优先选择全谷物（燕麦、糙米、全麦面包）、土豆、红薯
- 脂肪：坚果、牛油果、橄榄油等健康脂肪，适量控制
- ${dietText !== "无特别限制，注意干净饮食" ? `特别注意：${dietText}` : "减少精制糖和油炸食品，多吃蔬菜水果"}
- 每天保证 6–8 杯水，训练日适当多喝

【小提示】
- 每 4 周可以根据体重变化和训练感觉调整训练量和饮食量
- 如果第二天酸痛非常严重，可以适当减少组数或重量
- 任何不适（关节痛、胸闷、眩晕）请及时停止训练并就医

以上计划是一个通用模板，你可以根据自己实际情况微调动作、组数和重量。
`;

    return res.status(200).json({ plan: planText });
  } catch (err) {
    console.error("Error generating plan:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
