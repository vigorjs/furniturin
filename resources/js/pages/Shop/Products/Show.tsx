import { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star, Heart, ShoppingBag, Minus, Plus, ChevronLeft, ChevronRight,
    Truck, Shield, RotateCcw, Check, Share2, ZoomIn, X, Loader2
} from 'lucide-react';
import { RecentlyViewedSection, saveToRecentlyViewed, ShareModal } from '@/components/shop';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SEOHead, ProductStructuredData, BreadcrumbStructuredData } from '@/components/seo';
import { ApiProduct, ProductImage } from '@/types/shop';
import { SiteSettings } from '@/types';

interface Props {
    product: ApiProduct;
    relatedProducts: ApiProduct[];
}

export default function ProductShow({ product, relatedProducts }: Props) {
    const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
    const siteName = siteSettings?.site_name || 'Latif Living';
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [cartMessage, setCartMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Save to recently viewed on mount
    useEffect(() => {
        saveToRecentlyViewed(product);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product.id]);

    // Auto hide cart message after 3 seconds
    useEffect(() => {
        if (cartMessage) {
            const timer = setTimeout(() => setCartMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [cartMessage]);

    const images = product.images?.length
        ? product.images
        : [{ id: 0, image_url: '/images/placeholder-product.svg', alt_text: product.name } as ProductImage];

    const handleAddToCart = async () => {
        setIsAddingToCart(true);
        setCartMessage(null);

        router.post('/shop/cart', { product_id: product.id, quantity }, {
            preserveScroll: true,
            only: ['cart'],
            onSuccess: () => {
                setCartMessage({ type: 'success', text: 'Produk berhasil ditambahkan ke keranjang!' });
            },
            onError: (errors) => {
                console.error('Error adding to cart:', errors);
                setCartMessage({ type: 'error', text: 'Gagal menambahkan produk ke keranjang' });
            },
            onFinish: () => {
                setIsAddingToCart(false);
            },
        });
    };

    // SEO Data
    const productUrl = typeof window !== 'undefined' ? `${window.location.origin}/shop/products/${product.slug}` : `/shop/products/${product.slug}`;
    const productImages = images.map(img => img.image_url);
    const breadcrumbItems = [
        { name: 'Beranda', url: typeof window !== 'undefined' ? `${window.location.origin}/shop` : '/shop' },
        { name: 'Produk', url: typeof window !== 'undefined' ? `${window.location.origin}/shop/products` : '/shop/products' },
        ...(product.category ? [{ name: product.category.name, url: typeof window !== 'undefined' ? `${window.location.origin}/shop/category/${product.category.slug}` : `/shop/category/${product.category.slug}` }] : []),
        { name: product.name, url: productUrl },
    ];

    return (
        <>
            {/* SEO */}
            <SEOHead
                title={product.name}
                description={product.short_description || product.description?.replace(/<[^>]*>/g, '').substring(0, 160) || `Beli ${product.name} dengan harga terbaik di ${siteName}`}
                keywords={[product.name, product.category?.name || 'furnitur', product.sku].filter(Boolean) as string[]}
                image={images[0]?.image_url}
                url={productUrl}
                type="product"
                product={{
                    price: product.final_price,
                    currency: 'IDR',
                    availability: product.is_in_stock ? 'in stock' : 'out of stock',
                    brand: siteName,
                    category: product.category?.name,
                    sku: product.sku,
                }}
            />
            <ProductStructuredData
                data={{
                    name: product.name,
                    description: product.short_description || product.description?.replace(/<[^>]*>/g, '') || '',
                    image: productImages,
                    sku: product.sku,
                    brand: siteName,
                    category: product.category?.name,
                    price: product.final_price,
                    priceCurrency: 'IDR',
                    availability: product.is_in_stock ? 'InStock' : 'OutOfStock',
                    url: productUrl,
                    rating: product.review_count > 0 ? { value: product.average_rating, count: product.review_count } : undefined,
                }}
            />
            <BreadcrumbStructuredData items={breadcrumbItems} />
            <div className="bg-noise" />
            <ShopLayout showFooter={true} showWhatsApp={false}>
                <main className="min-h-screen bg-white pt-28 pb-20">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                    <Breadcrumb product={product} />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                        <ImageGallery
                            images={images}
                            selectedIndex={selectedImageIndex}
                            setSelectedIndex={setSelectedImageIndex}
                            onZoom={() => setIsZoomed(true)}
                            product={product}
                        />
                        <ProductInfo
                            product={product}
                            quantity={quantity}
                            setQuantity={setQuantity}
                            isWishlisted={isWishlisted}
                            setIsWishlisted={setIsWishlisted}
                            onAddToCart={handleAddToCart}
                            onShare={() => setIsShareOpen(true)}
                            isAddingToCart={isAddingToCart}
                            cartMessage={cartMessage}
                        />
                    </div>
                    {/* Customer Reviews */}
                    {product.reviews && product.reviews.length > 0 && (
                        <CustomerReviews reviews={product.reviews} averageRating={product.average_rating} reviewCount={product.review_count} />
                    )}

                    {relatedProducts.length > 0 && <RelatedProducts products={relatedProducts} />}
                </div>

                {/* Recently Viewed Section */}
                <RecentlyViewedSection excludeProductId={product.id} className="bg-sand-50" />
            </main>

            <ZoomModal
                isOpen={isZoomed}
                onClose={() => setIsZoomed(false)}
                images={images}
                currentIndex={selectedImageIndex}
                setCurrentIndex={setSelectedImageIndex}
            />

            {/* Share Modal */}
            <ShareModal
                isOpen={isShareOpen}
                onClose={() => setIsShareOpen(false)}
                url={`/shop/products/${product.slug}`}
                title={product.name}
                description={product.short_description || undefined}
                imageUrl={images[0]?.image_url}
            />

            </ShopLayout>
        </>
    );
}

// ==================== Breadcrumb ====================
function Breadcrumb({ product }: { product: ApiProduct }) {
    return (
        <nav className="flex items-center gap-2 text-sm text-terra-500 mb-8">
            <Link href="/shop" className="hover:text-terra-900">Beranda</Link>
            <span>/</span>
            <Link href="/shop/products" className="hover:text-terra-900">Produk</Link>
            <span>/</span>
            {product.category && (
                <>
                    <Link href={`/shop/category/${product.category.slug}`} className="hover:text-terra-900">
                        {product.category.name}
                    </Link>
                    <span>/</span>
                </>
            )}
            <span className="text-terra-900 truncate max-w-[200px]">{product.name}</span>
        </nav>
    );
}

// ==================== Image Gallery ====================
interface ImageGalleryProps {
    images: ProductImage[];
    selectedIndex: number;
    setSelectedIndex: (i: number) => void;
    onZoom: () => void;
    product: ApiProduct;
}

function ImageGallery({ images, selectedIndex, setSelectedIndex, onZoom, product }: ImageGalleryProps) {
    return (
        <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-sand-100 cursor-zoom-in" onClick={onZoom}>
                <AnimatePresence mode="wait">
                    <motion.img
                        key={selectedIndex}
                        src={images[selectedIndex]?.image_url}
                        alt={images[selectedIndex]?.alt_text || product.name}
                        className="w-full h-full object-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                </AnimatePresence>
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                    {product.has_discount && (
                        <span className="bg-red-500 text-white px-4 py-2 rounded-full font-medium">-{product.discount_percentage}%</span>
                    )}
                    {product.sale_type?.value && product.sale_type.value !== 'regular' && (
                        <span className="bg-wood text-white px-4 py-2 rounded-full font-medium">{product.sale_type.label}</span>
                    )}
                </div>
                <button className="absolute bottom-6 right-6 p-3 bg-white/90 rounded-full hover:bg-white text-terra-900"><ZoomIn size={20} /></button>
                {images.length > 1 && (
                    <>
                        <button onClick={(e) => { e.stopPropagation(); setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : images.length - 1); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full hover:bg-white text-terra-900"><ChevronLeft size={20} /></button>
                        <button onClick={(e) => { e.stopPropagation(); setSelectedIndex(selectedIndex < images.length - 1 ? selectedIndex + 1 : 0); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full hover:bg-white text-terra-900"><ChevronRight size={20} /></button>
                    </>
                )}
            </div>
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                        <button key={img.id || idx} onClick={() => setSelectedIndex(idx)}
                            className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${idx === selectedIndex ? 'border-terra-900' : 'border-transparent hover:border-terra-300'}`}>
                            <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ==================== Product Info ====================
interface ProductInfoProps {
    product: ApiProduct;
    quantity: number;
    setQuantity: (q: number) => void;
    isWishlisted: boolean;
    setIsWishlisted: (w: boolean) => void;
    onAddToCart: () => void;
    onShare: () => void;
    isAddingToCart: boolean;
    cartMessage: { type: 'success' | 'error'; text: string } | null;
}

function ProductInfo({ product, quantity, setQuantity, isWishlisted, setIsWishlisted, onAddToCart, onShare, isAddingToCart, cartMessage }: ProductInfoProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 text-sm text-terra-500">
                {product.category && <Link href={`/shop/category/${product.category.slug}`} className="hover:text-terra-900">{product.category.name}</Link>}
                <span>•</span>
                <span>SKU: {product.sku}</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-terra-900">{product.name}</h1>
            <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} size={18} className={s <= Math.round(product.average_rating) ? 'fill-yellow-400 text-yellow-400' : 'text-terra-200'} />)}</div>
                    <span className="font-medium">{Number(product.average_rating || 0).toFixed(1)}</span>
                    <span className="text-terra-500">({product.review_count} ulasan)</span>
                </div>
                <span className="text-terra-300">|</span>
                <span className="text-terra-500">{product.sold_count} terjual</span>
            </div>
            <div className="py-4 border-y border-terra-100">
                {product.has_discount ? (
                    <div className="flex items-end gap-3">
                        <span className="text-3xl font-bold text-terra-900">{product.final_price_formatted}</span>
                        <span className="text-xl text-terra-400 line-through">{product.price_formatted}</span>
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">Hemat {product.discount_percentage}%</span>
                    </div>
                ) : (
                    <span className="text-3xl font-bold text-terra-900">{product.final_price_formatted}</span>
                )}
            </div>
            {product.short_description && <p className="text-terra-600 leading-relaxed">{product.short_description}</p>}
            <div className="flex items-center gap-2">
                {product.is_in_stock ? (
                    <><Check className="text-green-500" size={20} /><span className="text-green-600 font-medium">Stok Tersedia</span>
                    {product.track_stock && <span className="text-terra-500">({product.stock_quantity} unit)</span>}</>
                ) : (<span className="text-red-500 font-medium">Stok Habis</span>)}
            </div>
            {/* Cart Message Notification */}
            <AnimatePresence>
                {cartMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-4 rounded-lg flex items-center gap-3 ${
                            cartMessage.type === 'success'
                                ? 'bg-green-50 border border-green-200 text-green-700'
                                : 'bg-red-50 border border-red-200 text-red-700'
                        }`}
                    >
                        {cartMessage.type === 'success' ? (
                            <Check className="text-green-500 flex-shrink-0" size={20} />
                        ) : (
                            <X className="text-red-500 flex-shrink-0" size={20} />
                        )}
                        <span className="font-medium">{cartMessage.text}</span>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="flex items-center gap-4">
                <div className="flex items-center border border-terra-200 rounded-full text-terra-900">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-terra-50 rounded-l-full" disabled={isAddingToCart}><Minus size={18} /></button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} disabled={(product.track_stock && quantity >= product.stock_quantity) || isAddingToCart} className="p-3 hover:bg-terra-50 rounded-r-full disabled:opacity-50"><Plus size={18} /></button>
                </div>
                <button onClick={onAddToCart} disabled={!product.is_in_stock || isAddingToCart} className="flex-1 flex items-center justify-center gap-3 bg-terra-900 text-white py-4 rounded-full font-medium hover:bg-wood disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                    {isAddingToCart ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            Menambahkan...
                        </>
                    ) : (
                        <>
                            <ShoppingBag size={20} />
                            Tambah ke Keranjang
                        </>
                    )}
                </button>
                <button onClick={() => setIsWishlisted(!isWishlisted)} className={`p-4 rounded-full border transition-colors ${isWishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'border-terra-200 hover:border-terra-900'}`}>
                    <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
                </button>
                <button onClick={onShare} className="p-4 rounded-full border border-terra-200 hover:border-terra-900 hover:bg-terra-50 transition-colors"><Share2 size={20} /></button>
            </div>
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-terra-100">
                <div className="text-center"><Truck className="mx-auto text-wood mb-2" size={24} /><p className="text-sm font-medium text-terra-900">Gratis Ongkir</p><p className="text-xs text-terra-500">Min. Rp 5 Juta</p></div>
                <div className="text-center"><Shield className="mx-auto text-wood mb-2" size={24} /><p className="text-sm font-medium text-terra-900">Garansi 1 Tahun</p><p className="text-xs text-terra-500">Kerusakan Pabrik</p></div>
                <div className="text-center"><RotateCcw className="mx-auto text-wood mb-2" size={24} /><p className="text-sm font-medium text-terra-900">14 Hari Retur</p><p className="text-xs text-terra-500">Syarat Berlaku</p></div>
            </div>
            {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="pt-6 border-t border-terra-100">
                    <h3 className="font-medium text-terra-900 mb-4">Spesifikasi</h3>
                    <dl className="grid grid-cols-2 gap-3 text-sm">
                        {Object.entries(product.specifications).map(([key, value]) => (
                            <div key={key} className="flex"><dt className="w-24 text-terra-500 flex-shrink-0">{key}</dt><dd className="text-terra-900">{value}</dd></div>
                        ))}
                    </dl>
                </div>
            )}
            {product.description && (
                <div className="pt-6 border-t border-terra-100">
                    <h3 className="font-medium text-terra-900 mb-4">Deskripsi Produk</h3>
                    <div className="prose prose-terra max-w-none text-terra-600" dangerouslySetInnerHTML={{ __html: product.description }} />
                </div>
            )}
        </div>
    );
}

// ==================== Related Products ====================
function RelatedProducts({ products }: { products: ApiProduct[] }) {
    return (
        <section>
            <h2 className="font-serif text-2xl text-terra-900 mb-8">Produk Terkait</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((product) => {
                    const imageUrl = product.primary_image?.image_url || product.images?.[0]?.image_url || '/images/placeholder-product.svg';
                    return (
                        <Link key={product.id} href={`/shop/products/${product.slug}`} className="group">
                            <div className="aspect-square rounded-2xl overflow-hidden bg-sand-100 mb-3">
                                <img src={imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <h3 className="font-medium text-terra-900 group-hover:text-wood transition-colors line-clamp-1">{product.name}</h3>
                            <p className="text-terra-600">{product.final_price_formatted}</p>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}

// ==================== Customer Reviews ====================
import { ProductReview } from '@/types/shop';

interface CustomerReviewsProps {
    reviews: ProductReview[];
    averageRating: number;
    reviewCount: number;
}

function CustomerReviews({ reviews, averageRating, reviewCount }: CustomerReviewsProps) {
    const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
        rating,
        count: reviews.filter(r => Math.round(r.rating) === rating).length,
        percentage: (reviews.filter(r => Math.round(r.rating) === rating).length / reviews.length) * 100
    }));

    return (
        <section className="mb-20 pt-12 border-t border-terra-100">
            <h2 className="font-serif text-2xl text-terra-900 mb-8">Ulasan Pelanggan</h2>
            <div className="grid md:grid-cols-3 gap-8">
                {/* Rating Summary */}
                <div className="bg-sand-50 rounded-2xl p-6">
                    <div className="text-center mb-6">
                        <div className="text-5xl font-bold text-terra-900 mb-2">{Number(averageRating || 0).toFixed(1)}</div>
                        <div className="flex justify-center mb-2">
                            {[1, 2, 3, 4, 5].map(s => (
                                <Star key={s} size={20} className={s <= Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-terra-200'} />
                            ))}
                        </div>
                        <p className="text-terra-500">{reviewCount} ulasan</p>
                    </div>
                    <div className="space-y-2">
                        {ratingCounts.map(({ rating, count, percentage }) => (
                            <div key={rating} className="flex items-center gap-2 text-sm">
                                <span className="w-3">{rating}</span>
                                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                <div className="flex-1 h-2 bg-terra-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percentage}%` }} />
                                </div>
                                <span className="w-8 text-terra-500">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reviews List */}
                <div className="md:col-span-2 space-y-6">
                    {reviews.slice(0, 5).map((review) => (
                        <div key={review.id} className="border-b border-terra-100 pb-6 last:border-0">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-10 h-10 bg-terra-100 rounded-full flex items-center justify-center">
                                            <span className="font-medium text-terra-600">{review.user?.name?.charAt(0) || 'U'}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-terra-900">{review.user?.name || 'Pengguna'}</p>
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <Star key={s} size={14} className={s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-terra-200'} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-sm text-terra-400">
                                    {new Date(review.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                            {review.title && <p className="font-medium text-terra-900 mb-1">{review.title}</p>}
                            {review.comment && <p className="text-terra-600">{review.comment}</p>}
                        </div>
                    ))}
                    {reviews.length > 5 && (
                        <button className="text-wood font-medium hover:underline">Lihat semua {reviewCount} ulasan</button>
                    )}
                </div>
            </div>
        </section>
    );
}

// ==================== Zoom Modal ====================
interface ZoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: ProductImage[];
    currentIndex: number;
    setCurrentIndex: (i: number) => void;
}

function ZoomModal({ isOpen, onClose, images, currentIndex, setCurrentIndex }: ZoomModalProps) {
    if (!isOpen) return null;
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
                onClick={onClose}
            >
                <button onClick={onClose} className="absolute top-6 right-6 p-3 bg-white/10 rounded-full text-white hover:bg-white/20">
                    <X size={24} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : images.length - 1); }}
                    className="absolute left-6 p-3 bg-white/10 rounded-full text-white hover:bg-white/20"
                >
                    <ChevronLeft size={32} />
                </button>
                <img
                    src={images[currentIndex]?.image_url}
                    alt=""
                    className="max-w-[90vw] max-h-[90vh] object-contain"
                    onClick={(e) => e.stopPropagation()}
                />
                <button
                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(currentIndex < images.length - 1 ? currentIndex + 1 : 0); }}
                    className="absolute right-6 p-3 bg-white/10 rounded-full text-white hover:bg-white/20"
                >
                    <ChevronRight size={32} />
                </button>
                <div className="absolute bottom-6 flex gap-2">
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                            className={`w-3 h-3 rounded-full transition-colors ${idx === currentIndex ? 'bg-white' : 'bg-white/40'}`}
                        />
                    ))}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
