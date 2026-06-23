import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Send, Bot, User, Sparkles, BookOpen, Cpu, PenTool, ExternalLink, Mail, MessageCircle } from 'lucide-react';
import { sendMessage, generateSessionId, getChatHistory } from '@/services/api';
import type { ChatMessage } from '@/types/types';
import { toast } from 'sonner';

const AVATAR_URL = '/ai-homepage/images/avatar-new.jpg';

const infoItems = [
  {
    icon: <Cpu className="w-4 h-4" />,
    label: '现在在做',
    value: '整理作品集，探索 AI 能帮我做什么',
  },
  {
    icon: <Sparkles className="w-4 h-4" />,
    label: '兴趣',
    value: 'AI 应用、写作、动漫、发呆',
  },
  {
    icon: <BookOpen className="w-4 h-4" />,
    label: '特点',
    value: '喜欢把复杂问题讲成人话，偶尔也会把简单问题讲复杂',
  },
];

const suggestedQuestions = [
  '你现在在干嘛？',
  '你有什么爱好？',
  '怎么联系你？',
];

export default function HomePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => generateSessionId());
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 加载历史消息
  useEffect(() => {
    getChatHistory(sessionId).then((history) => {
      if (history.length > 0) {
        setMessages(history);
      }
    });
  }, [sessionId]);

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleSend = useCallback(async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    setInput('');
    setLoading(true);

    // 添加用户消息到本地
    const userMsg: ChatMessage = {
      id: `temp_${Date.now()}`,
      session_id: sessionId,
      role: 'user',
      content: msg,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const reply = await sendMessage(msg, sessionId);
      const assistantMsg: ChatMessage = {
        id: `temp_${Date.now() + 1}`,
        session_id: sessionId,
        role: 'assistant',
        content: reply,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      toast.error('回复失败，请稍后重试');
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [input, loading, sessionId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        {/* 头部区域 */}
        <header className="flex flex-col items-center text-center opacity-0 animate-fade-in mb-10">
          <Avatar className="w-28 h-28 ring-4 ring-primary/10 ring-offset-4 ring-offset-background mb-5">
            <AvatarImage src={AVATAR_URL} alt="秋叶的头像" />
            <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
              叶
            </AvatarFallback>
          </Avatar>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance mb-3">
            秋叶
          </h1>
          <p className="text-muted-foreground text-base md:text-lg text-pretty max-w-md mx-auto mb-6">
正在用 AI 做点有趣的东西，喜欢把复杂问题讲成人话
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap w-full">
            <div className="flex gap-2">
              <Badge variant="outline" className="gap-1 px-3 py-1">
                <Cpu className="w-3 h-3" />
                AI 学习者
              </Badge>
              <Badge variant="outline" className="gap-1 px-3 py-1">
                <Sparkles className="w-3 h-3" />
                产品探索
              </Badge>
              <Badge variant="outline" className="gap-1 px-3 py-1">
                <PenTool className="w-3 h-3" />
                内容输出
              </Badge>
            </div>
            <div className="w-px h-6 bg-muted hidden sm:block" />
            <Button size="lg">
              查看作品
            </Button>
          </div>
        </header>

        {/* 个人信息展示区 - 去掉卡片，更简洁 */}
        <section className="opacity-0 animate-fade-in mb-10" style={{ animationDelay: '0.1s' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {infoItems.map((item) => (
              <div key={item.label} className="flex flex-col items-center text-center p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="p-2 rounded-full bg-primary/10 text-primary mb-2">
                  {item.icon}
                </div>
                <p className="text-xs font-medium text-muted-foreground mb-1">{item.label}</p>
                <p className="text-sm text-foreground font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 作品展示区 */}
        <section className="opacity-0 animate-fade-in mb-10" style={{ animationDelay: '0.15s' }}>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            作品
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="#" className="group block p-5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all border border-transparent hover:border-primary/20">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">个人主页</h3>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm text-muted-foreground">用 AI 搭建的个人主页，包含数字分身聊天功能</p>
            </a>
            <a href="#" className="group block p-5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all border border-transparent hover:border-primary/20">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">作品集</h3>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm text-muted-foreground">正在整理中，敬请期待...</p>
            </a>
          </div>
        </section>

        {/* 联系方式区 */}
        <section className="opacity-0 animate-fade-in mb-10" style={{ animationDelay: '0.18s' }}>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            联系我
          </h2>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/30 text-sm text-foreground">
              <Mail className="w-4 h-4 text-primary" />
              <span>17332616557@163.com</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/30 text-sm text-foreground">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span>微信：YS2387747421</span>
            </div>
          </div>
        </section>

        {/* 数字分身聊天区 */}
        <section className="opacity-0 animate-fade-in" style={{ animationDelay: '0.22s' }}>
          <Card className="border-primary/30 border-2 shadow-lg flex flex-col h-[500px] md:h-[550px]">
            <CardHeader className="pb-4 shrink-0 bg-gradient-to-r from-primary/10 to-transparent border-b border-primary/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary text-primary-foreground shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl font-bold text-foreground">和秋叶的数字分身聊聊</CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">问我关于职业、兴趣、作品等问题</p>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-green-600 font-medium">在线</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 min-h-0">
              {/* 消息列表 */}
              <ScrollArea ref={scrollRef} className="flex-1 px-4 py-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-10">
                    <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <div className="space-y-2 mb-6">
                      <p className="text-base font-semibold text-foreground">你好！我是秋叶的数字分身</p>
                      <p className="text-sm text-muted-foreground max-w-xs">可以问我关于秋叶的职业、兴趣、作品等问题</p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center max-w-sm">
                      {suggestedQuestions.map((q) => (
                        <Button
                          key={q}
                          variant="secondary"
                          size="sm"
                          className="text-sm h-9"
                          onClick={() => handleSend(q)}
                        >
                          {q}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        }`}>
                          {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                        </div>
                        <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex gap-2.5">
                        <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                        <div className="bg-secondary rounded-lg px-3 py-2">
                          <div className="flex gap-1">
                            <Skeleton className="w-2 h-2 rounded-full bg-muted" />
                            <Skeleton className="w-2 h-2 rounded-full bg-muted" />
                            <Skeleton className="w-2 h-2 rounded-full bg-muted" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>

              {/* 输入区 */}
              <div className="shrink-0 border-t border-border p-3">
                <div className="flex gap-2 items-end">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="输入你的问题..."
                    rows={1}
                    className="flex-1 min-h-[40px] max-h-[100px] resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                  <Button
                    size="icon"
                    className="h-10 w-10 shrink-0"
                    disabled={!input.trim() || loading}
                    onClick={() => handleSend()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 页脚 */}
        <footer className="text-center text-xs text-muted-foreground pb-4 opacity-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p>© 2026 秋叶 · 用 AI 做点有趣的东西</p>
        </footer>
      </div>
    </div>
  );
}