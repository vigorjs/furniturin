import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
}

interface EditCategoryProps {
    category: Category;
}

export default function EditCategory({ category }: EditCategoryProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
        description: category.description || '',
        is_active: category.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/categories/${category.id}`);
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Kategori', href: '/admin/categories' },
            { title: 'Edit Kategori', href: `/admin/categories/${category.id}/edit` }
        ]}>
            <Head title={`Edit: ${category.name}`} />

            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/categories" className="p-2 rounded-lg text-terra-600 hover:bg-terra-100 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-terra-900">Edit Kategori</h1>
                        <p className="text-terra-500 mt-1">{category.name}</p>
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
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

