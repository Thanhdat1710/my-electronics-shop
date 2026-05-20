'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';

export default function AccountPage() {
    const clearCart = useCartStore(s => s.clearCart);
  const router = useRouter();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    }
    return null;
  });

  async function handleSubmit() {
    setError('');
    setLoading(true);
    try {
      const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (!res.ok) { setError(data.error || 'Có lỗi xảy ra'); return; }

      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
    } catch {
      setError('Không thể kết nối server');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
  localStorage.removeItem('user');
  setUser(null);
  }
  if (user) return (
    <main style={{maxWidth:'400px', margin:'60px auto', padding:'0 16px'}}>
      <div style={{background:'white', border:'1px solid #f1f5f9', borderRadius:'16px', padding:'24px', textAlign:'center'}}>
        <div style={{width:'64px', height:'64px', background:'#eff6ff', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', margin:'0 auto 16px'}}>
          👤
        </div>
        <h2 style={{fontSize:'18px', fontWeight:'600', color:'#1e293b', marginBottom:'4px'}}>{user.name}</h2>
        <p style={{fontSize:'13px', color:'#94a3b8', marginBottom:'24px'}}>{user.email}</p>
        <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
          <button onClick={() => router.push('/cart')}
            style={{padding:'10px', background:'#eff6ff', color:'#3b82f6', border:'none', borderRadius:'12px', cursor:'pointer', fontSize:'13px', fontWeight:'500'}}>
            🛒 Xem giỏ hàng
          </button>
          <button onClick={handleLogout}
            style={{padding:'10px', background:'#fee2e2', color:'#ef4444', border:'none', borderRadius:'12px', cursor:'pointer', fontSize:'13px', fontWeight:'500'}}>
            Đăng xuất
          </button>
        </div>
      </div>
    </main>
  );

  return (
    <main style={{maxWidth:'400px', margin:'60px auto', padding:'0 16px'}}>
      <div style={{background:'white', border:'1px solid #f1f5f9', borderRadius:'16px', padding:'24px'}}>
        <div style={{display:'flex', marginBottom:'24px', background:'#f8fafc', borderRadius:'12px', padding:'4px'}}>
          <button onClick={() => setMode('login')}
            style={{flex:1, padding:'8px', borderRadius:'10px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'500', background: mode==='login' ? 'white' : 'transparent', color: mode==='login' ? '#1e293b' : '#94a3b8'}}>
            Đăng nhập
          </button>
          <button onClick={() => setMode('register')}
            style={{flex:1, padding:'8px', borderRadius:'10px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'500', background: mode==='register' ? 'white' : 'transparent', color: mode==='register' ? '#1e293b' : '#94a3b8'}}>
            Đăng ký
          </button>
        </div>

        {mode === 'register' && (
          <div style={{marginBottom:'12px'}}>
            <label style={{fontSize:'12px', color:'#64748b', display:'block', marginBottom:'6px'}}>Họ tên</label>
            <input value={form.name} onChange={e => setForm({...form, name:e.target.value})}
              placeholder="Nguyễn Văn A"
              style={{width:'100%', height:'40px', padding:'0 12px', border:'1px solid #e2e8f0', borderRadius:'10px', fontSize:'13px', outline:'none', boxSizing:'border-box'}} />
          </div>
        )}

        <div style={{marginBottom:'12px'}}>
          <label style={{fontSize:'12px', color:'#64748b', display:'block', marginBottom:'6px'}}>Email</label>
          <input value={form.email} onChange={e => setForm({...form, email:e.target.value})}
            placeholder="email@example.com" type="email"
            style={{width:'100%', height:'40px', padding:'0 12px', border:'1px solid #e2e8f0', borderRadius:'10px', fontSize:'13px', outline:'none', boxSizing:'border-box'}} />
        </div>

        <div style={{marginBottom:'20px'}}>
          <label style={{fontSize:'12px', color:'#64748b', display:'block', marginBottom:'6px'}}>Mật khẩu</label>
          <input value={form.password} onChange={e => setForm({...form, password:e.target.value})}
            placeholder="••••••••" type="password"
            style={{width:'100%', height:'40px', padding:'0 12px', border:'1px solid #e2e8f0', borderRadius:'10px', fontSize:'13px', outline:'none', boxSizing:'border-box'}} />
        </div>

        {error && (
          <p style={{fontSize:'13px', color:'#ef4444', marginBottom:'12px', padding:'8px 12px', background:'#fee2e2', borderRadius:'8px'}}>
            {error}
          </p>
        )}

        <button onClick={handleSubmit} disabled={loading}
          style={{width:'100%', padding:'12px', background:'#3b82f6', color:'white', fontWeight:'600', borderRadius:'12px', border:'none', cursor:'pointer', fontSize:'14px', opacity: loading ? 0.7 : 1}}>
          {loading ? 'Đang xử lý...' : mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
        </button>
      </div>
    </main>
  );
}