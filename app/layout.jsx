import './globals.css';
import Navbar from '@/components/Navbar';
import ChatWidget from '@/components/ChatWidget';

export const metadata = {
  title: 'TechZone - Cửa hàng điện tử',
  description: 'Laptop, điện thoại, phụ kiện chính hãng giá tốt',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body style={{margin:0, background:'#f8fafc', minHeight:'100vh', fontFamily:'sans-serif'}}>
        <Navbar />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}