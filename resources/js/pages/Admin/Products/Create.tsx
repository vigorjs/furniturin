import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

interface CreateProductProps {
    categories: Category[];
}

export default function CreateProduct({ categories }: CreateProductProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        sku: '',
        category_id: '',
        description: '',
        price: '',
        discount_percentage: '',
        stock_quantity: '',
        status: 'active',
        is_featured: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/products');
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Produk', href: '/admin/products' },
            { title: 'Tambah Produk', href: '/admin/products/create' }
        ]}>
            <Head title="Tambah Produk" />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/products"
                        className="p-2 rounded-lg text-terra-600 hover:bg-terra-100 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-terra-900">Tambah Produk Baru</h1>
                        <p className="text-terra-500 mt-1">Isi detail produk di bawah ini</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                        <h2 className="text-lg font-semibold text-terra-900 mb-4">Informasi Dasar</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-terra-700 mb-2">Nama Produk *</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 placeholder:text-terra-400 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all"
                                    placeholder="Masukkan nama produk"
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-terra-700 mb-2">SKU *</label>
                                <input
                                    type="text"
                                    value={data.sku}
                                    onChange={(e) => setData('sku', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 placeholder:text-terra-400 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all"
                                    placeholder="KRS-001"
                                />
                                {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-terra-700 mb-2">Kategori *</label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all"
                                >
                                    <option value="">Pilih kategori</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-terra-700 mb-2">Deskripsi</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 placeholder:text-terra-400 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all resize-none"
                                    placeholder="Deskripsi produk..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                        <h2 className="text-lg font-semibold text-terra-900 mb-4">Harga & Stok</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-terra-700 mb-2">Harga *</label>
                                <input type="number" value={data.price} onChange={(e) => setData('price', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all" placeholder="0" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-terra-700 mb-2">Diskon (%)</label>
                                <input type="number" value={data.discount_percentage} onChange={(e) => setData('discount_percentage', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all" placeholder="0" min="0" max="100" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-terra-700 mb-2">Stok *</label>
                                <input type="number" value={data.stock_quantity} onChange={(e) => setData('stock_quantity', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all" placeholder="0" />
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                        <h2 className="text-lg font-semibold text-terra-900 mb-4">Status</h2>
                        <div className="flex flex-wrap gap-6">
                            <div>
                                <label className="block text-sm font-medium text-terra-700 mb-2">Status Produk</label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all"
                                >
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Nonaktif</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer self-end pb-3">
                                <input type="checkbox" checked={data.is_featured} onChange={(e) => setData('is_featured', e.target.checked)} className="w-5 h-5 rounded border-terra-300 text-terra-900 focus:ring-wood" />
                                <span className="text-terra-700">Produk Unggulan</span>
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4">
                        <Link href="/admin/products" className="px-6 py-3 rounded-xl border border-terra-200 text-terra-700 hover:bg-terra-50 transition-colors font-medium">Batal</Link>
                        <button type="submit" disabled={processing} className="px-6 py-3 rounded-xl bg-terra-900 text-white hover:bg-wood-dark transition-colors font-medium disabled:opacity-50">
                            {processing ? 'Menyimpan...' : 'Simpan Produk'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

