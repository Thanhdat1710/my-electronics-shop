const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();

  const products = [
    {
      name: 'MacBook Air M3',
      description: 'Tuyệt tác di động MacBook Air M3 sở hữu thiết kế nhôm đúc nguyên khối siêu mỏng, hiệu năng đồ họa mạnh mẽ hỗ trợ Ray Tracing, tích hợp Neural Engine tối ưu cho các tác vụ AI và màn hình Liquid Retina tuyệt đẹp.',
      price: 28990000, oldPrice: 32000000, category: 'laptop', emoji: '💻', badge: '-9%', stock: 50,
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
        'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800',
      ],
      specs: JSON.stringify([
        ['CPU', 'Apple M3 8 nhân (4P + 4E)'],
        ['RAM', '8GB Unified Memory'],
        ['SSD', '256GB NVMe'],
        ['Màn hình', '13.6" Liquid Retina, 2560x1664, 224ppi'],
        ['GPU', 'Apple M3 10 nhân'],
        ['Pin', '52.6Wh, lên đến 18 giờ'],
        ['Trọng lượng', '1.24 kg'],
        ['Cổng kết nối', '2x Thunderbolt 3, MagSafe 3, Jack 3.5mm'],
        ['Hệ điều hành', 'macOS Sonoma'],
        ['Màu sắc', 'Midnight, Starlight, Space Gray, Sky Blue'],
      ])
    },
    {
      name: 'Asus Zenbook 14',
      description: 'Kiệt tác Ultrabook Asus Zenbook 14 sở hữu độ mỏng nhẹ phi thường chỉ 1.2kg, quyến rũ với màn hình Lumina OLED 3K sắc nét chuẩn điện ảnh và cấu hình tích hợp chip xử lý AI thông minh cho trải nghiệm làm việc vượt giới hạn.',
      price: 18500000, oldPrice: 21000000, category: 'laptop', emoji: '💻', badge: '-12%', stock: 30,
      images: [
        'https://images.unsplash.com/photo-1636211993589-6daf32038bd1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1636211990414-8edec17ba047?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1679124500499-88d6a0d3774b?q=80&w=716&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
      specs: JSON.stringify([
        ['CPU', 'Intel Core Ultra 5 125H'],
        ['RAM', '16GB LPDDR5X'],
        ['SSD', '512GB PCIe 4.0'],
        ['Màn hình', '14" OLED 2.8K, 120Hz, 100% DCI-P3'],
        ['GPU', 'Intel Arc Graphics'],
        ['Pin', '75Wh, lên đến 12 giờ'],
        ['Trọng lượng', '1.39 kg'],
        ['Cổng kết nối', '2x USB-C, 1x USB-A, HDMI 2.1, MicroSD'],
        ['Hệ điều hành', 'Windows 11 Home'],
        ['Màu sắc', 'Inkwell Black, Jasmine White'],
      ])
    },
    {
      name: 'iPhone 15 Pro Max',
      description: 'Siêu phẩm iPhone 15 Pro Max đột phá với thiết kế khung Titan chuẩn hàng không vũ trụ, hiệu năng đỉnh cao từ chip cấu trúc 3nm A17 Pro, cổng sạc USB-C siêu tốc cùng hệ thống camera quay chụp chuyên nghiệp.',
      price: 34990000, oldPrice: 38000000, category: 'phone', emoji: '📱', badge: '-8%', stock: 100,
      images: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
        'https://images.unsplash.com/photo-1720357632099-6d84cd7ee044?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
      specs: JSON.stringify([
        ['CPU', 'Apple A17 Pro 6 nhân'],
        ['RAM', '8GB'],
        ['Bộ nhớ', '256GB NVMe'],
        ['Màn hình', '6.7" Super Retina XDR, 2796x1290, 460ppi'],
        ['Camera sau', '48MP Fusion + 12MP Ultra Wide + 12MP Telephoto 5x'],
        ['Camera trước', '12MP TrueDepth, Face ID'],
        ['Pin', '4422 mAh, sạc nhanh 27W'],
        ['Kết nối', '5G, WiFi 6E, Bluetooth 5.3, NFC, USB-C 3.0'],
        ['Hệ điều hành', 'iOS 17'],
        ['Chất liệu', 'Khung titan, mặt lưng kính cường lực'],
      ])
    },
    {
      name: 'Samsung S24 Ultra',
      description: 'Thiết lập kỷ nguyên quyền năng mới với Samsung Galaxy S24 Ultra, dẫn đầu công nghệ nhờ hệ thống Galaxy AI tối tân, thiết kế khung viền Titanium cứng cáp, màn hình phẳng 120Hz siêu sáng và bút S Pen ghi chú vạn năng.Đỉnh cao flagship Android Galaxy S24 Ultra sở hữu camera 200MP bắt trọn mọi chi tiết với zoom AI vượt trội, hiệu năng cực đỉnh từ chip Snapdragon 8 Gen 3 chuyên biệt và mặt kính Corning Gorilla Armor chống chói đỉnh cấp.',
      price: 31990000, oldPrice: 35000000, category: 'phone', emoji: '📱', badge: '-9%', stock: 80,
      images: [
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
        'https://images.unsplash.com/photo-1709744722656-9b850470293f?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1705585174953-9b2aa8afc174?q=80&w=732&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
      specs: JSON.stringify([
        ['CPU', 'Snapdragon 8 Gen 3 for Galaxy'],
        ['RAM', '12GB'],
        ['Bộ nhớ', '256GB UFS 4.0'],
        ['Màn hình', '6.8" Dynamic AMOLED 2X, QHD+, 120Hz'],
        ['Camera sau', '200MP + 12MP + 50MP + 10MP (zoom 5x & 10x)'],
        ['Camera trước', '12MP'],
        ['Pin', '5000 mAh, sạc nhanh 45W, sạc không dây 15W'],
        ['Kết nối', '5G, WiFi 7, Bluetooth 5.3, NFC, USB-C 3.2'],
        ['Hệ điều hành', 'Android 14, One UI 6.1'],
        ['Đặc biệt', 'S Pen tích hợp, IP68'],
      ])
    },
    {
      name: 'Xiaomi 14',
      description: 'Flagship nhỏ gọn đỉnh cao Xiaomi 14 đột phá với hệ thống camera Leica thế hệ mới bắt trọn khoảnh khắc chân thực, hiệu năng dẫn đầu từ chip Snapdragon 8 Gen 3 mạnh mẽ cùng màn hình siêu sáng 3000 nits mượt mà vượt trội.',
      price: 14990000, oldPrice: 17000000, category: 'phone', emoji: '📱', badge: '-12%', stock: 60,
      images: [
        'https://images.unsplash.com/photo-1773414422120-3a8b1c07fee6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1773414422122-96165e640180?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1695733341794-4bd3c2f3251c?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
      specs: JSON.stringify([
        ['CPU', 'Snapdragon 8 Gen 3'],
        ['RAM', '12GB LPDDR5X'],
        ['Bộ nhớ', '256GB UFS 4.0'],
        ['Màn hình', '6.36" AMOLED, 2670x1200, 460ppi, 120Hz'],
        ['Camera sau', '50MP Leica Summilux + 50MP Ultra Wide + 50MP Telephoto 3.2x'],
        ['Camera trước', '32MP'],
        ['Pin', '4610 mAh, HyperCharge 90W, sạc không dây 50W'],
        ['Kết nối', '5G, WiFi 7, Bluetooth 5.4, NFC, USB-C 3.2'],
        ['Hệ điều hành', 'Android 14, HyperOS'],
        ['Đặc biệt', 'IP68, Leica Optics, Camera Leica chuyên nghiệp'],
      ])
    },
    {
      name: 'iPad Air M2',
      description: 'Nâng tầm trải nghiệm với iPad Air M2 siêu mỏng nhẹ, sở hữu sức mạnh vượt trội từ chip Apple M2 đỉnh cao thách thức mọi tác vụ đồ họa, đi kèm màn hình Liquid Retina sắc nét và khả năng tương thích hoàn hảo với Apple Pencil Pro cho trải nghiệm sáng tạo không giới hạn.',
      price: 17990000, oldPrice: 19500000, category: 'tablet', emoji: '📟', badge: '-8%', stock: 40,
      images: [
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
        'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800',
        'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800',
      ],
      specs: JSON.stringify([
        ['CPU', 'Apple M2 8 nhân'],
        ['RAM', '8GB Unified Memory'],
        ['Bộ nhớ', '128GB'],
        ['Màn hình', '11" Liquid Retina, 2360x1640, 264ppi'],
        ['Camera sau', '12MP Wide, quay 4K'],
        ['Camera trước', '12MP Ultra Wide, Center Stage'],
        ['Pin', '28.65Wh, lên đến 10 giờ'],
        ['Kết nối', 'WiFi 6E, Bluetooth 5.3, USB-C 3.1'],
        ['Hỗ trợ', 'Apple Pencil Pro, Magic Keyboard'],
        ['Màu sắc', 'Blue, Purple, Starlight, Space Gray'],
      ])
    },
    {
      name: 'Sony WH-1000XM5',
      description: 'Định nghĩa lại không gian âm nhạc với Sony WH-1000XM5, sở hữu công nghệ chống ồn đỉnh cao nhờ bộ xử lý kép thông minh, chất âm Hi-Res sắc nét hoàn hảo cùng thiết kế "Noiseless Design" siêu nhẹ mang lại cảm giác đeo êm ái suốt ngày dài.',
      price: 8490000, oldPrice: 9990000, category: 'audio', emoji: '🎧', badge: '-15%', stock: 70,
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
      ],
      specs: JSON.stringify([
        ['Loại', 'Over-ear, closed-back'],
        ['Driver', '30mm Carbon Fiber Composite'],
        ['Kết nối', 'Bluetooth 5.2, Multipoint 2 thiết bị'],
        ['Codec', 'SBC, AAC, LDAC (Hi-Res Wireless)'],
        ['Chống ồn', 'ANC với 8 microphone'],
        ['Pin', '30 giờ (ANC bật), 40 giờ (ANC tắt)'],
        ['Sạc', 'USB-C, 3 phút sạc = 3 giờ nghe'],
        ['Trọng lượng', '250g'],
        ['Màu sắc', 'Black, Platinum Silver'],
        ['Đặc biệt', 'Speak-to-Chat, Quick Attention Mode'],
      ])
    },
    {
      name: 'AirPods Pro 2',
      description: 'Trải nghiệm âm thanh đỉnh cao với AirPods Pro 2, sở hữu chip H2 mang lại khả năng chống ồn chủ động gấp đôi thế hệ trước, âm thanh vòm Spatial Audio cá nhân hóa cùng hộp sạc MagSafe tích hợp loa cảnh báo và chip tìm kiếm chính xác.',
      price: 6490000, oldPrice: 7500000, category: 'audio', emoji: '🎧', badge: '-13%', stock: 90,
      images: [
        'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://plus.unsplash.com/premium_photo-1675129779575-54b713ec81dc?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?q=80&w=1589&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
      specs: JSON.stringify([
        ['Loại', 'In-ear, True Wireless'],
        ['Chip', 'Apple H2'],
        ['Kết nối', 'Bluetooth 5.3'],
        ['Codec', 'AAC, Apple Lossless (ALAC)'],
        ['Chống ồn', 'ANC thế hệ 2, Transparency Mode'],
        ['Pin tai nghe', 'Lên đến 6 giờ (ANC bật)'],
        ['Pin hộp sạc', 'Tổng 30 giờ'],
        ['Sạc', 'MagSafe, Lightning, Qi2'],
        ['Kháng nước', 'IPX4 (tai nghe), IP54 (hộp sạc)'],
        ['Đặc biệt', 'Spatial Audio, Adaptive EQ, Touch Control'],
      ])
    },
    {
      name: 'Apple Watch S9',
      description: 'Đồng hồ thông minh Apple Watch Series 9 đột phá với chip S9 SiP mạnh mẽ, tính năng Chạm Hai Lần (Double Tap) không chạm màn hình kỳ diệu, cùng màn hình Always-On siêu sáng và hệ thống theo dõi sức khỏe, tập luyện chuyên sâu toàn diện.',
      price: 11990000, oldPrice: 13500000, category: 'accessory', emoji: '⌚', badge: '-11%', stock: 45,
      images: [
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800',
        'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800',
        'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800',
      ],
      specs: JSON.stringify([
        ['Chip', 'Apple S9 SiP 64-bit'],
        ['Màn hình', '41mm / 45mm Always-On Retina LTPO'],
        ['Độ phân giải', '41mm: 352x430px | 45mm: 396x484px'],
        ['Cảm biến', 'Nhịp tim, SpO2, ECG, Nhiệt độ da'],
        ['GPS', 'L1 + L5, GLONASS, BeiDou, Galileo'],
        ['Pin', 'Lên đến 18 giờ, 36h chế độ Low Power'],
        ['Sạc', 'MagSafe USB-C, 0-80% trong 45 phút'],
        ['Kháng nước', 'WR50, Swim Proof'],
        ['Kết nối', 'WiFi 802.11b/g/n, Bluetooth 5.3, NFC'],
        ['Màu sắc', 'Midnight, Starlight, Silver, Red, Pink'],
      ])
    },
    {
      name: 'Dell UltraSharp 27"',
      description: 'Màn hình đồ họa đỉnh cao Dell UltraSharp 27 inch sở hữu độ phân giải sắc nét cùng tấm nền IPS cho màu sắc chuẩn xác tuyệt đối, thiết kế viền mỏng vô cực sang trọng kết hợp cổng kết nối USB-C Hub toàn năng hỗ trợ truyền dữ liệu và sạc nhanh tiện lợi.',
      price: 12490000, oldPrice: 14000000, category: 'accessory', emoji: '🖥️', badge: '-11%', stock: 25,
      images: [
        'https://images.unsplash.com/photo-1619953942547-233eab5a70d6?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1612814824743-c760091da7f6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1618133030686-e1186525ebcc?q=80&w=772&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
      specs: JSON.stringify([
        ['Kích thước', '27 inch'],
        ['Độ phân giải', '3840x2160 (4K UHD)'],
        ['Tấm nền', 'IPS Black, chống lóa'],
        ['Tần số quét', '60Hz'],
        ['Thời gian phản hồi', '5ms (GtG)'],
        ['Độ phủ màu', '100% sRGB, 98% DCI-P3'],
        ['Độ sáng', '400 nits (HDR 400)'],
        ['Cổng kết nối', 'HDMI 2.0, DisplayPort 1.4, USB-C 90W, 4x USB-A'],
        ['Tính năng', 'Height/Tilt/Swivel/Pivot, Flicker-free, ComfortView+'],
        ['Bảo hành', '3 năm chính hãng'],
      ])
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log('✅ Đã seed xong dữ liệu với ảnh thật!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());