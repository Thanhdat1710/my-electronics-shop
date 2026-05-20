'use client';
import { useState, useRef, useEffect } from 'react';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Xin chào! Tôi là TechBot 🤖 Tôi có thể tư vấn sản phẩm, giải đáp về bảo hành và giao hàng. Bạn cần giúp gì?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Xin lỗi, có lỗi xảy ra. Thử lại nhé!' }]);
    } finally {
      setLoading(false);
    }
  }

  const suggestions = ['Laptop dưới 20 triệu', 'Điện thoại chụp ảnh đẹp', 'Bảo hành bao lâu?', 'Giao hàng mấy ngày?'];

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{position:'fixed', bottom:'24px', right:'24px', width:'56px', height:'56px', background:'#3b82f6', color:'white', borderRadius:'50%', border:'none', cursor:'pointer', fontSize:'24px', zIndex:50, boxShadow:'0 4px 12px rgba(59,130,246,0.4)'}}
      >
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div style={{position:'fixed', bottom:'96px', right:'24px', width:'320px', background:'white', borderRadius:'20px', boxShadow:'0 8px 32px rgba(0,0,0,0.12)', border:'1px solid #f1f5f9', display:'flex', flexDirection:'column', zIndex:50, maxHeight:'500px'}}>
          <div style={{padding:'14px 16px', background:'#3b82f6', borderRadius:'20px 20px 0 0', display:'flex', alignItems:'center', gap:'10px'}}>
            <div style={{width:'36px', height:'36px', background:'rgba(255,255,255,0.2)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px'}}>🤖</div>
            <div>
              <p style={{fontWeight:'600', fontSize:'14px', color:'white', margin:0}}>TechBot AI</p>
              <p style={{fontSize:'12px', color:'rgba(255,255,255,0.8)', margin:0}}>● Đang trực tuyến</p>
            </div>
            <button onClick={() => setOpen(false)} style={{marginLeft:'auto', background:'none', border:'none', color:'white', cursor:'pointer', fontSize:'18px'}}>✕</button>
          </div>

          <div style={{flex:1, overflowY:'auto', padding:'16px', display:'flex', flexDirection:'column', gap:'10px', minHeight:'200px'}}>
            {messages.map((msg, i) => (
              <div key={i} style={{display:'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'}}>
                <div style={{maxWidth:'80%', padding:'8px 12px', borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: msg.role === 'user' ? '#3b82f6' : '#f1f5f9', color: msg.role === 'user' ? 'white' : '#1e293b', fontSize:'13px', lineHeight:'1.5'}}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{background:'#f1f5f9', color:'#94a3b8', fontSize:'13px', padding:'8px 12px', borderRadius:'16px 16px 16px 4px', width:'fit-content', fontStyle:'italic'}}>
                Đang trả lời...
              </div>
            )}
            <div ref={endRef} />
          </div>

          {messages.length === 1 && (
            <div style={{padding:'0 12px 10px', display:'flex', flexWrap:'wrap', gap:'6px'}}>
              {suggestions.map(s => (
                <button key={s} onClick={() => setInput(s)}
                  style={{fontSize:'11px', padding:'4px 10px', border:'1px solid #e2e8f0', borderRadius:'12px', background:'white', color:'#64748b', cursor:'pointer'}}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <div style={{padding:'12px', borderTop:'1px solid #f1f5f9', display:'flex', gap:'8px'}}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Nhập câu hỏi..."
              style={{flex:1, height:'36px', padding:'0 12px', borderRadius:'12px', border:'1px solid #e2e8f0', fontSize:'13px', outline:'none', background:'#f8fafc'}}
            />
            <button onClick={sendMessage}
              style={{width:'36px', height:'36px', background:'#3b82f6', color:'white', border:'none', borderRadius:'12px', cursor:'pointer', fontSize:'16px'}}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}