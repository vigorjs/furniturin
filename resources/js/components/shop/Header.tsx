import { NAV_ITEMS } from '@/data/constants';
import { SiteSettings } from '@/types';
import { ApiCategory } from '@/types/shop';
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
    featuredCategories?: ApiCategory[];
}

export const Header: React.FC<HeaderProps> = ({
    cartCount,
    onCartClick,
    onLogoClick,
    bannerVisible = false,
    featuredCategories = [],
}) => {
    const { auth, wishlistCount, siteSettings } = usePage<{
        auth?: { user?: AuthUser };
        wishlistCount?: number;
        siteSettings?: SiteSettings;
    }>().props;
    const siteName = siteSettings?.site_name || 'Furniturin';
    const user = auth?.user;

    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

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

    return (
        <header className="relative sticky top-0 z-40 w-full bg-white shadow-sm">
            {/* Main Navigation */}
            <nav className="py-3">
                <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 md:px-12">
                    {/* Logo */}
                    <div
                        className="group flex flex-1 cursor-pointer items-center justify-start"
                        onClick={onLogoClick}
                    >
                        <img
                            src="/assets/images/logo.webp"
                            alt={siteName}
                            className="h-7 w-auto object-contain transition-all md:h-8"
                        />
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden flex-none items-center gap-8 lg:flex">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="text-sm font-medium text-neutral-600 transition-colors hover:text-teal-500"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Icons */}
                    <div className="flex flex-1 items-center justify-end gap-1 md:gap-2">
                        {/* Search */}
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="rounded-sm p-2.5 text-neutral-700 transition-colors hover:bg-neutral-100"
                        >
                            <Search size={20} />
                        </button>

                        {/* Wishlist */}
                        {user && (
                            <Link
                                href="/shop/wishlist"
                                className="relative hidden rounded-sm p-2.5 text-neutral-700 transition-colors hover:bg-neutral-100 md:flex"
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
                            className="group relative rounded-sm p-2.5 text-neutral-700 transition-colors hover:bg-neutral-100"
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
                                    className="flex items-center gap-2 rounded-sm p-2 text-neutral-700 transition-colors hover:bg-neutral-100"
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
                                                className="text-teal-500"
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
                                className="hidden items-center gap-2 rounded-sm bg-teal-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-teal-600 md:flex"
                            >
                                <User size={16} />
                                <span>Sign In</span>
                            </Link>
                        )}

                        {/* Mobile Menu */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="p-2.5 text-neutral-700 lg:hidden"
                        >
                            <Menu size={22} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Featured Categories Bar - Pottery Barn Style */}
            {featuredCategories.length > 0 && (
                <div className="hidden border-b border-neutral-100 bg-white sm:block">
                    <div className="mx-auto flex max-w-[1400px] items-center justify-center gap-6 overflow-x-auto px-6 py-2.5 md:gap-10 md:px-12">
                        {featuredCategories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/shop/products?filter[category_id]=${category.id}`}
                                className="text-xs font-medium tracking-wide whitespace-nowrap text-neutral-600 uppercase transition-colors hover:text-teal-500"
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

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

            {/* Mobile Sidebar Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
                        />
                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{
                                type: 'spring',
                                damping: 25,
                                stiffness: 200,
                            }}
                            className="fixed top-0 left-0 z-50 flex h-full w-full max-w-xs flex-col bg-white shadow-2xl lg:hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-neutral-100 p-5">
                                <img
                                    src="/assets/images/logo.webp"
                                    alt={siteName}
                                    className="h-7 w-auto"
                                />
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-sm p-2 text-neutral-500 hover:bg-neutral-100"
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-5">
                                {/* Navigation Links */}
                                <div className="mb-6">
                                    <h3 className="mb-3 text-xs font-semibold tracking-wide text-neutral-400 uppercase">
                                        Menu
                                    </h3>
                                    <div className="space-y-1">
                                        {NAV_ITEMS.map((item) => (
                                            <Link
                                                key={item.label}
                                                href={item.href}
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                                className="block rounded-sm px-3 py-2.5 font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-teal-500"
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Categories */}
                                {featuredCategories.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="mb-3 text-xs font-semibold tracking-wide text-neutral-400 uppercase">
                                            Kategori
                                        </h3>
                                        <div className="space-y-1">
                                            {featuredCategories.map(
                                                (category) => (
                                                    <Link
                                                        key={category.id}
                                                        href={`/shop/products?filter[category_id]=${category.id}`}
                                                        onClick={() =>
                                                            setMobileMenuOpen(
                                                                false,
                                                            )
                                                        }
                                                        className="block rounded-sm px-3 py-2.5 text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-teal-500"
                                                    >
                                                        {category.name}
                                                    </Link>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* User Section */}
                                {user ? (
                                    <div className="border-t border-neutral-100 pt-6">
                                        <div className="mb-4 flex items-center gap-3 px-3">
                                            {user.avatar_url ? (
                                                <img
                                                    src={user.avatar_url}
                                                    alt={user.name}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500/20">
                                                    <User
                                                        size={20}
                                                        className="text-teal-500"
                                                    />
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-medium text-neutral-800">
                                                    {user.name}
                                                </p>
                                                <p className="truncate text-sm text-neutral-500">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <Link
                                                href="/shop/orders"
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                                className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-neutral-600 hover:bg-neutral-50 hover:text-teal-500"
                                            >
                                                <Package size={18} />
                                                <span>Pesanan Saya</span>
                                            </Link>
                                            <Link
                                                href="/shop/wishlist"
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                                className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-neutral-600 hover:bg-neutral-50 hover:text-teal-500"
                                            >
                                                <Heart size={18} />
                                                <span>Wishlist</span>
                                                {(wishlistCount ?? 0) > 0 && (
                                                    <span className="ml-auto rounded-full bg-teal-500 px-2 py-0.5 text-xs font-medium text-white">
                                                        {wishlistCount}
                                                    </span>
                                                )}
                                            </Link>
                                            <Link
                                                href={
                                                    (
                                                        user as any
                                                    ).roles?.includes(
                                                        'super-admin',
                                                    ) ||
                                                    (
                                                        user as any
                                                    ).roles?.includes('admin')
                                                        ? '/admin/settings'
                                                        : '/settings/profile'
                                                }
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                                className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-neutral-600 hover:bg-neutral-50 hover:text-teal-500"
                                            >
                                                <Settings size={18} />
                                                <span>Pengaturan</span>
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setMobileMenuOpen(false);
                                                    handleLogout();
                                                }}
                                                className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-red-600 hover:bg-red-50"
                                            >
                                                <LogOut size={18} />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="border-t border-neutral-100 pt-6">
                                        <Link
                                            href="/login"
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                            className="flex w-full items-center justify-center gap-2 rounded-sm bg-teal-500 px-5 py-3 font-medium text-white transition-colors hover:bg-teal-600"
                                        >
                                            <User size={18} />
                                            <span>Masuk / Daftar</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
