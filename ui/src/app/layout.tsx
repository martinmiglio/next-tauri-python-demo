import Footer from '@/components/Footer';
import { sans, mono } from '@/styles/fonts';
import '@/styles/global.css';

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${sans.variable} ${mono.variable} font-sans antialiased`}
      >
        <div className="mx-auto flex h-full w-11/12 max-w-screen-md flex-col justify-between">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
