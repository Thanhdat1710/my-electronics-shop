'use client';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useState, useEffect } from 'react'; // BỔ SUNG: Import useState và useEffect

export default function Navbar() {
  const totalItems = useCartStore(s => s.totalItems());
  const [isMounted, setIsMounted] = useState(false); // BỔ SUNG: Khởi tạo state mounted

  // BỔ SUNG: useEffect này chỉ chạy duy nhất 1 lần khi component đã load xong ở Client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <nav style={{position:'sticky', top:0, zIndex:50, background:'white', borderBottom:'1px solid #f1f5f9', height:'56px', display:'flex', alignItems:'center', padding:'0 16px', gap:'12px', boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
      <Link href="/" style={{fontWeight:'700', fontSize:'18px', textDecoration:'none', color:'#1e293b', display:'flex', alignItems:'center', gap:'4px'}}>
        ⚡ <span style={{color:'#3b82f6'}}>Tech</span>Zone
      </Link>
      <div style={{flex:1, maxWidth:'360px', position:'relative'}}>
        <input
          type="text"
          placeholder="Tìm sản phẩm..."
          style={{width:'100%', height:'36px', padding:'0 12px 0 32px', borderRadius:'12px', border:'1px solid #e2e8f0', background:'#f8fafc', fontSize:'13px', outline:'none', boxSizing:'border-box'}}
        />
        <span style={{position:'absolute', left:'10px', top:'9px', fontSize:'14px'}}>🔍</span>
      </div>
      <div style={{marginLeft:'auto', display:'flex', alignItems:'center', gap:'8px'}}>
        <Link href="/cart" style={{position:'relative', padding:'8px', textDecoration:'none', fontSize:'20px'}}>
          🛒
          {/* SỬA Ở ĐÂY: Chỉ render badge số lượng khi đã mounted thành công phía Client */}
          {isMounted && totalItems > 0 && (
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