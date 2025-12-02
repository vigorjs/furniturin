import { Link, usePage, router } from '@inertiajs/react';
import { type BreadcrumbItem, type SharedData } from '@/types';
import {
    Bell,
    Search,
    Menu,
    LogOut,
    User,
    Settings,
    ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { useInitials } from '@/hooks/use-initials';

interface AdminHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export default function AdminHeader({ breadcrumbs = [] }: AdminHeaderProps) {
    const { auth } = usePage<SharedData>().props;
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const getInitials = useInitials();

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <header className="sticky top-0 z-30 bg-white border-b border-terra-100">
            <div className="flex h-16 items-center justify-between px-6">
                {/* Left side - Mobile menu + Breadcrumbs */}
                <div className="flex items-center gap-4">
                    {/* Mobile menu button */}
                    <button
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="lg:hidden p-2 rounded-lg text-terra-600 hover:bg-terra-50 transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Breadcrumbs */}
                    <nav className="hidden sm:flex items-center gap-2 text-sm">
                        <Link
                            href="/admin"
                            className="text-terra-500 hover:text-terra-900 transition-colors"
                        >
                            Dashboard
                        </Link>
                        {breadcrumbs.map((crumb, index) => (
                            <div key={crumb.href} className="flex items-center gap-2">
                                <ChevronRight className="w-4 h-4 text-terra-300" />
                                {index === breadcrumbs.length - 1 ? (
                                    <span className="text-terra-900 font-medium">{crumb.title}</span>
                                ) : (
                                    <Link
                                        href={crumb.href}
                                        className="text-terra-500 hover:text-terra-900 transition-colors"
                                    >
                                        {crumb.title}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Right side - Search, Notifications, User */}
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <button className="p-2 rounded-lg text-terra-500 hover:bg-terra-50 hover:text-terra-900 transition-colors">
                        <Search className="w-5 h-5" />
                    </button>

                    {/* Notifications */}
                    <button className="relative p-2 rounded-lg text-terra-500 hover:bg-terra-50 hover:text-terra-900 transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </button>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-terra-50 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-terra-200 flex items-center justify-center">
                                {auth.user.avatar ? (
                                    <img
                                        src={auth.user.avatar}
                                        alt={auth.user.name}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-sm font-medium text-terra-700">
                                        {getInitials(auth.user.name)}
                                    </span>
                                )}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-terra-900">{auth.user.name}</p>
                                <p className="text-xs text-terra-500">Administrator</p>
                            </div>
                        </button>

                        {/* Dropdown */}
                        {showUserMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowUserMenu(false)}
                                />
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-terra-100 py-2 z-50">
                                    <div className="px-4 py-2 border-b border-terra-100">
                                        <p className="text-sm font-medium text-terra-900">{auth.user.name}</p>
                                        <p className="text-xs text-terra-500">{auth.user.email}</p>
                                    </div>
                                    <Link
                                        href="/settings/profile"
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-terra-700 hover:bg-terra-50 transition-colors"
                                    >
                                        <User className="w-4 h-4" />
                                        Profil Saya
                                    </Link>
                                    <Link
                                        href="/settings"
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-terra-700 hover:bg-terra-50 transition-colors"
                                    >
                                        <Settings className="w-4 h-4" />
                                        Pengaturan
                                    </Link>
                                    <div className="border-t border-terra-100 mt-2 pt-2">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Keluar
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

