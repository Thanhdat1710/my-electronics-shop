'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ← đặt ở đây, ngoài component cũng được
const VARIANT_CATEGORIES = ['phone', 'tablet', 'laptop'];

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({
    name:'', description:'', price:'', oldPrice:'', salePercent:'',
    category:'laptop', emoji:'💻', badge:'', stock:'', images:'', specs:'', variants:[]
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') { router.push('/'); return; }
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [p, o] = await Promise.all([
        fetch('/api/products').then(r => r.json()).catch(() => []),
        fetch('/api/admin/orders').then(r => r.json()).catch(() => []),
      ]);
      setProducts(Array.isArray(p) ? p : []);
      setOrders(Array.isArray(o) ? o : []);
    } catch {
      setProducts([]);
      setOrders([]);
    }
    setLoading(false);
  }

  function openAdd() {
    setEditProduct(null);
    setForm({ name:'', description:'', price:'', oldPrice:'', salePercent:'',
              category:'laptop', emoji:'💻', badge:'', stock:'', images:'', specs:'', variants:[] });
    setShowForm(true);
  }

  function openEdit(p) {
    setEditProduct(p);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      oldPrice: p.oldPrice || '',
      salePercent: '',
      category: p.category,
      emoji: p.emoji,
      badge: p.badge || '',
      stock: p.stock,
      images: Array.isArray(p.images) ? p.images.join('\n') : '',
      specs: p.specs ? (Array.isArray(p.specs) ? p.specs : JSON.parse(p.specs || '[]')).map(([k,v]) => `${k}: ${v}`).join('\n') : '',
      variants: p.variants ? p.variants.map(v => ({
        id: v.id, storage: v.storage, price: v.price,
        oldPrice: v.oldPrice || '', stock: v.stock
      })) : []
    });
    setShowForm(true);
  }

  function handleSalePercent(percent) {
    const old = parseFloat(form.oldPrice);
    if (!percent || !old || isNaN(old)) { setForm({ ...form, salePercent: percent }); return; }
    const sale = parseFloat(percent);
    if (isNaN(sale) || sale <= 0 || sale >= 100) { setForm({ ...form, salePercent: percent }); return; }
    const newPrice = Math.round(old * (1 - sale / 100));
    setForm({ ...form, salePercent: percent, price: newPrice, badge: `-${Math.round(sale)}%` });
  }

  async function saveProduct() {
    const data = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : null,
      category: form.category,
      emoji: form.emoji,
      badge: form.badge || null,
      stock: parseInt(form.stock),
      images: form.images.split('\n').map(s => s.trim()).filter(Boolean),
      variants: form.variants.filter(v => v.storage && v.price),
      specs: JSON.stringify(
        form.specs.split('\n')
          .map(line => line.trim())
          .filter(line => line.includes(':'))
          .map(line => { const idx = line.indexOf(':'); return [line.slice(0,idx).trim(), line.slice(idx+1).trim()]; })
      ),
    };
    const url = editProduct ? `/api/admin/products/${editProduct.id}` : '/api/admin/products';
    const method = editProduct ? 'PUT' : 'POST';
    await fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) });
    setShowForm(false);
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
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ status })
    });
    loadData();
  }

  const statusColor = { pending:'#f59e0b', confirmed:'#3b82f6', shipping:'#8b5cf6', delivered:'#22c55e', cancelled:'#ef4444' };
  const statusLabel = { pending:'Chờ xác nhận', confirmed:'Đã xác nhận', shipping:'Đang giao', delivered:'Đã giao', cancelled:'Đã hủy' };

  if (loading) return <p style={{textAlign:'center', padding:'40px', color:'#94a3b8'}}>Đang tải...</p>;

  return (
    <main style={{maxWidth:'1000px', margin:'0 auto', padding:'20px 16px'}}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px'}}>
        <h1 style={{fontSize:'20px', fontWeight:'600', color:'#1e293b'}}>⚙️ Trang Admin</h1>
        <button onClick={() => router.push('/')} style={{fontSize:'13px', color:'#94a3b8', background:'none', border:'none', cursor:'pointer'}}>← Về trang chủ</button>
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
        {[['products','📦 Sản phẩm'],['orders','🛒 Đơn hàng']].map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            style={{padding:'8px 20px', borderRadius:'10px', border: tab===t ? 'none' : '1px solid #e2e8f0', cursor:'pointer', fontSize:'13px', fontWeight:'500', background: tab===t ? '#3b82f6' : 'white', color: tab===t ? 'white' : '#64748b'}}>
            {label}
          </button>
        ))}
      </div>

      {/* Tab Sản phẩm */}
      {tab === 'products' && (
        <div>
          <button onClick={openAdd}
            style={{marginBottom:'12px', padding:'8px 16px', background:'#3b82f6', color:'white', borderRadius:'10px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'500'}}>
            + Thêm sản phẩm
          </button>

          {showForm && (
            <div style={{background:'white', border:'1px solid #f1f5f9', borderRadius:'16px', padding:'16px', marginBottom:'16px'}}>
              <h3 style={{fontSize:'14px', fontWeight:'600', marginBottom:'14px', color:'#1e293b'}}>
                {editProduct ? '✏️ Sửa sản phẩm' : '+ Thêm sản phẩm mới'}
              </h3>

              {/* Grid giá */}
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                <div>
                  <label style={{fontSize:'12px', color:'#64748b', display:'block', marginBottom:'4px'}}>Tên sản phẩm</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="MacBook Air M3"
                    style={{width:'100%', height:'36px', padding:'0 10px', border:'1px solid #e2e8f0', borderRadius:'8px', fontSize:'13px', outline:'none', boxSizing:'border-box'}} />
                </div>
                <div>
                  <label style={{fontSize:'12px', color:'#64748b', display:'block', marginBottom:'4px'}}>Tồn kho</label>
                  <input value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} placeholder="50" type="number"
                    style={{width:'100%', height:'36px', padding:'0 10px', border:'1px solid #e2e8f0', borderRadius:'8px', fontSize:'13px', outline:'none', boxSizing:'border-box'}} />
                </div>
                <div>
                  <label style={{fontSize:'12px', color:'#64748b', display:'block', marginBottom:'4px'}}>Giá cũ (VNĐ)</label>
                  <input value={form.oldPrice} onChange={e => setForm({...form, oldPrice: e.target.value})} placeholder="32000000" type="number"
                    style={{width:'100%', height:'36px', padding:'0 10px', border:'1px solid #e2e8f0', borderRadius:'8px', fontSize:'13px', outline:'none', boxSizing:'border-box'}} />
                </div>
                <div>
                  <label style={{fontSize:'12px', color:'#64748b', display:'block', marginBottom:'4px'}}>% Giảm giá</label>
                  <div style={{position:'relative'}}>
                    <input value={form.salePercent} onChange={e => handleSalePercent(e.target.value)} placeholder="9" type="number" min="0" max="99"
                      style={{width:'100%', height:'36px', padding:'0 32px 0 10px', border:'1px solid #e2e8f0', borderRadius:'8px', fontSize:'13px', outline:'none', boxSizing:'border-box'}} />
                    <span style={{position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', fontSize:'12px', color:'#94a3b8'}}>%</span>
                  </div>
                </div>
                <div>
                  <label style={{fontSize:'12px', display:'block', marginBottom:'4px', color: form.salePercent ? '#3b82f6' : '#64748b'}}>
                    Giá bán (VNĐ) {form.salePercent ? '← tự tính' : ''}
                  </label>
                  <input value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="28990000" type="number"
                    style={{width:'100%', height:'36px', padding:'0 10px', border:`1px solid ${form.salePercent ? '#3b82f6' : '#e2e8f0'}`, borderRadius:'8px', fontSize:'13px', outline:'none', boxSizing:'border-box', background: form.salePercent ? '#eff6ff' : 'white'}} />
                </div>
                <div>
                  <label style={{fontSize:'12px', display:'block', marginBottom:'4px', color: form.salePercent ? '#3b82f6' : '#64748b'}}>
                    Badge {form.salePercent ? '← tự điền' : '(tuỳ chọn)'}
                  </label>
                  <input value={form.badge} onChange={e => setForm({...form, badge: e.target.value})} placeholder="-9%"
                    style={{width:'100%', height:'36px', padding:'0 10px', border:`1px solid ${form.salePercent ? '#3b82f6' : '#e2e8f0'}`, borderRadius:'8px', fontSize:'13px', outline:'none', boxSizing:'border-box', background: form.salePercent ? '#eff6ff' : 'white'}} />
                </div>
              </div>

              {form.salePercent && form.oldPrice && form.price && (
                <div style={{marginTop:'10px', padding:'10px 14px', background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'10px', fontSize:'13px', color:'#16a34a'}}>
                  💰 Giảm <strong>{form.salePercent}%</strong>: {parseFloat(form.oldPrice).toLocaleString('vi-VN')}đ → <strong>{parseFloat(form.price).toLocaleString('vi-VN')}đ</strong>
                  &nbsp;(tiết kiệm {(parseFloat(form.oldPrice) - parseFloat(form.price)).toLocaleString('vi-VN')}đ)
                </div>
              )}

              {/* Mô tả */}
              <div style={{marginTop:'10px'}}>
                <label style={{fontSize:'12px', color:'#64748b', display:'block', marginBottom:'4px'}}>Mô tả sản phẩm</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  placeholder="Nhập mô tả chi tiết..." rows={4}
                  style={{width:'100%', padding:'8px 10px', border:'1px solid #e2e8f0', borderRadius:'8px', fontSize:'13px', outline:'none', boxSizing:'border-box', resize:'vertical'}} />
              </div>

              {/* Danh mục */}
              <div style={{marginTop:'10px'}}>
                <label style={{fontSize:'12px', color:'#64748b', display:'block', marginBottom:'4px'}}>Danh mục</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                  style={{width:'100%', height:'36px', padding:'0 10px', border:'1px solid #e2e8f0', borderRadius:'8px', fontSize:'13px', outline:'none'}}>
                  <option value="laptop">💻 Laptop</option>
                  <option value="pc">🔲 PC</option>
                  <option value="monitor">🖥️ Màn hình</option>
                  <option value="phone">📱 Điện thoại</option>
                  <option value="tablet">📟 Máy tính bảng</option>
                  <option value="audio">🎧 Âm thanh</option>
                  <option value="accessory">⌚ Đồng hồ</option>
                  <option value="peripheral">🔌 Phụ kiện</option>
                  <option value="camera">📷 Camera</option>
                  <option value="gaming">🎮 Gaming</option>
                  <option value="network">📡 Mạng/Router</option>
                  <option value="printer">🖨️ Máy in</option>
                  <option value="storage">💾 Ổ cứng</option>
                </select>
              </div>

              {/* ── Biến thể dung lượng (chỉ hiện với phone/tablet/laptop) ── */}
              {VARIANT_CATEGORIES.includes(form.category) && (
                <div style={{marginTop:'10px'}}>
                  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'8px'}}>
                    <label style={{fontSize:'12px', color:'#64748b', fontWeight:'500'}}>💾 Biến thể dung lượng (tuỳ chọn)</label>
                    <button type="button"
                      onClick={() => setForm({...form, variants: [...form.variants, {storage:'', price:'', oldPrice:'', stock:''}]})}
                      style={{fontSize:'12px', color:'#3b82f6', background:'#eff6ff', border:'none', borderRadius:'6px', padding:'4px 10px', cursor:'pointer'}}>
                      + Thêm biến thể
                    </button>
                  </div>
                  {form.variants.length === 0 && (
                    <p style={{fontSize:'12px', color:'#94a3b8', fontStyle:'italic'}}>Chưa có biến thể. Ví dụ: điện thoại/tablet dùng "8GB/256GB", laptop dùng "12GB/256GB"...</p>
                  )}
                  {form.variants.map((v, i) => (
                    <div key={i} style={{display:'grid', gridTemplateColumns:'1.5fr 1.5fr 1.5fr 1fr auto', gap:'6px', marginBottom:'8px', alignItems:'center'}}>
                      <input value={v.storage}
                        onChange={e => { const nv=[...form.variants]; nv[i]={...nv[i],storage:e.target.value}; setForm({...form,variants:nv}); }}
                        placeholder="8GB/256GB"
                        style={{height:'34px', padding:'0 8px', border:'1px solid #e2e8f0', borderRadius:'8px', fontSize:'12px', outline:'none'}} />
                      <input value={v.price} type="number"
                        onChange={e => { const nv=[...form.variants]; nv[i]={...nv[i],price:e.target.value}; setForm({...form,variants:nv}); }}
                        placeholder="Giá bán"
                        style={{height:'34px', padding:'0 8px', border:'1px solid #e2e8f0', borderRadius:'8px', fontSize:'12px', outline:'none'}} />
                      <input value={v.oldPrice} type="number"
                        onChange={e => { const nv=[...form.variants]; nv[i]={...nv[i],oldPrice:e.target.value}; setForm({...form,variants:nv}); }}
                        placeholder="Giá cũ (tùy chọn)"
                        style={{height:'34px', padding:'0 8px', border:'1px solid #e2e8f0', borderRadius:'8px', fontSize:'12px', outline:'none'}} />
                      <input value={v.stock} type="number"
                        onChange={e => { const nv=[...form.variants]; nv[i]={...nv[i],stock:e.target.value}; setForm({...form,variants:nv}); }}
                        placeholder="Tồn kho"
                        style={{height:'34px', padding:'0 8px', border:'1px solid #e2e8f0', borderRadius:'8px', fontSize:'12px', outline:'none'}} />
                      <button type="button"
                        onClick={() => setForm({...form, variants: form.variants.filter((_,idx)=>idx!==i)})}
                        style={{height:'34px', width:'34px', background:'#fee2e2', color:'#ef4444', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'14px'}}>✕</button>
                    </div>
                  ))}
                  {form.variants.length > 0 && (
                    <p style={{fontSize:'11px', color:'#94a3b8', marginTop:'4px'}}>Cột theo thứ tự: Dung lượng/RAM · Giá bán · Giá cũ · Tồn kho</p>
                  )}
                </div>
              )}

              {/* Emoji */}
              <div style={{marginTop:'10px'}}>
                <label style={{fontSize:'12px', color:'#64748b', display:'block', marginBottom:'4px'}}>Emoji</label>
                <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
                  {[{emoji:'💻',label:'Laptop'},{emoji:'🔲',label:'PC'},{emoji:'🖥️',label:'Màn hình'},{emoji:'📱',label:'Điện thoại'},
                    {emoji:'📟',label:'Tablet'},{emoji:'🎧',label:'Tai nghe'},{emoji:'⌚',label:'Đồng hồ'},{emoji:'🔌',label:'Phụ kiện'},
                    {emoji:'📷',label:'Camera'},{emoji:'🎮',label:'Gaming'},{emoji:'📡',label:'Mạng'},{emoji:'🖨️',label:'Máy in'},
                    {emoji:'💾',label:'Ổ cứng'},{emoji:'📦',label:'Khác'}
                  ].map(({emoji, label}) => (
                    <button key={emoji} type="button" onClick={() => setForm({...form, emoji})}
                      style={{padding:'6px 10px', borderRadius:'8px', border: form.emoji===emoji ? '2px solid #3b82f6' : '1px solid #e2e8f0', background: form.emoji===emoji ? '#eff6ff' : 'white', cursor:'pointer', fontSize:'13px', display:'flex', alignItems:'center', gap:'4px'}}>
                      {emoji} <span style={{fontSize:'11px', color:'#64748b'}}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Link ảnh */}
              <div style={{marginTop:'10px'}}>
                <label style={{fontSize:'12px', color:'#64748b', display:'block', marginBottom:'4px'}}>Link ảnh (mỗi link 1 dòng)</label>
                <textarea value={form.images} onChange={e => setForm({...form, images: e.target.value})}
                  placeholder={"https://images.unsplash.com/...\nhttps://images.unsplash.com/..."} rows={4}
                  style={{width:'100%', padding:'8px 10px', border:'1px solid #e2e8f0', borderRadius:'8px', fontSize:'13px', outline:'none', boxSizing:'border-box', resize:'vertical'}} />
              </div>

              {/* Thông số kỹ thuật */}
              <div style={{marginTop:'10px'}}>
                <label style={{fontSize:'12px', color:'#64748b', display:'block', marginBottom:'4px'}}>Thông số kỹ thuật (mỗi dòng: Tên: Giá trị)</label>
                <textarea value={form.specs} onChange={e => setForm({...form, specs: e.target.value})}
                  placeholder={'CPU: Apple S7\nMàn hình: 41mm Always-On\nPin: 18 giờ'} rows={6}
                  style={{width:'100%', padding:'8px 10px', border:'1px solid #e2e8f0', borderRadius:'8px', fontSize:'13px', outline:'none', boxSizing:'border-box', resize:'vertical'}} />
              </div>

              <div style={{display:'flex', gap:'8px', marginTop:'14px'}}>
                <button onClick={saveProduct}
                  style={{padding:'8px 20px', background:'#3b82f6', color:'white', borderRadius:'10px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'500'}}>
                  {editProduct ? 'Cập nhật' : 'Lưu'}
                </button>
                <button onClick={() => setShowForm(false)}
                  style={{padding:'8px 20px', background:'#f1f5f9', color:'#64748b', borderRadius:'10px', border:'none', cursor:'pointer', fontSize:'13px'}}>
                  Hủy
                </button>
              </div>
            </div>
          )}

          {/* Danh sách sản phẩm */}
          <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
            {products.map(p => (
              <div key={p.id} style={{background:'white', border:'1px solid #f1f5f9', borderRadius:'14px', padding:'14px', display:'flex', alignItems:'center', gap:'12px'}}>
                <div style={{width:'48px', height:'48px', background:'#f8fafc', borderRadius:'10px', overflow:'hidden', flexShrink:0}}>
                  {p.images && p.images.length > 0 ? (
                    <img src={p.images[0]} alt={p.name} style={{width:'100%', height:'100%', objectFit:'contain', padding:'4px'}} />
                  ) : (
                    <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px'}}>{p.emoji}</div>
                  )}
                </div>
                <div style={{flex:1}}>
                  <p style={{fontSize:'13px', fontWeight:'500', color:'#1e293b'}}>{p.name}</p>
                  <p style={{fontSize:'12px', color:'#94a3b8'}}>{p.category} • Tồn: {p.stock} • {p.price.toLocaleString('vi-VN')}đ</p>
                </div>
                <div style={{display:'flex', gap:'6px'}}>
                  <button onClick={() => openEdit(p)}
                    style={{padding:'6px 12px', background:'#eff6ff', color:'#3b82f6', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:'500'}}>✏️ Sửa</button>
                  <button onClick={() => deleteProduct(p.id)}
                    style={{padding:'6px 12px', background:'#fee2e2', color:'#ef4444', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:'500'}}>🗑️ Xóa</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Đơn hàng */}
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