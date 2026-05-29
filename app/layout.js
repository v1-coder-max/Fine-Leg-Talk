import './globals.css';
import Script from 'next/script';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://fine-leg-talk.vercel.app';
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GSC = process.env.NEXT_PUBLIC_GSC_VERIFICATION;

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Fine Leg Talk — Cricket Analysis, Reviews & Commentary',
    template: '%s — Fine Leg Talk',
  },
  description: 'Fine Leg Talk is a cricket YouTube channel and blog with in-depth match reviews, player analysis, IPL coverage, and passionate cricket commentary.',
  keywords: ['cricket analysis', 'cricket match reviews', 'IPL 2026', 'India cricket', 'cricket YouTube channel', 'Test cricket analysis', 'cricket blog', 'Bumrah', 'Kohli', 'Rohit'],
  verification: GSC ? { google: GSC } : undefined,
  icons: { icon: '/favicon.ico' },
  openGraph: {
    type: 'website',
    siteName: 'Fine Leg Talk',
    title: 'Fine Leg Talk — Cricket Analysis, Reviews & Commentary',
    description: 'Cricket YouTube channel and blog with in-depth match reviews, player analysis, IPL coverage and honest opinions.',
    url: SITE_URL,
    images: ['/FineLegTalk.jpeg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fine Leg Talk — Cricket Analysis, Reviews & Commentary',
    description: 'Cricket YouTube channel and blog with in-depth match reviews, player analysis, IPL coverage and honest opinions.',
    images: ['/FineLegTalk.jpeg'],
  },
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Fine Leg Talk',
  url: SITE_URL,
  description: 'Cricket YouTube channel and blog with in-depth match reviews, player analysis, IPL coverage and honest opinions.',
  sameAs: ['https://youtube.com/@FineLegTalk'],
};

const siteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Fine Leg Talk',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/stats?player={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Lora:ital,wght@0,400;0,600;1,400&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }} />
      </head>
      <body>
        <Navigation />
        {children}
        <Footer />
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}</Script>
          </>
        )}
      </body>
    </html>
  );
}
