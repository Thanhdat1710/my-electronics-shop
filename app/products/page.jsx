'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import ProductCard from '@/components/ProductCard';

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const router = useRouter();

  const filtered = activeCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <main style={{maxWidth:'1000px', margin:'0 auto', padding:'20px 16px'}}>
      <div style={{display:'flex', gap:'8px', overflowX:'auto', paddingBottom:'12px', marginBottom:'16px'}}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            style={{flexShrink:0, padding:'6px 16px', borderRadius:'20px', border: activeCategory===cat.value ? 'none':'1px solid #e2e8f0', background: activeCategory===cat.value ? '#3b82f6':'white', color: activeCategory===cat.value ? 'white':'#64748b', fontSize:'13px', fontWeight:'500', cursor:'pointer'}}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <p style={{fontSize:'13px', color:'#94a3b8', marginBottom:'12px'}}>{filtered.length} sản phẩm</p>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:'12px'}}>
        {filtered.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={(p) => router.push(`/products/${p.id}`)}
          />
        ))}
      </div>
    </main>
  );
}