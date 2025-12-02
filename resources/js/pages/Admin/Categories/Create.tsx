import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function CreateCategory() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/categories');
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Kategori', href: '/admin/categories' },
            { title: 'Tambah Kategori', href: '/admin/categories/create' }
        ]}>
            <Head title="Tambah Kategori" />

            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/categories" className="p-2 rounded-lg text-terra-600 hover:bg-terra-100 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-terra-900">Tambah Kategori Baru</h1>
                        <p className="text-terra-500 mt-1">Buat kategori baru untuk produk</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-terra-700 mb-2">Nama Kategori *</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 placeholder:text-terra-400 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all"
                                    placeholder="Masukkan nama kategori"
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-terra-700 mb-2">Deskripsi</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 placeholder:text-terra-400 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all resize-none"
                                    placeholder="Deskripsi kategori (opsional)"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="w-5 h-5 rounded border-terra-300 text-terra-900 focus:ring-wood"
                                    />
                                    <span className="text-terra-700">Kategori Aktif</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4">
                        <Link href="/admin/categories" className="px-6 py-3 rounded-xl border border-terra-200 text-terra-700 hover:bg-terra-50 transition-colors font-medium">
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-3 rounded-xl bg-terra-900 text-white hover:bg-wood-dark transition-colors font-medium disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Kategori'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

