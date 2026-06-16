import { supabase } from '@/db/supabase';
import type { ChatMessage } from '@/types/types';

// 生成会话 ID
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// 发送消息给数字分身
export async function sendMessage(message: string, sessionId: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke('chat-with-yeqiu', {
    body: { message, session_id: sessionId },
    method: 'POST',
  });

  if (error) {
    const errorMsg = await error?.context?.text();
    console.error('edge function error in <chat-with-yeqiu>:', errorMsg || error?.message);
    throw new Error('回复失败，请稍后重试');
  }

  return data.reply;
}

// 获取历史消息
export async function getChatHistory(sessionId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })
    .limit(100);

  if (error) {
    console.error('获取聊天记录失败:', error.message);
    return [];
  }

  return Array.isArray(data) ? data : [];
}