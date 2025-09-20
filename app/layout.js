import './globals.css';
import { Arvo } from 'next/font/google';

const arvo = Arvo({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-arvo',
});

export const metadata = {
  title: 'SCRIPTHARA - Video Script Generator',
  description: 'Generate engaging video scripts with an AI-Powered tool',
  themeColor: '#ec4899',
  icons: {
    // Inlined SVG for a pink "S" favicon
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="85" font-weight="700" font-family="Arvo, sans-serif" fill="%23ec4899">S</text></svg>',
  },
};

export default function RootLayout({ children }) {
  // The font variable is applied via the body tag in globals.css
  return (
    <html lang="en" className={arvo.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}