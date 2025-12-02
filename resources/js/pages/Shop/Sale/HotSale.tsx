import { Head, Link, router } from '@inertiajs/react';
import { Flame, Filter, ChevronDown, Star } from 'lucide-react';
import { useState } from 'react';
import { Header, Footer } from '@/components/shop';
import { ApiProduct, ApiCategory, PaginatedResponse } from '@/types/shop';

interface Props {
    products: PaginatedResponse<ApiProduct>;
    categories: ApiCategory[];
    filters: { filter?: Record<string, string>; sort?: string };
}

export default function HotSale({ products, categories, filters }: Props) {
    const [showFilters, setShowFilters] = useState(false);

    const handleSort = (sort: string) => {
        router.get('/shop/hot-sale', { ...filters, sort }, { preserveState: true });
    };

    const handleCategoryFilter = (categoryId: number | null) => {
        const newFilters = { ...filters.filter };
        if (categoryId) {
            newFilters.category_id = String(categoryId);
        } else {
            delete newFilters.category_id;
        }
        router.get('/shop/hot-sale', { filter: newFilters, sort: filters.sort }, { preserveState: true });
    };

    return (
        <>
            <Head title="Hot Sale - Latif Living" />
            <div className="bg-noise" />
            <Header cartCount={0} onCartClick={() => {}} onLogoClick={() => router.visit('/shop')} />

            <main className="min-h-screen bg-sand-50 pt-28 pb-20">
                {/* Hero Banner */}
                <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-16 mb-12">
                    <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Flame size={40} className="animate-pulse" />
                            <h1 className="font-serif text-4xl md:text-5xl font-bold">HOT SALE</h1>
                            <Flame size={40} className="animate-pulse" />
                        </div>
                        <p className="text-xl opacity-90">Diskon hingga 70% untuk produk pilihan!</p>
                        <p className="text-sm mt-2 opacity-75">Penawaran terbatas, buruan sebelum kehabisan!</p>
                    </div>
                </div>

                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                    {/* Filters Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-terra-200 hover:border-terra-400">
                                <Filter size={18} /><span>Filter</span><ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>
                            <span className="text-terra-500">{products.meta.total} produk</span>
                        </div>
                        <select value={filters.sort || ''} onChange={(e) => handleSort(e.target.value)} className="px-4 py-2 bg-white rounded-full border border-terra-200 outline-none">
                            <option value="">Urutkan</option>
                            <option value="-discount_percentage">Diskon Terbesar</option>
                            <option value="-sold_count">Terlaris</option>
                            <option value="price">Harga Terendah</option>
                            <option value="-price">Harga Tertinggi</option>
                        </select>
                    </div>

                    {/* Category Filter */}
                    {showFilters && (
                        <div className="bg-white rounded-2xl p-6 mb-8">
                            <h3 className="font-medium text-terra-900 mb-4">Kategori</h3>
                            <div className="flex flex-wrap gap-2">
                                <button onClick={() => handleCategoryFilter(null)} className={`px-4 py-2 rounded-full text-sm ${!filters.filter?.category_id ? 'bg-terra-900 text-white' : 'bg-terra-100 text-terra-700 hover:bg-terra-200'}`}>
                                    Semua
                                </button>
                                {categories.map((cat) => (
                                    <button key={cat.id} onClick={() => handleCategoryFilter(cat.id)} className={`px-4 py-2 rounded-full text-sm ${filters.filter?.category_id === String(cat.id) ? 'bg-terra-900 text-white' : 'bg-terra-100 text-terra-700 hover:bg-terra-200'}`}>
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Products Grid */}
                    {products.data.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.data.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl">
                            <Flame size={48} className="mx-auto text-terra-300 mb-4" />
                            <h3 className="text-xl font-medium text-terra-900 mb-2">Belum Ada Produk Hot Sale</h3>
                            <p className="text-terra-500 mb-6">Nantikan penawaran menarik dari kami!</p>
                            <Link href="/shop/products" className="inline-flex items-center gap-2 bg-terra-900 text-white px-6 py-3 rounded-full hover:bg-wood">
                                Lihat Semua Produk
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {products.meta.last_page > 1 && (
                        <div className="flex justify-center gap-2 mt-12">
                            {products.meta.links.map((link, idx) => (
                                <Link key={idx} href={link.url || '#'} className={`px-4 py-2 rounded-lg text-sm ${link.active ? 'bg-terra-900 text-white' : link.url ? 'bg-white text-terra-700 hover:bg-terra-100' : 'bg-terra-100 text-terra-400 cursor-not-allowed'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}

function ProductCard({ product }: { product: ApiProduct }) {
    const imageUrl = product.primary_image?.image_url || product.images?.[0]?.image_url || 'https://via.placeholder.com/400';
    return (
        <Link href={`/shop/products/${product.slug}`} className="group bg-white rounded-2xl overflow-hidden border border-terra-100 hover:shadow-lg transition-all">
            <div className="relative aspect-square overflow-hidden">
                <img src={imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {product.has_discount && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">-{product.discount_percentage}%</span>
                )}
                <span className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Flame size={14} />HOT
                </span>
            </div>
            <div className="p-4">
                <h3 className="font-medium text-terra-900 group-hover:text-wood transition-colors line-clamp-2 mb-2">{product.name}</h3>
                <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (<Star key={s} size={14} className={s <= Math.round(product.average_rating) ? 'fill-yellow-400 text-yellow-400' : 'text-terra-200'} />))}
                    <span className="text-xs text-terra-500 ml-1">({product.review_count})</span>
                </div>
                <div className="flex items-end gap-2">
                    <span className="text-lg font-bold text-red-600">{product.final_price_formatted}</span>
                    {product.has_discount && <span className="text-sm text-terra-400 line-through">{product.price_formatted}</span>}
                </div>
            </div>
        </Link>
    );
}

