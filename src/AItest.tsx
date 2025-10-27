import { GoogleGenAI } from '@google/genai';
import React, { useEffect, useMemo, useRef, useState } from 'react';

// Simple chat types matching Google Gen AI SDK
export type Part = { text: string };
export type ChatMsg = { role: 'user' | 'model'; parts: Part[] };

type Props = {
  /** Default Gemini model id (you can type any valid one) */
  defaultModel?: string; // e.g. 'gemini-2.5-flash'
  /** Optional starter message */
  starter?: string;
};

export default function AItest({
  defaultModel = 'gemini-2.5-flash',
  starter = '午餐吃什麼？',
}: Props) {
  const [model, setModel] = useState<string>(defaultModel);
  const [history, setHistory] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [rememberKey, setRememberKey] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [persona, setPersona] = useState(''); //記錄使用者目前選擇的角色。
  const listRef = useRef<HTMLDivElement | null>(null);

  // Load key from localStorage (for demo only — never ship an exposed key in production)
  useEffect(() => {
    const saved = localStorage.getItem('AIzaSyC0TuQJkRe_KkR0vzX0zrwLK2zOvIs4gvo');
    if (saved) setApiKey(saved);
  }, []);

  // Warm welcome + starter
  useEffect(() => {
    setHistory([{ role: 'model', parts: [{ text: '👋 我是美食百科，不知道吃什麼的時候來找我' }] }]);
    if (starter) setInput(starter);
  }, [starter]);

  // auto-scroll to bottom
  useEffect(() => {
    const el = listRef.current; if (!el) return; el.scrollTop = el.scrollHeight;
  }, [history, loading]);

  const ai = useMemo(() => {
    try {
      return apiKey ? new GoogleGenAI({ apiKey }) : null;
    } catch {
      return null;
    }
  }, [apiKey]);

  async function sendMessage(message?: string) {
    const personaPrefix = persona ? `請以「${persona}」的口吻回答：` : '';
    const content = (personaPrefix + (message ?? input)).trim(); //在使用者輸入的訊息前加上角色提示詞，讓 Gemini 知道要用什麼風格回答。
    if (!content || loading) return;
    if (!ai) { setError('請先輸入有效的 Gemini API Key'); return; }

    setError('');
    setLoading(true);

    const newHistory: ChatMsg[] = [...history, { role: 'user', parts: [{ text: content }] }];
    setHistory(newHistory);
    setInput('');

    try {
      // Use the official SDK directly in the browser
      const resp = await ai.models.generateContent({
        model,
        contents: newHistory, // send the chat history to keep context
      });

      const reply = resp.text || '[No content]';
      setHistory(h => [...h, { role: 'model', parts: [{ text: reply }] }]);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  function renderMarkdownLike(text: string) {
  const lines = text.split(/\n/);
  return (
    <>
      {lines.map((ln, i) => {
        const isNumberedBold = /^\s*\d+\.\s+\*\*(.+)\*\*/.test(ln); // 例如：1. **老牌山東水餃大王**
        const isBulletWithColon = /^\s*[-•*]\s+/.test(ln) && (ln.includes('：') || ln.includes(':'));
        const isTitle = ln.startsWith('# ') || /^\*\*(.+)\*\*$/.test(ln);

        if (isNumberedBold) {
          return (
            <div
              key={i}
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontWeight: 'bold',
                fontSize: 15,
                marginBottom: 4,
              }}
            >
              {ln.replace(/^\s*\d+\.\s+\*\*(.+)\*\*/, (_, p1) => `1. ${p1}`)}
            </div>
          );
        }

        if (isBulletWithColon) {
          const [before, after] = ln.replace(/^\s*[-•*]\s+/, '').split(/：|:/);
          return (
            <div key={i} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginBottom: 4 }}>
              <span style={{ fontWeight: 'bold' }}>• {before.trim()}</span>
              <span>：{after.trim()}</span>
            </div>
          );
        }

        if (isTitle) {
          const cleanText = ln.replace(/^# /, '').replace(/^\*\*(.+)\*\*$/, '$1');
          return (
            <div
              key={i}
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontWeight: 'bold',
                fontSize: 16,
                marginBottom: 4,
              }}
            >
              {cleanText}
            </div>
          );
        }

        return (
          <div
            key={i}
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontWeight: 'normal',
              fontSize: 14,
              marginBottom: 4,
            }}
          >
            {ln}
          </div>
        );
      })}
    </>
  );
}



  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.header}>Gemini Chat（直連 SDK，不經 proxy）</div>
      {persona && (
  <div style={{ padding: '6px 12px', fontSize: 13, color: '#374151' }}>
    🎭 目前角色：<strong>{persona}</strong>
  </div>
)} 

        {/* Controls */}
        <div style={styles.controls}>
          <label style={styles.label}> 
  <span>角色扮演模式</span>
  <select
    value={persona}
    onChange={e => setPersona(e.target.value)}
    style={styles.input}
  >
    <option value="">（無）</option>
    <option value="美食評論家">美食評論家</option>
    <option value="營養師">營養師</option>
    <option value="料理老師">料理老師</option>
    <option value="台北在地人">台北在地人</option>
  </select>
  <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
    Gemini 將依照角色風格回答問題，例如評論口味、分析營養、推薦在地美食。
  </div>
</label>

          <label style={styles.label}>
            <span>Model</span>
            <input
              value={model}
              onChange={e => setModel(e.target.value)}
              placeholder="例如 gemini-2.5-flash、gemini-2.5-pro"
              style={styles.input}
            />
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
              模型名稱會隨時間更新，若錯誤請改成官方清單中的有效 ID。
            </div>
          </label>

          <label style={styles.label}>
            <span>Gemini API Key</span>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => {
                const v = e.target.value; setApiKey(v);
                if (rememberKey) localStorage.setItem('gemini_api_key', v);
              }}
              placeholder="貼上你的 API Key（只在本機瀏覽器儲存）"
              style={styles.input}
            />
            <label style={{ display:'flex', alignItems:'center', gap:8, marginTop:6, fontSize:12 }}>
              <input type="checkbox" checked={rememberKey} onChange={(e)=>{
                setRememberKey(e.target.checked);
                if (!e.target.checked) localStorage.removeItem('gemini_api_key');
                else if (apiKey) localStorage.setItem('gemini_api_key', apiKey);
              }} />
              <span>記住在本機（localStorage）</span>
            </label>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
              Demo 用法：在瀏覽器內保存 Key 僅供教學。正式環境請改走後端或使用安全限制的 Key。
            </div>
          </label>
        </div>

        {/* Messages */}
        <div ref={listRef} style={styles.messages}>
          {history.map((m, idx) => (
            <div key={idx} style={{ ...styles.msg, ...(m.role === 'user' ? styles.user : styles.assistant) }}>
              <div style={styles.msgRole}>{m.role === 'user' ? 'You' : 'Gemini'}</div>
              <div style={styles.msgBody}>{renderMarkdownLike(m.parts.map(p => p.text).join('\n'))}</div>
            </div>
          ))}
          {loading && (
            <div style={{ ...styles.msg, ...styles.assistant }}>
              <div style={styles.msgRole}>Gemini</div>
              <div style={styles.msgBody}>思考中…</div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={styles.error}>⚠ {error}</div>
        )}

        {/* Composer */}
        <form
          onSubmit={e => { e.preventDefault(); sendMessage(); }}
          style={styles.composer}
        >
          <input
            placeholder="輸入訊息，按 Enter 送出"
            value={input}
            onChange={e => setInput(e.target.value)}
            style={styles.textInput}
          />
          <button type="submit" disabled={loading || !input.trim() || !apiKey} style={styles.sendBtn}>
            送出
          </button>
        </form>

        {/* Quick examples */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          {['台北市大安區好吃的印度料理有什麼', '公館有什麼隱藏美食', '請推薦好吃的火鍋店'].map((q) => (
            <button key={q} type="button" style={styles.suggestion} onClick={() => sendMessage(q)}>{q}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { display: 'grid', placeItems: 'start', padding: 16 },
  card: {
    width: 'min(900px, 100%)',
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    padding: '10px 12px',
    fontWeight: 700,
    borderBottom: '1px solid #e5e7eb',
    background: '#f9fafb',
  },
  controls: {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: '1fr 1fr',
    padding: 12,
  },
  label: { display: 'grid', gap: 6, fontSize: 13, fontWeight: 600 },
  input: { padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 14 },
  messages: { padding: 12, display: 'grid', gap: 10, maxHeight: 420, overflow: 'auto' },
  msg: { borderRadius: 12, padding: 10, border: '1px solid #e5e7eb' },
  user: { background: '#eef2ff', borderColor: '#c7d2fe' },
  assistant: { background: '#f1f5f9', borderColor: '#e2e8f0' },
  msgRole: { fontSize: 12, fontWeight: 700, opacity: 0.7, marginBottom: 6 },
  msgBody: { fontSize: 14, lineHeight: 1.5 },
  error: { color: '#b91c1c', padding: '4px 12px' },
  composer: { padding: 12, display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, borderTop: '1px solid #e5e7eb' },
  textInput: { padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 14 },
  sendBtn: { padding: '10px 14px', borderRadius: 999, border: '1px solid #111827', background: '#111827', color: '#fff', fontSize: 14, cursor: 'pointer' },
  suggestion: { padding: '6px 10px', borderRadius: 999, border: '1px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer', fontSize: 12 },
};