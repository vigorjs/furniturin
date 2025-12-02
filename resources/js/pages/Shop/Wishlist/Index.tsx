import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Header, Footer } from '@/components/shop';
import { ApiProduct } from '@/types/shop';
import { useState } from 'react';

interface Props {
    products: ApiProduct[];
}

export default function WishlistIndex({ products: initialProducts }: Props) {
    const [products, setProducts] = useState(initialProducts);
    const [removingId, setRemovingId] = useState<number | null>(null);

    const handleRemove = async (productId: number) => {
        setRemovingId(productId);
        try {
            await fetch(`/shop/wishlist/${productId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Accept': 'application/json',
                },
            });
            setProducts(products.filter(p => p.id !== productId));
        } catch (error) {
            console.error('Failed to remove from wishlist:', error);
        } finally {
            setRemovingId(null);
        }
    };

    return (
        <>
            <Head title="Wishlist - Latif Living" />
            <div className="bg-noise" />
            <Header cartCount={0} onCartClick={() => {}} onLogoClick={() => router.visit('/shop')} />

            <main className="min-h-screen bg-white pt-28 pb-20">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h1 className="font-serif text-3xl md:text-4xl text-terra-900 mb-2">Wishlist Saya</h1>
                            <p className="text-terra-500">{products.length} produk tersimpan</p>
                        </div>
                        <Link href="/shop/products" className="flex items-center gap-2 text-wood hover:text-terra-900 transition-colors">
                            <span>Lanjut Belanja</span>
                            <ArrowRight size={18} />
                        </Link>
                    </div>

                    {/* Products Grid */}
                    {products.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            <AnimatePresence>
                                {products.map((product) => (
                                    <WishlistCard
                                        key={product.id}
                                        product={product}
                                        onRemove={() => handleRemove(product.id)}
                                        isRemoving={removingId === product.id}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <EmptyState />
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}

interface WishlistCardProps {
    product: ApiProduct;
    onRemove: () => void;
    isRemoving: boolean;
}

function WishlistCard({ product, onRemove, isRemoving }: WishlistCardProps) {
    const imageUrl = product.primary_image?.image_url || product.images?.[0]?.image_url || 'https://via.placeholder.com/400';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group relative bg-white rounded-2xl overflow-hidden border border-terra-100 hover:border-terra-200 transition-colors"
        >
            {/* Image */}
            <Link href={`/shop/products/${product.slug}`} className="block aspect-square overflow-hidden bg-sand-50">
                <img src={imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </Link>

            {/* Remove Button */}
            <button
                onClick={onRemove}
                disabled={isRemoving}
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-terra-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
                {isRemoving ? (
                    <div className="w-5 h-5 border-2 border-terra-300 border-t-transparent rounded-full animate-spin" />
                ) : (
                    <Trash2 size={18} />
                )}
            </button>

            {/* Discount Badge */}
            {product.has_discount && (
                <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    -{product.discount_percentage}%
                </span>
            )}

            {/* Content */}
            <div className="p-4">
                {product.category && (
                    <span className="text-xs text-terra-400 uppercase tracking-wider">{product.category.name}</span>
                )}
                <Link href={`/shop/products/${product.slug}`}>
                    <h3 className="font-medium text-terra-900 mt-1 line-clamp-2 group-hover:text-wood transition-colors">
                        {product.name}
                    </h3>
                </Link>
                <div className="flex items-center gap-2 mt-2">
                    <span className="font-semibold text-terra-900">{product.final_price_formatted}</span>
                    {product.has_discount && (
                        <span className="text-sm text-terra-400 line-through">{product.price_formatted}</span>
                    )}
                </div>

                {/* Stock Status */}
                <div className="mt-3 flex items-center justify-between">
                    {product.is_in_stock ? (
                        <span className="text-xs text-green-600">Stok Tersedia</span>
                    ) : (
                        <span className="text-xs text-red-500">Stok Habis</span>
                    )}
                    <button
                        disabled={!product.is_in_stock}
                        className="p-2 bg-terra-900 text-white rounded-full hover:bg-wood transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ShoppingBag size={16} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

function EmptyState() {
    return (
        <div className="text-center py-20">
            <div className="w-20 h-20 bg-sand-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart size={32} className="text-terra-300" />
            </div>
            <h3 className="text-xl font-medium text-terra-900 mb-2">Wishlist Anda Kosong</h3>
            <p className="text-terra-500 mb-8 max-w-md mx-auto">
                Simpan produk favorit Anda untuk memudahkan belanja nanti
            </p>
            <Link href="/shop/products" className="inline-flex items-center gap-2 bg-terra-900 text-white px-6 py-3 rounded-full hover:bg-wood transition-colors">
                <span>Jelajahi Produk</span>
                <ArrowRight size={18} />
            </Link>
        </div>
    );
}

