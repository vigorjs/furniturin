import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, router } from '@inertiajs/react';
import { DollarSign, ShoppingCart, Users, Calendar, Download } from 'lucide-react';

interface ReportsIndexProps {
    summary: {
        totalSales: string;
        totalOrders: number;
        averageOrderValue: string;
        totalCustomers: number;
    };
    salesByDay: Array<{ date: string; total: number; orders: number }>;
    topProducts: Array<{ id: number; name: string; total_sold: number; revenue: string }>;
    topCustomers: Array<{ id: number; name: string; email: string; orders_count: number; total_spent: string }>;
    ordersByStatus: Array<{ status: string; label: string; count: number }>;
    period: string;
}

export default function ReportsIndex({ summary, salesByDay, topProducts, topCustomers, period }: ReportsIndexProps) {
    const handlePeriodChange = (newPeriod: string) => {
        router.get('/admin/reports', { period: newPeriod }, { preserveState: true });
    };

    return (
        <AdminLayout breadcrumbs={[{ title: 'Laporan', href: '/admin/reports' }]}>
            <Head title="Laporan & Analitik" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-terra-900">Laporan & Analitik</h1>
                        <p className="text-terra-500 mt-1">Pantau performa toko Anda</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={period}
                            onChange={(e) => handlePeriodChange(e.target.value)}
                            className="px-4 py-2.5 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all"
                        >
                            <option value="week">7 Hari Terakhir</option>
                            <option value="month">30 Hari Terakhir</option>
                            <option value="year">Tahun Ini</option>
                        </select>
                        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-terra-900 text-white hover:bg-wood-dark transition-colors">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-terra-500">Total Penjualan</p>
                            <p className="text-2xl font-bold text-terra-900 mt-1">{summary.totalSales}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-terra-500">Total Pesanan</p>
                            <p className="text-2xl font-bold text-terra-900 mt-1">{summary.totalOrders}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                        <div className="w-12 h-12 bg-wood/10 rounded-xl flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-wood" />
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-terra-500">Rata-rata Pesanan</p>
                            <p className="text-2xl font-bold text-terra-900 mt-1">{summary.averageOrderValue}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-terra-500">Total Pelanggan</p>
                            <p className="text-2xl font-bold text-terra-900 mt-1">{summary.totalCustomers}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Products */}
                    <div className="bg-white rounded-2xl shadow-sm border border-terra-100">
                        <div className="p-6 border-b border-terra-100">
                            <h2 className="text-lg font-semibold text-terra-900">Produk Terlaris</h2>
                        </div>
                        <div className="divide-y divide-terra-100">
                            {topProducts.length === 0 ? (
                                <div className="p-6 text-center text-terra-500">Belum ada data</div>
                            ) : topProducts.map((product, index) => (
                                <div key={product.id} className="p-4 flex items-center gap-4">
                                    <span className="w-8 h-8 bg-terra-100 rounded-lg flex items-center justify-center text-sm font-medium text-terra-600">{index + 1}</span>
                                    <div className="flex-1">
                                        <p className="font-medium text-terra-900">{product.name}</p>
                                        <p className="text-sm text-terra-500">{product.total_sold} terjual</p>
                                    </div>
                                    <p className="font-medium text-terra-900">{product.revenue}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sales by Day */}
                    <div className="bg-white rounded-2xl shadow-sm border border-terra-100">
                        <div className="p-6 border-b border-terra-100">
                            <h2 className="text-lg font-semibold text-terra-900">Penjualan Harian</h2>
                        </div>
                        <div className="divide-y divide-terra-100 max-h-96 overflow-y-auto">
                            {salesByDay.length === 0 ? (
                                <div className="p-6 text-center text-terra-500">Belum ada data</div>
                            ) : salesByDay.map((sale) => (
                                <div key={sale.date} className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-terra-400" />
                                        <span className="text-terra-900">{sale.date}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-terra-900">Rp {sale.total.toLocaleString('id-ID')}</p>
                                        <p className="text-sm text-terra-500">{sale.orders} pesanan</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Customers */}
                <div className="bg-white rounded-2xl shadow-sm border border-terra-100">
                    <div className="p-6 border-b border-terra-100">
                        <h2 className="text-lg font-semibold text-terra-900">Pelanggan Terbaik</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-sand-50 border-b border-terra-100">
                                <tr>
                                    <th className="text-left py-3 px-6 text-sm font-medium text-terra-600">#</th>
                                    <th className="text-left py-3 px-6 text-sm font-medium text-terra-600">Pelanggan</th>
                                    <th className="text-left py-3 px-6 text-sm font-medium text-terra-600">Pesanan</th>
                                    <th className="text-left py-3 px-6 text-sm font-medium text-terra-600">Total Belanja</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-terra-100">
                                {topCustomers.length === 0 ? (
                                    <tr><td colSpan={4} className="py-6 text-center text-terra-500">Belum ada data</td></tr>
                                ) : topCustomers.map((customer, index) => (
                                    <tr key={customer.id} className="hover:bg-sand-50/50">
                                        <td className="py-3 px-6 text-terra-600">{index + 1}</td>
                                        <td className="py-3 px-6">
                                            <p className="font-medium text-terra-900">{customer.name}</p>
                                            <p className="text-sm text-terra-500">{customer.email}</p>
                                        </td>
                                        <td className="py-3 px-6 text-terra-900">{customer.orders_count}</td>
                                        <td className="py-3 px-6 font-medium text-terra-900">{customer.total_spent}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

