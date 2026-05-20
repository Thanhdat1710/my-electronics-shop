'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const addItem = useCartStore(s => s.addItem);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => { setProduct(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={{textAlign:'center', padding:'40px', color:'#94a3b8'}}>Đang tải...</p>;
  if (!product) return <p style={{textAlign:'center', padding:'40px', color:'#94a3b8'}}>Không tìm thấy sản phẩm</p>;

  return (
    <main style={{maxWidth:'560px', margin:'0 auto', padding:'20px 16px'}}>
      <button onClick={() => router.back()}
        style={{fontSize:'13px', color:'#94a3b8', background:'none', border:'none', cursor:'pointer', marginBottom:'16px', display:'flex', alignItems:'center', gap:'4px'}}>
        ← Quay lại
      </button>

      <div style={{background:'white', border:'1px solid #f1f5f9', borderRadius:'16px', overflow:'hidden', marginBottom:'12px'}}>
        <div style={{height:'200px', display:'flex', alignItems:'center', justifyContent:'center', background:'#f8fafc', fontSize:'80px'}}>
          {product.emoji}
        </div>
        <div style={{padding:'20px'}}>
          {product.badge && (
            <span style={{display:'inline-block', background:'#fee2e2', color:'#991b1b', fontSize:'11px', padding:'2px 8px', borderRadius:'4px', marginBottom:'8px'}}>
              {product.badge}
            </span>
          )}
          <h1 style={{fontSize:'20px', fontWeight:'600', color:'#1e293b', marginBottom:'6px'}}>{product.name}</h1>
          <p style={{fontSize:'24px', color:'#3b82f6', fontWeight:'700', marginBottom:'4px'}}>
            {product.price.toLocaleString('vi-VN')}đ
          </p>
          {product.oldPrice && (
            <p style={{fontSize:'13px', color:'#94a3b8', textDecoration:'line-through', marginBottom:'12px'}}>
              {product.oldPrice.toLocaleString('vi-VN')}đ
            </p>
          )}
          <p style={{fontSize:'13px', color:'#64748b', marginBottom:'16px', lineHeight:'1.6'}}>{product.description}</p>
          <button
            onClick={() => { addItem(product); router.push('/cart'); }}
            style={{width:'100%', padding:'12px', background:'#3b82f6', color:'white', fontWeight:'600', borderRadius:'12px', border:'none', cursor:'pointer', fontSize:'14px'}}>
            🛒 Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </main>
  );
}