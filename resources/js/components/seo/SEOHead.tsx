import { Head } from '@inertiajs/react';

export interface SEOProps {
    title: string;
    description?: string;
    keywords?: string[];
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'product';
    siteName?: string;
    locale?: string;
    // Product specific
    product?: {
        price?: number;
        currency?: string;
        availability?: 'in stock' | 'out of stock' | 'preorder';
        brand?: string;
        category?: string;
        sku?: string;
    };
    // Article specific
    article?: {
        publishedTime?: string;
        modifiedTime?: string;
        author?: string;
    };
    // Twitter specific
    twitterCard?: 'summary' | 'summary_large_image' | 'product';
    twitterSite?: string;
    // Robots
    noindex?: boolean;
    nofollow?: boolean;
    // Canonical
    canonical?: string;
}

const DEFAULT_SITE_NAME = 'Latif Living';
const DEFAULT_LOCALE = 'id_ID';
const DEFAULT_IMAGE = '/images/og-default.jpg';
const DEFAULT_DESCRIPTION = 'Latif Living - Furnitur Berkualitas dengan Harga Terjangkau. Temukan koleksi kursi, meja, lemari, dan furnitur custom terbaik.';

export const SEOHead: React.FC<SEOProps> = ({
    title,
    description = DEFAULT_DESCRIPTION,
    keywords = ['furnitur', 'furniture', 'mebel', 'latif living', 'kursi', 'meja', 'lemari'],
    image = DEFAULT_IMAGE,
    url,
    type = 'website',
    siteName = DEFAULT_SITE_NAME,
    locale = DEFAULT_LOCALE,
    product,
    article,
    twitterCard = 'summary_large_image',
    twitterSite = '@latifliving',
    noindex = false,
    nofollow = false,
    canonical,
}) => {
    const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
    const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const imageUrl = image?.startsWith('http') ? image : (typeof window !== 'undefined' ? `${window.location.origin}${image}` : image);
    
    const robotsContent = [
        noindex ? 'noindex' : 'index',
        nofollow ? 'nofollow' : 'follow',
    ].join(', ');

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords.join(', ')} />
            <meta name="robots" content={robotsContent} />
            
            {/* Canonical URL */}
            {canonical && <link rel="canonical" href={canonical} />}
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content={locale} />
            
            {/* Twitter Card */}
            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:site" content={twitterSite} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={imageUrl} />
            
            {/* Product specific Open Graph */}
            {product && (
                <>
                    {product.price && <meta property="product:price:amount" content={String(product.price)} />}
                    {product.currency && <meta property="product:price:currency" content={product.currency} />}
                    {product.availability && <meta property="product:availability" content={product.availability} />}
                    {product.brand && <meta property="product:brand" content={product.brand} />}
                    {product.category && <meta property="product:category" content={product.category} />}
                </>
            )}
            
            {/* Article specific Open Graph */}
            {article && (
                <>
                    {article.publishedTime && <meta property="article:published_time" content={article.publishedTime} />}
                    {article.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
                    {article.author && <meta property="article:author" content={article.author} />}
                </>
            )}
        </Head>
    );
};

export default SEOHead;

