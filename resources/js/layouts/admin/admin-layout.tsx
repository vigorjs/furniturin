import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren, useState } from 'react';
import AdminHeader from './admin-header';
import AdminSidebar from './admin-sidebar';

interface AdminLayoutProps {
    breadcrumbs?: BreadcrumbItem[];
}

export default function AdminLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<AdminLayoutProps>) {
    const [collapsed, setCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('admin-sidebar-collapsed') === 'true';
        }
        return false;
    });

    const [mobileOpen, setMobileOpen] = useState(false);

    const handleSetCollapsed = (
        value: boolean | ((prevState: boolean) => boolean),
    ) => {
        setCollapsed((prev) => {
            const newValue = typeof value === 'function' ? value(prev) : value;
            localStorage.setItem('admin-sidebar-collapsed', String(newValue));
            return newValue;
        });
    };

    return (
        <div className="min-h-screen bg-sand-50">
            {/* Sidebar */}
            <AdminSidebar
                collapsed={collapsed}
                setCollapsed={handleSetCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            {/* Main Content */}
            <div
                className={cn(
                    'transition-all duration-300',
                    collapsed ? 'lg:pl-20' : 'lg:pl-72',
                )}
            >
                {/* Header */}
                <AdminHeader
                    breadcrumbs={breadcrumbs}
                    onMobileMenuClick={() => setMobileOpen(true)}
                />

                {/* Page Content */}
                <main className="p-4 sm:p-6">{children}</main>
            </div>
        </div>
    );
}
