'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:'', description:'', price:'', oldPrice:'', category:'laptop', emoji:'💻', badge:'', stock:'' });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') { router.push('/'); return; }
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [p, o] = await Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/admin/orders').then(r => r.json()),
    ]);
    setProducts(p);
    setOrders(o);
    setLoading(false);
  }

  async function addProduct() {
    await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : null,
        stock: parseInt(form.stock)
      })
    });
    setShowForm(false);
    setForm({ name:'', description:'', price:'', oldPrice:'', category:'laptop', emoji:'💻', badge:'', stock:'' });
    loadData();
  }

  async function deleteProduct(id) {
    if (!confirm('Xóa sản phẩm này?')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    loadData();
  }

  async function updateOrderStatus(id, status) {
    await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    loadData();
  }

  const statusColor = { pending:'#f59e0b', confirmed:'#3b82f6', shipping:'#8b5cf6', delivered:'#22c55e', cancelled:'#ef4444' };
  const statusLabel = { pending:'Chờ xác nhận', confirmed:'Đã xác nhận', shipping:'Đang giao', delivered:'Đã giao', cancelled:'Đã hủy' };

  if (loading) return <p style={{textAlign:'center', padding:'40px', color:'#94a3b8'}}>Đang tải...</p>;

  return (
    <main style={{maxWidth:'900px', margin:'0 auto', padding:'20px 16px'}}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px'}}>
        <h1 style={{fontSize:'20px', fontWeight:'600', color:'#1e293b'}}>⚙️ Trang Admin</h1>
        <button onClick={() => router.push('/')}
          style={{fontSize:'13px', color:'#94a3b8', background:'none', border:'none', cursor:'pointer'}}>
          ← Về trang chủ
        </button>
      </div>

      {/* Thống kê */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:'12px', marginBottom:'20px'}}>
        {[
          { label:'Sản phẩm', value: products.length, emoji:'📦' },
          { label:'Đơn hàng', value: orders.length, emoji:'🛒' },
          { label:'Chờ xử lý', value: orders.filter(o => o.status === 'pending').length, emoji:'⏳' },
          { label:'Doanh thu', value: orders.filter(o=>o.status==='delivered').reduce((s,o)=>s+o.total,0).toLocaleString('vi-VN')+'đ', emoji:'💰' },
        ].map(s => (
          <div key={s.label} style={{background:'white', border:'1px solid #f1f5f9', borderRadius:'14px', padding:'14px'}}>
            <p style={{fontSize:'20px', marginBottom:'6px'}}>{s.emoji}</p>
            <p style={{fontSize:'18px', fontWeight:'700', color:'#1e293b'}}>{s.value}</p>
            <p style={{fontSize:'12px', color:'#94a3b8'}}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{display:'flex', gap:'8px', marginBottom:'16px'}}>
        {['products','orders'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{padding:'8px 20px', borderRadius:'10px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'500', background: tab===t ? '#3b82f6' : 'white', color: tab===t ? 'white' : '#64748b', border: tab===t ? 'none' : '1px solid #e2e8f0'}}>
            {t === 'products' ? '📦 Sản phẩm' : '🛒 Đơn hàng'}
          </button>
        ))}
      </div>

      {/* Sản phẩm */}
      {tab === 'products' && (
        <div>
          <button onClick={() => setShowForm(!showForm)}
            style={{marginBottom:'12px', padding:'8px 16px', background:'#3b82f6', color:'white', borderRadius:'10px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'500'}}>
            + Thêm sản phẩm
          </button>

          {showForm && (
            <div style={{background:'white', border:'1px solid #f1f5f9', borderRadius:'16px', padding:'16px', marginBottom:'16px'}}>
              <h3 style={{fontSize:'14px', fontWeight:'600', marginBottom:'14px'}}>Thêm sản phẩm mới</h3>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                {[
                  { key:'name', label:'Tên sản phẩm', placeholder:'MacBook Air M3' },
                  { key:'emoji', label:'Emoji', placeholder:'💻' },
                  { key:'price', label:'Giá (VNĐ)', placeholder:'28990000' },
                  { key:'oldPrice', label:'Giá cũ (tuỳ chọn)', placeholder:'32000000' },
                  { key:'stock', label:'Tồn kho', placeholder:'50' },
                  { key:'badge', label:'Badge (tuỳ chọn)', placeholder:'-9%' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{fontSize:'12px', color:'#64748b', display:'block', marginBottom:'4px'}}>{f.label}</label>
                    <input value={form[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})}
                      placeholder={f.placeholder}
                      style={{width:'100%', height:'36px', padding:'0 10px', border:'1px solid #e2e8f0', borderRadius:'8px', fontSize:'13px', outline:'none', boxSizing:'border-box'}} />
                  </div>
                ))}
              </div>
              <div style={{marginTop:'10px'}}>
                <label style={{fontSize:'12px', color:'#64748b', display:'block', marginBottom:'4px'}}>Mô tả</label>
                <input value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  placeholder="Mô tả sản phẩm..."
                  style={{width:'100%', height:'36px', padding:'0 10px', border:'1px solid #e2e8f0', borderRadius:'8px', fontSize:'13px', outline:'none', boxSizing:'border-box'}} />
              </div>
              <div style={{marginTop:'10px'}}>
                <label style={{fontSize:'12px', color:'#64748b', display:'block', marginBottom:'4px'}}>Danh mục</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                  style={{width:'100%', height:'36px', padding:'0 10px', border:'1px solid #e2e8f0', borderRadius:'8px', fontSize:'13px', outline:'none'}}>
                  <option value="laptop">Laptop</option>
                  <option value="phone">Điện thoại</option>
                  <option value="tablet">Máy tính bảng</option>
                  <option value="audio">Âm thanh</option>
                  <option value="accessory">Phụ kiện</option>
                </select>
              </div>
              <div style={{display:'flex', gap:'8px', marginTop:'14px'}}>
                <button onClick={addProduct}
                  style={{padding:'8px 20px', background:'#3b82f6', color:'white', borderRadius:'10px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'500'}}>
                  Lưu
                </button>
                <button onClick={() => setShowForm(false)}
                  style={{padding:'8px 20px', background:'#f1f5f9', color:'#64748b', borderRadius:'10px', border:'none', cursor:'pointer', fontSize:'13px'}}>
                  Hủy
                </button>
              </div>
            </div>
          )}

          <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
            {products.map(p => (
              <div key={p.id} style={{background:'white', border:'1px solid #f1f5f9', borderRadius:'14px', padding:'14px', display:'flex', alignItems:'center', gap:'12px'}}>
                <span style={{fontSize:'28px'}}>{p.emoji}</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:'13px', fontWeight:'500', color:'#1e293b'}}>{p.name}</p>
                  <p style={{fontSize:'12px', color:'#94a3b8'}}>{p.category} • Tồn: {p.stock} • {p.price.toLocaleString('vi-VN')}đ</p>
                </div>
                <button onClick={() => deleteProduct(p.id)}
                  style={{padding:'6px 12px', background:'#fee2e2', color:'#ef4444', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'12px'}}>
                  Xóa
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Đơn hàng */}
      {tab === 'orders' && (
        <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
          {orders.length === 0 && <p style={{color:'#94a3b8', textAlign:'center', padding:'40px'}}>Chưa có đơn hàng nào</p>}
          {orders.map(o => (
            <div key={o.id} style={{background:'white', border:'1px solid #f1f5f9', borderRadius:'14px', padding:'16px'}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                <div>
                  <p style={{fontSize:'13px', fontWeight:'600', color:'#1e293b'}}>Đơn #{o.id}</p>
                  <p style={{fontSize:'12px', color:'#94a3b8'}}>{o.phone} • {o.address}</p>
                </div>
                <div style={{textAlign:'right'}}>
                  <p style={{fontSize:'13px', fontWeight:'600', color:'#3b82f6'}}>{o.total.toLocaleString('vi-VN')}đ</p>
                  <span style={{fontSize:'11px', padding:'3px 8px', borderRadius:'6px', background: statusColor[o.status]+'20', color: statusColor[o.status], fontWeight:'500'}}>
                    {statusLabel[o.status]}
                  </span>
                </div>
              </div>
              <div style={{display:'flex', gap:'6px', flexWrap:'wrap'}}>
                {Object.entries(statusLabel).map(([s, label]) => (
                  <button key={s} onClick={() => updateOrderStatus(o.id, s)}
                    style={{padding:'4px 10px', borderRadius:'8px', border:'1px solid #e2e8f0', background: o.status===s ? statusColor[s] : 'white', color: o.status===s ? 'white' : '#64748b', fontSize:'11px', cursor:'pointer'}}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}