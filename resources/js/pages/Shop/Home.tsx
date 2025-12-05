import { useState } from 'react';
import { HomePageProps } from '@/types/shop';
import { ShopLayout } from '@/layouts/ShopLayout';
import { LandingView, PromoBanner } from '@/components/shop';
import { SEOHead, WebsiteStructuredData, OrganizationStructuredData } from '@/components/seo';

// --- Main App Component ---

export default function Home({
    featuredProducts,
    featuredCategories,
    testimonials,
    heroSettings,
    trustLogos,
    values,
    siteSettings,
}: HomePageProps) {
    const [bannerVisible, setBannerVisible] = useState(false);

    return (
        <>
            {/* SEO Head */}
            <SEOHead
                title="Furniture Premium Berkualitas"
                description={siteSettings.description || "Latif Living - Toko furnitur premium Indonesia. Temukan koleksi kursi, meja, lemari, dan furnitur custom berkualitas tinggi dengan harga terjangkau."}
                keywords={['furnitur', 'furniture', 'mebel', 'latif living', 'kursi', 'meja', 'lemari', 'furnitur custom', 'furniture indonesia', 'mebel jepara']}
                type="website"
            />

            {/* Structured Data */}
            <WebsiteStructuredData
                data={{
                    name: siteSettings.name,
                    url: typeof window !== 'undefined' ? window.location.origin : '',
                    searchUrl: typeof window !== 'undefined' ? `${window.location.origin}/shop/products` : '',
                }}
            />
            <OrganizationStructuredData
                data={{
                    name: siteSettings.name,
                    url: typeof window !== 'undefined' ? window.location.origin : '',
                    logo: typeof window !== 'undefined' ? `${window.location.origin}/images/logo.png` : '',
                    description: siteSettings.description,
                    email: siteSettings.email || 'info@latifliving.com',
                    phone: siteSettings.phone || '+6281234567890',
                    address: {
                        street: siteSettings.address || 'Jl. Mebel No. 123',
                        city: 'Jepara',
                        region: 'Jawa Tengah',
                        postalCode: '59411',
                        country: 'ID',
                    },
                    socialMedia: [
                        'https://www.facebook.com/latifliving',
                        'https://www.instagram.com/latifliving',
                        'https://www.twitter.com/latifliving',
                    ],
                }}
            />

            {/* Promo Banner */}
            <PromoBanner type="banner" storageKey="home_promo_banner" onVisibilityChange={setBannerVisible} />

            {/* Noise Overlay */}
            <div className="bg-noise" />

            <ShopLayout
                showFooter={true}
                showWhatsApp={true}
                whatsAppPhone={siteSettings.whatsapp || "6281234567890"}
                whatsAppMessage={`Halo, saya tertarik dengan produk di ${siteSettings.name}`}
                bannerVisible={bannerVisible}
            >
                <main className="bg-white min-h-screen">
                    <LandingView
                        featuredProducts={featuredProducts.data}
                        featuredCategories={featuredCategories.data}
                        testimonials={testimonials}
                        heroSettings={heroSettings}
                        trustLogos={trustLogos}
                        values={values}
                    />
                </main>
            </ShopLayout>

            {/* Promo Popup - shows after 5 seconds */}
            <PromoBanner type="popup" storageKey="home_promo_popup" delayPopup={5000} />
        </>
    );
}

