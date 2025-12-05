import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingBag, Heart, Minus, Plus, ChevronLeft, ChevronRight, Eye, Loader2, Check } from 'lucide-react';
import { ApiProduct } from '@/types/shop';

interface QuickViewModalProps {
    product: ApiProduct | null;
    isOpen: boolean;
    onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [cartSuccess, setCartSuccess] = useState(false);

    if (!product) return null;

    const images = product.images?.length ? product.images : [{ id: 0, image_url: product.primary_image?.image_url || '/images/placeholder-product.svg', alt_text: product.name }];

    const handleAddToCart = async () => {
        setIsAddingToCart(true);

        router.post('/shop/cart', { product_id: product.id, quantity }, {
            preserveScroll: true,
            only: ['cart'],
            onSuccess: () => {
                setCartSuccess(true);
                // Show success briefly then close
                setTimeout(() => {
                    onClose();
                    setCartSuccess(false);
                    setQuantity(1);
                }, 800);
            },
            onError: (errors) => {
                console.error('Error adding to cart:', errors);
            },
            onFinish: () => {
                setIsAddingToCart(false);
            },
        });
    };

    const handleWishlist = async () => {
        router.post(`/shop/wishlist/${product.id}`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setIsWishlisted(!isWishlisted);
            },
            onError: (e) => console.error(e),
        });
    };

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
                    <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="grid md:grid-cols-2">
                            {/* Image Section */}
                            <div className="relative bg-sand-50 aspect-square md:aspect-auto">
                                <img src={images[currentImageIndex]?.image_url} alt={product.name} className="w-full h-full object-cover" />
                                {images.length > 1 && (
                                    <>
                                        <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white text-terra-900 shadow-lg"><ChevronLeft size={20} /></button>
                                        <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white text-terra-900 shadow-lg"><ChevronRight size={20} /></button>
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                            {images.map((_, idx) => (<button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`w-2 h-2 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-terra-900' : 'bg-white/60'}`} />))}
                                        </div>
                                    </>
                                )}
                                {product.has_discount && (<span className="absolute top-4 left-4 bg-wood-dark text-white px-3 py-1 rounded-full text-sm font-bold">-{product.discount_percentage}%</span>)}
                            </div>

                            {/* Info Section */}
                            <div className="p-6 md:p-8 flex flex-col max-h-[90vh] md:max-h-none overflow-y-auto">
                                <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-terra-100 hover:bg-terra-200 text-terra-900 rounded-full flex items-center justify-center transition-colors"><X size={20} /></button>

                                <p className="text-sm text-wood uppercase tracking-wider mb-2">{product.category?.name}</p>
                                <h2 className="font-serif text-2xl md:text-3xl text-terra-900 mb-3">{product.name}</h2>

                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} size={16} className={s <= Math.round(product.average_rating) ? 'fill-yellow-400 text-yellow-400' : 'text-terra-200'} />)}</div>
                                    <span className="text-sm text-terra-500">({product.review_count} ulasan)</span>
                                    <span className="text-terra-300">|</span>
                                    <span className="text-sm text-terra-500">{product.sold_count} terjual</span>
                                </div>

                                <div className="py-4 border-y border-terra-100 mb-4">
                                    {product.has_discount ? (
                                        <div className="flex items-end gap-3">
                                            <span className="text-2xl md:text-3xl font-bold text-terra-900">{product.final_price_formatted}</span>
                                            <span className="text-lg text-terra-400 line-through">{product.price_formatted}</span>
                                        </div>
                                    ) : (<span className="text-2xl md:text-3xl font-bold text-terra-900">{product.price_formatted}</span>)}
                                </div>

                                {product.short_description && (<p className="text-terra-600 text-sm mb-4 line-clamp-3">{product.short_description}</p>)}

                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.is_in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {product.is_in_stock ? `Stok: ${product.stock_quantity}` : 'Stok Habis'}
                                    </span>
                                </div>

                                {/* Quantity */}
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-sm text-terra-600">Jumlah:</span>
                                    <div className="flex items-center border border-terra-200 rounded-full text-terra-900">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-terra-50 rounded-l-full"><Minus size={16} /></button>
                                        <span className="w-12 text-center font-medium">{quantity}</span>
                                        <button onClick={() => setQuantity(Math.min(product.stock_quantity || 99, quantity + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-terra-50 rounded-r-full"><Plus size={16} /></button>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 mt-auto">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={!product.is_in_stock || isAddingToCart || cartSuccess}
                                        className={`flex-1 py-3 rounded-full font-medium transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed ${
                                            cartSuccess
                                                ? 'bg-green-500 text-white'
                                                : 'bg-terra-900 text-white hover:bg-wood-dark disabled:opacity-50'
                                        }`}
                                    >
                                        {cartSuccess ? (
                                            <>
                                                <Check size={20} />
                                                Ditambahkan!
                                            </>
                                        ) : isAddingToCart ? (
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
                                    <button onClick={handleWishlist} className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${isWishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'border-terra-200 text-terra-600 hover:bg-terra-50'}`}>
                                        <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
                                    </button>
                                </div>

                                <Link href={`/shop/products/${product.slug}`} className="mt-4 text-center text-sm text-wood hover:text-wood-dark flex items-center justify-center gap-2">
                                    <Eye size={16} />Lihat Detail Lengkap
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default QuickViewModal;

