import { BreadcrumbStructuredData, SEOHead } from '@/components/seo';
import { QuickViewModal } from '@/components/shop';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import {
    ApiCategory,
    ApiProduct,
    PaginatedResponse,
    ProductFilters,
} from '@/types/shop';
import { Link, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Eye,
    Grid3X3,
    Heart,
    LayoutList,
    Search,
    ShoppingBag,
    SlidersHorizontal,
    Star,
    X,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

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

export default function ProductsIndex({
    products,
    categories,
    currentCategory,
    filters,
}: Props) {
    const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
    const siteName = siteSettings?.site_name || 'Latif Living';
    const safeFilters = Array.isArray(filters) ? {} : filters;

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState(
        safeFilters.filter?.name || '',
    );
    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        safeFilters.filter?.category_id || currentCategory?.id || null,
    );
    const [selectedSort, setSelectedSort] = useState(
        safeFilters.sort || '-created_at',
    );
    const [priceRange, setPriceRange] = useState<{
        min?: number;
        max?: number;
    }>({
        min: safeFilters.filter?.price_min,
        max: safeFilters.filter?.price_max,
    });
    const [quickViewProduct, setQuickViewProduct] = useState<ApiProduct | null>(
        null,
    );

    const applyFilters = useCallback(() => {
        const params: Record<string, string> = {};

        if (searchQuery) params['filter[name]'] = searchQuery;
        if (selectedCategory)
            params['filter[category_id]'] = String(selectedCategory);
        if (priceRange.min)
            params['filter[price_min]'] = String(priceRange.min);
        if (priceRange.max)
            params['filter[price_max]'] = String(priceRange.max);
        if (selectedSort) params['sort'] = selectedSort;

        router.get('/shop/products', params, {
            preserveState: true,
            preserveScroll: true,
        });
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

    const hasActiveFilters =
        searchQuery || selectedCategory || priceRange.min || priceRange.max;

    // SEO Data
    const pageTitle = currentCategory ? currentCategory.name : 'Semua Produk';
    const pageDescription = currentCategory
        ? `Koleksi ${currentCategory.name} berkualitas tinggi di ${siteName}. Temukan berbagai pilihan ${currentCategory.name?.toLowerCase() || ''} dengan harga terbaik.`
        : `Jelajahi koleksi lengkap furnitur berkualitas di ${siteName}. Kursi, meja, lemari, dan berbagai furnitur lainnya dengan harga terjangkau.`;
    const breadcrumbItems = [
        {
            name: 'Beranda',
            url:
                typeof window !== 'undefined'
                    ? `${window.location.origin}/shop`
                    : '/shop',
        },
        ...(currentCategory
            ? [
                  {
                      name: currentCategory.name,
                      url:
                          typeof window !== 'undefined'
                              ? `${window.location.origin}/shop/category/${currentCategory.slug}`
                              : `/shop/category/${currentCategory.slug}`,
                  },
              ]
            : [
                  {
                      name: 'Semua Produk',
                      url:
                          typeof window !== 'undefined'
                              ? `${window.location.origin}/shop/products`
                              : '/shop/products',
                  },
              ]),
    ];

    return (
        <>
            <SEOHead
                title={pageTitle}
                description={pageDescription}
                keywords={
                    currentCategory
                        ? [currentCategory.name, 'furnitur', 'mebel']
                        : [
                              'furnitur',
                              'furniture',
                              'mebel',
                              'kursi',
                              'meja',
                              'lemari',
                          ]
                }
            />
            <BreadcrumbStructuredData items={breadcrumbItems} />
            <div className="bg-noise" />
            <ShopLayout>
                <main className="min-h-screen bg-white pt-28 pb-20">
                    <div className="mx-auto max-w-[1400px] px-6 md:px-12">
                        {/* Breadcrumb */}
                        <nav className="mb-8 flex items-center gap-2 text-sm text-neutral-500">
                            <Link href="/shop" className="hover:text-teal-500">
                                Beranda
                            </Link>
                            <span>/</span>
                            <span className="text-neutral-900">
                                {currentCategory
                                    ? currentCategory.name
                                    : 'Semua Produk'}
                            </span>
                        </nav>

                        {/* Header */}
                        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                            <div>
                                <h1 className="font-serif text-4xl text-neutral-900 md:text-5xl">
                                    {currentCategory
                                        ? currentCategory.name
                                        : 'Semua Produk'}
                                </h1>
                                <p className="mt-2 text-neutral-500">
                                    {products.meta.total} produk ditemukan
                                </p>
                            </div>

                            {/* Search & Filter Toggle */}
                            <div className="flex items-center gap-4">
                                <div className="relative flex-1 md:w-80">
                                    <Search
                                        className="absolute top-1/2 left-4 -translate-y-1/2 text-neutral-400"
                                        size={20}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Cari produk..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="w-full rounded-full border border-neutral-200 py-3 pr-4 pl-12 transition-colors focus:border-teal-500 focus:outline-none"
                                    />
                                </div>
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`rounded-full border p-3 transition-colors ${showFilters ? 'border-teal-500 bg-teal-500 text-white' : 'border-neutral-200 hover:border-teal-500'}`}
                                >
                                    <SlidersHorizontal size={20} />
                                </button>
                                <div className="hidden items-center gap-2 rounded-full border border-neutral-200 p-1 md:flex">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`rounded-full p-2 transition-colors ${viewMode === 'grid' ? 'bg-teal-500 text-white' : ''}`}
                                    >
                                        <Grid3X3 size={18} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`rounded-full p-2 transition-colors ${viewMode === 'list' ? 'bg-teal-500 text-white' : ''}`}
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
                                <ProductGrid
                                    products={products.data}
                                    viewMode={viewMode}
                                    onQuickView={setQuickViewProduct}
                                />
                                <Pagination meta={products.meta} />
                            </div>
                        </div>
                    </div>
                </main>

                <QuickViewModal
                    product={quickViewProduct}
                    isOpen={!!quickViewProduct}
                    onClose={() => setQuickViewProduct(null)}
                />
            </ShopLayout>
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
    categories,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    selectedSort,
    setSelectedSort,
    onApply,
    onClear,
    hasActiveFilters,
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
                    <h3 className="mb-4 font-medium text-neutral-900">
                        Urutkan
                    </h3>
                    <select
                        value={selectedSort}
                        onChange={(e) => {
                            setSelectedSort(e.target.value);
                        }}
                        className="w-full rounded-xl border border-neutral-200 p-3 focus:border-teal-500 focus:outline-none"
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Categories */}
                <div>
                    <h3 className="mb-4 font-medium text-neutral-900">
                        Kategori
                    </h3>
                    <div className="space-y-2">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`w-full rounded-lg px-4 py-2 text-left transition-colors ${!selectedCategory ? 'bg-teal-500 text-white' : 'hover:bg-neutral-100'}`}
                        >
                            Semua Kategori
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`w-full rounded-lg px-4 py-2 text-left transition-colors ${selectedCategory === cat.id ? 'bg-teal-500 text-white' : 'hover:bg-neutral-100'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div>
                    <h3 className="mb-4 font-medium text-neutral-900">
                        Rentang Harga
                    </h3>
                    <div className="space-y-2">
                        {PRICE_RANGES.map((range, i) => (
                            <button
                                key={i}
                                onClick={() =>
                                    setPriceRange({
                                        min: range.min,
                                        max: range.max ?? undefined,
                                    })
                                }
                                className={`w-full rounded-lg px-4 py-2 text-left text-sm transition-colors ${
                                    priceRange.min === range.min &&
                                    priceRange.max === (range.max ?? undefined)
                                        ? 'bg-teal-500 text-white'
                                        : 'hover:bg-neutral-100'
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
                        className="flex-1 rounded-full bg-teal-500 py-3 font-medium text-white transition-colors hover:bg-teal-600"
                    >
                        Terapkan
                    </button>
                    {hasActiveFilters && (
                        <button
                            onClick={onClear}
                            className="rounded-full border border-neutral-200 px-4 py-3 transition-colors hover:border-neutral-900"
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
    onQuickView: (product: ApiProduct) => void;
}

function ProductGrid({ products, viewMode, onQuickView }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="py-20 text-center">
                <ShoppingBag
                    className="mx-auto mb-4 text-neutral-300"
                    size={64}
                />
                <h3 className="mb-2 text-xl font-medium text-neutral-900">
                    Tidak ada produk ditemukan
                </h3>
                <p className="text-neutral-500">
                    Coba ubah filter atau kata kunci pencarian Anda
                </p>
            </div>
        );
    }

    return (
        <div
            className={
                viewMode === 'grid'
                    ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
                    : 'space-y-6'
            }
        >
            {products.map((product, index) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    index={index}
                    onQuickView={onQuickView}
                />
            ))}
        </div>
    );
}

// ==================== Product Card ====================
interface ProductCardProps {
    product: ApiProduct;
    viewMode: 'grid' | 'list';
    index: number;
    onQuickView: (product: ApiProduct) => void;
}

function ProductCard({
    product,
    viewMode,
    index,
    onQuickView,
}: ProductCardProps) {
    const imageUrl =
        product.primary_image?.image_url ||
        product.images?.[0]?.image_url ||
        '/images/placeholder-product.svg';

    if (viewMode === 'list') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
            >
                <Link
                    href={`/shop/products/${product.slug}`}
                    className="group flex gap-6 rounded-2xl border border-neutral-100 bg-white p-4 transition-shadow hover:shadow-lg"
                >
                    <div className="relative h-48 w-48 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onQuickView(product);
                            }}
                            className="absolute right-2 bottom-2 rounded-full bg-white/90 p-2 text-neutral-900 opacity-0 transition-colors group-hover:opacity-100 hover:bg-white"
                            title="Quick View"
                        >
                            <Eye size={16} />
                        </button>
                    </div>
                    <div className="flex flex-1 flex-col justify-between py-2">
                        <div>
                            <p className="mb-1 text-sm text-neutral-500">
                                {product.category?.name}
                            </p>
                            <h3 className="mb-2 font-serif text-xl text-neutral-900">
                                {product.name}
                            </h3>
                            <p className="line-clamp-2 text-sm text-neutral-600">
                                {product.short_description}
                            </p>
                            <div className="mt-3 flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-medium">
                                        {Number(
                                            product.average_rating || 0,
                                        ).toFixed(1)}
                                    </span>
                                </div>
                                <span className="text-neutral-300">•</span>
                                <span className="text-sm text-neutral-500">
                                    {product.sold_count} terjual
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                {product.has_discount && (
                                    <p className="text-sm text-neutral-400 line-through">
                                        {product.price_formatted}
                                    </p>
                                )}
                                <p className="text-xl font-semibold text-teal-600">
                                    {product.final_price_formatted}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                    }}
                                    className="rounded-full border border-neutral-200 p-3 transition-colors hover:border-neutral-900"
                                >
                                    <Heart size={18} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                    }}
                                    className="rounded-full bg-teal-500 p-3 text-white transition-colors hover:bg-teal-600"
                                >
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
                <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-neutral-100">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.has_discount && (
                        <span className="absolute top-4 left-4 rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white">
                            -{product.discount_percentage}%
                        </span>
                    )}
                    {product.sale_type.value !== 'regular' && (
                        <span className="absolute top-4 right-4 rounded-full bg-teal-500 px-3 py-1 text-sm font-medium text-white">
                            {product.sale_type.label}
                        </span>
                    )}
                    <div className="absolute right-4 bottom-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onQuickView(product);
                            }}
                            className="rounded-full bg-white/90 p-3 text-neutral-900 transition-colors hover:bg-white"
                            title="Quick View"
                        >
                            <Eye size={18} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                            }}
                            className="rounded-full bg-white/90 p-3 text-neutral-900 transition-colors hover:bg-white"
                        >
                            <Heart size={18} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                            }}
                            className="rounded-full bg-teal-500 p-3 text-white transition-colors hover:bg-teal-600"
                        >
                            <ShoppingBag size={18} />
                        </button>
                    </div>
                </div>
                <div>
                    <p className="mb-1 text-sm text-neutral-500">
                        {product.category?.name}
                    </p>
                    <h3 className="mb-2 font-serif text-lg text-neutral-900 transition-colors group-hover:text-teal-500">
                        {product.name}
                    </h3>
                    <div className="mb-2 flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">
                                {Number(product.average_rating || 0).toFixed(1)}
                            </span>
                        </div>
                        <span className="text-neutral-300">•</span>
                        <span className="text-sm text-neutral-500">
                            {product.sold_count} terjual
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {product.has_discount && (
                            <span className="text-sm text-neutral-400 line-through">
                                {product.price_formatted}
                            </span>
                        )}
                        <span className="text-lg font-semibold text-teal-600">
                            {product.final_price_formatted}
                        </span>
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
            pages.push(
                1,
                '...',
                current - 1,
                current,
                current + 1,
                '...',
                last,
            );
        }
    }

    const goToPage = (page: number) => {
        router.get(
            window.location.pathname,
            {
                ...Object.fromEntries(
                    new URLSearchParams(window.location.search),
                ),
                page,
            },
            { preserveState: true },
        );
    };

    return (
        <div className="mt-12 flex items-center justify-between border-t border-neutral-100 pt-8">
            <p className="text-sm text-neutral-500">
                Menampilkan {meta.from}-{meta.to} dari {meta.total} produk
            </p>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => goToPage(current - 1)}
                    disabled={current === 1}
                    className="rounded-lg border border-neutral-200 p-2 transition-colors hover:border-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <ChevronLeft size={18} />
                </button>
                {pages.map((page, i) =>
                    typeof page === 'number' ? (
                        <button
                            key={i}
                            onClick={() => goToPage(page)}
                            className={`h-10 w-10 rounded-lg font-medium transition-colors ${
                                page === current
                                    ? 'bg-teal-500 text-white'
                                    : 'border border-neutral-200 hover:border-neutral-900'
                            }`}
                        >
                            {page}
                        </button>
                    ) : (
                        <span key={i} className="px-2 text-neutral-400">
                            ...
                        </span>
                    ),
                )}
                <button
                    onClick={() => goToPage(current + 1)}
                    disabled={current === last}
                    className="rounded-lg border border-neutral-200 p-2 transition-colors hover:border-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}
