import { Head, Link, router, usePage } from '@inertiajs/react';
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, Bookmark, ShoppingCart } from 'lucide-react';
import { ShopLayout } from '@/layouts/ShopLayout';
import { useState } from 'react';
import { SiteSettings } from '@/types';

interface ProductImage {
    id: number;
    url: string;
    is_primary: boolean;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    price_formatted: string;
    final_price_formatted: string;
    has_discount: boolean;
    images: ProductImage[];
}

interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    unit_price_formatted: string;
    subtotal_formatted: string;
    is_saved_for_later: boolean;
    product: Product;
}

interface Cart {
    id: number;
    items_count: number;
    saved_items_count: number;
    subtotal_formatted: string;
    items: CartItem[];
    saved_items: CartItem[];
}

interface Props {
    cart: Cart | null;
}

export default function CartIndex({ cart }: Props) {
    const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
    const siteName = siteSettings?.site_name || 'Latif Living';
    const [loading, setLoading] = useState<number | null>(null);

    const updateQuantity = (itemId: number, quantity: number) => {
        if (quantity < 1) return;
        setLoading(itemId);
        router.put(`/shop/cart/${itemId}`, { quantity }, {
            preserveScroll: true,
            onFinish: () => setLoading(null),
        });
    };

    const removeItem = (itemId: number) => {
        setLoading(itemId);
        router.delete(`/shop/cart/${itemId}`, {
            preserveScroll: true,
            onFinish: () => setLoading(null),
        });
    };

    const saveForLater = (itemId: number) => {
        setLoading(itemId);
        router.post(`/shop/cart/${itemId}/save-for-later`, {}, {
            preserveScroll: true,
            onFinish: () => setLoading(null),
        });
    };

    const moveToCart = (itemId: number) => {
        setLoading(itemId);
        router.post(`/shop/cart/${itemId}/move-to-cart`, {}, {
            preserveScroll: true,
            onFinish: () => setLoading(null),
        });
    };

    const getProductImage = (product: Product) => {
        const primary = product.images?.find(img => img.is_primary);
        return primary?.url || product.images?.[0]?.url || '/images/placeholder-product.svg';
    };

    return (
        <>
            <Head title={`Keranjang Belanja - ${siteName}`} />
            <div className="bg-noise" />
            <ShopLayout>
            <main className="min-h-screen bg-sand-50 pt-28 pb-20">
                <div className="max-w-6xl mx-auto px-6 md:px-12">
                    <h1 className="font-serif text-3xl text-terra-900 mb-8">Keranjang Belanja</h1>

                    {!cart || cart.items.length === 0 ? (
                        <div className="bg-white rounded-sm p-12 text-center">
                            <ShoppingBag className="w-16 h-16 mx-auto text-terra-200 mb-4" />
                            <h2 className="font-serif text-2xl text-terra-900 mb-2">Keranjang Kosong</h2>
                            <p className="text-terra-500 mb-6">Mulai belanja untuk mengisi keranjang Anda</p>
                            <Link href="/shop/products" className="inline-flex items-center gap-2 bg-terra-900 text-white px-6 py-3 rounded-full hover:bg-terra-800 transition-colors">
                                Mulai Belanja <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {cart.items.map((item) => (
                                    <CartItemCard
                                        key={item.id}
                                        item={item}
                                        loading={loading === item.id}
                                        onUpdateQuantity={updateQuantity}
                                        onRemove={removeItem}
                                        onSaveForLater={saveForLater}
                                        getProductImage={getProductImage}
                                    />
                                ))}

                                {/* Saved for Later */}
                                {cart.saved_items.length > 0 && (
                                    <div className="mt-8">
                                        <h2 className="font-serif text-xl text-terra-900 mb-4 flex items-center gap-2">
                                            <Bookmark className="w-5 h-5" /> Disimpan untuk Nanti ({cart.saved_items.length})
                                        </h2>
                                        <div className="space-y-4">
                                            {cart.saved_items.map((item) => (
                                                <SavedItemCard key={item.id} item={item} loading={loading === item.id} onMoveToCart={moveToCart} onRemove={removeItem} getProductImage={getProductImage} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-sm p-6 sticky top-28">
                                    <h2 className="font-serif text-xl text-terra-900 mb-4">Ringkasan Pesanan</h2>
                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-terra-600">
                                            <span>Subtotal ({cart.items_count} item)</span>
                                            <span>{cart.subtotal_formatted}</span>
                                        </div>
                                        <div className="flex justify-between text-terra-500 text-sm">
                                            <span>Ongkos Kirim</span>
                                            <span>Dihitung saat checkout</span>
                                        </div>
                                    </div>
                                    <div className="border-t border-terra-100 pt-4 mb-6">
                                        <div className="flex justify-between">
                                            <span className="font-medium text-terra-900">Total</span>
                                            <span className="font-serif text-2xl text-terra-900">{cart.subtotal_formatted}</span>
                                        </div>
                                    </div>
                                    <Link href="/shop/checkout" className="block w-full bg-terra-900 text-white text-center py-4 rounded-full font-medium hover:bg-terra-800 transition-colors">
                                        Lanjut ke Checkout
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            </ShopLayout>
        </>
    );
}

interface CartItemCardProps {
    item: CartItem;
    loading: boolean;
    onUpdateQuantity: (id: number, qty: number) => void;
    onRemove: (id: number) => void;
    onSaveForLater: (id: number) => void;
    getProductImage: (product: Product) => string;
}

function CartItemCard({ item, loading, onUpdateQuantity, onRemove, onSaveForLater, getProductImage }: CartItemCardProps) {
    return (
        <div className={`bg-white rounded-sm p-4 flex gap-4 ${loading ? 'opacity-50' : ''}`}>
            <Link href={`/shop/products/${item.product.slug}`} className="w-24 h-24 bg-terra-100 rounded-sm overflow-hidden flex-shrink-0">
                <img src={getProductImage(item.product)} alt={item.product.name} className="w-full h-full object-cover" />
            </Link>
            <div className="flex-1 min-w-0">
                <Link href={`/shop/products/${item.product.slug}`} className="font-medium text-terra-900 hover:text-wood transition-colors line-clamp-2">
                    {item.product.name}
                </Link>
                <div className="mt-1">
                    {item.product.has_discount ? (
                        <div className="flex items-center gap-2">
                            <span className="text-terra-900 font-medium">{item.product.final_price_formatted}</span>
                            <span className="text-terra-400 text-sm line-through">{item.product.price_formatted}</span>
                        </div>
                    ) : (
                        <span className="text-terra-900 font-medium">{item.unit_price_formatted}</span>
                    )}
                </div>
                <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center border border-terra-200 rounded-lg text-terra-900">
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} disabled={loading || item.quantity <= 1} className="p-2 hover:bg-terra-50 disabled:opacity-50">
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 text-terra-900">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} disabled={loading} className="p-2 hover:bg-terra-50 disabled:opacity-50">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    <button onClick={() => onSaveForLater(item.id)} disabled={loading} className="text-terra-500 hover:text-wood text-sm flex items-center gap-1">
                        <Bookmark className="w-4 h-4" /> Simpan
                    </button>
                    <button onClick={() => onRemove(item.id)} disabled={loading} className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1">
                        <Trash2 className="w-4 h-4" /> Hapus
                    </button>
                </div>
            </div>
            <div className="text-right">
                <span className="font-serif text-lg text-terra-900">{item.subtotal_formatted}</span>
            </div>
        </div>
    );
}

interface SavedItemCardProps {
    item: CartItem;
    loading: boolean;
    onMoveToCart: (id: number) => void;
    onRemove: (id: number) => void;
    getProductImage: (product: Product) => string;
}

function SavedItemCard({ item, loading, onMoveToCart, onRemove, getProductImage }: SavedItemCardProps) {
    return (
        <div className={`bg-white rounded-sm p-4 flex gap-4 ${loading ? 'opacity-50' : ''}`}>
            <Link href={`/shop/products/${item.product.slug}`} className="w-20 h-20 bg-terra-100 rounded-sm overflow-hidden flex-shrink-0">
                <img src={getProductImage(item.product)} alt={item.product.name} className="w-full h-full object-cover" />
            </Link>
            <div className="flex-1 min-w-0">
                <Link href={`/shop/products/${item.product.slug}`} className="font-medium text-terra-900 hover:text-wood transition-colors line-clamp-1">
                    {item.product.name}
                </Link>
                <span className="text-terra-600">{item.unit_price_formatted}</span>
                <div className="flex items-center gap-4 mt-2">
                    <button onClick={() => onMoveToCart(item.id)} disabled={loading} className="text-wood hover:text-terra-900 text-sm flex items-center gap-1">
                        <ShoppingCart className="w-4 h-4" /> Pindah ke Keranjang
                    </button>
                    <button onClick={() => onRemove(item.id)} disabled={loading} className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1">
                        <Trash2 className="w-4 h-4" /> Hapus
                    </button>
                </div>
            </div>
        </div>
    );
}

