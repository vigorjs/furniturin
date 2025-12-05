import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Save, Store, Mail, Phone, MapPin, Globe, Home, ChevronRight, CreditCard } from 'lucide-react';

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
        <AdminLayout breadcrumbs={[{ title: 'Pengaturan', href: '/admin/settings' }]}>
            <Head title="Pengaturan Situs" />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-terra-900">Pengaturan Situs</h1>
                    <p className="text-terra-500 mt-1">Kelola pengaturan umum toko Anda</p>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                        href="/admin/settings/homepage"
                        className="flex items-center justify-between p-4 bg-white rounded-2xl border border-terra-100 hover:border-wood hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-wood/10 rounded-lg flex items-center justify-center">
                                <Home className="w-5 h-5 text-wood" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-terra-900">Pengaturan Homepage</h3>
                                <p className="text-sm text-terra-500">Hero, Trust Logos, Values</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-terra-400 group-hover:text-wood transition-colors" />
                    </Link>
                    <Link
                        href="/admin/settings/payment"
                        className="flex items-center justify-between p-4 bg-white rounded-2xl border border-terra-100 hover:border-wood hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-terra-900">Pengaturan Pembayaran</h3>
                                <p className="text-sm text-terra-500">Rekening Bank, COD, Deadline</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-terra-400 group-hover:text-wood transition-colors" />
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* General Settings */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-wood/10 rounded-lg flex items-center justify-center">
                                <Store className="w-5 h-5 text-wood" />
                            </div>
                            <h2 className="text-lg font-semibold text-terra-900">Informasi Toko</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-terra-700 mb-2">Nama Toko</label>
                                <input
                                    type="text"
                                    value={data.site_name}
                                    onChange={(e) => setData('site_name', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-terra-700 mb-2">Deskripsi Toko</label>
                                <textarea
                                    value={data.site_description}
                                    onChange={(e) => setData('site_description', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Settings */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                <Phone className="w-5 h-5 text-blue-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-terra-900">Kontak</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-terra-700 mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-terra-400" />
                                    <input type="email" value={data.contact_email} onChange={(e) => setData('contact_email', e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-terra-700 mb-2">Telepon</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-terra-400" />
                                    <input type="text" value={data.contact_phone} onChange={(e) => setData('contact_phone', e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-terra-700 mb-2">WhatsApp</label>
                                <input type="text" value={data.contact_whatsapp} onChange={(e) => setData('contact_whatsapp', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all" placeholder="6281234567890" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-terra-700 mb-2">Alamat</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-terra-400" />
                                    <input type="text" value={data.address} onChange={(e) => setData('address', e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                <Globe className="w-5 h-5 text-purple-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-terra-900">Media Sosial</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-terra-700 mb-2">Facebook</label>
                                <input type="url" value={data.facebook_url} onChange={(e) => setData('facebook_url', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-terra-700 mb-2">Instagram</label>
                                <input type="url" value={data.instagram_url} onChange={(e) => setData('instagram_url', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-terra-700 mb-2">TikTok</label>
                                <input type="url" value={data.tiktok_url} onChange={(e) => setData('tiktok_url', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all" />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end">
                        <button type="submit" disabled={processing} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-terra-900 text-white hover:bg-wood-dark transition-colors font-medium disabled:opacity-50">
                            <Save className="w-5 h-5" />
                            {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

