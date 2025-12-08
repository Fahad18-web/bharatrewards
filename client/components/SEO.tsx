import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords = "Solve2Win, rewards, gaming, earn money, play games, crypto, wallet", 
  image = "/og-image.png", 
  url = "https://solve2win.com", 
  type = "website" 
}) => {
  const siteTitle = "Solve2Win - Play, Solve & Earn Rewards";
  const fullTitle = title === "Home" ? siteTitle : `${title} | Solve2Win`;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
      
      {/* Open Graph tags */}
      <meta property='og:type' content={type} />
      <meta property='og:title' content={fullTitle} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={image} />
      <meta property='og:url' content={url} />
      <meta property='og:site_name' content="Solve2Win" />
      
      {/* Twitter tags */}
      <meta name='twitter:creator' content="@Solve2Win" />
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={fullTitle} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
