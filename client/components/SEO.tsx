import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  canonicalPath?: string;
  noIndex?: boolean;
  structuredData?: Record<string, unknown>[];
  lang?: string;
}

const SITE_NAME = "Solve2Win";
const SITE_TITLE = `${SITE_NAME} - Play, Solve & Earn Rewards`;
const DEFAULT_ORIGIN = "https://solve2win.com";

const normalizeUrl = (origin: string, path?: string) => {
  if (!path) return origin;
  const base = origin.endsWith('/') ? origin.slice(0, -1) : origin;
  const cleanedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanedPath}`;
};

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = "Solve2Win, rewards, gaming, earn money, play games, crypto, wallet",
  image = "/og-image.png",
  url = DEFAULT_ORIGIN,
  type = "website",
  canonicalPath,
  noIndex = false,
  structuredData,
  lang = "en"
}) => {
  const fullTitle = title === "Home" ? SITE_TITLE : `${title} | ${SITE_NAME}`;
  const canonical = normalizeUrl(url, canonicalPath);
  const robots = noIndex ? "noindex,nofollow" : "index,follow";

  const defaultStructuredData: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: url,
      description,
      inLanguage: lang,
      potentialAction: {
        "@type": "SearchAction",
        target: `${url}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: url,
      logo: normalizeUrl(url, image),
      sameAs: [
        "https://twitter.com/Solve2Win",
        "https://www.facebook.com/Solve2Win"
      ]
    }
  ];

  const jsonLdPayload = structuredData && structuredData.length > 0 ? structuredData : defaultStructuredData;

  return (
    <Helmet htmlAttributes={{ lang }}>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robots} />
      <meta name="author" content={SITE_NAME} />
      <meta name="theme-color" content="#ffffff" />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={normalizeUrl(url, image)} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:creator" content="@Solve2Win" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={normalizeUrl(url, image)} />

      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="en" href={canonical} />

      <script type="application/ld+json">{JSON.stringify(jsonLdPayload)}</script>
    </Helmet>
  );
};

export default SEO;
