export async function POST(request) {
  try {
    const { messages } = await request.json();

    // Map tin nhắn từ frontend sang định dạng chuẩn của Gemini
    const geminiMessages = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    // CẬP NHẬT: Dùng model gemini-2.5-flash chạy trên endpoint v1beta
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Chỉ dẫn hệ thống cấu hình cho TechBot
          systemInstruction: {
            parts: [{             
            text: `Bạn là TechBot — trợ lý tư vấn của cửa hàng điện tử TechZone. 
            Tư vấn sản phẩm, bảo hành 12 tháng, giao hàng 2-3 ngày. 
            Sản phẩm: MacBook Air M3 (28.99tr), Asus Zenbook 14 (18.5tr), iPhone 15 Pro Max (34.99tr), Samsung S24 Ultra (31.99tr), Xiaomi 14 (14.99tr).
            Trả lời ngắn gọn, thân thiện, tiếng Việt, tối đa 80 từ.`
                }]
          },
          contents: geminiMessages
        })
      }
    );

    const data = await response.json();

    // Bẫy lỗi chi tiết từ Google để in ra terminal nếu có sự cố
    if (data.error) {
      console.error("Gemini API Error Detail:", data.error);
      return Response.json({ reply: `Lỗi API: ${data.error.message}` });
    }

    // Trích xuất dữ liệu trả về từ object phản hồi của Google
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Xin lỗi, không nhận được phản hồi từ AI!';
    return Response.json({ reply });

  } catch (error) {
    console.error("Server Error:", error);
    return Response.json({ reply: 'Xin lỗi, có lỗi hệ thống xảy ra!' });
  }
}