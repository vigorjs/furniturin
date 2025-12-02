import { useState, useEffect, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Search, SlidersHorizontal, Grid3X3, LayoutList, X,
    Star, ShoppingBag, Heart, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Header, Footer } from '@/components/shop';
import { ApiProduct, ApiCategory, PaginatedResponse, ProductFilters } from '@/types/shop';

interface Props {
    products: PaginatedResponse<ApiProduct>;
    categories: ApiCategory[];
    currentCategory?: ApiCategory;
    filters: ProductFilters;
}

const SORT_OPTIONS = [
    { value: '-created_at', label: 'Terbaru' },
    { value: 'price', label: 'Harga: Rendah ke Tinggi' },
    { value: '-price', label: 'Harga: Tinggi ke Rendah' },
    { value: '-sold_count', label: 'Terlaris' },
    { value: '-average_rating', label: 'Rating Tertinggi' },
];

const PRICE_RANGES = [
    { min: 0, max: 1000000, label: 'Di bawah Rp 1 Juta' },
    { min: 1000000, max: 5000000, label: 'Rp 1 - 5 Juta' },
    { min: 5000000, max: 10000000, label: 'Rp 5 - 10 Juta' },
    { min: 10000000, max: 50000000, label: 'Rp 10 - 50 Juta' },
    { min: 50000000, max: null, label: 'Di atas Rp 50 Juta' },
];

export default function ProductsIndex({ products, categories, currentCategory, filters }: Props) {
    const safeFilters = Array.isArray(filters) ? {} : filters;

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState(safeFilters.filter?.name || '');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        safeFilters.filter?.category_id || currentCategory?.id || null
    );
    const [selectedSort, setSelectedSort] = useState(safeFilters.sort || '-created_at');
    const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({
        min: safeFilters.filter?.price_min,
        max: safeFilters.filter?.price_max,
    });

    const applyFilters = useCallback(() => {
        const params: Record<string, string> = {};

        if (searchQuery) params['filter[name]'] = searchQuery;
        if (selectedCategory) params['filter[category_id]'] = String(selectedCategory);
        if (priceRange.min) params['filter[price_min]'] = String(priceRange.min);
        if (priceRange.max) params['filter[price_max]'] = String(priceRange.max);
        if (selectedSort) params['sort'] = selectedSort;

        router.get('/shop/products', params, { preserveState: true, preserveScroll: true });
    }, [searchQuery, selectedCategory, priceRange, selectedSort]);

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory(null);
        setPriceRange({});
        setSelectedSort('-created_at');
        router.get('/shop/products', {}, { preserveState: true });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery !== (safeFilters.filter?.name || '')) {
                applyFilters();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, applyFilters, safeFilters.filter?.name]);

    const hasActiveFilters = searchQuery || selectedCategory || priceRange.min || priceRange.max;

    return (
        <>
            <Head title={currentCategory ? `${currentCategory.name} - Latif Living` : 'Produk - Latif Living'} />
            <div className="bg-noise" />
            <Header cartCount={0} onCartClick={() => {}} onLogoClick={() => router.visit('/shop')} />

            <main className="min-h-screen bg-white pt-28 pb-20">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-terra-500 mb-8">
                        <Link href="/shop" className="hover:text-terra-900">Beranda</Link>
                        <span>/</span>
                        <span className="text-terra-900">
                            {currentCategory ? currentCategory.name : 'Semua Produk'}
                        </span>
                    </nav>

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <div>
                            <h1 className="font-serif text-4xl md:text-5xl text-terra-900">
                                {currentCategory ? currentCategory.name : 'Semua Produk'}
                            </h1>
                            <p className="text-terra-500 mt-2">
                                {products.meta.total} produk ditemukan
                            </p>
                        </div>

                        {/* Search & Filter Toggle */}
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1 md:w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-terra-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Cari produk..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-terra-200 rounded-full focus:outline-none focus:border-wood transition-colors"
                                />
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`p-3 rounded-full border transition-colors ${showFilters ? 'bg-terra-900 text-white border-terra-900' : 'border-terra-200 hover:border-terra-900'}`}
                            >
                                <SlidersHorizontal size={20} />
                            </button>
                            <div className="hidden md:flex items-center gap-2 border border-terra-200 rounded-full p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-terra-900 text-white' : ''}`}
                                >
                                    <Grid3X3 size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-full transition-colors ${viewMode === 'list' ? 'bg-terra-900 text-white' : ''}`}
                                >
                                    <LayoutList size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-8">
                        {/* Sidebar Filters */}
                        {showFilters && (
                            <FilterSidebar
                                categories={categories}
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                                priceRange={priceRange}
                                setPriceRange={setPriceRange}
                                selectedSort={selectedSort}
                                setSelectedSort={setSelectedSort}
                                onApply={applyFilters}
                                onClear={clearFilters}
                                hasActiveFilters={!!hasActiveFilters}
                            />
                        )}

                        {/* Products Grid */}
                        <div className="flex-1">
                            <ProductGrid products={products.data} viewMode={viewMode} />
                            <Pagination meta={products.meta} />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}

// ==================== Filter Sidebar ====================
interface FilterSidebarProps {
    categories: ApiCategory[];
    selectedCategory: number | null;
    setSelectedCategory: (id: number | null) => void;
    priceRange: { min?: number; max?: number };
    setPriceRange: (range: { min?: number; max?: number }) => void;
    selectedSort: string;
    setSelectedSort: (sort: string) => void;
    onApply: () => void;
    onClear: () => void;
    hasActiveFilters: boolean;
}

function FilterSidebar({
    categories, selectedCategory, setSelectedCategory,
    priceRange, setPriceRange, selectedSort, setSelectedSort,
    onApply, onClear, hasActiveFilters
}: FilterSidebarProps) {
    return (
        <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-72 flex-shrink-0"
        >
            <div className="sticky top-28 space-y-8">
                {/* Sort */}
                <div>
                    <h3 className="font-medium text-terra-900 mb-4">Urutkan</h3>
                    <select
                        value={selectedSort}
                        onChange={(e) => { setSelectedSort(e.target.value); }}
                        className="w-full p-3 border border-terra-200 rounded-xl focus:outline-none focus:border-wood"
                    >
                        {SORT_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                {/* Categories */}
                <div>
                    <h3 className="font-medium text-terra-900 mb-4">Kategori</h3>
                    <div className="space-y-2">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${!selectedCategory ? 'bg-terra-900 text-white' : 'hover:bg-terra-100'}`}
                        >
                            Semua Kategori
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${selectedCategory === cat.id ? 'bg-terra-900 text-white' : 'hover:bg-terra-100'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div>
                    <h3 className="font-medium text-terra-900 mb-4">Rentang Harga</h3>
                    <div className="space-y-2">
                        {PRICE_RANGES.map((range, i) => (
                            <button
                                key={i}
                                onClick={() => setPriceRange({ min: range.min, max: range.max ?? undefined })}
                                className={`w-full text-left px-4 py-2 rounded-lg transition-colors text-sm ${
                                    priceRange.min === range.min && priceRange.max === (range.max ?? undefined)
                                        ? 'bg-terra-900 text-white'
                                        : 'hover:bg-terra-100'
                                }`}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onApply}
                        className="flex-1 bg-terra-900 text-white py-3 rounded-full font-medium hover:bg-wood transition-colors"
                    >
                        Terapkan
                    </button>
                    {hasActiveFilters && (
                        <button
                            onClick={onClear}
                            className="px-4 py-3 border border-terra-200 rounded-full hover:border-terra-900 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>
        </motion.aside>
    );
}


// ==================== Product Grid ====================
interface ProductGridProps {
    products: ApiProduct[];
    viewMode: 'grid' | 'list';
}

function ProductGrid({ products, viewMode }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="text-center py-20">
                <ShoppingBag className="mx-auto text-terra-300 mb-4" size={64} />
                <h3 className="text-xl font-medium text-terra-900 mb-2">Tidak ada produk ditemukan</h3>
                <p className="text-terra-500">Coba ubah filter atau kata kunci pencarian Anda</p>
            </div>
        );
    }

    return (
        <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-6'
        }>
            {products.map((product, index) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} index={index} />
            ))}
        </div>
    );
}

// ==================== Product Card ====================
interface ProductCardProps {
    product: ApiProduct;
    viewMode: 'grid' | 'list';
    index: number;
}

function ProductCard({ product, viewMode, index }: ProductCardProps) {
    const imageUrl = product.primary_image?.image_url
        || product.images?.[0]?.image_url
        || 'https://via.placeholder.com/400x400?text=No+Image';

    if (viewMode === 'list') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
            >
                <Link
                    href={`/shop/products/${product.slug}`}
                    className="flex gap-6 bg-white border border-terra-100 rounded-2xl p-4 hover:shadow-lg transition-shadow group"
                >
                    <div className="w-48 h-48 flex-shrink-0 rounded-xl overflow-hidden bg-sand-100">
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-2">
                        <div>
                            <p className="text-sm text-terra-500 mb-1">{product.category?.name}</p>
                            <h3 className="font-serif text-xl text-terra-900 mb-2">{product.name}</h3>
                            <p className="text-terra-600 text-sm line-clamp-2">{product.short_description}</p>
                            <div className="flex items-center gap-2 mt-3">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-medium">{Number(product.average_rating || 0).toFixed(1)}</span>
                                </div>
                                <span className="text-terra-300">•</span>
                                <span className="text-sm text-terra-500">{product.sold_count} terjual</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                {product.has_discount && (
                                    <p className="text-sm text-terra-400 line-through">{product.price_formatted}</p>
                                )}
                                <p className="text-xl font-semibold text-terra-900">{product.final_price_formatted}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-3 rounded-full border border-terra-200 hover:border-terra-900 transition-colors">
                                    <Heart size={18} />
                                </button>
                                <button className="p-3 rounded-full bg-terra-900 text-white hover:bg-wood transition-colors">
                                    <ShoppingBag size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </Link>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group"
        >
            <Link href={`/shop/products/${product.slug}`}>
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-sand-100 mb-4">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.has_discount && (
                        <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            -{product.discount_percentage}%
                        </span>
                    )}
                    {product.sale_type.value !== 'regular' && (
                        <span className="absolute top-4 right-4 bg-wood text-white px-3 py-1 rounded-full text-sm font-medium">
                            {product.sale_type.label}
                        </span>
                    )}
                    <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={(e) => { e.preventDefault(); }}
                            className="p-3 rounded-full bg-white/90 hover:bg-white transition-colors"
                        >
                            <Heart size={18} />
                        </button>
                        <button
                            onClick={(e) => { e.preventDefault(); }}
                            className="p-3 rounded-full bg-terra-900 text-white hover:bg-wood transition-colors"
                        >
                            <ShoppingBag size={18} />
                        </button>
                    </div>
                </div>
                <div>
                    <p className="text-sm text-terra-500 mb-1">{product.category?.name}</p>
                    <h3 className="font-serif text-lg text-terra-900 mb-2 group-hover:text-wood transition-colors">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{Number(product.average_rating || 0).toFixed(1)}</span>
                        </div>
                        <span className="text-terra-300">•</span>
                        <span className="text-sm text-terra-500">{product.sold_count} terjual</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {product.has_discount && (
                            <span className="text-sm text-terra-400 line-through">{product.price_formatted}</span>
                        )}
                        <span className="text-lg font-semibold text-terra-900">{product.final_price_formatted}</span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// ==================== Pagination ====================
interface PaginationProps {
    meta: {
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
}

function Pagination({ meta }: PaginationProps) {
    if (meta.last_page <= 1) return null;

    const pages: (number | string)[] = [];
    const current = meta.current_page;
    const last = meta.last_page;

    // Build page numbers array
    if (last <= 7) {
        for (let i = 1; i <= last; i++) pages.push(i);
    } else {
        if (current <= 3) {
            pages.push(1, 2, 3, 4, '...', last);
        } else if (current >= last - 2) {
            pages.push(1, '...', last - 3, last - 2, last - 1, last);
        } else {
            pages.push(1, '...', current - 1, current, current + 1, '...', last);
        }
    }

    const goToPage = (page: number) => {
        router.get(window.location.pathname, { ...Object.fromEntries(new URLSearchParams(window.location.search)), page }, { preserveState: true });
    };

    return (
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-terra-100">
            <p className="text-sm text-terra-500">
                Menampilkan {meta.from}-{meta.to} dari {meta.total} produk
            </p>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => goToPage(current - 1)}
                    disabled={current === 1}
                    className="p-2 rounded-lg border border-terra-200 hover:border-terra-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft size={18} />
                </button>
                {pages.map((page, i) => (
                    typeof page === 'number' ? (
                        <button
                            key={i}
                            onClick={() => goToPage(page)}
                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                page === current
                                    ? 'bg-terra-900 text-white'
                                    : 'border border-terra-200 hover:border-terra-900'
                            }`}
                        >
                            {page}
                        </button>
                    ) : (
                        <span key={i} className="px-2 text-terra-400">...</span>
                    )
                ))}
                <button
                    onClick={() => goToPage(current + 1)}
                    disabled={current === last}
                    className="p-2 rounded-lg border border-terra-200 hover:border-terra-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}

