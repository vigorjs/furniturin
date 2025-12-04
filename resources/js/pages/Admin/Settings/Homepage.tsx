import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Save, Home, Image, Type, Quote, Plus, Trash2, ChevronLeft } from 'lucide-react';
import { useState } from 'react';

interface HomepageSettingsProps {
    settings: {
        hero_badge: string;
        hero_title: string;
        hero_title_highlight: string;
        hero_description: string;
        hero_image_main: string;
        hero_image_secondary: string;
        hero_product_name: string;
        trust_logos: string;
        home_values: string;
    };
}

interface ValueItem {
    icon: string;
    title: string;
    desc: string;
}

export default function HomepageSettings({ settings }: HomepageSettingsProps) {
    // Parse JSON strings
    const initialTrustLogos = JSON.parse(settings.trust_logos || '[]');
    const initialValues = JSON.parse(settings.home_values || '[]');

    const [trustLogos, setTrustLogos] = useState<string[]>(initialTrustLogos);
    const [values, setValues] = useState<ValueItem[]>(initialValues);
    const [newLogo, setNewLogo] = useState('');

    const { data, setData, post, processing } = useForm({
        hero_badge: settings.hero_badge,
        hero_title: settings.hero_title,
        hero_title_highlight: settings.hero_title_highlight,
        hero_description: settings.hero_description,
        hero_image_main: settings.hero_image_main,
        hero_image_secondary: settings.hero_image_secondary,
        hero_product_name: settings.hero_product_name,
        trust_logos: settings.trust_logos,
        home_values: settings.home_values,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Update JSON strings before submit
        setData('trust_logos', JSON.stringify(trustLogos));
        setData('home_values', JSON.stringify(values));
        post('/admin/settings/homepage');
    };

    // Trust logos handlers
    const addTrustLogo = () => {
        if (newLogo.trim()) {
            const updated = [...trustLogos, newLogo.trim()];
            setTrustLogos(updated);
            setData('trust_logos', JSON.stringify(updated));
            setNewLogo('');
        }
    };

    const removeTrustLogo = (index: number) => {
        const updated = trustLogos.filter((_, i) => i !== index);
        setTrustLogos(updated);
        setData('trust_logos', JSON.stringify(updated));
    };

    // Values handlers
    const updateValue = (index: number, field: keyof ValueItem, value: string) => {
        const updated = [...values];
        updated[index] = { ...updated[index], [field]: value };
        setValues(updated);
        setData('home_values', JSON.stringify(updated));
    };

    const addValue = () => {
        const updated = [...values, { icon: 'leaf', title: '', desc: '' }];
        setValues(updated);
        setData('home_values', JSON.stringify(updated));
    };

    const removeValue = (index: number) => {
        const updated = values.filter((_, i) => i !== index);
        setValues(updated);
        setData('home_values', JSON.stringify(updated));
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Pengaturan', href: '/admin/settings' },
            { title: 'Homepage', href: '/admin/settings/homepage' },
        ]}>
            <Head title="Pengaturan Homepage" />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/admin/settings" className="inline-flex items-center gap-2 text-terra-500 hover:text-terra-700 mb-2">
                            <ChevronLeft size={16} />
                            Kembali ke Pengaturan
                        </Link>
                        <h1 className="text-2xl font-bold text-terra-900">Pengaturan Homepage</h1>
                        <p className="text-terra-500 mt-1">Kelola tampilan halaman utama toko Anda</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Hero Section Settings */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-wood/10 rounded-lg flex items-center justify-center">
                                <Home className="w-5 h-5 text-wood" />
                            </div>
                            <h2 className="text-lg font-semibold text-terra-900">Hero Section</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-terra-700 mb-2">Badge Text</label>
                                <input
                                    type="text"
                                    value={data.hero_badge}
                                    onChange={(e) => setData('hero_badge', e.target.value)}
                                    placeholder="Koleksi Terbaru 2025"
                                    className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-terra-700 mb-2">Product Name (Hero)</label>
                                <input
                                    type="text"
                                    value={data.hero_product_name}
                                    onChange={(e) => setData('hero_product_name', e.target.value)}
                                    placeholder="Kursi Santai Premium"
                                    className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-terra-700 mb-2">Judul Utama</label>
                                <input
                                    type="text"
                                    value={data.hero_title}
                                    onChange={(e) => setData('hero_title', e.target.value)}
                                    placeholder="Desain yang"
                                    className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-terra-700 mb-2">Judul Highlight (Italic)</label>
                                <input
                                    type="text"
                                    value={data.hero_title_highlight}
                                    onChange={(e) => setData('hero_title_highlight', e.target.value)}
                                    placeholder="bernafas."
                                    className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-terra-700 mb-2">Deskripsi Hero</label>
                                <textarea
                                    value={data.hero_description}
                                    onChange={(e) => setData('hero_description', e.target.value)}
                                    rows={3}
                                    placeholder="Furniture minimalis dari bahan berkelanjutan..."
                                    className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Hero Images */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                <Image className="w-5 h-5 text-blue-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-terra-900">Gambar Hero</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-terra-700 mb-2">Gambar Utama (URL)</label>
                                <input
                                    type="url"
                                    value={data.hero_image_main}
                                    onChange={(e) => setData('hero_image_main', e.target.value)}
                                    placeholder="https://..."
                                    className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all"
                                />
                                {data.hero_image_main && (
                                    <img src={data.hero_image_main} alt="Preview" className="mt-3 w-full h-40 object-cover rounded-lg" />
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-terra-700 mb-2">Gambar Sekunder (URL)</label>
                                <input
                                    type="url"
                                    value={data.hero_image_secondary}
                                    onChange={(e) => setData('hero_image_secondary', e.target.value)}
                                    placeholder="https://..."
                                    className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all"
                                />
                                {data.hero_image_secondary && (
                                    <img src={data.hero_image_secondary} alt="Preview" className="mt-3 w-full h-40 object-cover rounded-lg" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Trust Logos */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                <Type className="w-5 h-5 text-purple-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-terra-900">Trust Logos / Press</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {trustLogos.map((logo, index) => (
                                    <span key={index} className="inline-flex items-center gap-2 px-3 py-2 bg-terra-100 rounded-lg text-terra-700">
                                        {logo}
                                        <button type="button" onClick={() => removeTrustLogo(index)} className="text-terra-400 hover:text-red-500">
                                            <Trash2 size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newLogo}
                                    onChange={(e) => setNewLogo(e.target.value)}
                                    placeholder="Nama brand/media..."
                                    className="flex-1 px-4 py-2 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTrustLogo())}
                                />
                                <button type="button" onClick={addTrustLogo} className="px-4 py-2 bg-terra-900 text-white rounded-xl hover:bg-wood transition-colors">
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Values / Features */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                                    <Quote className="w-5 h-5 text-green-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-terra-900">Nilai / Fitur Unggulan</h2>
                            </div>
                            <button type="button" onClick={addValue} className="inline-flex items-center gap-2 px-4 py-2 bg-terra-100 text-terra-700 rounded-xl hover:bg-terra-200 transition-colors">
                                <Plus size={16} />
                                Tambah
                            </button>
                        </div>
                        <div className="space-y-4">
                            {values.map((value, index) => (
                                <div key={index} className="p-4 bg-sand-50 rounded-xl border border-terra-100">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-terra-500">Item {index + 1}</span>
                                        <button type="button" onClick={() => removeValue(index)} className="text-terra-400 hover:text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs text-terra-500 mb-1">Icon</label>
                                            <select
                                                value={value.icon}
                                                onChange={(e) => updateValue(index, 'icon', e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg border border-terra-200 bg-white text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50"
                                            >
                                                <option value="leaf">🌿 Leaf</option>
                                                <option value="truck">🚚 Truck</option>
                                                <option value="shield-check">🛡️ Shield Check</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs text-terra-500 mb-1">Judul</label>
                                            <input
                                                type="text"
                                                value={value.title}
                                                onChange={(e) => updateValue(index, 'title', e.target.value)}
                                                placeholder="Bahan Berkelanjutan"
                                                className="w-full px-3 py-2 rounded-lg border border-terra-200 bg-white text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50"
                                            />
                                        </div>
                                        <div className="md:col-span-3">
                                            <label className="block text-xs text-terra-500 mb-1">Deskripsi</label>
                                            <textarea
                                                value={value.desc}
                                                onChange={(e) => updateValue(index, 'desc', e.target.value)}
                                                rows={2}
                                                placeholder="Setiap produk menggunakan kayu dari hutan yang dikelola secara bertanggung jawab..."
                                                className="w-full px-3 py-2 rounded-lg border border-terra-200 bg-white text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
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
