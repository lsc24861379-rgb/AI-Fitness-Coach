// api/generate-plan.js

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // 处理 CORS（浏览器请求才不会报错）
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(200).end();
    return;
  }

  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const {
    age,
    gender,
    height,
    weight,
    experience,
    frequency,
    equipment,
    goal,
    diet,
  } = req.body || {};

  // 简单必填校验（可以按需删掉）
  if (!age || !gender || !height || !weight || !frequency || !goal) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an experienced personal trainer and nutrition coach. Create concise, realistic fitness and nutrition plans.",
        },
        {
          role: "user",
          content: `Create a 7-day fitness and meal plan for this person:
Age: ${age}
Gender: ${gender}
Height: ${height} cm
Weight: ${weight} kg
Training Experience: ${experience}
Weekly Training Frequency: ${frequency} days/week
Equipment Available: ${equipment}
Primary Goal: ${goal}
Diet Preferences / Restrictions: ${diet}

Format the answer with clear headings and bullet points. Keep total length under 800 words.`,
        },
      ],
    });

    const plan =
      completion.choices?.[0]?.message?.content ||
      "Sorry, I could not generate a plan.";

    res.status(200).json({ plan });
  } catch (error) {
    console.error("OpenAI API error:", error);

    // 尽量把错误信息返回给前端，方便你看到真实原因
    const message =
      error?.response?.data?.error?.message ||
      error?.message ||
      "Unknown error";

    res.status(500).json({
      error: "Server error when calling OpenAI: " + message,
    });
  }
}
