import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link } from '@inertiajs/react';
import {
    Package,
    ShoppingCart,
    Users,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    ArrowRight,
    Clock,
    AlertTriangle,
} from 'lucide-react';
import { useState } from 'react';
import Pagination from '@/components/pagination';

interface DashboardProps {
    stats: {
        totalProducts: number;
        totalOrders: number;
        totalCustomers: number;
        totalRevenue: number;
        ordersGrowth: number;
        revenueGrowth: number;
    };
    recentOrders: {
        data: Array<{
            id: number;
            order_number: string;
            customer: string;
            total: string;
            status: string;
            created_at: string;
        }>;
        links: Array<{ url: string | null; label: string; active: boolean }>;
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    lowStockProducts: {
        data: Array<{
            id: number;
            name: string;
            stock: number;
            sku: string;
        }>;
        links: Array<{ url: string | null; label: string; active: boolean }>;
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
    pending: 'Menunggu',
    processing: 'Diproses',
    shipped: 'Dikirim',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
};

export default function Dashboard({
    stats,
    recentOrders,
    lowStockProducts,
}: DashboardProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <AdminLayout>
            <Head title="Dashboard Admin" />

            <div className="space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-2xl font-bold text-terra-900">Dashboard</h1>
                    <p className="text-terra-500 mt-1">Selamat datang kembali! Berikut ringkasan toko Anda.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Products */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-wood/10 rounded-xl flex items-center justify-center">
                                <Package className="w-6 h-6 text-wood" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-terra-500">Total Produk</p>
                            <p className="text-2xl font-bold text-terra-900 mt-1">{stats.totalProducts}</p>
                        </div>
                    </div>

                    {/* Total Orders */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                <ShoppingCart className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className={`flex items-center gap-1 text-sm ${stats.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {stats.ordersGrowth >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                {Math.abs(stats.ordersGrowth)}%
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-terra-500">Total Pesanan</p>
                            <p className="text-2xl font-bold text-terra-900 mt-1">{stats.totalOrders}</p>
                        </div>
                    </div>

                    {/* Total Customers */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                                <Users className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-terra-500">Total Pelanggan</p>
                            <p className="text-2xl font-bold text-terra-900 mt-1">{stats.totalCustomers}</p>
                        </div>
                    </div>

                    {/* Total Revenue */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                            <div className={`flex items-center gap-1 text-sm ${stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {stats.revenueGrowth >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                {Math.abs(stats.revenueGrowth)}%
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-terra-500">Total Pendapatan</p>
                            <p className="text-2xl font-bold text-terra-900 mt-1">{formatCurrency(stats.totalRevenue)}</p>
                        </div>
                    </div>
                </div>

                {/* Recent Orders & Low Stock */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Orders */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-terra-100">
                        <div className="p-6 border-b border-terra-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-terra-900">Pesanan Terbaru</h2>
                                <Link href="/admin/orders" className="text-sm text-wood hover:text-wood-dark transition-colors flex items-center gap-1">
                                    Lihat Semua <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                        <div className="divide-y divide-terra-100">
                            {recentOrders.data.map((order) => (
                                <div key={order.id} className="p-4 hover:bg-sand-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-terra-100 rounded-lg flex items-center justify-center">
                                                <ShoppingCart className="w-5 h-5 text-terra-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-terra-900">{order.order_number}</p>
                                                <p className="text-sm text-terra-500">{order.customer}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-terra-900">{order.total}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>
                                                    {statusLabels[order.status]}
                                                </span>
                                                <span className="text-xs text-terra-400 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {order.created_at}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Pagination removed */}
                    </div>

                    {/* Low Stock Alert */}
                    <div className="bg-white rounded-2xl shadow-sm border border-terra-100 overflow-hidden">
                        <div className="p-6 border-b border-terra-100 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-terra-900 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-orange-500" />
                                Stok Menipis
                            </h2>
                            <Link href="/admin/products?filter[stock]=low" className="text-sm text-wood hover:text-wood-dark transition-colors flex items-center gap-1">
                                Lihat Semua <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="divide-y divide-terra-100">
                            {lowStockProducts.data.map((product) => (
                                <div key={product.id} className="p-4 flex items-center justify-between hover:bg-sand-50/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-terra-100 rounded-lg flex items-center justify-center">
                                            <Package className="w-5 h-5 text-terra-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-terra-900">{product.name}</p>
                                            <p className="text-sm text-terra-500">{product.sku}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-orange-600">{product.stock} tersisa</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination removed */}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

