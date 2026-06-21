import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// 袁帅的知识库
const knowledgeBase = {
  identity: "AI 学习者 / 生物科学学生",
  currentWork: "做生物实验，同时用 AI 做更完整的小项目",
  skills: ["排球", "乒乓球"],
  interests: ["AI 学习", "生物医学领域", "排球", "乒乓球"],
  trait: "平易近人，偶尔开点玩笑",
  tagline: "正在用 AI 做点有趣的东西",
  contact: "邮箱：17332616557@163.com，微信：YS2387747421",
  education: {
    highSchool: "廊坊市第一中学",
    university: "内蒙古大学",
    major: "生物科学（拔尖学生培养计划2.0基地）",
    gpa: "3.87",
    rank: "专业第二",
    cet4: "579",
    cet6: "548",
  },
  location: "河北省廊坊市",
};

// 基于关键词匹配生成回复
function generateReply(message: string): string {
  const msg = message.toLowerCase();

  // 你现在在做什么
  if (msg.includes("做什么") || msg.includes("在忙") || msg.includes("最近") || msg.includes("现在") || msg.includes("项目")) {
    return `最近主要在做两件事：一是生物实验方面的东西，二是尝试用 AI 做更完整的小项目。边学边做，进展不算快但还挺充实的。`;
  }

  // 作品
  if (msg.includes("作品") || msg.includes("项目") || msg.includes("案例") || msg.includes("做过什么")) {
    return `我做过的项目主要有三个：一是生物竞赛，关于工程化益生菌预防奶山羊乳腺炎感染的；二是毕业设计，研究卵巢癌细胞相关靶点的；三是这个个人主页，用 AI 搭的。感兴趣的话可以聊聊具体内容。`;
  }

  // 联系方式
  if (msg.includes("联系") || msg.includes("微信") || msg.includes("邮箱") || msg.includes("怎么找")) {
    return `想联系我的话，邮箱是 17332616557@163.com，微信是 YS2387747421。直接加我，我们聊聊！`;
  }

  // 兴趣
  if (msg.includes("兴趣") || msg.includes("喜欢") || msg.includes("爱好")) {
    return `我感兴趣的东西挺杂的：AI 相关的东西肯定在关注，生物医学领域的知识我也一直在看。运动方面，排球和乒乓球是我的老本行了。平时也看看动漫放松一下。`;
  }

  // 擅长
  if (msg.includes("擅长") || msg.includes("技能") || msg.includes("能力")) {
    return `打球还行吧，排球乒乓球都能来两下。其他的还在学，AI 这块我也是初学者，互相学习。`;
  }

  // 介绍
  if (msg.includes("介绍") || msg.includes("你是谁") || msg.includes("名字") || msg.includes("袁帅") || msg.includes("真名") || msg.includes("姓名") || msg.includes("叫") || msg.includes("叫什么")) {
    return `我叫袁帅，来自河北廊坊，高中就读于廊坊市第一中学，现在在内蒙古大学学生物科学（拔尖学生培养计划2.0基地），学分绩3.87，专业排名第二，四级579，六级548。做过三个主要项目：生物竞赛是关于工程化益生菌预防奶山羊乳腺炎的，毕设是卵巢癌细胞相关研究，还有就是这个用 AI 搭的个人主页。排球乒乓球都能打，感兴趣的话欢迎聊聊！`;
  }

  // AI
  if (msg.includes("ai") || msg.includes("人工智能") || msg.includes("机器学习")) {
    return `AI 这波浪潮确实挺有意思的。我现在主要在学 vibe coding，想把 AI 用在实际项目里。不是专家，就是一个正在学习的小白，有问题欢迎交流。`;
  }

  // 生物医学
  if (msg.includes("生物") || msg.includes("医学") || msg.includes("健康")) {
    return `生物医学这个方向我一直在关注，虽然不是科班出身，但平时会看看相关的科普和进展。有意思的方向，欢迎交流。`;
  }

  // 排球 / 乒乓球
  if (msg.includes("排球") || msg.includes("乒乓球") || msg.includes("打球")) {
    return `打球是我为数不多的运动爱好！排球和乒乓球都在打，虽然不算专业，但确实喜欢。你也打球吗？`;
  }

  // 学校 / 大学 / 高中 / 本科院校
  if (msg.includes("学校") || msg.includes("大学") || msg.includes("高中") || msg.includes("在哪上学") || msg.includes("哪个学校") || msg.includes("本科") || msg.includes("院校") || msg.includes("母校")) {
    return `我老家是河北廊坊的，高中就读于廊坊市第一中学，现在在内蒙古大学读书，专业是生物科学。`;
  }

  // 专业 / 生物科学
  if (msg.includes("专业") || msg.includes("生物科学") || msg.includes("生科")) {
    return `我在内蒙古大学学生物科学，是拔尖学生培养计划2.0基地的。简单说就是学校里比较好的生物专业吧。`;
  }

  // 绩点 / 成绩 / 排名
  if (msg.includes("绩点") || msg.includes("gpa") || msg.includes("成绩") || msg.includes("排名") || msg.includes("学分")) {
    return `学分绩 3.87，专业排名第二。不算特别拔尖，但也不差吧，还在努力中。`;
  }

  // 四级 / 六级 / 英语
  if (msg.includes("四级") || msg.includes("六级") || msg.includes("英语")) {
    return `四级 579，六级 548。英语这块还行吧，至少能看文献。`;
  }

  // 老家 / 家乡 / 廊坊
  if (msg.includes("老家") || msg.includes("家乡") || msg.includes("廊坊") || msg.includes("来自")) {
    return `我来自河北省廊坊市，标准的河北人。高中在廊坊市第一中学，后来考到了内蒙古大学。`;
  }

  // 默认回复
  return `这个问题我可能答不上来，毕竟我只是个还在学习的小白。邮箱是 17332616557@163.com，微信 YS2387747421，有问题可以直接问我。`;
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