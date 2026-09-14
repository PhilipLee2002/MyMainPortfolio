import type { Metadata } from 'next';
import { Host_Grotesk, DM_Sans } from 'next/font/google';
import { LenisProvider } from '@/components/providers/LenisProvider';
import { MotionProvider } from '@/components/providers/MotionProvider';
import { ScrollAtmosphere } from '@/components/providers/ScrollAtmosphere';
import { CustomCursor } from '@/components/ui/CustomCursor';
import './globals.css';

const displayFont = Host_Grotesk({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-display-raw',
  display: 'swap',
});

const bodyFont = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body-raw',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Philip Lee — Full-Stack Developer | Laravel & AI Specialist',
  description:
    'Full-stack developer specialising in Laravel architecture and local AI. Building clean, scalable solutions for complex business problems.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://philip-lee.vercel.app'
  ),
  openGraph: {
    type: 'website',
    title: 'Philip Lee — Full-Stack Developer | Laravel & AI Specialist',
    description:
      'Full-stack developer specialising in Laravel architecture and local AI.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    // {/* REPLACE WITH REAL OG IMAGE */}
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Philip Lee — Full-Stack Developer | Laravel & AI Specialist',
    description:
      'Full-stack developer specialising in Laravel architecture and local AI.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <LenisProvider>
          <ScrollAtmosphere />
          <MotionProvider>
            {children}
          </MotionProvider>
        </LenisProvider>
        <CustomCursor />
      </body>
    </html>
  );
}
