import { seoConfig } from '../../../config/seo';

interface SeoMetaProps {
  component?: string;
}

export const SeoMeta = ({ component }: SeoMetaProps) => {
  const pageMeta = component 
    ? seoConfig.pages[component] || seoConfig.defaultMeta 
    : seoConfig.defaultMeta;

  return (
    <>
      <meta property="og:title" content={pageMeta.title} />
      <meta property="og:description" content={pageMeta.description} />
      <meta property="og:image" content={`${seoConfig.baseUrl}${pageMeta.image}`} />
      <meta property="og:url" content={`${seoConfig.baseUrl}${pageMeta.route}`} />
      <meta property="og:type" content={pageMeta.type} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageMeta.title} />
      <meta name="twitter:description" content={pageMeta.description} />
      <meta name="twitter:image" content={`${seoConfig.baseUrl}${pageMeta.image}`} />

      <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
    </>
  );
}; 