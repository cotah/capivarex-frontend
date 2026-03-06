import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Capivarex — Your AI Life Assistant',
  description:
    'Manage your music, calendar, smart home, groceries, and more — all through one intelligent AI conversation.',
  metadataBase: new URL('https://capivarex.com'),
  openGraph: {
    title: 'Capivarex — Your AI Life Assistant',
    description:
      'Manage your music, calendar, smart home, groceries, and more — all through one intelligent AI conversation.',
    url: 'https://capivarex.com/landing',
    siteName: 'Capivarex',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Capivarex — Your AI Life Assistant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Capivarex — Your AI Life Assistant',
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
