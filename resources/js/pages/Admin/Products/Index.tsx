import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Filter, Eye, Pencil, Trash2, Package } from 'lucide-react';
import { useState } from 'react';

interface Product {
    id: number;
    name: string;
    slug: string;
    sku: string;
    price: number;
    price_formatted: string;
    stock_quantity: number;
    status: { value: string; label: string };
    sale_type: { value: string; label: string };
    category: { id: number; name: string } | null;
    primary_image: { id: number; image_url: string } | null;
    images: Array<{ id: number; image_url: string }>;
    created_at: string;
}

interface Category {
    id: number;
    name: string;
}

interface ProductsIndexProps {
    products: {
        data: Product[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        meta?: { current_page: number; last_page: number; per_page: number; total: number };
    };
    categories: Category[];
    filters?: { filter?: Record<string, string>; sort?: string };
    statuses: Array<{ value: string; name: string }>;
    saleTypes: Array<{ value: string; name: string }>;
}

export default function ProductsIndex({ products, filters }: ProductsIndexProps) {
    // Safely get filter name - check if filter is an object
    const filterName = filters?.filter && typeof filters.filter === 'object' ? filters.filter.name : '';
    const [search, setSearch] = useState(filterName || '');
    const productData = products.data;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/products', { 'filter[name]': search }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            router.delete(`/admin/products/${id}`);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700';
            case 'inactive': return 'bg-gray-100 text-gray-700';
            case 'out_of_stock': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <AdminLayout breadcrumbs={[{ title: 'Produk', href: '/admin/products' }]}>
            <Head title="Kelola Produk" />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-terra-900">Kelola Produk</h1>
                        <p className="text-terra-500 mt-1">Kelola semua produk di toko Anda</p>
                    </div>
                    <Link href="/admin/products/create" className="inline-flex items-center gap-2 bg-terra-900 hover:bg-wood-dark text-white font-medium py-2.5 px-4 rounded-xl transition-all">
                        <Plus className="w-5 h-5" /> Tambah Produk
                    </Link>
                </div>
                {/* Filters */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-terra-100">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-terra-400" />
                            <input type="text" placeholder="Cari produk..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 placeholder:text-terra-400 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all" />
                        </div>
                        <button type="button" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-terra-200 text-terra-700 hover:bg-terra-50 transition-colors">
                            <Filter className="w-5 h-5" /> Filter
                        </button>
                    </form>
                </div>
                {/* Products Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-terra-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-sand-50 border-b border-terra-100">
                                <tr>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-terra-600">Produk</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-terra-600">SKU</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-terra-600">Kategori</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-terra-600">Harga</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-terra-600">Stok</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-terra-600">Status</th>
                                    <th className="text-right py-4 px-6 text-sm font-medium text-terra-600">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-terra-100">
                                {productData.length === 0 ? (
                                    <tr><td colSpan={7} className="py-12 text-center text-terra-500">Belum ada produk</td></tr>
                                ) : productData.map((product) => (
                                    <tr key={product.id} className="hover:bg-sand-50/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-terra-100 rounded-lg flex items-center justify-center overflow-hidden">
                                                    {product.primary_image?.image_url ? (
                                                        <img src={product.primary_image.image_url} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package className="w-6 h-6 text-terra-400" />
                                                    )}
                                                </div>
                                                <p className="font-medium text-terra-900">{product.name}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-terra-600">{product.sku}</td>
                                        <td className="py-4 px-6 text-sm text-terra-600">{product.category?.name || '-'}</td>
                                        <td className="py-4 px-6 text-sm font-medium text-terra-900">{product.price_formatted}</td>
                                        <td className="py-4 px-6">
                                            <span className={`text-sm font-medium ${product.stock_quantity < 10 ? 'text-orange-600' : 'text-terra-600'}`}>{product.stock_quantity}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(product.status.value)}`}>{product.status.label}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/products/${product.id}`} className="p-2 rounded-lg text-terra-500 hover:bg-terra-100 transition-colors" title="Lihat"><Eye className="w-4 h-4" /></Link>
                                                <Link href={`/admin/products/${product.id}/edit`} className="p-2 rounded-lg text-terra-500 hover:bg-terra-100 transition-colors" title="Edit"><Pencil className="w-4 h-4" /></Link>
                                                <button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors" title="Hapus"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
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

