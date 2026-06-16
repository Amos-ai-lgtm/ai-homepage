import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Send, Bot, User, Sparkles, BookOpen, Cpu, PenTool } from 'lucide-react';
import { sendMessage, generateSessionId, getChatHistory } from '@/services/api';
import type { ChatMessage } from '@/types/types';
import { toast } from 'sonner';

const AVATAR_URL = 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_a6372095-f6c5-4895-a5f5-d32ec7b44947.jpg';

const infoItems = [
  {
    icon: <Cpu className="w-4 h-4" />,
    label: '现在在做',
    value: '整理自己的作品和写作方向',
  },
  {
    icon: <Sparkles className="w-4 h-4" />,
    label: '兴趣',
    value: 'AI 应用、写作、动漫',
  },
  {
    icon: <BookOpen className="w-4 h-4" />,
    label: '特点',
    value: '喜欢把复杂问题讲成人话',
  },
];

const suggestedQuestions = [
  '你现在在做什么？',
  '你有哪些作品？',
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
      {/* 顶部装饰线 */}
      <div className="h-1 bg-primary w-full" />

      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 space-y-8">
        {/* 头部区域 */}
        <header className="flex flex-col items-center text-center space-y-4 opacity-0 animate-fade-in">
          <Avatar className="w-24 h-24 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
            <AvatarImage src={AVATAR_URL} alt="叶秋的头像" />
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
              叶
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              叶秋
            </h1>
            <p className="text-muted-foreground text-base md:text-lg text-pretty max-w-md mx-auto">
              一个正在学习用 AI 做产品的内容策划
            </p>
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            <Badge variant="secondary" className="gap-1">
              <PenTool className="w-3 h-3" />
              内容策划
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Cpu className="w-3 h-3" />
              AI 应用
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <BookOpen className="w-3 h-3" />
              知识整理
            </Badge>
          </div>
        </header>

        <Separator />

        {/* 个人信息展示区 */}
        <section className="opacity-0 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground">关于我</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {infoItems.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 rounded-md bg-primary/10 text-primary shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-muted-foreground mb-0.5">{item.label}</p>
                    <p className="text-sm text-foreground text-pretty">{item.value}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* 数字分身聊天区 */}
        <section className="opacity-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Card className="border-border/60 shadow-sm flex flex-col h-[500px] md:h-[520px]">
            <CardHeader className="pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground">和叶秋的数字分身聊聊</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">问我关于职业、兴趣、作品等问题</p>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="flex-1 flex flex-col p-0 min-h-0">
              {/* 消息列表 */}
              <ScrollArea ref={scrollRef} className="flex-1 px-4 py-3">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-8">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">你好！我是叶秋的数字分身</p>
                      <p className="text-xs text-muted-foreground">可以问我关于叶秋的任何问题</p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center max-w-xs">
                      {suggestedQuestions.map((q) => (
                        <Button
                          key={q}
                          variant="outline"
                          size="sm"
                          className="text-xs h-8"
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
          <p>© 2026 叶秋 · 用 AI 做产品的内容策划</p>
        </footer>
      </div>
    </div>
  );
}