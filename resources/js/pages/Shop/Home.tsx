import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Product, CartItem, ViewState } from '@/types/shop';
import {
    Header,
    Footer,
    LandingView,
    CartDrawer,
    ProductDetail,
    CheckoutView,
    SuccessView,
    PromoBanner,
    WhatsAppButton,
} from '@/components/shop';
import { SEOHead, WebsiteStructuredData, OrganizationStructuredData } from '@/components/seo';

// --- Main App Component ---

export default function Home() {
    const [view, setView] = useState<ViewState>('landing');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [bannerVisible, setBannerVisible] = useState(false);

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQty = (id: string, qty: number) => {
        if (qty <= 0) {
            removeFromCart(id);
        } else {
            setCart(prev => prev.map(item =>
                item.id === id ? { ...item, quantity: qty } : item
            ));
        }
    };

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        setView('detail');
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        setView('landing');
        setSelectedProduct(null);
        window.scrollTo(0, 0);
    };

    const handleCheckout = () => {
        setIsCartOpen(false);
        setView('checkout');
        window.scrollTo(0, 0);
    };

    const handleOrderSuccess = () => {
        setCart([]);
        setView('success');
        window.scrollTo(0, 0);
    };

    const handleContinueShopping = () => {
        setView('landing');
        window.scrollTo(0, 0);
    };

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <>
            {/* SEO Head */}
            <SEOHead
                title="Furniture Premium Berkualitas"
                description="Latif Living - Toko furnitur premium Indonesia. Temukan koleksi kursi, meja, lemari, dan furnitur custom berkualitas tinggi dengan harga terjangkau. Gratis ongkir untuk pembelian di atas Rp 5 juta."
                keywords={['furnitur', 'furniture', 'mebel', 'latif living', 'kursi', 'meja', 'lemari', 'furnitur custom', 'furniture indonesia', 'mebel jepara']}
                type="website"
            />

            {/* Structured Data */}
            <WebsiteStructuredData
                data={{
                    name: 'Latif Living',
                    url: typeof window !== 'undefined' ? window.location.origin : '',
                    searchUrl: typeof window !== 'undefined' ? `${window.location.origin}/shop/products` : '',
                }}
            />
            <OrganizationStructuredData
                data={{
                    name: 'Latif Living',
                    url: typeof window !== 'undefined' ? window.location.origin : '',
                    logo: typeof window !== 'undefined' ? `${window.location.origin}/images/logo.png` : '',
                    description: 'Toko furnitur premium Indonesia dengan koleksi berkualitas tinggi',
                    email: 'info@latifliving.com',
                    phone: '+6281234567890',
                    address: {
                        street: 'Jl. Mebel No. 123',
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

            <Header
                cartCount={cartCount}
                onCartClick={() => setIsCartOpen(true)}
                onLogoClick={() => { setView('landing'); window.scrollTo(0, 0); }}
                bannerVisible={bannerVisible}
            />

            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cart={cart}
                removeFromCart={removeFromCart}
                updateQty={updateQty}
                onCheckout={handleCheckout}
            />

            <main className="bg-white min-h-screen">
                <AnimatePresence mode="wait">
                    {view === 'landing' && (
                        <LandingView key="landing" onProductClick={handleProductClick} />
                    )}
                    {view === 'detail' && selectedProduct && (
                        <ProductDetail
                            key="detail"
                            product={selectedProduct}
                            onBack={handleBack}
                            addToCart={addToCart}
                        />
                    )}
                    {view === 'checkout' && (
                        <CheckoutView
                            key="checkout"
                            cart={cart}
                            onBack={() => { setView('landing'); setIsCartOpen(true); }}
                            onSuccess={handleOrderSuccess}
                        />
                    )}
                    {view === 'success' && (
                        <SuccessView key="success" onContinue={handleContinueShopping} />
                    )}
                </AnimatePresence>
            </main>

            <Footer />

            {/* WhatsApp Floating Button */}
            <WhatsAppButton
                phoneNumber="6281234567890"
                message="Halo, saya tertarik dengan produk di Latif Living"
            />

            {/* Promo Popup - shows after 5 seconds */}
            <PromoBanner type="popup" storageKey="home_promo_popup" delayPopup={5000} />
        </>
    );
}

