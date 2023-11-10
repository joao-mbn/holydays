import type { Metadata } from 'next';
import { Dancing_Script, Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
const dancing_script = Dancing_Script({ subsets: ['latin'], display: 'swap', variable: '--font-dancing-script' });

export const metadata: Metadata = {
  title: 'Holydays',
  description: 'Get the most out of your vacations!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dancing_script.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
