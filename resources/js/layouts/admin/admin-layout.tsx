import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren, useState } from 'react';
import AdminSidebar from './admin-sidebar';
import AdminHeader from './admin-header';
import { cn } from '@/lib/utils';

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

    const handleSetCollapsed = (value: boolean | ((prevState: boolean) => boolean)) => {
        setCollapsed((prev) => {
            const newValue = typeof value === 'function' ? value(prev) : value;
            localStorage.setItem('admin-sidebar-collapsed', String(newValue));
            return newValue;
        });
    };

    return (
        <div className="min-h-screen bg-sand-50">
            {/* Sidebar */}
            <AdminSidebar collapsed={collapsed} setCollapsed={handleSetCollapsed} />

            {/* Main Content */}
            <div
                className={cn(
                    'transition-all duration-300',
                    collapsed ? 'lg:pl-20' : 'lg:pl-72'
                )}
            >
                {/* Header */}
                <AdminHeader breadcrumbs={breadcrumbs} />

                {/* Page Content */}
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}

