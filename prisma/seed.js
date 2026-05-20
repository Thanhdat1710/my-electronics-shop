const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      { name:'MacBook Air M3', description:'Laptop mỏng nhẹ nhất của Apple với chip M3 cực mạnh.', price:28990000, oldPrice:32000000, category:'laptop', emoji:'💻', badge:'-9%', stock:50 },
      { name:'Asus Zenbook 14', description:'Thiết kế sang trọng, màn OLED sắc nét.', price:18500000, oldPrice:21000000, category:'laptop', emoji:'💻', badge:'-12%', stock:30 },
      { name:'iPhone 15 Pro Max', description:'iPhone cao cấp nhất, camera 48MP đỉnh cao.', price:34990000, oldPrice:38000000, category:'phone', emoji:'📱', badge:'-8%', stock:100 },
      { name:'Samsung S24 Ultra', description:'Camera 200MP siêu nét, bút S Pen tiện lợi.', price:31990000, oldPrice:35000000, category:'phone', emoji:'📱', badge:'-9%', stock:80 },
      { name:'Xiaomi 14', description:'Hiệu năng flagship với giá hợp lý.', price:14990000, oldPrice:17000000, category:'phone', emoji:'📱', badge:'-12%', stock:60 },
      { name:'iPad Air M2', description:'Máy tính bảng mỏng nhẹ, chip M2 mạnh mẽ.', price:17990000, oldPrice:19500000, category:'tablet', emoji:'📟', badge:'-8%', stock:40 },
      { name:'Sony WH-1000XM5', description:'Tai nghe chống ồn tốt nhất hiện tại.', price:8490000, oldPrice:9990000, category:'audio', emoji:'🎧', badge:'-15%', stock:70 },
      { name:'AirPods Pro 2', description:'Âm thanh không gian, chống ồn xuất sắc.', price:6490000, oldPrice:7500000, category:'audio', emoji:'🎧', badge:'-13%', stock:90 },
      { name:'Apple Watch S9', description:'Đồng hồ thông minh toàn diện nhất.', price:11990000, oldPrice:13500000, category:'accessory', emoji:'⌚', badge:'-11%', stock:45 },
      { name:'Dell UltraSharp 27"', description:'Màn hình 4K chuẩn màu chuyên đồ họa.', price:12490000, oldPrice:14000000, category:'accessory', emoji:'🖥️', badge:'-11%', stock:25 },
    ]
  });

  console.log('✅ Đã seed xong dữ liệu!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());