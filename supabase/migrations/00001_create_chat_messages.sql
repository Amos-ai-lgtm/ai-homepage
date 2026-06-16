CREATE TABLE chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 允许匿名用户插入和查询消息
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_messages" ON chat_messages
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_select_messages" ON chat_messages
  FOR SELECT TO anon USING (true);