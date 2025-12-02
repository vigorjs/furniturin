import { Link } from '@inertiajs/react';
import {
    LayoutDashboard,
    Package,
    FolderTree,
    ShoppingCart,
    Users,
    Star,
    BarChart3,
    UserCog,
    Settings,
    ChevronLeft,
    Store,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface NavItem {
    title: string;
    href: string;
    icon: React.ElementType;
    permission?: string;
}

const mainNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { title: 'Produk', href: '/admin/products', icon: Package, permission: 'view products' },
    { title: 'Kategori', href: '/admin/categories', icon: FolderTree, permission: 'view categories' },
    { title: 'Pesanan', href: '/admin/orders', icon: ShoppingCart, permission: 'view orders' },
    { title: 'Pelanggan', href: '/admin/customers', icon: Users, permission: 'view users' },
    { title: 'Ulasan', href: '/admin/reviews', icon: Star, permission: 'view reviews' },
    { title: 'Laporan', href: '/admin/reports', icon: BarChart3, permission: 'view reports' },
];

const settingsNavItems: NavItem[] = [
    { title: 'Manajemen User', href: '/admin/users', icon: UserCog, permission: 'manage roles' },
    { title: 'Pengaturan', href: '/admin/settings', icon: Settings, permission: 'manage settings' },
];

export default function AdminSidebar() {
    const [collapsed, setCollapsed] = useState(false);

    // Get current URL path
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

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
            <div className="fixed inset-0 z-40 bg-black/50 lg:hidden hidden" />

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 flex flex-col bg-gradient-to-b from-terra-900 via-terra-800 to-wood-dark transition-all duration-300',
                    collapsed ? 'w-20' : 'w-72',
                    'hidden lg:flex'
                )}
            >
                {/* Logo */}
                <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
                    <Link href="/admin" className="flex items-center gap-3">
                        <img
                            src="/assets/images/logo.webp"
                            alt="Latif Living"
                            className={cn(
                                'h-8 w-auto object-contain brightness-0 invert transition-all',
                                collapsed && 'h-10'
                            )}
                        />
                        {!collapsed && (
                            <span className="text-white font-semibold text-lg">Admin</span>
                        )}
                    </Link>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <ChevronLeft className={cn('w-5 h-5 transition-transform', collapsed && 'rotate-180')} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3">
                    {/* Main Menu */}
                    <div className="space-y-1">
                        {!collapsed && (
                            <p className="px-3 mb-2 text-xs font-medium text-white/40 uppercase tracking-wider">
                                Menu Utama
                            </p>
                        )}
                        {mainNavItems.filter(item => hasPermission(item.permission)).map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                                    isActive(item.href)
                                        ? 'bg-white/15 text-white shadow-lg'
                                        : 'text-white/70 hover:text-white hover:bg-white/10'
                                )}
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                {!collapsed && <span>{item.title}</span>}
                            </Link>
                        ))}
                    </div>

                    {/* Settings Menu */}
                    <div className="mt-8 space-y-1">
                        {!collapsed && (
                            <p className="px-3 mb-2 text-xs font-medium text-white/40 uppercase tracking-wider">
                                Pengaturan
                            </p>
                        )}
                        {settingsNavItems.filter(item => hasPermission(item.permission)).map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                                    isActive(item.href)
                                        ? 'bg-white/15 text-white shadow-lg'
                                        : 'text-white/70 hover:text-white hover:bg-white/10'
                                )}
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                {!collapsed && <span>{item.title}</span>}
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* Footer */}
                <div className="p-3 border-t border-white/10">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <Store className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && <span>Lihat Toko</span>}
                    </Link>
                </div>
            </aside>
        </>
    );
}

