'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const addItem = useCartStore(s => s.addItem);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [zoomImg, setZoomImg] = useState(false);
  const [activeTab, setActiveTab] = useState('specs');
  const [reviews, setReviews] = useState([
    { name: 'Nguyễn Văn Trung', rating: 5, date: '20/05/2026', comment: 'Sản phẩm tuyệt vời, đúng như mô tả. Giao hàng nhanh, đóng gói cẩn thận!' },
    { name: 'Trần Thị Bích', rating: 4, date: '18/05/2026', comment: 'Chất lượng tốt, giá hợp lý. Sẽ ủng hộ shop dài dài.' },
    { name: 'Lê Văn Cường', rating: 5, date: '15/05/2026', comment: 'Mua lần 2 rồi, vẫn rất hài lòng. Shop tư vấn nhiệt tình.' },
  ]);

  const colors = ['Đen', 'Trắng', 'Xanh', 'Bạc'];

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
        fetch(`/api/products?category=${data.category}`)
          .then(r => r.json())
          .then(related => setRelatedProducts(related.filter(p => p.id != id).slice(0, 4)));
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={{textAlign:'center', padding:'60px', color:'#94a3b8'}}>Đang tải...</p>;
  if (!product) return <p style={{textAlign:'center', padding:'60px', color:'#94a3b8'}}>Không tìm thấy sản phẩm</p>;

  function handleAddToCart() {
    const user = localStorage.getItem('user');
    if (!user) { alert('Vui lòng đăng nhập!'); router.push('/account'); return; }
    for (let i = 0; i < quantity; i++) addItem(product);
    router.push('/cart');
  }

  const images = product.images && product.images.length > 0 ? product.images : null;
  const specs = product.specs || [];
  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <>
      <main style={{maxWidth:'1000px', margin:'0 auto', padding:'20px 16px'}}>
        <button onClick={() => router.back()}
          style={{fontSize:'13px', color:'#94a3b8', background:'none', border:'none', cursor:'pointer', marginBottom:'16px'}}>
          ← Quay lại
        </button>

        {/* Phần trên: ảnh + thông tin */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px', marginBottom:'24px', background:'white', borderRadius:'16px', border:'1px solid #f1f5f9', padding:'20px'}}>
          
          {/* Ảnh sản phẩm */}
          <div>
            <div style={{position:'relative', height:'320px', background:'#f8fafc', borderRadius:'12px', overflow:'hidden', marginBottom:'12px', cursor:'zoom-in'}}
              onClick={() => setZoomImg(true)}>
              {images ? (
                <img src={images[selectedImg]} alt={product.name}
                  style={{width:'100%', height:'100%', objectFit:'contain', padding:'16px'}} />
              ) : (
                <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'80px'}}>{product.emoji}</div>
              )}
              {images && images.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedImg(i => (i - 1 + images.length) % images.length); }}
                    style={{position:'absolute', left:'8px', top:'50%', transform:'translateY(-50%)', width:'32px', height:'32px', borderRadius:'50%', background:'white', border:'1px solid #e2e8f0', cursor:'pointer', fontSize:'16px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}>
                    ‹
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedImg(i => (i + 1) % images.length); }}
                    style={{position:'absolute', right:'8px', top:'50%', transform:'translateY(-50%)', width:'32px', height:'32px', borderRadius:'50%', background:'white', border:'1px solid #e2e8f0', cursor:'pointer', fontSize:'16px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}>
                    ›
                  </button>
                </>
              )}
              <div style={{position:'absolute', bottom:'8px', right:'8px', background:'rgba(0,0,0,0.4)', color:'white', fontSize:'11px', padding:'3px 8px', borderRadius:'8px'}}>
                🔍 Nhấn để phóng to
              </div>
            </div>
            {images && images.length > 1 && (
              <div style={{display:'flex', gap:'8px'}}>
                {images.map((img, i) => (
                  <div key={i} onClick={() => setSelectedImg(i)}
                    style={{width:'64px', height:'64px', borderRadius:'10px', overflow:'hidden', cursor:'pointer', border: selectedImg===i ? '2px solid #3b82f6' : '2px solid transparent', background:'#f8fafc', flexShrink:0}}>
                    <img src={img} alt="" style={{width:'100%', height:'100%', objectFit:'contain', padding:'4px'}} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Thông tin sản phẩm */}
          <div>
            {product.badge && (
              <span style={{display:'inline-block', background:'#fee2e2', color:'#991b1b', fontSize:'12px', padding:'3px 10px', borderRadius:'6px', marginBottom:'8px', fontWeight:'500'}}>
                🔥 Giảm {product.badge}
              </span>
            )}
            <h1 style={{fontSize:'22px', fontWeight:'700', color:'#1e293b', marginBottom:'8px'}}>{product.name}</h1>

            {/* Rating */}
            <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px'}}>
              <div style={{color:'#f59e0b', fontSize:'14px'}}>{'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5-Math.round(avgRating))}</div>
              <span style={{fontSize:'13px', color:'#64748b'}}>{avgRating} ({reviews.length} đánh giá)</span>
            </div>

            {/* Giá */}
            <div style={{marginBottom:'16px'}}>
              <span style={{fontSize:'28px', color:'#3b82f6', fontWeight:'700'}}>{product.price.toLocaleString('vi-VN')}đ</span>
              {product.oldPrice && (
                <span style={{fontSize:'16px', color:'#94a3b8', textDecoration:'line-through', marginLeft:'10px'}}>{product.oldPrice.toLocaleString('vi-VN')}đ</span>
              )}
              {product.oldPrice && (
                <span style={{fontSize:'13px', color:'#22c55e', marginLeft:'8px', fontWeight:'500'}}>
                  Tiết kiệm {(product.oldPrice - product.price).toLocaleString('vi-VN')}đ
                </span>
              )}
            </div>

            {/* Chọn màu */}
            <div style={{marginBottom:'16px'}}>
              <p style={{fontSize:'13px', color:'#64748b', marginBottom:'8px', fontWeight:'500'}}>Màu sắc: <strong style={{color:'#1e293b'}}>{colors[selectedColor]}</strong></p>
              <div style={{display:'flex', gap:'8px'}}>
                {colors.map((c, i) => (
                  <button key={i} onClick={() => setSelectedColor(i)}
                    style={{padding:'6px 14px', borderRadius:'8px', border: selectedColor===i ? '2px solid #3b82f6' : '1px solid #e2e8f0', background: selectedColor===i ? '#eff6ff' : 'white', color: selectedColor===i ? '#3b82f6' : '#64748b', fontSize:'12px', cursor:'pointer', fontWeight: selectedColor===i ? '600' : '400'}}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Số lượng */}
            <div style={{marginBottom:'16px'}}>
              <p style={{fontSize:'13px', color:'#64748b', marginBottom:'8px', fontWeight:'500'}}>Số lượng:</p>
              <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                <button onClick={() => setQuantity(q => Math.max(1, q-1))}
                  style={{width:'36px', height:'36px', borderRadius:'10px', border:'1px solid #e2e8f0', background:'#f8fafc', cursor:'pointer', fontSize:'18px'}}>−</button>
                <span style={{fontSize:'16px', fontWeight:'600', minWidth:'30px', textAlign:'center'}}>{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q+1))}
                  style={{width:'36px', height:'36px', borderRadius:'10px', border:'1px solid #e2e8f0', background:'#f8fafc', cursor:'pointer', fontSize:'18px'}}>+</button>
                <span style={{fontSize:'12px', color:'#94a3b8'}}>Còn {product.stock} sản phẩm</span>
              </div>
            </div>

            {/* Nút thêm giỏ hàng */}
            <button onClick={handleAddToCart}
              style={{width:'100%', padding:'14px', background:'#3b82f6', color:'white', fontWeight:'600', borderRadius:'12px', border:'none', cursor:'pointer', fontSize:'15px', marginBottom:'12px'}}>
              🛒 Thêm vào giỏ hàng
            </button>
            <button onClick={() => { handleAddToCart(); }}
              style={{width:'100%', padding:'14px', background:'#1e293b', color:'white', fontWeight:'600', borderRadius:'12px', border:'none', cursor:'pointer', fontSize:'15px'}}>
              ⚡ Mua ngay
            </button>

            {/* Khuyến mãi */}
            <div style={{marginTop:'16px', background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'12px', padding:'12px'}}>
              <p style={{fontSize:'13px', fontWeight:'600', color:'#15803d', marginBottom:'8px'}}>🎁 Khuyến mãi đi kèm:</p>
              {['Miễn phí giao hàng toàn quốc', 'Bảo hành chính hãng 12 tháng', 'Đổi trả miễn phí trong 7 ngày', 'Tặng túi đựng sản phẩm cao cấp'].map((k, i) => (
                <p key={i} style={{fontSize:'12px', color:'#16a34a', marginBottom:'4px'}}>✓ {k}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs: Mô tả, Thông số, Bảo hành */}
        <div style={{background:'white', borderRadius:'16px', border:'1px solid #f1f5f9', marginBottom:'24px', overflow:'hidden'}}>
          <div style={{display:'flex', borderBottom:'1px solid #f1f5f9'}}>
            {[['specs','📋 Thông số'],['desc','📖 Mô tả'],['warranty','🛡️ Bảo hành']].map(([key, label]) => (
              <button key={key} onClick={() => setActiveTab(key)}
                style={{flex:1, padding:'14px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'500', background: activeTab===key ? '#eff6ff' : 'white', color: activeTab===key ? '#3b82f6' : '#64748b', borderBottom: activeTab===key ? '2px solid #3b82f6' : 'none'}}>
                {label}
              </button>
            ))}
          </div>

          <div style={{padding:'20px'}}>
            {activeTab === 'specs' && (
              <div>
                <h3 style={{fontSize:'15px', fontWeight:'600', color:'#1e293b', marginBottom:'16px'}}>Thông số kỹ thuật</h3>
                {specs.map(([k, v], i) => (
                  <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #f8fafc', fontSize:'13px'}}>
                    <span style={{color:'#64748b', fontWeight:'500'}}>{k}</span>
                    <span style={{color:'#1e293b'}}>{v}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'desc' && (
              <div>
                <h3 style={{fontSize:'15px', fontWeight:'600', color:'#1e293b', marginBottom:'16px'}}>Giới thiệu sản phẩm</h3>
                <p style={{fontSize:'13px', color:'#64748b', lineHeight:'1.8', marginBottom:'12px'}}>{product.description}</p>
                <p style={{fontSize:'13px', color:'#64748b', lineHeight:'1.8', marginBottom:'12px'}}>
                  TechZone tự hào là đại lý ủy quyền chính thức, cam kết cung cấp sản phẩm 100% chính hãng với giá tốt nhất thị trường. Tất cả sản phẩm đều được kiểm tra kỹ lưỡng trước khi giao đến tay khách hàng.
                </p>
                <p style={{fontSize:'13px', color:'#64748b', lineHeight:'1.8'}}>
                  Với đội ngũ kỹ thuật viên chuyên nghiệp và trung tâm bảo hành uy tín, chúng tôi luôn đảm bảo mang đến trải nghiệm mua sắm tốt nhất cho khách hàng.
                </p>
              </div>
            )}
            {activeTab === 'warranty' && (
              <div>
                <h3 style={{fontSize:'15px', fontWeight:'600', color:'#1e293b', marginBottom:'16px'}}>Chính sách bảo hành</h3>
                {[
                  ['🛡️ Thời gian bảo hành', '12 tháng bảo hành chính hãng tại trung tâm bảo hành toàn quốc'],
                  ['🔄 Đổi trả', 'Đổi trả miễn phí trong 7 ngày nếu sản phẩm lỗi do nhà sản xuất'],
                  ['📞 Hỗ trợ', 'Hotline 1800-xxxx hỗ trợ 24/7, kỹ thuật viên tư vấn miễn phí'],
                  ['🚚 Giao hàng', 'Miễn phí giao hàng toàn quốc, giao trong ngày nội thành HN & HCM'],
                  ['💳 Thanh toán', 'Hỗ trợ COD, chuyển khoản, ví điện tử MoMo, ZaloPay'],
                ].map(([title, desc], i) => (
                  <div key={i} style={{marginBottom:'16px', padding:'12px', background:'#f8fafc', borderRadius:'10px'}}>
                    <p style={{fontSize:'13px', fontWeight:'600', color:'#1e293b', marginBottom:'4px'}}>{title}</p>
                    <p style={{fontSize:'12px', color:'#64748b'}}>{desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Đánh giá */}
        <div style={{background:'white', borderRadius:'16px', border:'1px solid #f1f5f9', padding:'20px', marginBottom:'24px'}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px'}}>
            <h3 style={{fontSize:'15px', fontWeight:'600', color:'#1e293b'}}>⭐ Đánh giá sản phẩm</h3>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:'32px', fontWeight:'700', color:'#f59e0b'}}>{avgRating}</div>
              <div style={{color:'#f59e0b', fontSize:'14px'}}>{'★'.repeat(Math.round(avgRating))}</div>
              <div style={{fontSize:'12px', color:'#94a3b8'}}>{reviews.length} đánh giá</div>
            </div>
          </div>
          {reviews.map((r, i) => (
            <div key={i} style={{padding:'14px 0', borderBottom: i < reviews.length-1 ? '1px solid #f8fafc' : 'none'}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'6px'}}>
                <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                  <div style={{width:'32px', height:'32px', background:'#eff6ff', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:'600', color:'#3b82f6'}}>
                    {r.name[0]}
                  </div>
                  <span style={{fontSize:'13px', fontWeight:'600', color:'#1e293b'}}>{r.name}</span>
                </div>
                <span style={{fontSize:'11px', color:'#94a3b8'}}>{r.date}</span>
              </div>
              <div style={{color:'#f59e0b', fontSize:'13px', marginBottom:'4px'}}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
              <p style={{fontSize:'13px', color:'#64748b'}}>{r.comment}</p>
            </div>
          ))}
        </div>

        {/* Sản phẩm liên quan */}
        {relatedProducts.length > 0 && (
          <div style={{marginBottom:'24px'}}>
            <h3 style={{fontSize:'16px', fontWeight:'600', color:'#1e293b', marginBottom:'16px'}}>🔗 Sản phẩm liên quan</h3>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:'12px'}}>
              {relatedProducts.map(p => (
                <div key={p.id} onClick={() => router.push(`/products/${p.id}`)}
                  style={{background:'white', border:'1px solid #f1f5f9', borderRadius:'14px', overflow:'hidden', cursor:'pointer'}}>
                  <div style={{height:'120px', background:'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center'}}>
                    {p.images && p.images.length > 0 ? (
                      <img src={p.images[0]} alt={p.name} style={{width:'100%', height:'100%', objectFit:'contain', padding:'8px'}} />
                    ) : (
                      <span style={{fontSize:'40px'}}>{p.emoji}</span>
                    )}
                  </div>
                  <div style={{padding:'10px'}}>
                    <p style={{fontSize:'12px', fontWeight:'500', color:'#1e293b', marginBottom:'4px'}}>{p.name}</p>
                    <p style={{fontSize:'13px', color:'#3b82f6', fontWeight:'600'}}>{p.price.toLocaleString('vi-VN')}đ</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Zoom ảnh */}
      {zoomImg && images && (
        <div onClick={() => setZoomImg(false)}
          style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', cursor:'zoom-out'}}>
          <img src={images[selectedImg]} alt={product.name}
            style={{maxWidth:'90vw', maxHeight:'90vh', objectFit:'contain', borderRadius:'12px'}} />
          <button onClick={() => setZoomImg(false)}
            style={{position:'absolute', top:'20px', right:'20px', background:'white', border:'none', borderRadius:'50%', width:'36px', height:'36px', cursor:'pointer', fontSize:'18px'}}>✕</button>
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setSelectedImg(i => (i-1+images.length)%images.length); }}
                style={{position:'absolute', left:'20px', background:'white', border:'none', borderRadius:'50%', width:'44px', height:'44px', cursor:'pointer', fontSize:'24px'}}>‹</button>
              <button onClick={(e) => { e.stopPropagation(); setSelectedImg(i => (i+1)%images.length); }}
                style={{position:'absolute', right:'20px', background:'white', border:'none', borderRadius:'50%', width:'44px', height:'44px', cursor:'pointer', fontSize:'24px'}}>›</button>
            </>
          )}
        </div>
      )}

      {/* Footer */}
      <footer style={{background:'#1e293b', color:'white', padding:'40px 16px 20px', marginTop:'40px'}}>
        <div style={{maxWidth:'1000px', margin:'0 auto'}}>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'32px', marginBottom:'32px'}}>
            <div>
              <h4 style={{fontSize:'16px', fontWeight:'700', marginBottom:'16px', color:'#60a5fa'}}>⚡ TechZone</h4>
              <p style={{fontSize:'13px', color:'#94a3b8', lineHeight:'1.8'}}>Cửa hàng điện tử uy tín, chính hãng. Cam kết giá tốt nhất thị trường.</p>
            </div>
            <div>
              <h4 style={{fontSize:'14px', fontWeight:'600', marginBottom:'16px'}}>Thông tin liên hệ</h4>
              {[['📍 Địa chỉ','211 Yên Xá, Tân Triều, Thanh Trì, Hà Nội'],['📞 Hotline','1800-TECHZONE (miễn phí)'],['📧 Email','support@techzone.vn'],['🕐 Giờ làm việc','8:00 - 22:00 (Tất cả các ngày)']].map(([icon, text]) => (
                <p key={icon} style={{fontSize:'12px', color:'#94a3b8', marginBottom:'8px'}}>{icon}: {text}</p>
              ))}
            </div>
            <div>
              <h4 style={{fontSize:'14px', fontWeight:'600', marginBottom:'16px'}}>Chính sách mua hàng</h4>
              {['Chính sách đổi trả','Chính sách bảo hành','Chính sách vận chuyển','Chính sách bảo mật','Điều khoản sử dụng'].map(p => (
                <p key={p} style={{fontSize:'12px', color:'#94a3b8', marginBottom:'8px', cursor:'pointer'}}>› {p}</p>
              ))}
            </div>
            <div>
              <h4 style={{fontSize:'14px', fontWeight:'600', marginBottom:'16px'}}>Liên hệ với chúng tôi</h4>
              <p style={{fontSize:'12px', color:'#94a3b8', marginBottom:'12px'}}>Theo dõi TechZone trên mạng xã hội:</p>
              {['Facebook', 'Instagram', 'YouTube', 'TikTok'].map(s => (
                <p key={s} style={{fontSize:'12px', color:'#60a5fa', marginBottom:'6px', cursor:'pointer'}}>→ {s}</p>
              ))}
            </div>
          </div>
          <div style={{borderTop:'1px solid #334155', paddingTop:'16px', textAlign:'center'}}>
            <p style={{fontSize:'12px', color:'#64748b'}}>© 2026 TechZone. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </>
  );
}