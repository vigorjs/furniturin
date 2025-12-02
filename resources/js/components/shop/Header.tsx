import { useState, useEffect, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { ShoppingBag, Search, Menu, Heart, User, LogOut, Package, Settings, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_ITEMS } from '@/data/constants';

interface AuthUser {
    id: number;
    name: string;
    email: string;
    avatar_url?: string;
}

interface HeaderProps {
    cartCount: number;
    onCartClick: () => void;
    onLogoClick: () => void;
    bannerVisible?: boolean; // When promo banner is visible, shift header down
}

export const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick, onLogoClick, bannerVisible = false }) => {
    const { auth, wishlistCount } = usePage().props as { auth?: { user?: AuthUser }; wishlistCount?: number };
    const user = auth?.user;

    const [scrolled, setScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const userMenuRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus search input when opened
    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchOpen]);

    // Handle keyboard shortcut (Ctrl+K or Cmd+K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(true);
            }
            if (e.key === 'Escape') {
                setSearchOpen(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleLogout = () => {
        router.post('/logout');
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.visit(`/shop/products?filter[name]=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    // Calculate top position based on banner visibility
    const topPosition = bannerVisible ? 'top-10' : 'top-0';

    return (
        <>
            <nav className={`fixed ${topPosition} w-full z-40 transition-all duration-500 border-b ${scrolled ? 'bg-white/80 backdrop-blur-md py-4 border-terra-200' : 'bg-transparent py-6 border-transparent'}`}>
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
                    <div className="flex items-center cursor-pointer group" onClick={onLogoClick}>
                        <img
                            src="/assets/images/logo.webp"
                            alt="Latif Living"
                            className="h-7 md:h-8 w-auto object-contain"
                        />
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        {NAV_ITEMS.map((item) => (
                            <Link key={item.label} href={item.href} className="text-sm font-medium text-terra-600 hover:text-wood transition-all">
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <button onClick={() => setSearchOpen(true)} className="p-2 text-terra-900 hover:bg-terra-100 rounded-full transition-colors">
                            <Search size={20} />
                        </button>

                    {user && (
                        <Link href="/shop/wishlist" className="relative p-2 text-terra-900 hover:bg-terra-100 rounded-full transition-colors hidden md:flex">
                            <Heart size={20} />
                            {(wishlistCount ?? 0) > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-wood text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>
                    )}

                    <button onClick={onCartClick} className="relative p-2 text-terra-900 hover:bg-terra-100 rounded-full transition-colors group">
                        <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-wood text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    {/* User Menu */}
                    {user ? (
                        <div className="relative hidden md:block" ref={userMenuRef}>
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 p-2 text-terra-900 hover:bg-terra-100 rounded-full transition-colors"
                            >
                                {user.avatar_url ? (
                                    <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                                ) : (
                                    <div className="w-8 h-8 bg-terra-100 rounded-full flex items-center justify-center">
                                        <User size={18} className="text-terra-600" />
                                    </div>
                                )}
                                <ChevronDown size={16} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-terra-100 py-2 z-50">
                                    <div className="px-4 py-3 border-b border-terra-100">
                                        <p className="font-medium text-terra-900 truncate">{user.name}</p>
                                        <p className="text-sm text-terra-500 truncate">{user.email}</p>
                                    </div>
                                    <Link href="/shop/orders" className="flex items-center gap-3 px-4 py-2.5 text-terra-700 hover:bg-terra-50 transition-colors">
                                        <Package size={18} /><span>Pesanan Saya</span>
                                    </Link>
                                    <Link href="/shop/wishlist" className="flex items-center gap-3 px-4 py-2.5 text-terra-700 hover:bg-terra-50 transition-colors">
                                        <Heart size={18} /><span>Wishlist</span>
                                    </Link>
                                    <Link href="/settings/profile" className="flex items-center gap-3 px-4 py-2.5 text-terra-700 hover:bg-terra-50 transition-colors">
                                        <Settings size={18} /><span>Pengaturan</span>
                                    </Link>
                                    <div className="border-t border-terra-100 mt-2 pt-2">
                                        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors w-full">
                                            <LogOut size={18} /><span>Keluar</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/login" className="hidden md:flex items-center gap-2 px-4 py-2 bg-terra-900 text-white rounded-full text-sm font-medium hover:bg-wood transition-colors">
                            <User size={16} /><span>Masuk</span>
                        </Link>
                    )}

                        <button className="md:hidden p-2 text-terra-900">
                            <Menu size={20} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Search Modal */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
                        onClick={() => setSearchOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <form onSubmit={handleSearch} className="flex items-center gap-4 p-4">
                                <Search size={24} className="text-terra-400 flex-shrink-0" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari produk furniture..."
                                    className="flex-1 text-lg outline-none placeholder:text-terra-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setSearchOpen(false)}
                                    className="p-2 hover:bg-terra-100 rounded-full transition-colors"
                                >
                                    <X size={20} className="text-terra-500" />
                                </button>
                            </form>
                            <div className="border-t border-terra-100 px-4 py-3">
                                <p className="text-xs text-terra-400">
                                    Tekan <kbd className="px-1.5 py-0.5 bg-terra-100 rounded text-terra-600">Enter</kbd> untuk mencari atau <kbd className="px-1.5 py-0.5 bg-terra-100 rounded text-terra-600">Esc</kbd> untuk menutup
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;

