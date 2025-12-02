import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';
import AdminSidebar from './admin-sidebar';
import AdminHeader from './admin-header';

interface AdminLayoutProps {
    breadcrumbs?: BreadcrumbItem[];
}

export default function AdminLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<AdminLayoutProps>) {
    return (
        <div className="min-h-screen bg-sand-50">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <div className="lg:pl-72">
                {/* Header */}
                <AdminHeader breadcrumbs={breadcrumbs} />

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

