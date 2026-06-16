import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// 叶秋的知识库
const knowledgeBase = {
  identity: "内容策划",
  currentWork: "正在搭自己的个人主页，整理作品集",
  skills: ["内容表达", "AI 应用", "知识整理"],
  interests: ["AI 应用", "写作", "动漫"],
  trait: "喜欢把复杂问题讲成人话",
  tagline: "一个正在学习用 AI 做产品的内容策划",
  contact: "可以通过这个主页的聊天区和我互动，或者通过社交媒体联系我",
};

// 基于关键词匹配生成回复
function generateReply(message: string): string {
  const msg = message.toLowerCase();

  // 你现在在做什么
  if (msg.includes("做什么") || msg.includes("在忙") || msg.includes("最近") || msg.includes("现在")) {
    return `我最近主要在做两件事：一是搭建这个个人主页，二是整理自己的作品集。作为一个内容策划，我正在把之前做过的项目和写过的内容做一个系统性的梳理。`;
  }

  // 作品
  if (msg.includes("作品") || msg.includes("项目") || msg.includes("案例") || msg.includes("做过什么")) {
    return `我的作品主要集中在内容策划和知识整理方向。我擅长把复杂的信息梳理成清晰易懂的内容，这也是我一直在深耕的方向。目前我正在整理作品集，后续会在这个主页上展示出来。`;
  }

  // 联系方式
  if (msg.includes("联系") || msg.includes("微信") || msg.includes("邮箱") || msg.includes("怎么找")) {
    return `很高兴你想联系我！目前你可以通过这个聊天区和我互动。如果你有合作意向，可以留言，我会尽快回复。`;
  }

  // 兴趣
  if (msg.includes("兴趣") || msg.includes("喜欢") || msg.includes("爱好")) {
    return `我主要对三个方面感兴趣：AI 应用——探索 AI 如何帮助内容创作和产品开发；写作——用文字表达想法和分享知识；动漫——放松和获取灵感的好方式。`;
  }

  // 擅长
  if (msg.includes("擅长") || msg.includes("技能") || msg.includes("能力")) {
    return `我最擅长的方向是内容表达、AI 应用和知识整理。我有一个比较有意思的特点：喜欢把复杂问题讲成人话，让信息更容易被理解和传播。`;
  }

  // 介绍
  if (msg.includes("介绍") || msg.includes("你是谁") || msg.includes("名字") || msg.includes("叶秋")) {
    return `我是叶秋，一个正在学习用 AI 做产品的内容策划。我擅长把复杂问题讲成人话，目前主要在做内容表达和知识整理相关的工作。`;
  }

  // AI
  if (msg.includes("ai") || msg.includes("人工智能")) {
    return `AI 是我非常感兴趣的方向！我正在学习如何用 AI 来辅助内容创作和产品开发。我认为 AI 是一个很好的工具，可以帮助我们更高效地整理知识和表达想法。`;
  }

  // 写作
  if (msg.includes("写作") || msg.includes("写") || msg.includes("文章")) {
    return `写作是我表达想法的重要方式。我正在整理自己的写作方向，希望能在内容策划和知识分享方面有更多输出。`;
  }

  // 动漫
  if (msg.includes("动漫") || msg.includes("动画") || msg.includes("番")) {
    return `动漫是我放松和获取灵感的方式之一。好的动漫作品在叙事和视觉表达上都有很多值得学习的地方，对我的内容策划工作也很有启发。`;
  }

  // 默认回复
  return `谢谢你的提问！我是叶秋的数字分身，可以回答关于叶秋的职业、兴趣、作品等方面的问题。你可以试试问我：你现在在做什么？你有哪些作品？怎么联系你？`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message, session_id } = await req.json();

    if (!message || !session_id) {
      return new Response(
        JSON.stringify({ error: "缺少必要参数" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 生成回复
    const reply = generateReply(message);

    // 存储到数据库
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 并行存储用户消息和助手回复
    await Promise.all([
      supabase.from("chat_messages").insert({
        session_id,
        role: "user",
        content: message,
      }),
      supabase.from("chat_messages").insert({
        session_id,
        role: "assistant",
        content: reply,
      }),
    ]);

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "回复失败，请稍后重试" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});