import { useState, ReactNode } from 'react';
import { router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { Header, Footer, WhatsAppButton } from '@/components/shop';

interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    price: number;
    subtotal: number;
    product: {
        id: number;
        name: string;
        slug: string;
        price: number;
        sale_price: number | null;
        final_price: number;
        primary_image: {
            image_url: string;
        } | null;
        category: {
            name: string;
        } | null;
    } | null;
}

interface SharedCart {
    id: number | null;
    items_count: number;
    items: CartItem[];
    subtotal: number;
}

interface ShopLayoutProps {
    children: ReactNode;
    showFooter?: boolean;
    showWhatsApp?: boolean;
    whatsAppPhone?: string;
    whatsAppMessage?: string;
    bannerVisible?: boolean;
}

export function ShopLayout({
    children,
    showFooter = true,
    showWhatsApp = true,
    whatsAppPhone = "6281234567890",
    whatsAppMessage = "Halo, saya ingin bertanya tentang produk",
    bannerVisible = false
}: ShopLayoutProps) {
    const { cart } = usePage<{ cart: SharedCart }>().props;
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [updatingItem, setUpdatingItem] = useState<number | null>(null);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        setUpdatingItem(itemId);

        router.put(`/shop/cart/${itemId}`, { quantity: newQuantity }, {
            preserveScroll: true,
            only: ['cart'],
            onFinish: () => setUpdatingItem(null),
            onError: (errors) => {
                console.error('Error updating cart:', errors);
                setUpdatingItem(null);
            },
        });
    };

    const handleRemoveItem = async (itemId: number) => {
        setUpdatingItem(itemId);

        router.delete(`/shop/cart/${itemId}`, {
            preserveScroll: true,
            only: ['cart'],
            onFinish: () => setUpdatingItem(null),
            onError: (errors) => {
                console.error('Error removing item:', errors);
                setUpdatingItem(null);
            },
        });
    };

    const handleCheckout = () => {
        setIsCartOpen(false);
        router.visit('/shop/checkout');
    };

    return (
        <>
            <Header
                cartCount={cart?.items_count || 0}
                onCartClick={() => setIsCartOpen(true)}
                onLogoClick={() => router.visit('/shop')}
                bannerVisible={bannerVisible}
            />

            {children}

            {showFooter && <Footer />}

            {showWhatsApp && (
                <WhatsAppButton phoneNumber={whatsAppPhone} message={whatsAppMessage} />
            )}

            {/* Cart Drawer */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCartOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-terra-100 flex justify-between items-center">
                                <h2 className="font-serif text-2xl text-terra-900">Keranjang</h2>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="p-2 hover:bg-terra-50 rounded-full transition-colors"
                                >
                                    <X size={24} className="text-terra-600" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                {!cart?.items || cart.items.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center">
                                        <ShoppingBag size={64} className="text-terra-200 mb-6" />
                                        <h3 className="font-serif text-xl text-terra-900 mb-2">Keranjang Kosong</h3>
                                        <p className="text-terra-500">Mulai belanja untuk mengisi keranjang.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {cart.items.map((item) => (
                                            <div
                                                key={item.id}
                                                className={`flex gap-4 pb-4 border-b border-terra-100 last:border-0 ${
                                                    updatingItem === item.id ? 'opacity-50' : ''
                                                }`}
                                            >
                                                <div className="w-20 h-24 bg-terra-100 rounded-xl overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={item.product?.primary_image?.image_url || '/images/placeholder-product.svg'}
                                                        alt={item.product?.name || 'Product'}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-terra-900 truncate">
                                                        {item.product?.name || 'Unknown Product'}
                                                    </h4>
                                                    {item.product?.category && (
                                                        <p className="text-sm text-terra-500">
                                                            {item.product.category.name}
                                                        </p>
                                                    )}
                                                    <p className="text-wood font-medium mt-1">
                                                        {formatPrice(item.price)}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <div className="flex items-center border border-terra-200 rounded-full">
                                                            <button
                                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                                disabled={updatingItem === item.id || item.quantity <= 1}
                                                                className="w-8 h-8 flex items-center justify-center hover:bg-terra-50 rounded-l-full disabled:opacity-50"
                                                            >
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className="w-8 text-center text-sm font-medium">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                                disabled={updatingItem === item.id}
                                                                className="w-8 h-8 flex items-center justify-center hover:bg-terra-50 rounded-r-full disabled:opacity-50"
                                                            >
                                                                <Plus size={14} />
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveItem(item.id)}
                                                            disabled={updatingItem === item.id}
                                                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {cart?.items && cart.items.length > 0 && (
                                <div className="p-6 border-t border-terra-100 space-y-4">
                                    <div className="flex justify-between items-center text-lg">
                                        <span className="text-terra-600">Subtotal</span>
                                        <span className="font-medium text-terra-900">
                                            {formatPrice(cart.subtotal)}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleCheckout}
                                        className="w-full bg-terra-900 text-white py-4 rounded-full font-medium hover:bg-wood transition-colors"
                                    >
                                        Lanjut ke Checkout
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsCartOpen(false);
                                            router.visit('/shop/cart');
                                        }}
                                        className="w-full border border-terra-200 text-terra-900 py-3 rounded-full font-medium hover:bg-terra-50 transition-colors"
                                    >
                                        Lihat Keranjang
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

export default ShopLayout;
