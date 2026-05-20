'use client';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const router = useRouter();
  const { items, changeQty, removeItem, totalPrice } = useCartStore();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const cartItems = Object.entries(items).map(([id, qty]) => ({
    product: products.find(p => p.id == id),
    qty
  })).filter(x => x.product);

  if (!Object.keys(items).length) return (
    <div style={{textAlign:'center', padding:'60px 20px'}}>
      <p style={{fontSize:'48px', marginBottom:'12px'}}>🛒</p>
      <p style={{color:'#94a3b8', marginBottom:'16px'}}>Giỏ hàng trống</p>
      <button onClick={() => router.push('/')}
        style={{background:'#3b82f6', color:'white', padding:'10px 24px', borderRadius:'12px', border:'none', cursor:'pointer', fontSize:'14px'}}>
        Tiếp tục mua sắm
      </button>
    </div>
  );

  const subtotal = cartItems.reduce((sum, {product, qty}) => sum + product.price * qty, 0);
  const ship = 30000;

  return (
    <main style={{maxWidth:'560px', margin:'0 auto', padding:'20px 16px'}}>
      <h1 style={{fontSize:'18px', fontWeight:'600', color:'#1e293b', marginBottom:'16px'}}>
        Giỏ hàng ({cartItems.length})
      </h1>

      <div style={{display:'flex', flexDirection:'column', gap:'10px', marginBottom:'16px'}}>
        {cartItems.map(({product, qty}) => (
          <div key={product.id} style={{background:'white', border:'1px solid #f1f5f9', borderRadius:'16px', padding:'14px', display:'flex', gap:'12px', alignItems:'center'}}>
            <div style={{width:'56px', height:'56px', background:'#f8fafc', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', flexShrink:0}}>
              {product.emoji}
            </div>
            <div style={{flex:1, minWidth:0}}>
              <p style={{fontSize:'13px', fontWeight:'500', color:'#1e293b', marginBottom:'4px'}}>{product.name}</p>
              <p style={{fontSize:'13px', color:'#3b82f6', fontWeight:'600'}}>{product.price.toLocaleString('vi-VN')}đ</p>
              <div style={{display:'flex', alignItems:'center', gap:'8px', marginTop:'6px'}}>
                <button onClick={() => changeQty(product.id, -1)}
                  style={{width:'26px', height:'26px', border:'1px solid #e2e8f0', borderRadius:'8px', background:'#f8fafc', cursor:'pointer', fontSize:'16px', display:'flex', alignItems:'center', justifyContent:'center'}}>−</button>
                <span style={{fontSize:'13px', fontWeight:'500', minWidth:'20px', textAlign:'center'}}>{qty}</span>
                <button onClick={() => changeQty(product.id, 1)}
                  style={{width:'26px', height:'26px', border:'1px solid #e2e8f0', borderRadius:'8px', background:'#f8fafc', cursor:'pointer', fontSize:'16px', display:'flex', alignItems:'center', justifyContent:'center'}}>+</button>
              </div>
            </div>
            <button onClick={() => removeItem(product.id)}
              style={{background:'none', border:'none', cursor:'pointer', fontSize:'18px', color:'#cbd5e1'}}>🗑</button>
          </div>
        ))}
      </div>

      <div style={{background:'white', border:'1px solid #f1f5f9', borderRadius:'16px', padding:'16px'}}>
        <div style={{display:'flex', justifyContent:'space-between', fontSize:'13px', color:'#64748b', padding:'4px 0'}}>
          <span>Tạm tính</span><span>{subtotal.toLocaleString('vi-VN')}đ</span>
        </div>
        <div style={{display:'flex', justifyContent:'space-between', fontSize:'13px', color:'#64748b', padding:'4px 0'}}>
          <span>Phí ship</span><span>{ship.toLocaleString('vi-VN')}đ</span>
        </div>
        <div style={{display:'flex', justifyContent:'space-between', fontSize:'15px', fontWeight:'600', color:'#1e293b', padding:'10px 0 4px', borderTop:'1px solid #f1f5f9', marginTop:'8px'}}>
          <span>Tổng cộng</span><span style={{color:'#3b82f6'}}>{(subtotal+ship).toLocaleString('vi-VN')}đ</span>
        </div>
        <button
         onClick={() => router.push('/checkout')}
            style={{width:'100%', marginTop:'12px', padding:'12px', background:'#3b82f6', color:'white', fontWeight:'600', borderRadius:'12px', border:'none', cursor:'pointer', fontSize:'14px'}}>
            Tiến hành thanh toán →
          </button>
      </div>
    </main>
  );
}