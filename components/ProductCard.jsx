'use client';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';

export default function ProductCard({ product, onClick }) {
  const addItem = useCartStore(s => s.addItem);
  const router = useRouter();

  function handleAddToCart(e) {
    e.stopPropagation();
    const user = localStorage.getItem('user');
    if (!user) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng!');
      router.push('/account');
      return;
    }
    addItem(product);
  }

  return (
    <div onClick={() => onClick(product)}
      style={{background:'white', border:'1px solid #f1f5f9', borderRadius:'16px', overflow:'hidden', cursor:'pointer'}}>
      <div style={{height:'140px', display:'flex', alignItems:'center', justifyContent:'center', background:'#f8fafc', overflow:'hidden'}}>
  {product.images && product.images.length > 0 ? (
    <img
      src={product.images[0]}
      alt={product.name}
      style={{width:'100%', height:'100%', objectFit:'contain', padding:'8px'}}
      onError={(e) => { e.target.style.display='none'; }}
    />
  ) : (
    <span style={{fontSize:'48px'}}>{product.emoji}</span>
  )}
</div>
      <div style={{padding:'12px'}}>
        {product.badge && (
          <span style={{display:'inline-block', background:'#fee2e2', color:'#991b1b', fontSize:'11px', padding:'2px 8px', borderRadius:'4px', marginBottom:'6px', fontWeight:'500'}}>
            {product.badge}
          </span>
        )}
        <p style={{fontSize:'13px', fontWeight:'500', color:'#1e293b', marginBottom:'4px', lineHeight:'1.4'}}>
          {product.name}
        </p>
        <p style={{fontSize:'13px', color:'#3b82f6', fontWeight:'600'}}>
          {product.price.toLocaleString('vi-VN')}đ
        </p>
        {product.oldPrice && (
          <p style={{fontSize:'11px', color:'#94a3b8', textDecoration:'line-through'}}>
            {product.oldPrice.toLocaleString('vi-VN')}đ
          </p>
        )}
        <button onClick={handleAddToCart}
          style={{marginTop:'8px', width:'100%', padding:'6px', background:'#3b82f6', color:'white', border:'none', borderRadius:'8px', fontSize:'12px', cursor:'pointer', fontWeight:'500'}}>
          + Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}