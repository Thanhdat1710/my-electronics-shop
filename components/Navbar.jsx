'use client';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const totalItems = useCartStore(s => s.totalItems());
  const router = useRouter();
  const [query, setQuery] = useState('');

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) router.push(`/?search=${encodeURIComponent(query.trim())}`);
  }

  return (
    <nav style={{position:'sticky', top:0, zIndex:50, background:'white', borderBottom:'1px solid #f1f5f9', height:'56px', display:'flex', alignItems:'center', padding:'0 16px', gap:'12px', boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
      <Link href="/" style={{fontWeight:'700', fontSize:'18px', textDecoration:'none', color:'#1e293b', display:'flex', alignItems:'center', gap:'4px', flexShrink:0}}>
        ⚡ <span style={{color:'#3b82f6'}}>Tech</span>Zone
      </Link>

      <form onSubmit={handleSearch} style={{flex:1, maxWidth:'360px', position:'relative'}}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Tìm sản phẩm..."
          style={{width:'100%', height:'36px', padding:'0 36px 0 32px', borderRadius:'12px', border:'1px solid #e2e8f0', background:'#f8fafc', fontSize:'13px', outline:'none', boxSizing:'border-box'}}
        />
        <span style={{position:'absolute', left:'10px', top:'9px', fontSize:'14px'}}>🔍</span>
        {query && (
          <button type="submit"
            style={{position:'absolute', right:'8px', top:'6px', background:'#3b82f6', color:'white', border:'none', borderRadius:'8px', padding:'2px 8px', fontSize:'11px', cursor:'pointer'}}>
            Tìm
          </button>
        )}
      </form>

      <div style={{marginLeft:'auto', display:'flex', alignItems:'center', gap:'8px'}}>
        <Link href="/cart" style={{position:'relative', padding:'8px', textDecoration:'none', fontSize:'20px'}}>
          🛒
          {totalItems > 0 && (
            <span style={{position:'absolute', top:0, right:0, background:'#3b82f6', color:'white', fontSize:'10px', width:'16px', height:'16px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'600'}}>
              {totalItems}
            </span>
          )}
        </Link>
        <Link href="/account" style={{padding:'8px', textDecoration:'none', fontSize:'20px'}}>👤</Link>
      </div>
    </nav>
  );
}