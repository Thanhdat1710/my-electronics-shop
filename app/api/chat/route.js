// app/api/chat/route.js
import prisma from '@/lib/prisma';

// ─────────────────────────────────────────────
// In-memory cache cho danh sách sản phẩm
// ─────────────────────────────────────────────
let _cachedProducts = null;
let _cacheTimestamp = 0;
const CACHE_TTL_MS = 60_000;

async function getProductsCached() {
  const now = Date.now();
  if (_cachedProducts && now - _cacheTimestamp < CACHE_TTL_MS) {
    return _cachedProducts;
  }
  const products = await prisma.product.findMany({
    where: { stock: { gt: 0 } },
    select: {
      name:     true,
      price:    true,
      oldPrice: true,
      category: true,
      emoji:    true,
      badge:    true,
      stock:    true,
      specs:    true,
    },
    orderBy: { createdAt: 'desc' },
  });
  _cachedProducts = products;
  _cacheTimestamp = now;
  return products;
}

function formatProductList(products) {
  if (!products.length) return '(Hiện chưa có sản phẩm nào trong kho)';
  return products
    .map((p) => {
      const price    = p.price.toLocaleString('vi-VN');
      const oldPrice = p.oldPrice ? ` (giá gốc: ${p.oldPrice.toLocaleString('vi-VN')}đ)` : '';
      const badge    = p.badge ? ` [${p.badge}]` : '';

      let specsText = '';
      try {
        const specsArr = JSON.parse(p.specs || '[]');
        if (specsArr.length > 0) {
          specsText = '\n  Thông số: ' + specsArr
            .map(([key, val]) => `${key}: ${val}`)
            .join(', ');
        }
      } catch { /* bỏ qua nếu parse lỗi */ }

      return `- ${p.emoji} ${p.name}${badge}: ${price}đ${oldPrice} — còn ${p.stock} sản phẩm${specsText}`;
    })
    .join('\n');
}

// ─────────────────────────────────────────────
// Danh sách model theo thứ tự ưu tiên
// Nếu model đầu bị 503/429 → tự động fallback
// ─────────────────────────────────────────────
const GEMINI_MODELS = [
  'gemini-2.5-flash',   // ưu tiên 1 — mạnh nhất
  'gemini-1.5-flash',   // fallback  — ít tải hơn
];

async function callGeminiWithFallback(payload, maxRetries = 3) {
  let lastError = null;

  for (const model of GEMINI_MODELS) {
    console.log(`Thử model: ${model}`);

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      // Chờ trước khi retry (lần đầu không chờ)
      if (attempt > 0) {
        const waitMs = Math.pow(2, attempt - 1) * 2000; // 2s, 4s, 8s
        await new Promise((res) => setTimeout(res, waitMs));
        console.log(`  Retry lần ${attempt} sau ${waitMs}ms`);
      }

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(payload),
        }
      );

      // Thành công
      if (res.ok) {
        console.log(`  ✅ Thành công với model: ${model}`);
        return res;
      }

      const errText = await res.text();
      console.error(`  ❌ ${model} HTTP ${res.status} (attempt ${attempt + 1}):`, errText);
      lastError = { status: res.status, body: errText, model };

      // Lỗi 400/401/404 → không retry, không fallback (lỗi cấu hình)
      if (res.status === 400 || res.status === 401 || res.status === 404) {
        return { ok: false, _lastError: lastError };
      }

      // Lỗi 503/429 → retry trong cùng model, sau đó fallback sang model tiếp
      if (res.status !== 503 && res.status !== 429) break;
    }

    console.log(`  Chuyển sang model tiếp theo...`);
  }

  // Hết cả 2 model đều thất bại
  return { ok: false, _lastError: lastError };
}

// ─────────────────────────────────────────────
// Route handler
// ─────────────────────────────────────────────
export async function POST(request) {
  // 1. Parse và validate body
  let messages;
  try {
    const body = await request.json();
    messages = body?.messages;
  } catch {
    return Response.json({ reply: 'Request body không hợp lệ.' }, { status: 400 });
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ reply: 'Danh sách tin nhắn không hợp lệ hoặc rỗng.' }, { status: 400 });
  }

  const isValid = messages.every(
    (m) =>
      (m.role === 'user' || m.role === 'assistant') &&
      typeof m.content === 'string' &&
      m.content.trim().length > 0
  );
  if (!isValid) {
    return Response.json({ reply: 'Định dạng tin nhắn không đúng.' }, { status: 400 });
  }

  try {
    // 2. Lấy sản phẩm
    const products    = await getProductsCached();
    const productList = formatProductList(products);

    // 3. Map messages sang định dạng Gemini
    const geminiMessages = messages.map((m) => ({
      role:  m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const payload = {
      systemInstruction: {
        parts: [{
          text: `Bạn là TechBot — trợ lý tư vấn của cửa hàng điện tử TechZone.
Chính sách: bảo hành 12 tháng, giao hàng 2-3 ngày toàn quốc.
Danh sách sản phẩm hiện có:
${productList}
Hướng dẫn: Trả lời ngắn gọn, thân thiện, bằng tiếng Việt, tối đa 80 từ.
Nếu khách hỏi sản phẩm không có trong danh sách, thông báo hiện chưa có hàng.`,
        }],
      },
      contents: geminiMessages,
    };

    // 4. Gọi Gemini với fallback model
    const geminiRes = await callGeminiWithFallback(payload);

    // 5. Xử lý kết quả
    if (!geminiRes.ok) {
      const isOverloaded = geminiRes._lastError?.status === 503
                        || geminiRes._lastError?.status === 429;
      return Response.json(
        {
          reply: isOverloaded
            ? 'Dịch vụ AI đang quá tải, vui lòng thử lại sau ít giây nhé! 🙏'
            : 'Dịch vụ AI tạm thời không khả dụng, vui lòng thử lại.',
        },
        { status: 502 }
      );
    }

    const data = await geminiRes.json();

    if (data.error) {
      console.error('Gemini API Error:', data.error);
      return Response.json(
        { reply: `Lỗi từ dịch vụ AI: ${data.error.message}` },
        { status: 502 }
      );
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Xin lỗi, không nhận được phản hồi từ AI!';

    return Response.json({ reply });

  } catch (error) {
    console.error('Server Error:', error);
    return Response.json({ reply: 'Xin lỗi, có lỗi hệ thống xảy ra!' }, { status: 500 });
  }
}