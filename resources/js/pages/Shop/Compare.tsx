import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { GitCompare, Star, ShoppingBag, X, ArrowLeft, Check, Minus, Loader2 } from 'lucide-react';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SEOHead } from '@/components/seo';
import { ApiProduct } from '@/types/shop';
import { SiteSettings } from '@/types';

interface Props {
    products: ApiProduct[];
}

export default function Compare({ products }: Props) {
    const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
    const siteName = siteSettings?.site_name || 'Latif Living';
    const [addingToCart, setAddingToCart] = useState<number | null>(null);
    const [cartSuccess, setCartSuccess] = useState<number | null>(null);

    const handleRemove = (productId: number) => {
        const newIds = products.filter(p => p.id !== productId).map(p => p.id).join(',');
        if (newIds) {
            router.get(`/shop/compare?ids=${newIds}`);
        } else {
            router.visit('/shop/products');
        }
    };

    const handleAddToCart = async (productId: number) => {
        setAddingToCart(productId);

        router.post('/shop/cart', { product_id: productId, quantity: 1 }, {
            preserveScroll: true,
            only: ['cart'],
            onSuccess: () => {
                setCartSuccess(productId);
                setTimeout(() => setCartSuccess(null), 1500);
            },
            onError: (errors) => {
                console.error('Error adding to cart:', errors);
            },
            onFinish: () => {
                setAddingToCart(null);
            },
        });
    };

    // Collect all unique specs from products
    const allSpecs = new Set<string>();
    products.forEach(p => {
        if (p.specifications) {
            Object.keys(p.specifications).forEach(key => allSpecs.add(key));
        }
    });

    return (
        <>
            <SEOHead
                title="Bandingkan Produk"
                description={`Bandingkan spesifikasi dan harga produk furnitur di ${siteName}. Pilih produk terbaik sesuai kebutuhan Anda.`}
                noindex={true}
            />
            <div className="bg-noise" />
            <ShopLayout>
            <main className="min-h-screen bg-sand-50 pt-28 pb-20">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/shop/products" className="p-2 hover:bg-terra-100 rounded-full transition-colors">
                            <ArrowLeft size={24} />
                        </Link>
                        <div>
                            <h1 className="font-serif text-3xl text-terra-900 flex items-center gap-3">
                                <GitCompare size={32} className="text-wood" />
                                Bandingkan Produk
                            </h1>
                            <p className="text-terra-500 mt-1">{products.length} produk dipilih</p>
                        </div>
                    </div>

                    {products.length < 2 ? (
                        <div className="text-center py-20 bg-white rounded-sm">
                            <GitCompare size={48} className="mx-auto text-terra-300 mb-4" />
                            <h3 className="text-xl font-medium text-terra-900 mb-2">Pilih minimal 2 produk</h3>
                            <p className="text-terra-500 mb-6">Tambahkan produk untuk membandingkan</p>
                            <Link href="/shop/products" className="inline-flex items-center gap-2 bg-terra-900 text-white px-6 py-3 rounded-full hover:bg-wood-dark">
                                Lihat Produk
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white rounded-sm overflow-hidden border border-terra-100">
                            {/* Product Images & Names */}
                            <div className="grid" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
                                <div className="p-4 bg-terra-50 font-medium text-terra-700">Produk</div>
                                {products.map((product) => (
                                    <div key={product.id} className="p-4 border-l border-terra-100 relative">
                                        <button onClick={() => handleRemove(product.id)} className="absolute top-2 right-2 w-8 h-8 bg-terra-100 hover:bg-red-100 text-terra-600 hover:text-red-500 rounded-full flex items-center justify-center transition-colors">
                                            <X size={16} />
                                        </button>
                                        <div className="aspect-square rounded-sm overflow-hidden mb-3 bg-sand-50">
                                            <img src={product.primary_image?.image_url || product.images?.[0]?.image_url || '/images/placeholder-product.svg'} alt={product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <Link href={`/shop/products/${product.slug}`} className="font-medium text-terra-900 hover:text-wood line-clamp-2">{product.name}</Link>
                                        <p className="text-sm text-terra-500 mt-1">{product.category?.name}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Price */}
                            <CompareRow label="Harga" products={products} render={(p) => (
                                <div>
                                    <span className="text-xl font-bold text-terra-900">{p.final_price_formatted}</span>
                                    {p.has_discount && <span className="text-sm text-terra-400 line-through ml-2">{p.price_formatted}</span>}
                                </div>
                            )} />

                            {/* Rating */}
                            <CompareRow label="Rating" products={products} render={(p) => (
                                <div className="flex items-center gap-2">
                                    <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} size={16} className={s <= Math.round(p.average_rating) ? 'fill-yellow-400 text-yellow-400' : 'text-terra-200'} />)}</div>
                                    <span className="text-sm text-terra-500">({p.review_count})</span>
                                </div>
                            )} />

                            {/* Stock */}
                            <CompareRow label="Stok" products={products} render={(p) => (
                                <span className={`px-3 py-1 rounded-full text-sm ${p.is_in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {p.is_in_stock ? `Tersedia (${p.stock_quantity})` : 'Habis'}
                                </span>
                            )} />

                            {/* Specifications */}
                            {Array.from(allSpecs).map((spec) => (
                                <CompareRow key={spec} label={spec} products={products} render={(p) => {
                                    const value = p.specifications?.[spec];
                                    if (value === 'true' || value === 'yes' || value === 'Ya') return <Check size={20} className="text-green-500" />;
                                    if (value === 'false' || value === 'no' || value === 'Tidak' || !value) return <Minus size={20} className="text-terra-300" />;
                                    return <span className="text-terra-700">{value}</span>;
                                }} />
                            ))}

                            {/* Add to Cart */}
                            <div className="grid border-t border-terra-100" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
                                <div className="p-4 bg-terra-50"></div>
                                {products.map((product) => (
                                    <div key={product.id} className="p-4 border-l border-terra-100">
                                        <button
                                            onClick={() => handleAddToCart(product.id)}
                                            disabled={!product.is_in_stock || addingToCart === product.id || cartSuccess === product.id}
                                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-full transition-colors disabled:cursor-not-allowed ${
                                                cartSuccess === product.id
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-terra-900 text-white hover:bg-wood-dark disabled:opacity-50'
                                            }`}
                                        >
                                            {cartSuccess === product.id ? (
                                                <>
                                                    <Check size={18} />
                                                    Ditambahkan!
                                                </>
                                            ) : addingToCart === product.id ? (
                                                <>
                                                    <Loader2 size={18} className="animate-spin" />
                                                    Menambahkan...
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingBag size={18} />
                                                    Tambah ke Keranjang
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            </ShopLayout>
        </>
    );
}

function CompareRow({ label, products, render }: { label: string; products: ApiProduct[]; render: (p: ApiProduct) => React.ReactNode }) {
    return (
        <div className="grid border-t border-terra-100" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
            <div className="p-4 bg-terra-50 font-medium text-terra-700">{label}</div>
            {products.map((product) => (
                <div key={product.id} className="p-4 border-l border-terra-100">{render(product)}</div>
            ))}
        </div>
    );
}

