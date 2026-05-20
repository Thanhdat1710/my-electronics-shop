'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CATEGORIES } from '@/data/products';
import ProductCard from '@/components/ProductCard';

function HomeContent() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    setLoading(true);
    const url = searchQuery
      ? `/api/products?search=${encodeURIComponent(searchQuery)}`
      : `/api/products?category=${activeCategory}`;
    fetch(url)
      .then(res => res.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [activeCategory, searchQuery]);

  return (
    <main>
      <div style={{background:'#3b82f6', color:'white', padding:'2.5rem 1rem', textAlign:'center'}}>
        <h1 style={{fontSize:'22px', fontWeight:'600', marginBottom:'8px'}}>
          📱 Công nghệ đỉnh cao, giá tốt nhất
        </h1>
        <p style={{fontSize:'14px', opacity:'0.85', marginBottom:'20px'}}>
          Laptop, điện thoại, phụ kiện chính hãng — giao hàng toàn quốc
        </p>
        <button onClick={() => router.push('/cart')}
          style={{background:'white', color:'#3b82f6', fontWeight:'600', padding:'8px 24px', borderRadius:'12px', border:'none', cursor:'pointer', fontSize:'14px'}}>
          Xem giỏ hàng 🛒
        </button>
      </div>

      {searchQuery ? (
        <div style={{padding:'12px 16px', background:'white', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', gap:'8px'}}>
          <span style={{fontSize:'13px', color:'#64748b'}}>Kết quả tìm kiếm: <strong>"{searchQuery}"</strong></span>
          <button onClick={() => router.push('/')}
            style={{fontSize:'12px', color:'#ef4444', background:'#fee2e2', border:'none', borderRadius:'8px', padding:'3px 8px', cursor:'pointer'}}>
            ✕ Xóa
          </button>
        </div>
      ) : (
        <div style={{display:'flex', gap:'8px', padding:'12px 16px', overflowX:'auto', background:'white', borderBottom:'1px solid #f1f5f9'}}>
          {CATEGORIES.map(cat => (
            <button key={cat.value} onClick={() => setActiveCategory(cat.value)}
              style={{flexShrink:0, padding:'6px 16px', borderRadius:'20px', border: activeCategory===cat.value ? 'none':'1px solid #e2e8f0', background: activeCategory===cat.value ? '#3b82f6':'white', color: activeCategory===cat.value ? 'white':'#64748b', fontSize:'13px', fontWeight:'500', cursor:'pointer'}}>
              {cat.label}
            </button>
          ))}
        </div>
      )}

      <div style={{maxWidth:'1000px', margin:'0 auto', padding:'20px 16px'}}>
        {loading ? (
          <p style={{textAlign:'center', color:'#94a3b8', padding:'40px'}}>Đang tải...</p>
        ) : products.length === 0 ? (
          <div style={{textAlign:'center', padding:'60px 20px'}}>
            <p style={{fontSize:'40px', marginBottom:'12px'}}>🔍</p>
            <p style={{color:'#94a3b8'}}>Không tìm thấy sản phẩm nào</p>
          </div>
        ) : (
          <>
            <p style={{fontSize:'13px', color:'#94a3b8', marginBottom:'12px'}}>{products.length} sản phẩm</p>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:'12px'}}>
              {products.map(product => (
                <ProductCard key={product.id} product={product} onClick={(p) => router.push(`/products/${p.id}`)} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<p style={{textAlign:'center', padding:'40px', color:'#94a3b8'}}>Đang tải...</p>}>
      <HomeContent />
    </Suspense>
  );
}