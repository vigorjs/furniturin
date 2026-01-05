import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    ChevronLeft,
    FolderTree,
    LayoutDashboard,
    Package,
    Settings,
    ShoppingCart,
    Star,
    Store,
    UserCog,
    Users,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { SiteSettings } from '@/types';

interface NavItem {
    title: string;
    href: string;
    icon: React.ElementType;
    permission?: string;
}

const mainNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    {
        title: 'Produk',
        href: '/admin/products',
        icon: Package,
        permission: 'view products',
    },
    {
        title: 'Kategori',
        href: '/admin/categories',
        icon: FolderTree,
        permission: 'view categories',
    },
    {
        title: 'Pesanan',
        href: '/admin/orders',
        icon: ShoppingCart,
        permission: 'view orders',
    },
    {
        title: 'Pelanggan',
        href: '/admin/customers',
        icon: Users,
        permission: 'view users',
    },
    {
        title: 'Ulasan',
        href: '/admin/reviews',
        icon: Star,
        permission: 'view reviews',
    },
    {
        title: 'Laporan',
        href: '/admin/reports',
        icon: BarChart3,
        permission: 'view reports',
    },
];

const settingsNavItems: NavItem[] = [
    {
        title: 'Manajemen User',
        href: '/admin/users',
        icon: UserCog,
        permission: 'manage roles',
    },
    {
        title: 'Profil Saya',
        href: '/admin/profile',
        icon: Users,
        permission: '',
    },
    {
        title: 'Pengaturan',
        href: '/admin/settings',
        icon: Settings,
        permission: 'manage settings',
    },
];

interface AdminSidebarProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

export default function AdminSidebar({
    collapsed,
    setCollapsed,
}: AdminSidebarProps) {
    // Get current URL path
    const currentPath =
        typeof window !== 'undefined' ? window.location.pathname : '';

    // Get site settings
    const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
    const siteName = siteSettings?.site_name || 'Latif Living';

    // Check if user has permission (simplified - will be enhanced later)
    const hasPermission = (permission?: string) => {
        if (!permission) return true;
        // For now, return true. Will be connected to actual permissions later
        return true;
    };

    const isActive = (href: string) => {
        if (href === '/admin') {
            return currentPath === '/admin' || currentPath === '/admin/';
        }
        return currentPath.startsWith(href);
    };

    return (
        <>
            {/* Mobile overlay */}
            <div className="fixed inset-0 z-40 hidden bg-black/50 lg:hidden" />

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 flex flex-col bg-gradient-to-b from-teal-900 via-teal-800 to-teal-950 transition-all duration-300',
                    collapsed ? 'w-20' : 'w-72',
                    'hidden lg:flex',
                )}
            >
                {/* Logo */}
                <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
                    <Link href="/admin" className="flex items-center gap-3">
                        <img
                            src="/assets/images/logo.webp"
                            alt={siteName}
                            className={cn(
                                'h-8 w-auto object-contain brightness-0 invert transition-all',
                                collapsed && 'hidden h-10',
                            )}
                        />
                        {!collapsed && (
                            <span
                                className={cn(
                                    'text-lg font-semibold text-white',
                                    collapsed && 'hidden',
                                )}
                            >
                                Admin
                            </span>
                        )}
                    </Link>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className={cn(
                            'rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white',
                            collapsed && 'mx-auto',
                        )}
                    >
                        <ChevronLeft
                            className={cn(
                                'h-5 w-5 transition-transform',
                                collapsed && 'rotate-180',
                            )}
                        />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-x-hidden overflow-y-auto px-4 py-4">
                    {/* Main Menu */}
                    <div className="space-y-1">
                        {!collapsed && (
                            <p className="mb-2 px-3 text-xs font-medium tracking-wider text-white/40 uppercase">
                                Menu Utama
                            </p>
                        )}
                        {mainNavItems
                            .filter((item) => hasPermission(item.permission))
                            .map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-all',
                                        collapsed
                                            ? 'justify-center px-2'
                                            : 'px-3',
                                        isActive(item.href)
                                            ? 'bg-white/15 text-white shadow-lg'
                                            : 'text-white/70 hover:bg-white/10 hover:text-white',
                                    )}
                                >
                                    <item.icon className="h-5 w-5 flex-shrink-0" />
                                    {!collapsed && (
                                        <span className="truncate">
                                            {item.title}
                                        </span>
                                    )}
                                </Link>
                            ))}
                    </div>

                    {/* Settings Menu */}
                    <div className="mt-8 space-y-1">
                        {!collapsed && (
                            <p className="mb-2 px-3 text-xs font-medium tracking-wider text-white/40 uppercase">
                                Pengaturan
                            </p>
                        )}
                        {settingsNavItems
                            .filter((item) => hasPermission(item.permission))
                            .map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-all',
                                        collapsed
                                            ? 'justify-center px-2'
                                            : 'px-3',
                                        isActive(item.href)
                                            ? 'bg-white/15 text-white shadow-lg'
                                            : 'text-white/70 hover:bg-white/10 hover:text-white',
                                    )}
                                >
                                    <item.icon className="h-5 w-5 flex-shrink-0" />
                                    {!collapsed && (
                                        <span className="truncate">
                                            {item.title}
                                        </span>
                                    )}
                                </Link>
                            ))}
                    </div>
                </nav>

                {/* Footer */}
                <div className="border-t border-white/10 p-4">
                    <Link
                        href="/"
                        className={cn(
                            'flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white',
                            collapsed ? 'justify-center px-2' : 'px-3',
                        )}
                    >
                        <Store className="h-5 w-5 flex-shrink-0" />
                        {!collapsed && (
                            <span className="truncate">Lihat Toko</span>
                        )}
                    </Link>
                </div>
            </aside>
        </>
    );
}
