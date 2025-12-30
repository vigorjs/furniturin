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
    Package,
    ShoppingCart,
    Users,
    LayoutDashboard,
    PlusCircle,
    UserPlus,
    Loader2,
    Info,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useInitials } from '@/hooks/use-initials';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AdminHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

interface SearchResults {
    products: Array<{ id: number; name: string; image: string; slug: string }>;
    users: Array<{ id: number; name: string; email: string; avatar: string }>;
    orders: Array<{ id: number; order_number: string; status: string }>;
}

export default function AdminHeader({ breadcrumbs = [] }: AdminHeaderProps) {
    const { auth } = usePage<SharedData>().props;
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [openSearch, setOpenSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResults>({
        products: [],
        users: [],
        orders: [],
    });
    const getInitials = useInitials();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/admin/notifications/unread');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications);
                setUnreadCount(data.unread_count);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Optional: Poll every minute
        const poll = setInterval(fetchNotifications, 60000);
        return () => clearInterval(poll);
    }, []);

    const markAsRead = async (id: string) => {
        router.patch(`/admin/notifications/${id}/read`, {}, {
            preserveScroll: true,
            onSuccess: () => fetchNotifications()
        });
    };

    const markAllRead = () => {
        router.post('/admin/notifications/mark-all-read', {}, {
             preserveScroll: true,
             onSuccess: () => fetchNotifications()
        });
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpenSearch((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim().length > 0) {
                setLoading(true);
                try {
                    const response = await fetch(`/admin/search?query=${encodeURIComponent(searchQuery)}`);
                    if (response.ok) {
                        const data = await response.json();
                        setSearchResults(data);
                    }
                } catch (error) {
                    console.error('Search failed:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setSearchResults({ products: [], users: [], orders: [] });
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const runCommand = (command: () => void) => {
        setOpenSearch(false);
        command();
    };

    const hasResults = searchResults.products.length > 0 || searchResults.users.length > 0 || searchResults.orders.length > 0;

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
                    <button
                        onClick={() => setOpenSearch(true)}
                        className="hidden md:flex items-center gap-2 px-3 py-2 w-64 bg-sand-50 border border-terra-200 rounded-xl text-sm text-terra-500 hover:bg-terra-50 hover:text-terra-900 transition-colors group"
                    >
                        <Search className="w-4 h-4 text-terra-400 group-hover:text-terra-600" />
                        <span>Cari sesuatu...</span>
                        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                            <span className="text-xs">Ctrl</span>K
                        </kbd>
                    </button>
                    {/* Mobile Search Icon */}
                     <button
                        onClick={() => setOpenSearch(true)}
                        className="md:hidden p-2 rounded-lg text-terra-500 hover:bg-terra-50 hover:text-terra-900 transition-colors"
                    >
                        <Search className="w-5 h-5" />
                    </button>

                    <CommandDialog open={openSearch} onOpenChange={setOpenSearch}>
                        <CommandInput 
                            placeholder="Ketik untuk mencari produk, pelanggan, atau menu..." 
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                        />
                        <CommandList>
                            <CommandEmpty>
                                {loading ? (
                                    <div className="flex items-center justify-center py-6">
                                        <Loader2 className="w-6 h-6 animate-spin text-wood" />
                                    </div>
                                ) : (
                                    "Tidak ada hasil ditemukan."
                                )}
                            </CommandEmpty>

                            <CommandGroup heading="Aksi Cepat">
                                <CommandItem onSelect={() => runCommand(() => router.visit('/admin/products/create'))}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    <span>Tambah Produk</span>
                                </CommandItem>
                                <CommandItem onSelect={() => runCommand(() => router.visit('/admin/users/create'))}>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    <span>Tambah Pengguna</span>
                                </CommandItem>
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup heading="Halaman Utama">
                                <CommandItem onSelect={() => runCommand(() => router.visit('/admin'))}>
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    <span>Dashboard</span>
                                </CommandItem>
                                <CommandItem onSelect={() => runCommand(() => router.visit('/admin/products'))}>
                                    <Package className="mr-2 h-4 w-4" />
                                    <span>Produk</span>
                                </CommandItem>
                                <CommandItem onSelect={() => runCommand(() => router.visit('/admin/orders'))}>
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    <span>Pesanan</span>
                                </CommandItem>
                                <CommandItem onSelect={() => runCommand(() => router.visit('/admin/customers'))}>
                                    <Users className="mr-2 h-4 w-4" />
                                    <span>Pelanggan</span>
                                </CommandItem>
                            </CommandGroup>
                            <CommandGroup heading="Pengaturan">
                                <CommandItem onSelect={() => runCommand(() => router.visit('/admin/users'))}>
                                    <Users className="mr-2 h-4 w-4" />
                                    <span>Manajemen User</span>
                                </CommandItem>
                                <CommandItem onSelect={() => runCommand(() => router.visit('/admin/profile'))}>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profil Saya</span>
                                </CommandItem>
                                <CommandItem onSelect={() => runCommand(() => router.visit('/admin/settings'))}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Pengaturan Toko</span>
                                </CommandItem>
                            </CommandGroup>

                            {hasResults && (
                                <>
                                    {searchResults.products.length > 0 && (
                                        <CommandGroup heading="Produk">
                                            {searchResults.products.map((product) => (
                                                <CommandItem 
                                                    key={product.id}
                                                    onSelect={() => runCommand(() => router.visit(`/admin/products/${product.id}/edit`))}
                                                >
                                                    <Package className="mr-2 h-4 w-4" />
                                                    <span>{product.name}</span>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    )}
                                    {searchResults.users.length > 0 && (
                                        <CommandGroup heading="Pelanggan">
                                            {searchResults.users.map((user) => (
                                                <CommandItem 
                                                    key={user.id}
                                                    onSelect={() => runCommand(() => router.visit(`/admin/customers/${user.id}`))}
                                                >
                                                    <User className="mr-2 h-4 w-4" />
                                                    <span>{user.name}</span>
                                                    <span className="ml-2 text-xs text-muted-foreground">{user.email}</span>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    )}
                                    {searchResults.orders.length > 0 && (
                                        <CommandGroup heading="Pesanan">
                                            {searchResults.orders.map((order) => (
                                                <CommandItem 
                                                    key={order.id}
                                                    onSelect={() => runCommand(() => router.visit(`/admin/orders/${order.id}`))}
                                                >
                                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                                    <span>#{order.order_number}</span>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    )}
                                </>
                            )}
                        </CommandList>
                    </CommandDialog>

                    {/* Notifications */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="relative p-2 rounded-lg text-terra-500 hover:bg-terra-50 hover:text-terra-900 transition-colors outline-none">
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                                )}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80 p-0">
                            <div className="p-4 border-b border-border bg-sand-50/50">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-terra-900">Notifikasi ({unreadCount})</h4>
                                    <button 
                                        onClick={markAllRead} 
                                        className="text-xs text-wood hover:text-wood-dark font-medium transition-colors"
                                    >
                                        Tandai semua dibaca
                                    </button>
                                </div>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((notif) => (
                                        <div 
                                            key={notif.id}
                                            onClick={() => markAsRead(notif.id)}
                                            className="p-4 hover:bg-sand-50 transition-colors border-b border-border/50 cursor-pointer group"
                                        >
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                                                    <Info className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-terra-900 group-hover:text-blue-700 transition-colors">
                                                        {notif.data.title || 'Notifikasi'}
                                                    </p>
                                                    <p className="text-xs text-terra-500 mt-0.5 line-clamp-2">
                                                        {notif.data.message}
                                                    </p>
                                                    <p className="text-[10px] text-terra-400 mt-2">
                                                        {new Date(notif.created_at).toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center">
                                        <p className="text-sm text-terra-400">Tidak ada notifikasi baru</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-2 border-t border-border">
                                <Link
                                    href="/admin/notifications"
                                    className="flex items-center justify-center w-full py-2 text-sm text-terra-600 hover:text-terra-900 hover:bg-sand-50 rounded-md transition-colors font-medium"
                                >
                                    Lihat Semua Notifikasi
                                </Link>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

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
                                        href="/admin/profile"
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-terra-700 hover:bg-terra-50 transition-colors"
                                    >
                                        <User className="w-4 h-4" />
                                        Profil Saya
                                    </Link>
                                    <Link
                                        href="/admin/settings"
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

