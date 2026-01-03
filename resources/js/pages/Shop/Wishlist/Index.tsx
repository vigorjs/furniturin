import { SEOHead } from '@/components/seo';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { ApiProduct } from '@/types/shop';
import { Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
    products: ApiProduct[];
}

export default function WishlistIndex({ products: initialProducts }: Props) {
    const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
    const siteName = siteSettings?.site_name || 'Latif Living';
    const [products, setProducts] = useState(initialProducts);
    const [removingId, setRemovingId] = useState<number | null>(null);

    const handleRemove = async (productId: number) => {
        setRemovingId(productId);

        router.delete(`/shop/wishlist/${productId}`, {
            preserveScroll: true,
            onSuccess: () => {
                setProducts(products.filter((p) => p.id !== productId));
            },
            onError: (error) => {
                console.error('Failed to remove from wishlist:', error);
            },
            onFinish: () => {
                setRemovingId(null);
            },
        });
    };

    return (
        <>
            <SEOHead
                title="Wishlist Saya"
                description={`Daftar produk favorit Anda di ${siteName}. Simpan produk yang Anda sukai dan beli kapan saja.`}
                noindex={true}
            />
            <div className="bg-noise" />
            <ShopLayout>
                <main className="min-h-screen bg-white pt-20 pb-20">
                    <div className="mx-auto max-w-[1400px] px-6 pt-8 md:px-12">
                        {/* Header */}
                        <div className="mb-12 flex items-center justify-between">
                            <div>
                                <h1 className="mb-2 font-serif text-3xl font-medium text-terra-900 md:text-4xl">
                                    Wishlist Saya
                                </h1>
                                <p className="text-terra-500">
                                    {products.length} produk tersimpan
                                </p>
                            </div>
                            <Link
                                href="/shop/products"
                                className="flex items-center gap-2 text-wood transition-colors hover:text-terra-900"
                            >
                                <span>Lanjut Belanja</span>
                                <ArrowRight size={18} />
                            </Link>
                        </div>

                        {/* Products Grid */}
                        {products.length > 0 ? (
                            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                                <AnimatePresence>
                                    {products.map((product) => (
                                        <WishlistCard
                                            key={product.id}
                                            product={product}
                                            onRemove={() =>
                                                handleRemove(product.id)
                                            }
                                            isRemoving={
                                                removingId === product.id
                                            }
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <EmptyState />
                        )}
                    </div>
                </main>
            </ShopLayout>
        </>
    );
}

interface WishlistCardProps {
    product: ApiProduct;
    onRemove: () => void;
    isRemoving: boolean;
}

function WishlistCard({ product, onRemove, isRemoving }: WishlistCardProps) {
    const imageUrl =
        product.primary_image?.image_url ||
        product.images?.[0]?.image_url ||
        '/images/placeholder-product.svg';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group relative overflow-hidden rounded-2xl border border-terra-100 bg-white transition-colors hover:border-terra-200"
        >
            {/* Image */}
            <Link
                href={`/shop/products/${product.slug}`}
                className="block aspect-square overflow-hidden bg-sand-50"
            >
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </Link>

            {/* Remove Button */}
            <button
                onClick={onRemove}
                disabled={isRemoving}
                className="absolute top-3 right-3 rounded-full bg-white/90 p-2 text-terra-600 backdrop-blur-sm transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
            >
                {isRemoving ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-terra-300 border-t-transparent" />
                ) : (
                    <Trash2 size={18} />
                )}
            </button>

            {/* Discount Badge */}
            {product.has_discount && (
                <span className="absolute top-3 left-3 rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white">
                    -{product.discount_percentage}%
                </span>
            )}

            {/* Content */}
            <div className="p-4">
                {product.category && (
                    <span className="text-xs tracking-wider text-terra-400 uppercase">
                        {product.category.name}
                    </span>
                )}
                <Link href={`/shop/products/${product.slug}`}>
                    <h3 className="mt-1 line-clamp-2 font-medium text-terra-900 transition-colors group-hover:text-wood">
                        {product.name}
                    </h3>
                </Link>
                <div className="mt-2 flex items-center gap-2">
                    <span className="font-semibold text-terra-900">
                        {product.final_price_formatted}
                    </span>
                    {product.has_discount && (
                        <span className="text-sm text-terra-400 line-through">
                            {product.price_formatted}
                        </span>
                    )}
                </div>

                {/* Stock Status */}
                <div className="mt-3 flex items-center justify-between">
                    {product.is_in_stock ? (
                        <span className="text-xs text-green-600">
                            Stok Tersedia
                        </span>
                    ) : (
                        <span className="text-xs text-red-500">Stok Habis</span>
                    )}
                    <button
                        disabled={!product.is_in_stock}
                        className="rounded-full bg-terra-900 p-2 text-white transition-colors hover:bg-wood disabled:cursor-not-allowed disabled:opacity-50"
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
        <div className="py-20 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sand-100">
                <Heart size={32} className="text-terra-300" />
            </div>
            <h3 className="mb-2 text-xl font-medium text-terra-900">
                Wishlist Anda Kosong
            </h3>
            <p className="mx-auto mb-8 max-w-md text-terra-500">
                Simpan produk favorit Anda untuk memudahkan belanja nanti
            </p>
            <Link
                href="/shop/products"
                className="inline-flex items-center gap-2 rounded-full bg-terra-900 px-6 py-3 text-white transition-colors hover:bg-wood"
            >
                <span>Jelajahi Produk</span>
                <ArrowRight size={18} />
            </Link>
        </div>
    );
}
