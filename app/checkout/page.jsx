'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name:'', phone:'', address:'', note:'' });
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const cartItems = Object.entries(items).map(([id, qty]) => ({
    product: products.find(p => p.id == id), qty
  })).filter(x => x.product);

  const subtotal = cartItems.reduce((sum, {product, qty}) => sum + product.price * qty, 0);
  const ship = 30000;
  const total = subtotal + ship;

  async function handleOrder() {
    if (!form.name || !form.phone || !form.address) {
      setError('Vui lòng điền đầy đủ thông tin'); return;
    }
    if (!user) { setError('Vui lòng đăng nhập trước khi đặt hàng'); return; }
    if (!cartItems.length) { setError('Giỏ hàng trống'); return; }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          address: form.address,
          phone: form.phone,
          total: total,
          items: cartItems.map(({product, qty}) => ({
            productId: product.id,
            quantity: qty,
            price: product.price
          }))
        })
      });
      if (res.ok) {
        setSuccess(true);
        clearCart();
      } else {
        setError('Đặt hàng thất bại, thử lại!');
      }
    } catch {
      setError('Không thể kết nối server');
    } finally {
      setLoading(false);
    }
  }

  if (success) return (
    <main style={{maxWidth:'400px', margin:'60px auto', padding:'0 16px', textAlign:'center'}}>
      <div style={{background:'white', border:'1px solid #f1f5f9', borderRadius:'16px', padding:'32px'}}>
        <p style={{fontSize:'56px', marginBottom:'16px'}}>🎉</p>
        <h2 style={{fontSize:'20px', fontWeight:'600', color:'#1e293b', marginBottom:'8px'}}>Đặt hàng thành công!</h2>
        <p style={{fontSize:'13px', color:'#94a3b8', marginBottom:'24px'}}>Chúng tôi sẽ liên hệ xác nhận trong 30 phút.</p>
        <button onClick={() => router.push('/')}
          style={{padding:'10px 24px', background:'#3b82f6', color:'white', borderRadius:'12px', border:'none', cursor:'pointer', fontSize:'14px', fontWeight:'500'}}>
          Tiếp tục mua sắm
        </button>
      </div>
    </main>
  );

  return (
    <main style={{maxWidth:'560px', margin:'0 auto', padding:'20px 16px'}}>
      <button onClick={() => router.back()}
        style={{fontSize:'13px', color:'#94a3b8', background:'none', border:'none', cursor:'pointer', marginBottom:'16px'}}>
        ← Quay lại
      </button>
      <h1 style={{fontSize:'18px', fontWeight:'600', color:'#1e293b', marginBottom:'16px'}}>Thanh toán</h1>

      {/* Thông tin giao hàng */}
      <div style={{background:'white', border:'1px solid #f1f5f9', borderRadius:'16px', padding:'16px', marginBottom:'12px'}}>
        <h2 style={{fontSize:'14px', fontWeight:'600', color:'#1e293b', marginBottom:'14px'}}>📦 Thông tin giao hàng</h2>
        {[
          { key:'name', label:'Họ tên', placeholder:'Nguyễn Văn A', type:'text' },
          { key:'phone', label:'Số điện thoại', placeholder:'0912345678', type:'tel' },
          { key:'address', label:'Địa chỉ giao hàng', placeholder:'123 Đường ABC, Quận 1, TP.HCM', type:'text' },
          { key:'note', label:'Ghi chú (tuỳ chọn)', placeholder:'Giao giờ hành chính...', type:'text' },
        ].map(f => (
          <div key={f.key} style={{marginBottom:'12px'}}>
            <label style={{fontSize:'12px', color:'#64748b', display:'block', marginBottom:'5px'}}>{f.label}</label>
            <input value={form[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})}
              placeholder={f.placeholder} type={f.type}
              style={{width:'100%', height:'40px', padding:'0 12px', border:'1px solid #e2e8f0', borderRadius:'10px', fontSize:'13px', outline:'none', boxSizing:'border-box'}} />
          </div>
        ))}
      </div>

      {/* Tóm tắt đơn hàng */}
      <div style={{background:'white', border:'1px solid #f1f5f9', borderRadius:'16px', padding:'16px', marginBottom:'12px'}}>
        <h2 style={{fontSize:'14px', fontWeight:'600', color:'#1e293b', marginBottom:'14px'}}>🛒 Đơn hàng</h2>
        {cartItems.map(({product, qty}) => (
          <div key={product.id} style={{display:'flex', justifyContent:'space-between', fontSize:'13px', padding:'6px 0', borderBottom:'1px solid #f8fafc'}}>
            <span style={{color:'#64748b'}}>{product.emoji} {product.name} x{qty}</span>
            <span style={{fontWeight:'500'}}>{(product.price * qty).toLocaleString('vi-VN')}đ</span>
          </div>
        ))}
        <div style={{display:'flex', justifyContent:'space-between', fontSize:'13px', color:'#94a3b8', padding:'8px 0 4px'}}>
          <span>Phí ship</span><span>{ship.toLocaleString('vi-VN')}đ</span>
        </div>
        <div style={{display:'flex', justifyContent:'space-between', fontSize:'15px', fontWeight:'700', color:'#3b82f6', paddingTop:'8px', borderTop:'1px solid #f1f5f9'}}>
          <span>Tổng cộng</span><span>{total.toLocaleString('vi-VN')}đ</span>
        </div>
      </div>

      {/* Phương thức thanh toán */}
      <div style={{background:'white', border:'1px solid #f1f5f9', borderRadius:'16px', padding:'16px', marginBottom:'16px'}}>
        <h2 style={{fontSize:'14px', fontWeight:'600', color:'#1e293b', marginBottom:'12px'}}>💳 Phương thức thanh toán</h2>
        <div style={{padding:'10px 14px', border:'2px solid #3b82f6', borderRadius:'10px', display:'flex', alignItems:'center', gap:'10px'}}>
          <span style={{fontSize:'20px'}}>💵</span>
          <span style={{fontSize:'13px', fontWeight:'500', color:'#1e293b'}}>Thanh toán khi nhận hàng (COD)</span>
        </div>
      </div>

      {error && (
        <p style={{fontSize:'13px', color:'#ef4444', marginBottom:'12px', padding:'10px 14px', background:'#fee2e2', borderRadius:'10px'}}>
          {error}
        </p>
      )}

      <button onClick={handleOrder} disabled={loading}
        style={{width:'100%', padding:'14px', background:'#3b82f6', color:'white', fontWeight:'600', borderRadius:'12px', border:'none', cursor:'pointer', fontSize:'15px', opacity: loading ? 0.7 : 1}}>
        {loading ? 'Đang xử lý...' : '🎉 Đặt hàng ngay'}
      </button>
    </main>
  );
}