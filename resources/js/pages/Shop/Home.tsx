import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ShoppingBag, Star, Minus, Plus, ArrowLeft, Check, X, ArrowRight, Menu, Search, Truck, Leaf, ShieldCheck, Quote, Mail } from 'lucide-react';
import { Head, Link } from '@inertiajs/react';
import { PRODUCTS, formatPrice, TESTIMONIALS, NAV_ITEMS } from '@/data/constants';
import { Product, CartItem, ViewState } from '@/types/shop';

// --- Shared Components ---

const Header: React.FC<{
    cartCount: number;
    onCartClick: () => void;
    onLogoClick: () => void;
}> = ({ cartCount, onCartClick, onLogoClick }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-40 transition-all duration-500 border-b ${scrolled ? 'bg-white/80 backdrop-blur-md py-4 border-terra-200' : 'bg-transparent py-6 border-transparent'}`}>
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
                <div className="flex items-center gap-1 cursor-pointer group" onClick={onLogoClick}>
                    <span className="font-serif text-3xl font-bold tracking-tight text-terra-900 relative z-10">
                        Latif
                        <span className="text-wood group-hover:text-terra-900 transition-colors">.</span>
                    </span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="text-sm font-medium text-terra-600 hover:text-terra-900 hover:text-wood transition-all"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 text-terra-900 hover:bg-terra-100 rounded-full transition-colors">
                        <Search size={20} />
                    </button>
                    <button onClick={onCartClick} className="relative p-2 text-terra-900 hover:bg-terra-100 rounded-full transition-colors group">
                        <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-wood text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                                {cartCount}
                            </span>
                        )}
                    </button>
                    <button className="md:hidden p-2 text-terra-900">
                        <Menu size={20} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

const Footer = () => (
    <footer className="bg-terra-900 text-sand-200 py-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-white/10 pb-16">
                <div className="md:col-span-5">
                    <h3 className="font-serif text-4xl text-white mb-6">Latif Living.</h3>
                    <p className="text-lg text-terra-400 font-light leading-relaxed max-w-md">
                        Furniture berkualitas tinggi untuk hunian modern. Kami percaya pada furniture yang bercerita—cerita Anda.
                    </p>
                </div>
                <div className="md:col-span-2 md:col-start-7">
                    <h4 className="font-medium text-white mb-6 tracking-wide">Belanja</h4>
                    <ul className="space-y-4 text-sm text-terra-400">
                        <li className="hover:text-wood-light cursor-pointer transition-colors">Produk Baru</li>
                        <li className="hover:text-wood-light cursor-pointer transition-colors">Terlaris</li>
                        <li className="hover:text-wood-light cursor-pointer transition-colors">Ruang Tamu</li>
                        <li className="hover:text-wood-light cursor-pointer transition-colors">Pencahayaan</li>
                    </ul>
                </div>
                <div className="md:col-span-2">
                    <h4 className="font-medium text-white mb-6 tracking-wide">Perusahaan</h4>
                    <ul className="space-y-4 text-sm text-terra-400">
                        <li className="hover:text-wood-light cursor-pointer transition-colors">Tentang Kami</li>
                        <li className="hover:text-wood-light cursor-pointer transition-colors">Keberlanjutan</li>
                        <li className="hover:text-wood-light cursor-pointer transition-colors">Karir</li>
                        <li className="hover:text-wood-light cursor-pointer transition-colors">Kontak</li>
                    </ul>
                </div>
                <div className="md:col-span-2">
                    <h4 className="font-medium text-white mb-6 tracking-wide">Bantuan</h4>
                    <ul className="space-y-4 text-sm text-terra-400">
                        <li className="hover:text-wood-light cursor-pointer transition-colors">Pengiriman</li>
                        <li className="hover:text-wood-light cursor-pointer transition-colors">Pengembalian</li>
                        <li className="hover:text-wood-light cursor-pointer transition-colors">FAQ</li>
                    </ul>
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center pt-8 text-xs text-terra-500">
                <p>&copy; 2024 Latif Living. Hak cipta dilindungi.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <span className="cursor-pointer hover:text-terra-300">Kebijakan Privasi</span>
                    <span className="cursor-pointer hover:text-terra-300">Syarat & Ketentuan</span>
                </div>
            </div>
        </div>
    </footer>
);

// --- Landing View Component ---

const LandingView: React.FC<{ onProductClick: (p: Product) => void }> = ({ onProductClick }) => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -100]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="overflow-hidden"
        >
            {/* Hero Section */}
            <section className="relative min-h-[95vh] flex items-center pt-24 pb-12 overflow-hidden">
                <div className="absolute top-0 right-0 w-[60%] h-full bg-[#f0ede6] -z-10 rounded-bl-[100px]" />

                <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative z-10 order-2 lg:order-1">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <span className="inline-block px-3 py-1 mb-6 border border-terra-800/30 rounded-full text-xs font-semibold uppercase tracking-widest text-terra-800">
                                Koleksi Terbaru 2024
                            </span>
                            <h1 className="font-serif text-6xl md:text-8xl leading-[1.1] mb-8 text-terra-900">
                                Desain yang <br />
                                <span className="italic text-wood">bernafas.</span>
                            </h1>
                            <p className="text-lg md:text-xl text-terra-600 mb-10 max-w-lg leading-relaxed font-light">
                                Furniture minimalis dari bahan berkelanjutan. Dibuat untuk mereka yang menemukan kemewahan dalam kesederhanaan.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button className="bg-terra-900 text-white px-10 py-4 rounded-full font-medium hover:bg-wood transition-all duration-300 shadow-xl shadow-terra-900/20">
                                    Lihat Koleksi
                                </button>
                                <button className="px-10 py-4 rounded-full font-medium border border-terra-200 hover:border-terra-900 transition-colors duration-300">
                                    Katalog
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    <div className="relative h-[600px] lg:h-[800px] w-full order-1 lg:order-2 flex items-center justify-center lg:justify-end">
                        <motion.div style={{ y: y1 }} className="absolute top-20 left-10 md:left-20 w-64 h-80 z-20 hidden md:block">
                            <img src="https://images.unsplash.com/photo-1594040226829-7f2c1c270259?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover rounded-2xl shadow-2xl" alt="Interior Detail" />
                        </motion.div>

                        <motion.div style={{ y: y2 }} className="relative z-10 w-full md:w-[80%] h-[90%] rounded-t-[200px] rounded-b-[20px] overflow-hidden shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Hero Furniture" />
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/40 to-transparent p-8">
                                <p className="text-white font-serif italic text-2xl">Kursi Santai Premium</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Trust / Press Logos Section */}
            <section className="py-12 border-y border-terra-100 bg-white">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                    <p className="text-center text-terra-400 text-xs font-bold uppercase tracking-[0.2em] mb-8">Dipercaya oleh Rumah Modern & Ditampilkan Di</p>
                    <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                        {['Kompas', 'Tempo', 'Forbes Indonesia', 'Bisnis Indonesia', 'The Jakarta Post'].map((name) => (
                            <span key={name} className="font-serif text-2xl md:text-3xl font-bold text-terra-900 cursor-default">{name}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Marquee Section */}
            <div className="bg-terra-900 py-6 overflow-hidden whitespace-nowrap">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
                    className="inline-block"
                >
                    {Array(4).fill("Keberlanjutan • Keahlian • Desain Timeless • Hunian Modern • ").map((text, i) => (
                        <span key={i} className="text-terra-200/50 font-serif text-4xl mx-4">{text}</span>
                    ))}
                </motion.div>
            </div>

            {/* Categories Bento Grid */}
            <section className="py-24 px-6 md:px-12 max-w-[1400px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                    <h2 className="font-serif text-5xl text-terra-900">Ruangan Pilihan</h2>
                    <p className="text-terra-500 max-w-sm text-right mt-4 md:mt-0">Jelajahi koleksi kami yang dirancang dengan penuh perhatian untuk setiap ruangan di rumah Anda.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
                    <div className="md:col-span-2 relative group overflow-hidden rounded-3xl cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Living" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        <div className="absolute bottom-8 left-8 text-white">
                            <h3 className="font-serif text-3xl">Ruang Tamu</h3>
                            <p className="text-sm opacity-80 mt-2 flex items-center gap-2">Jelajahi <ArrowRight size={14} /></p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="flex-1 relative group overflow-hidden rounded-3xl cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Dining" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                            <div className="absolute bottom-6 left-6 text-white">
                                <h3 className="font-serif text-2xl">Ruang Makan</h3>
                            </div>
                        </div>
                        <div className="flex-1 relative group overflow-hidden rounded-3xl cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1513506003011-3b03c80175e8?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Lighting" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                            <div className="absolute bottom-6 left-6 text-white">
                                <h3 className="font-serif text-2xl">Pencahayaan</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-24 bg-sand-100">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                    <div className="text-center mb-16">
                        <span className="text-wood font-medium uppercase tracking-widest text-xs">Mengapa Kami</span>
                        <h2 className="font-serif text-5xl text-terra-900 mt-2">Filosofi Kami</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: <Leaf />, title: 'Bahan Berkelanjutan', desc: 'Setiap produk menggunakan kayu dari hutan yang dikelola secara bertanggung jawab dan bahan daur ulang.' },
                            { icon: <Truck />, title: 'Gratis Pengiriman', desc: 'Pengiriman gratis untuk pembelian di atas Rp 5 juta ke seluruh Indonesia.' },
                            { icon: <ShieldCheck />, title: 'Garansi Selamanya', desc: 'Garansi seumur hidup untuk semua kerusakan struktural karena kami percaya dengan kualitas kami.' },
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-10 rounded-3xl text-center group hover:shadow-2xl hover:shadow-terra-900/5 transition-all duration-300">
                                <div className="w-16 h-16 mx-auto bg-terra-100 rounded-2xl flex items-center justify-center text-wood group-hover:bg-wood group-hover:text-white transition-colors">
                                    {item.icon}
                                </div>
                                <h3 className="font-serif text-2xl text-terra-900 mt-6 mb-3">{item.title}</h3>
                                <p className="text-terra-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-24 px-6 md:px-12">
                <div className="max-w-[1400px] mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                        <div>
                            <span className="text-wood font-medium uppercase tracking-widest text-xs">Terlaris</span>
                            <h2 className="font-serif text-5xl text-terra-900 mt-2">Produk Unggulan</h2>
                        </div>
                        <Link href="/shop/products" className="mt-4 md:mt-0 text-terra-900 font-medium flex items-center gap-2 hover:gap-4 transition-all">
                            Lihat Semua <ArrowRight size={18} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {PRODUCTS.slice(0, 6).map((product) => (
                            <div
                                key={product.id}
                                onClick={() => onProductClick(product)}
                                className="group cursor-pointer"
                            >
                                <div className="aspect-[4/5] bg-terra-100 rounded-3xl overflow-hidden mb-5 relative">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                        <ShoppingBag size={18} className="text-terra-900" />
                                    </div>
                                </div>
                                <span className="text-xs text-wood uppercase font-medium tracking-wider">{product.category}</span>
                                <h3 className="font-serif text-xl text-terra-900 mt-1 mb-2">{product.name}</h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-terra-700 font-medium">{formatPrice(product.price)}</span>
                                    <div className="flex items-center gap-1">
                                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                        <span className="text-sm text-terra-500">{product.rating}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-terra-900 relative overflow-hidden">
                <div className="absolute top-20 left-20 text-[400px] font-serif text-white opacity-[0.02] pointer-events-none">"</div>
                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                    <div className="text-center mb-16">
                        <span className="text-wood-light font-medium uppercase tracking-widest text-xs">Testimoni</span>
                        <h2 className="font-serif text-5xl text-white mt-2">Kata Pelanggan</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {TESTIMONIALS.map((t) => (
                            <div key={t.id} className="bg-white/5 backdrop-blur-sm p-10 rounded-3xl border border-white/10">
                                <Quote size={32} className="text-wood mb-6" />
                                <p className="text-terra-200 text-lg leading-relaxed mb-8">{t.text}</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-terra-700 rounded-full flex items-center justify-center font-serif text-white text-lg">
                                        {t.author[0]}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{t.author}</p>
                                        <p className="text-terra-400 text-sm">{t.location}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-24 px-6 md:px-12">
                <div className="max-w-[1400px] mx-auto">
                    <div className="bg-sand-100 rounded-[40px] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="max-w-xl">
                            <h2 className="font-serif text-5xl text-terra-900">Bergabung dengan Keluarga Latif</h2>
                            <p className="text-terra-600 mt-4 text-lg">Dapatkan akses eksklusif ke koleksi terbaru, tips dekorasi, dan penawaran khusus.</p>
                        </div>
                        <div className="w-full md:w-auto">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-terra-400" size={20} />
                                    <input
                                        type="email"
                                        placeholder="Alamat email Anda"
                                        className="w-full sm:w-80 pl-12 pr-4 py-4 rounded-full border border-terra-200 focus:outline-none focus:border-wood transition-colors"
                                    />
                                </div>
                                <button className="bg-terra-900 text-white px-8 py-4 rounded-full font-medium hover:bg-wood transition-colors">
                                    Berlangganan
                                </button>
                            </div>
                            <p className="text-terra-400 text-xs mt-4 text-center sm:text-left">Dengan berlangganan, Anda menyetujui kebijakan privasi kami.</p>
                        </div>
                    </div>
                </div>
            </section>

        </motion.div>
    );
};

// --- Cart Drawer Component ---

const CartDrawer: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    cart: CartItem[];
    removeFromCart: (id: string) => void;
    updateQty: (id: string, qty: number) => void;
    onCheckout: () => void;
}> = ({ isOpen, onClose, cart, removeFromCart, updateQty, onCheckout }) => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
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
                            <button onClick={onClose} className="p-2 hover:bg-terra-50 rounded-full transition-colors">
                                <X size={24} className="text-terra-600" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <ShoppingBag size={64} className="text-terra-200 mb-6" />
                                    <h3 className="font-serif text-xl text-terra-900 mb-2">Keranjang Kosong</h3>
                                    <p className="text-terra-500">Mulai belanja untuk mengisi keranjang.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex gap-4 pb-6 border-b border-terra-100 last:border-0">
                                            <div className="w-24 h-28 bg-terra-100 rounded-xl overflow-hidden flex-shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <span className="text-xs text-wood uppercase font-medium">{item.category}</span>
                                                    <h4 className="text-terra-900 font-medium mt-0.5 leading-tight">{item.name}</h4>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center border border-terra-200 rounded-lg">
                                                        <button onClick={() => updateQty(item.id, item.quantity - 1)} className="p-2 hover:bg-terra-50 transition-colors">
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                        <button onClick={() => updateQty(item.id, item.quantity + 1)} className="p-2 hover:bg-terra-50 transition-colors">
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                    <span className="font-medium text-terra-900">{formatPrice(item.price * item.quantity)}</span>
                                                </div>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id)} className="text-terra-400 hover:text-red-500 transition-colors self-start">
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-6 border-t border-terra-100 bg-sand-50">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-terra-600">Subtotal</span>
                                    <span className="font-serif text-2xl text-terra-900">{formatPrice(total)}</span>
                                </div>
                                <p className="text-xs text-terra-500 mb-4">Ongkir dihitung saat checkout</p>
                                <button
                                    onClick={onCheckout}
                                    className="w-full bg-terra-900 text-white py-4 rounded-full font-medium hover:bg-wood transition-colors"
                                >
                                    Checkout
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// --- Product Detail View Component ---

const ProductDetailView: React.FC<{
    product: Product;
    onBack: () => void;
    addToCart: (product: Product) => void;
}> = ({ product, onBack, addToCart }) => {
    const [selectedQty, setSelectedQty] = useState(1);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen pt-32 pb-20"
        >
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-terra-600 hover:text-terra-900 mb-8 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Kembali</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-[4/5] bg-terra-100 rounded-3xl overflow-hidden">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="lg:sticky lg:top-32 h-fit">
                        <span className="text-wood uppercase text-xs font-medium tracking-widest">{product.category}</span>
                        <h1 className="font-serif text-5xl text-terra-900 mt-2 mb-4">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} size={18} className={i < Math.floor(product.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-terra-200'} />
                                ))}
                            </div>
                            <span className="text-terra-500 text-sm">{product.rating} / 5</span>
                        </div>

                        <p className="text-3xl font-serif text-terra-900 mb-6">{formatPrice(product.price)}</p>

                        <p className="text-terra-600 leading-relaxed mb-8">{product.description}</p>

                        {/* Features */}
                        <div className="mb-8">
                            <h3 className="font-medium text-terra-900 mb-4">Fitur Utama</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.features.map((feature, i) => (
                                    <span key={i} className="px-4 py-2 bg-terra-100 text-terra-700 rounded-full text-sm">
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-6 mb-8">
                            <span className="text-terra-700 font-medium">Jumlah</span>
                            <div className="flex items-center border border-terra-200 rounded-lg">
                                <button onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))} className="p-3 hover:bg-terra-50 transition-colors">
                                    <Minus size={18} />
                                </button>
                                <span className="w-12 text-center font-medium">{selectedQty}</span>
                                <button onClick={() => setSelectedQty(selectedQty + 1)} className="p-3 hover:bg-terra-50 transition-colors">
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={() => {
                                for (let i = 0; i < selectedQty; i++) {
                                    addToCart(product);
                                }
                            }}
                            className="w-full bg-terra-900 text-white py-5 rounded-full font-medium hover:bg-wood transition-colors flex items-center justify-center gap-3 text-lg"
                        >
                            <ShoppingBag size={22} />
                            Tambahkan ke Keranjang
                        </button>

                        {/* Delivery Info */}
                        <div className="mt-8 p-6 bg-sand-50 rounded-2xl space-y-4">
                            <div className="flex items-center gap-4">
                                <Truck className="text-wood" size={24} />
                                <div>
                                    <p className="font-medium text-terra-900">Gratis Pengiriman</p>
                                    <p className="text-sm text-terra-500">Untuk pembelian di atas Rp 5.000.000</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <ShieldCheck className="text-wood" size={24} />
                                <div>
                                    <p className="font-medium text-terra-900">Garansi 5 Tahun</p>
                                    <p className="text-sm text-terra-500">Untuk kerusakan struktural</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// --- Checkout View Component ---

const CheckoutView: React.FC<{
    cart: CartItem[];
    onBack: () => void;
    onSuccess: () => void;
}> = ({ cart, onBack, onSuccess }) => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 5000000 ? 0 : 150000;
    const total = subtotal + shipping;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSuccess();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen pt-32 pb-20"
        >
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-terra-600 hover:text-terra-900 mb-8 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Kembali ke Keranjang</span>
                </button>

                <h1 className="font-serif text-5xl text-terra-900 mb-12">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Checkout Form */}
                    <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
                        <div>
                            <h2 className="font-serif text-2xl text-terra-900 mb-6">Informasi Kontak</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Nama Depan" className="col-span-1 p-4 border border-terra-200 rounded-xl focus:outline-none focus:border-wood transition-colors" required />
                                <input type="text" placeholder="Nama Belakang" className="col-span-1 p-4 border border-terra-200 rounded-xl focus:outline-none focus:border-wood transition-colors" required />
                                <input type="email" placeholder="Email" className="col-span-2 p-4 border border-terra-200 rounded-xl focus:outline-none focus:border-wood transition-colors" required />
                                <input type="tel" placeholder="Nomor Telepon" className="col-span-2 p-4 border border-terra-200 rounded-xl focus:outline-none focus:border-wood transition-colors" required />
                            </div>
                        </div>

                        <div>
                            <h2 className="font-serif text-2xl text-terra-900 mb-6">Alamat Pengiriman</h2>
                            <div className="space-y-4">
                                <input type="text" placeholder="Alamat Lengkap" className="w-full p-4 border border-terra-200 rounded-xl focus:outline-none focus:border-wood transition-colors" required />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Kota" className="p-4 border border-terra-200 rounded-xl focus:outline-none focus:border-wood transition-colors" required />
                                    <input type="text" placeholder="Provinsi" className="p-4 border border-terra-200 rounded-xl focus:outline-none focus:border-wood transition-colors" required />
                                </div>
                                <input type="text" placeholder="Kode Pos" className="w-full p-4 border border-terra-200 rounded-xl focus:outline-none focus:border-wood transition-colors" required />
                            </div>
                        </div>

                        <div>
                            <h2 className="font-serif text-2xl text-terra-900 mb-6">Metode Pembayaran</h2>
                            <div className="space-y-3">
                                {['Transfer Bank', 'Kartu Kredit/Debit', 'E-Wallet', 'COD (Bayar di Tempat)'].map((method) => (
                                    <label key={method} className="flex items-center gap-4 p-4 border border-terra-200 rounded-xl cursor-pointer hover:border-wood transition-colors">
                                        <input type="radio" name="payment" value={method} className="w-5 h-5 accent-wood" defaultChecked={method === 'Transfer Bank'} />
                                        <span className="text-terra-700">{method}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-terra-900 text-white py-5 rounded-full font-medium hover:bg-wood transition-colors flex items-center justify-center gap-3 text-lg">
                            <Check size={22} />
                            Selesaikan Pesanan
                        </button>
                    </form>

                    {/* Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-sand-50 rounded-3xl p-8 sticky top-32">
                            <h2 className="font-serif text-2xl text-terra-900 mb-6">Ringkasan Pesanan</h2>

                            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-20 h-24 bg-terra-100 rounded-xl overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-terra-900 font-medium text-sm">{item.name}</h4>
                                            <p className="text-terra-500 text-sm">Qty: {item.quantity}</p>
                                            <p className="text-terra-900 font-medium">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-terra-200 pt-6 space-y-3">
                                <div className="flex justify-between text-terra-600">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-terra-600">
                                    <span>Ongkir</span>
                                    <span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
                                </div>
                                <div className="flex justify-between text-xl font-serif text-terra-900 pt-3 border-t border-terra-200">
                                    <span>Total</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// --- Success View Component ---

const SuccessView: React.FC<{ onContinue: () => void }> = ({ onContinue }) => {
    const [orderNumber] = useState(() => `LL-${Date.now().toString().slice(-8)}`);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-screen flex items-center justify-center px-6"
        >
            <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Check size={48} className="text-green-600" />
                </div>
                <h1 className="font-serif text-4xl text-terra-900 mb-4">Pesanan Berhasil!</h1>
                <p className="text-terra-600 mb-8 leading-relaxed">
                    Terima kasih atas pesanan Anda. Kami akan segera memproses dan mengirimkan pesanan Anda. Konfirmasi telah dikirim ke email Anda.
                </p>
                <div className="bg-sand-50 p-6 rounded-2xl mb-8">
                    <p className="text-terra-500 text-sm mb-2">Nomor Pesanan</p>
                    <p className="font-mono text-xl text-terra-900">{orderNumber}</p>
                </div>
                <button
                    onClick={onContinue}
                    className="bg-terra-900 text-white px-10 py-4 rounded-full font-medium hover:bg-wood transition-colors"
                >
                    Lanjut Belanja
                </button>
            </div>
        </motion.div>
    );
};

// --- Main App Component ---

export default function Home() {
    const [view, setView] = useState<ViewState>('landing');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQty = (id: string, qty: number) => {
        if (qty <= 0) {
            removeFromCart(id);
        } else {
            setCart(prev => prev.map(item =>
                item.id === id ? { ...item, quantity: qty } : item
            ));
        }
    };

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        setView('detail');
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        setView('landing');
        setSelectedProduct(null);
        window.scrollTo(0, 0);
    };

    const handleCheckout = () => {
        setIsCartOpen(false);
        setView('checkout');
        window.scrollTo(0, 0);
    };

    const handleOrderSuccess = () => {
        setCart([]);
        setView('success');
        window.scrollTo(0, 0);
    };

    const handleContinueShopping = () => {
        setView('landing');
        window.scrollTo(0, 0);
    };

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <>
            <Head title="Latif Living - Furniture Premium Indonesia" />

            {/* Noise Overlay */}
            <div className="bg-noise" />

            <Header
                cartCount={cartCount}
                onCartClick={() => setIsCartOpen(true)}
                onLogoClick={() => { setView('landing'); window.scrollTo(0, 0); }}
            />

            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cart={cart}
                removeFromCart={removeFromCart}
                updateQty={updateQty}
                onCheckout={handleCheckout}
            />

            <main className="bg-white min-h-screen">
                <AnimatePresence mode="wait">
                    {view === 'landing' && (
                        <LandingView key="landing" onProductClick={handleProductClick} />
                    )}
                    {view === 'detail' && selectedProduct && (
                        <ProductDetailView
                            key="detail"
                            product={selectedProduct}
                            onBack={handleBack}
                            addToCart={addToCart}
                        />
                    )}
                    {view === 'checkout' && (
                        <CheckoutView
                            key="checkout"
                            cart={cart}
                            onBack={() => { setView('landing'); setIsCartOpen(true); }}
                            onSuccess={handleOrderSuccess}
                        />
                    )}
                    {view === 'success' && (
                        <SuccessView key="success" onContinue={handleContinueShopping} />
                    )}
                </AnimatePresence>
            </main>

            <Footer />
        </>
    );
}
