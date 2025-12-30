import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ChevronRight,
    CreditCard,
    Globe,
    Home,
    Mail,
    MapPin,
    Phone,
    Save,
    Store,
} from 'lucide-react';

interface SettingsIndexProps {
    settings: {
        site_name: string;
        site_description: string;
        contact_email: string;
        contact_phone: string;
        contact_whatsapp: string;
        address: string;
        facebook_url: string;
        instagram_url: string;
        tiktok_url: string;
    };
}

export default function SettingsIndex({ settings }: SettingsIndexProps) {
    const { data, setData, post, processing } = useForm(settings);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/settings');
    };

    return (
        <AdminLayout
            breadcrumbs={[{ title: 'Pengaturan', href: '/admin/settings' }]}
        >
            <Head title="Pengaturan Situs" />

            <div className="mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-terra-900">
                        Pengaturan Situs
                    </h1>
                    <p className="mt-1 text-terra-500">
                        Kelola pengaturan umum toko Anda
                    </p>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Link
                        href="/admin/settings/homepage"
                        className="group flex items-center justify-between rounded-2xl border border-terra-100 bg-white p-4 transition-all hover:border-wood hover:shadow-md"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-wood/10">
                                <Home className="h-5 w-5 text-wood" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-terra-900">
                                    Pengaturan Homepage
                                </h3>
                                <p className="text-sm text-terra-500">
                                    Hero, Trust Logos, Values
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-terra-400 transition-colors group-hover:text-wood" />
                    </Link>
                    <Link
                        href="/admin/settings/payment"
                        className="group flex items-center justify-between rounded-2xl border border-terra-100 bg-white p-4 transition-all hover:border-wood hover:shadow-md"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                                <CreditCard className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-terra-900">
                                    Pengaturan Pembayaran
                                </h3>
                                <p className="text-sm text-terra-500">
                                    Rekening Bank, COD, Deadline
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-terra-400 transition-colors group-hover:text-wood" />
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* General Settings */}
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-wood/10">
                                <Store className="h-5 w-5 text-wood" />
                            </div>
                            <h2 className="text-lg font-semibold text-terra-900">
                                Informasi Toko
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-terra-700">
                                    Nama Toko
                                </label>
                                <input
                                    type="text"
                                    value={data.site_name}
                                    onChange={(e) =>
                                        setData('site_name', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-terra-700">
                                    Deskripsi Toko
                                </label>
                                <textarea
                                    value={data.site_description}
                                    onChange={(e) =>
                                        setData(
                                            'site_description',
                                            e.target.value,
                                        )
                                    }
                                    rows={3}
                                    className="w-full resize-none rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Settings */}
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                                <Phone className="h-5 w-5 text-blue-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-terra-900">
                                Kontak
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-terra-700">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-terra-400" />
                                    <input
                                        type="email"
                                        value={data.contact_email}
                                        onChange={(e) =>
                                            setData(
                                                'contact_email',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border border-terra-200 bg-sand-50 py-3 pr-4 pl-10 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-terra-700">
                                    Telepon
                                </label>
                                <div className="relative">
                                    <Phone className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-terra-400" />
                                    <input
                                        type="text"
                                        value={data.contact_phone}
                                        onChange={(e) =>
                                            setData(
                                                'contact_phone',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border border-terra-200 bg-sand-50 py-3 pr-4 pl-10 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-terra-700">
                                    WhatsApp
                                </label>
                                <input
                                    type="text"
                                    value={data.contact_whatsapp}
                                    onChange={(e) =>
                                        setData(
                                            'contact_whatsapp',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                                    placeholder="6281234567890"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-terra-700">
                                    Alamat
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-terra-400" />
                                    <input
                                        type="text"
                                        value={data.address}
                                        onChange={(e) =>
                                            setData('address', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-terra-200 bg-sand-50 py-3 pr-4 pl-10 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                                <Globe className="h-5 w-5 text-purple-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-terra-900">
                                Media Sosial
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-terra-700">
                                    Facebook
                                </label>
                                <input
                                    type="url"
                                    value={data.facebook_url}
                                    onChange={(e) =>
                                        setData('facebook_url', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-terra-700">
                                    Instagram
                                </label>
                                <input
                                    type="url"
                                    value={data.instagram_url}
                                    onChange={(e) =>
                                        setData('instagram_url', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-terra-700">
                                    TikTok
                                </label>
                                <input
                                    type="url"
                                    value={data.tiktok_url}
                                    onChange={(e) =>
                                        setData('tiktok_url', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-xl bg-terra-900 px-6 py-3 font-medium text-white transition-colors hover:bg-wood-dark disabled:opacity-50"
                        >
                            <Save className="h-5 w-5" />
                            {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
