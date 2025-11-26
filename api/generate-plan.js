{\rtf1\ansi\ansicpg936\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import OpenAI from "openai";\
\
export default async function handler(req, res) \{\
  try \{\
    const openai = new OpenAI(\{\
      apiKey: process.env.OPENAI_API_KEY\
    \});\
\
    const body = req.body;\
\
    const prompt = `\
Generate a 7-day workout and meal plan for:\
Gender: $\{body.gender\}\
Age: $\{body.age\}\
Height: $\{body.height\} cm\
Weight: $\{body.weight\} kg\
Training Experience: $\{body.experience\}\
Weekly Frequency: $\{body.frequency\}\
Equipment: $\{body.equipment\}\
Goal: $\{body.goal\}\
Diet Restrictions: $\{body.diet\}\
\
Make it structured and easy to read.\
    `;\
\
    const completion = await openai.chat.completions.create(\{\
      model: "gpt-4o-mini",\
      messages: [\{ role: "user", content: prompt \}]\
    \});\
\
    res.status(200).json(\{ result: completion.choices[0].message.content \});\
\
  \} catch (err) \{\
    res.status(500).json(\{ error: err.message \});\
  \}\
\}\
}