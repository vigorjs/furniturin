import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, Package, Tag, Layers, BarChart3 } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    slug: string;
    sku: string;
    description: string | null;
    price_formatted: string;
    final_price_formatted: string;
    has_discount: boolean;
    stock_quantity: number;
    sold_count: number;
    view_count: number;
    category: { id: number; name: string } | null;
    status: { value: string; label: string };
    is_featured: boolean;
    images: Array<{ id: number; url: string }>;
    created_at: string;
    updated_at: string;
}

interface ShowProductProps {
    product: Product;
}

export default function ShowProduct({ product }: ShowProductProps) {
    return (
        <AdminLayout breadcrumbs={[
            { title: 'Produk', href: '/admin/products' },
            { title: product.name, href: `/admin/products/${product.id}` }
        ]}>
            <Head title={product.name} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/products" className="p-2 rounded-lg text-terra-600 hover:bg-terra-100 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-terra-900">{product.name}</h1>
                            <p className="text-terra-500 mt-1">SKU: {product.sku}</p>
                        </div>
                    </div>
                    <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="inline-flex items-center gap-2 bg-terra-900 hover:bg-wood-dark text-white font-medium py-2.5 px-4 rounded-xl transition-all"
                    >
                        <Pencil className="w-4 h-4" />
                        Edit Produk
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-terra-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-wood/10 rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 text-wood" />
                            </div>
                            <div>
                                <p className="text-sm text-terra-500">Stok</p>
                                <p className="text-lg font-bold text-terra-900">{product.stock_quantity}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-terra-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                                <Tag className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-terra-500">Terjual</p>
                                <p className="text-lg font-bold text-terra-900">{product.sold_count}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-terra-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-terra-500">Dilihat</p>
                                <p className="text-lg font-bold text-terra-900">{product.view_count}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-terra-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                <Layers className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-terra-500">Kategori</p>
                                <p className="text-lg font-bold text-terra-900">{product.category?.name || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Product Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                            <h2 className="text-lg font-semibold text-terra-900 mb-4">Deskripsi Produk</h2>
                            <p className="text-terra-600 leading-relaxed">{product.description || 'Tidak ada deskripsi'}</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                            <h2 className="text-lg font-semibold text-terra-900 mb-4">Informasi Harga</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-terra-500">Harga Normal</p>
                                    <p className="text-xl font-bold text-terra-900">{product.price_formatted}</p>
                                </div>
                                {product.has_discount && (
                                    <div>
                                        <p className="text-sm text-terra-500">Harga Diskon</p>
                                        <p className="text-xl font-bold text-green-600">{product.final_price_formatted}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                            <h2 className="text-lg font-semibold text-terra-900 mb-4">Status</h2>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-terra-600">Status Produk</span>
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${product.status.value === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {product.status.label}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-terra-600">Produk Unggulan</span>
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${product.is_featured ? 'bg-wood/20 text-wood-dark' : 'bg-terra-100 text-terra-600'}`}>
                                        {product.is_featured ? 'Ya' : 'Tidak'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                            <h2 className="text-lg font-semibold text-terra-900 mb-4">Tanggal</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-terra-500">Dibuat</span>
                                    <span className="text-terra-900">{product.created_at}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-terra-500">Diperbarui</span>
                                    <span className="text-terra-900">{product.updated_at}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

