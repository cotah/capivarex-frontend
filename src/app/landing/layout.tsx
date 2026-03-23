import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CAPIVAREX — Your AI Life Assistant',
  description:
    'Manage your music, calendar, smart home, groceries, and more — all through one intelligent AI conversation.',
  metadataBase: new URL('https://capivarex.com'),
  openGraph: {
    title: 'CAPIVAREX — Your AI Life Assistant',
    description:
      'Manage your music, calendar, smart home, groceries, and more — all through one intelligent AI conversation.',
    url: 'https://capivarex.com/landing',
    siteName: 'CAPIVAREX',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CAPIVAREX — Your AI Life Assistant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CAPIVAREX — Your AI Life Assistant',
    description:
      'Manage your music, calendar, smart home, groceries, and more — all through one intelligent AI conversation.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://capivarex.com/landing',
  },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
