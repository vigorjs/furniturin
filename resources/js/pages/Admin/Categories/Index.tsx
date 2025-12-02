import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Pencil, Trash2, Layers } from 'lucide-react';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    products_count: number;
    is_active: boolean;
    is_featured: boolean;
    sort_order: number;
    parent: Category | null;
    children: Category[];
    created_at: string;
}

interface CategoriesIndexProps {
    categories: {
        data: Category[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        meta?: { current_page: number; last_page: number; per_page: number; total: number };
    };
}

export default function CategoriesIndex({ categories }: CategoriesIndexProps) {
    const [search, setSearch] = useState('');
    const categoryData = categories.data;

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
            router.delete(`/admin/categories/${id}`);
        }
    };

    const filteredCategories = categoryData.filter(cat =>
        cat.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout breadcrumbs={[{ title: 'Kategori', href: '/admin/categories' }]}>
            <Head title="Kelola Kategori" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-terra-900">Kelola Kategori</h1>
                        <p className="text-terra-500 mt-1">Kelola kategori produk di toko Anda</p>
                    </div>
                    <Link
                        href="/admin/categories/create"
                        className="inline-flex items-center gap-2 bg-terra-900 hover:bg-wood-dark text-white font-medium py-2.5 px-4 rounded-xl transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Tambah Kategori
                    </Link>
                </div>

                {/* Search */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-terra-100">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-terra-400" />
                        <input
                            type="text"
                            placeholder="Cari kategori..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 placeholder:text-terra-400 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all"
                        />
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCategories.map((category) => (
                        <div key={category.id} className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-wood/10 rounded-xl flex items-center justify-center">
                                        <Layers className="w-6 h-6 text-wood" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-terra-900">{category.name}</h3>
                                        <p className="text-sm text-terra-500">{category.products_count} produk</p>
                                    </div>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${category.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {category.is_active ? 'Aktif' : 'Nonaktif'}
                                </span>
                            </div>
                            {category.description && (
                                <p className="text-sm text-terra-600 mt-3 line-clamp-2">{category.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-terra-100">
                                <Link
                                    href={`/admin/categories/${category.id}/edit`}
                                    className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-terra-600 hover:bg-terra-50 transition-colors text-sm"
                                >
                                    <Pencil className="w-4 h-4" />
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredCategories.length === 0 && (
                    <div className="bg-white rounded-2xl p-12 shadow-sm border border-terra-100 text-center">
                        <Layers className="w-12 h-12 text-terra-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-terra-900">Tidak ada kategori</h3>
                        <p className="text-terra-500 mt-1">Mulai dengan menambahkan kategori baru</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

