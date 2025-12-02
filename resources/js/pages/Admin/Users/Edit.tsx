import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface UserData {
    id: number;
    name: string;
    email: string;
    roles: string[];
}

interface EditUserProps {
    user: UserData;
    roles: string[];
}

const roleLabels: Record<string, string> = {
    'super-admin': 'Super Admin',
    'admin': 'Admin',
    'manager': 'Manager',
    'staff': 'Staff',
    'customer': 'Customer',
};

export default function EditUser({ user, roles }: EditUserProps) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        role: user.roles[0] || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Manajemen User', href: '/admin/users' },
            { title: 'Edit User', href: `/admin/users/${user.id}/edit` }
        ]}>
            <Head title={`Edit User: ${user.name}`} />

            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/users" className="p-2 rounded-lg text-terra-600 hover:bg-terra-100 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-terra-900">Edit User</h1>
                        <p className="text-terra-500 mt-1">Perbarui informasi user</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-terra-700 mb-2">Nama Lengkap</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all"
                            placeholder="Masukkan nama lengkap"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-terra-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all"
                            placeholder="email@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-terra-700 mb-2">Password Baru <span className="text-terra-400">(kosongkan jika tidak ingin mengubah)</span></label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full px-4 py-3 pr-12 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all"
                                placeholder="Masukkan password baru"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-terra-400 hover:text-terra-600">
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-terra-700 mb-2">Role</label>
                        <select
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all"
                        >
                            <option value="">Pilih Role</option>
                            {roles.map((role) => (
                                <option key={role} value={role}>{roleLabels[role] || role}</option>
                            ))}
                        </select>
                        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-terra-100">
                        <Link href="/admin/users" className="px-6 py-2.5 rounded-xl border border-terra-200 text-terra-700 hover:bg-terra-50 transition-colors">
                            Batal
                        </Link>
                        <button type="submit" disabled={processing} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-terra-900 text-white hover:bg-wood-dark disabled:opacity-50 transition-colors">
                            <Save className="w-4 h-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

