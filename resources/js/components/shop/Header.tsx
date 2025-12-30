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
    bannerVisible?: boolean;
    isHeroPage?: boolean; // If true, header is transparent initially (for pages with hero)
}

export const Header: React.FC<HeaderProps> = ({
    cartCount,
    onCartClick,
    onLogoClick,
    bannerVisible = false,
    isHeroPage = false, // Default to solid header for inner pages
}) => {
    const { auth, wishlistCount, siteSettings } = usePage<{
        auth?: { user?: AuthUser };
        wishlistCount?: number;
        siteSettings?: SiteSettings;
    }>().props;
    const siteName = siteSettings?.site_name || 'Furniturin';
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

    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchOpen]);

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

    const topPosition = bannerVisible ? 'top-10' : 'top-0';

    // Determine if header should be solid (scrolled OR not a hero page)
    const isSolidHeader = scrolled || !isHeroPage;

    return (
        <>
            <nav
                className={`fixed ${topPosition} z-40 w-full transition-all duration-300 ${
                    isSolidHeader
                        ? 'border-b border-neutral-100 bg-white/95 py-3 shadow-sm backdrop-blur-md'
                        : 'bg-transparent py-5'
                }`}
            >
                <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 md:px-12">
                    {/* Logo */}
                    <div
                        className="group flex cursor-pointer items-center"
                        onClick={onLogoClick}
                    >
                        <img
                            src="/assets/images/logo.webp"
                            alt={siteName}
                            className={`h-7 w-auto object-contain transition-all md:h-8 ${
                                isSolidHeader ? '' : 'brightness-0 invert'
                            }`}
                        />
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden items-center gap-8 lg:flex">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`text-sm font-medium transition-colors ${
                                    isSolidHeader
                                        ? 'text-neutral-600 hover:text-teal-500'
                                        : 'text-white/90 hover:text-white'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Icons */}
                    <div className="flex items-center gap-1 md:gap-2">
                        {/* Search */}
                        <button
                            onClick={() => setSearchOpen(true)}
                            className={`rounded-sm p-2.5 transition-colors ${
                                isSolidHeader
                                    ? 'text-neutral-700 hover:bg-neutral-100'
                                    : 'text-white hover:bg-white/10'
                            }`}
                        >
                            <Search size={20} />
                        </button>

                        {/* Wishlist */}
                        {user && (
                            <Link
                                href="/shop/wishlist"
                                className={`relative hidden rounded-sm p-2.5 transition-colors md:flex ${
                                    isSolidHeader
                                        ? 'text-neutral-700 hover:bg-neutral-100'
                                        : 'text-white hover:bg-white/10'
                                }`}
                            >
                                <Heart size={20} />
                                {(wishlistCount ?? 0) > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-teal-500 text-[10px] font-medium text-white">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* Cart */}
                        <button
                            onClick={onCartClick}
                            className={`group relative rounded-sm p-2.5 transition-colors ${
                                isSolidHeader
                                    ? 'text-neutral-700 hover:bg-neutral-100'
                                    : 'text-white hover:bg-white/10'
                            }`}
                        >
                            <ShoppingBag
                                size={20}
                                className="transition-transform group-hover:scale-105"
                            />
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-[10px] font-semibold text-neutral-800">
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
                                    className={`flex items-center gap-2 rounded-sm p-2 transition-colors ${
                                        isSolidHeader
                                            ? 'text-neutral-700 hover:bg-neutral-100'
                                            : 'text-white hover:bg-white/10'
                                    }`}
                                >
                                    {user.avatar_url ? (
                                        <img
                                            src={user.avatar_url}
                                            alt={user.name}
                                            className="h-8 w-8 rounded-sm object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-teal-500/20">
                                            <User
                                                size={18}
                                                className={
                                                    isSolidHeader
                                                        ? 'text-teal-500'
                                                        : 'text-white'
                                                }
                                            />
                                        </div>
                                    )}
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 z-50 mt-2 w-56 rounded-sm border border-neutral-100 bg-white py-2 shadow-lg">
                                        <div className="border-b border-neutral-100 px-4 py-3">
                                            <p className="truncate font-medium text-neutral-800">
                                                {user.name}
                                            </p>
                                            <p className="truncate text-sm text-neutral-500">
                                                {user.email}
                                            </p>
                                        </div>
                                        <Link
                                            href="/shop/orders"
                                            className="flex items-center gap-3 px-4 py-2.5 text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-teal-500"
                                        >
                                            <Package size={18} />
                                            <span>My Orders</span>
                                        </Link>
                                        <Link
                                            href="/shop/wishlist"
                                            className="flex items-center gap-3 px-4 py-2.5 text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-teal-500"
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
                                            className="flex items-center gap-3 px-4 py-2.5 text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-teal-500"
                                        >
                                            <Settings size={18} />
                                            <span>Settings</span>
                                        </Link>
                                        <div className="mt-2 border-t border-neutral-100 pt-2">
                                            <button
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-3 px-4 py-2.5 text-red-600 transition-colors hover:bg-red-50"
                                            >
                                                <LogOut size={18} />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className={`hidden items-center gap-2 rounded-sm px-5 py-2.5 text-sm font-medium transition-all md:flex ${
                                    isSolidHeader
                                        ? 'bg-teal-500 text-white hover:bg-teal-600'
                                        : 'bg-white text-teal-500 hover:bg-accent-500 hover:text-neutral-800'
                                }`}
                            >
                                <User size={16} />
                                <span>Sign In</span>
                            </Link>
                        )}

                        {/* Mobile Menu */}
                        <button
                            className={`p-2.5 lg:hidden ${
                                isSolidHeader
                                    ? 'text-neutral-700'
                                    : 'text-white'
                            }`}
                        >
                            <Menu size={22} />
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
                        className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-24 backdrop-blur-sm"
                        onClick={() => setSearchOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="mx-4 w-full max-w-2xl overflow-hidden rounded-sm bg-white shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <form
                                onSubmit={handleSearch}
                                className="flex items-center gap-4 p-5"
                            >
                                <Search
                                    size={22}
                                    className="flex-shrink-0 text-neutral-400"
                                />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder="Search furniture..."
                                    className="flex-1 text-lg outline-none placeholder:text-neutral-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setSearchOpen(false)}
                                    className="rounded-sm p-2 transition-colors hover:bg-neutral-100"
                                >
                                    <X size={20} className="text-neutral-500" />
                                </button>
                            </form>
                            <div className="border-t border-neutral-100 bg-neutral-50 px-5 py-3">
                                <p className="text-xs text-neutral-500">
                                    Press{' '}
                                    <kbd className="rounded-sm bg-neutral-200 px-1.5 py-0.5 font-medium text-neutral-700">
                                        Enter
                                    </kbd>{' '}
                                    to search or{' '}
                                    <kbd className="rounded-sm bg-neutral-200 px-1.5 py-0.5 font-medium text-neutral-700">
                                        Esc
                                    </kbd>{' '}
                                    to close
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
