import { NAV_ITEMS } from '@/data/constants';
import { SiteSettings } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ChevronDown,
    Heart,
    LogOut,
    Menu,
    Package,
    Search,
    Settings,
    ShoppingBag,
    User,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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

export const Header: React.FC<HeaderProps> = ({
    cartCount,
    onCartClick,
    onLogoClick,
    bannerVisible = false,
}) => {
    const { auth, wishlistCount, siteSettings } = usePage<{
        auth?: { user?: AuthUser };
        wishlistCount?: number;
        siteSettings?: SiteSettings;
    }>().props;
    const siteName = siteSettings?.site_name || 'Latif Living';
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
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(e.target as Node)
            ) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
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
            router.visit(
                `/shop/products?filter[name]=${encodeURIComponent(searchQuery.trim())}`,
            );
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    // Calculate top position based on banner visibility
    const topPosition = bannerVisible ? 'top-10' : 'top-0';

    return (
        <>
            <nav
                className={`fixed ${topPosition} z-40 w-full border-b transition-all duration-500 ${scrolled ? 'border-terra-200 bg-white/80 py-4 backdrop-blur-md' : 'border-transparent bg-transparent py-6'}`}
            >
                <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 md:px-12">
                    <div
                        className="group flex cursor-pointer items-center"
                        onClick={onLogoClick}
                    >
                        <img
                            src="/assets/images/logo.webp"
                            alt={siteName}
                            className="h-7 w-auto object-contain md:h-8"
                        />
                    </div>

                    <div className="hidden items-center gap-8 md:flex">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="text-sm font-medium text-terra-600 transition-all hover:text-wood"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="rounded-full p-2 text-terra-900 transition-colors hover:bg-terra-100"
                        >
                            <Search size={20} />
                        </button>

                        {user && (
                            <Link
                                href="/shop/wishlist"
                                className="relative hidden rounded-full p-2 text-terra-900 transition-colors hover:bg-terra-100 md:flex"
                            >
                                <Heart size={20} />
                                {(wishlistCount ?? 0) > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-wood text-[10px] text-white shadow-sm">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        <button
                            onClick={onCartClick}
                            className="group relative rounded-full p-2 text-terra-900 transition-colors hover:bg-terra-100"
                        >
                            <ShoppingBag
                                size={20}
                                className="transition-transform group-hover:scale-110"
                            />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-wood text-[10px] text-white shadow-sm">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* User Menu */}
                        {user ? (
                            <div
                                className="relative hidden md:block"
                                ref={userMenuRef}
                            >
                                <button
                                    onClick={() =>
                                        setUserMenuOpen(!userMenuOpen)
                                    }
                                    className="flex items-center gap-2 rounded-full p-2 text-terra-900 transition-colors hover:bg-terra-100"
                                >
                                    {user.avatar_url ? (
                                        <img
                                            src={user.avatar_url}
                                            alt={user.name}
                                            className="h-8 w-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-terra-100">
                                            <User
                                                size={18}
                                                className="text-terra-600"
                                            />
                                        </div>
                                    )}
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-terra-100 bg-white py-2 shadow-lg">
                                        <div className="border-b border-terra-100 px-4 py-3">
                                            <p className="truncate font-medium text-terra-900">
                                                {user.name}
                                            </p>
                                            <p className="truncate text-sm text-terra-500">
                                                {user.email}
                                            </p>
                                        </div>
                                        <Link
                                            href="/shop/orders"
                                            className="flex items-center gap-3 px-4 py-2.5 text-terra-700 transition-colors hover:bg-terra-50"
                                        >
                                            <Package size={18} />
                                            <span>Pesanan Saya</span>
                                        </Link>
                                        <Link
                                            href="/shop/wishlist"
                                            className="flex items-center gap-3 px-4 py-2.5 text-terra-700 transition-colors hover:bg-terra-50"
                                        >
                                            <Heart size={18} />
                                            <span>Wishlist</span>
                                        </Link>
                                        <Link
                                            href={
                                                (user as any).roles?.includes(
                                                    'super-admin',
                                                ) ||
                                                (user as any).roles?.includes(
                                                    'admin',
                                                )
                                                    ? '/admin/settings'
                                                    : '/settings/profile'
                                            }
                                            className="flex items-center gap-3 px-4 py-2.5 text-terra-700 transition-colors hover:bg-terra-50"
                                        >
                                            <Settings size={18} />
                                            <span>Pengaturan</span>
                                        </Link>
                                        <div className="mt-2 border-t border-terra-100 pt-2">
                                            <button
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-3 px-4 py-2.5 text-red-600 transition-colors hover:bg-red-50"
                                            >
                                                <LogOut size={18} />
                                                <span>Keluar</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden items-center gap-2 rounded-full bg-terra-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-wood md:flex"
                            >
                                <User size={16} />
                                <span>Masuk</span>
                            </Link>
                        )}

                        <button className="p-2 text-terra-900 md:hidden">
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
                        className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-20 backdrop-blur-sm"
                        onClick={() => setSearchOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mx-4 w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <form
                                onSubmit={handleSearch}
                                className="flex items-center gap-4 p-4"
                            >
                                <Search
                                    size={24}
                                    className="flex-shrink-0 text-terra-400"
                                />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder="Cari produk furniture..."
                                    className="flex-1 text-lg outline-none placeholder:text-terra-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setSearchOpen(false)}
                                    className="rounded-full p-2 transition-colors hover:bg-terra-100"
                                >
                                    <X size={20} className="text-terra-500" />
                                </button>
                            </form>
                            <div className="border-t border-terra-100 px-4 py-3">
                                <p className="text-xs text-terra-400">
                                    Tekan{' '}
                                    <kbd className="rounded bg-terra-100 px-1.5 py-0.5 text-terra-600">
                                        Enter
                                    </kbd>{' '}
                                    untuk mencari atau{' '}
                                    <kbd className="rounded bg-terra-100 px-1.5 py-0.5 text-terra-600">
                                        Esc
                                    </kbd>{' '}
                                    untuk menutup
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
