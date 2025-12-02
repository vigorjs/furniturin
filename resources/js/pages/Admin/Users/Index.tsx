import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Pencil, Trash2, Shield, User, UserCog } from 'lucide-react';
import { useState } from 'react';

interface AdminUser {
    id: number;
    name: string;
    email: string;
    roles: string[];
    created_at: string;
}

interface UsersIndexProps {
    users: {
        data: AdminUser[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters?: { filter?: Record<string, string> };
    roles: string[];
}

const roleColors: Record<string, string> = {
    'super-admin': 'bg-red-100 text-red-700',
    'admin': 'bg-purple-100 text-purple-700',
    'manager': 'bg-blue-100 text-blue-700',
    'staff': 'bg-green-100 text-green-700',
    'customer': 'bg-terra-100 text-terra-700',
};

const roleLabels: Record<string, string> = {
    'super-admin': 'Super Admin',
    'admin': 'Admin',
    'manager': 'Manager',
    'staff': 'Staff',
    'customer': 'Customer',
};

export default function UsersIndex({ users, filters }: UsersIndexProps) {
    // Safely get filter name - check if filter is an object
    const filterName = filters?.filter && typeof filters.filter === 'object' ? filters.filter.name : '';
    const [search, setSearch] = useState(filterName || '');

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
            router.delete(`/admin/users/${id}`);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/users', search ? { 'filter[name]': search } : {}, { preserveState: true });
    };

    return (
        <AdminLayout breadcrumbs={[{ title: 'Manajemen User', href: '/admin/users' }]}>
            <Head title="Manajemen User" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-terra-900">Manajemen User</h1>
                        <p className="text-terra-500 mt-1">Kelola user admin dan staff</p>
                    </div>
                    <Link
                        href="/admin/users/create"
                        className="inline-flex items-center gap-2 bg-terra-900 hover:bg-wood-dark text-white font-medium py-2.5 px-4 rounded-xl transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Tambah User
                    </Link>
                </div>

                {/* Search */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-terra-100">
                    <form onSubmit={handleSearch} className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-terra-400" />
                        <input
                            type="text"
                            placeholder="Cari nama atau email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 placeholder:text-terra-400 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all"
                        />
                    </form>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-terra-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-sand-50 border-b border-terra-100">
                                <tr>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-terra-600">User</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-terra-600">Role</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-terra-600">Terdaftar</th>
                                    <th className="text-right py-4 px-6 text-sm font-medium text-terra-600">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-terra-100">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-terra-500">Tidak ada user ditemukan</td>
                                    </tr>
                                ) : users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-sand-50/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-terra-100 rounded-full flex items-center justify-center">
                                                    {user.roles.includes('super-admin') ? (
                                                        <Shield className="w-5 h-5 text-red-600" />
                                                    ) : user.roles.includes('admin') ? (
                                                        <UserCog className="w-5 h-5 text-purple-600" />
                                                    ) : (
                                                        <User className="w-5 h-5 text-terra-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-terra-900">{user.name}</p>
                                                    <p className="text-sm text-terra-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles.map((role: string) => (
                                                    <span key={role} className={`text-xs px-2 py-1 rounded-full font-medium ${roleColors[role] || 'bg-terra-100 text-terra-700'}`}>
                                                        {roleLabels[role] || role}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-terra-600">{user.created_at}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/users/${user.id}/edit`} className="p-2 rounded-lg text-terra-500 hover:bg-terra-100 transition-colors" title="Edit">
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                {!user.roles.includes('super-admin') && (
                                                    <button onClick={() => handleDelete(user.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors" title="Hapus">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.links.length > 3 && (
                        <div className="px-6 py-4 border-t border-terra-100 flex justify-center gap-1">
                            {users.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-3 py-1.5 rounded-lg text-sm ${link.active ? 'bg-terra-900 text-white' : link.url ? 'text-terra-600 hover:bg-terra-100' : 'text-terra-300 cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

