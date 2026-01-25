import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
  BookOpen,
  ChevronLeft,
  Eye,
  EyeOff,
  Globe,
  Home,
  Image,
  LayoutGrid,
  Mail,
  MessageSquare,
  Plus,
  Quote,
  Save,
  ShoppingBag,
  Trash2,
  Type,
  Users,
} from 'lucide-react';
import { useState } from 'react';

interface HomepageSettingsProps {
  settings: {
    hero_badge: string;
    hero_title: string;
    hero_title_highlight: string;
    hero_description: string;
    hero_image_main: string;
    hero_product_name: string;
    trust_logos: string;
    home_values: string;
    // Section visibility
    section_hero_visible: boolean;
    section_trust_visible: boolean;
    section_categories_visible: boolean;
    section_catalog_visible: boolean;
    section_values_visible: boolean;
    section_products_visible: boolean;
    section_testimonials_visible: boolean;
    section_newsletter_visible: boolean;
  };
}

interface ValueItem {
  icon: string;
  title: string;
  desc: string;
}

interface TrustLogo {
  name: string;
  logo_url?: string;
}

const SECTIONS = [
  { key: 'hero', label: 'Hero', icon: Home, desc: 'Banner utama' },
  { key: 'trust', label: 'Trust Logos', icon: Users, desc: 'Logo media/brand' },
  {
    key: 'categories',
    label: 'Kategori',
    icon: LayoutGrid,
    desc: 'Kategori produk',
  },
  { key: 'catalog', label: 'Katalog', icon: BookOpen, desc: 'Flipbook PDF' },
  { key: 'values', label: 'Nilai Unggulan', icon: Quote, desc: 'Fitur/USP' },
  {
    key: 'products',
    label: 'Produk Unggulan',
    icon: ShoppingBag,
    desc: 'Produk pilihan',
  },
  {
    key: 'testimonials',
    label: 'Testimoni',
    icon: MessageSquare,
    desc: 'Review pelanggan',
  },
  {
    key: 'newsletter',
    label: 'Newsletter',
    icon: Mail,
    desc: 'Form subscribe',
  },
];

export default function HomepageSettings({ settings }: HomepageSettingsProps) {
  // Parse JSON strings
  const initialTrustLogos: TrustLogo[] = (() => {
    try {
      const parsed = JSON.parse(settings.trust_logos || '[]');
      // Handle old format (array of strings)
      if (Array.isArray(parsed) && typeof parsed[0] === 'string') {
        return parsed.map((name: string) => ({ name, logo_url: '' }));
      }
      return parsed;
    } catch {
      return [];
    }
  })();
  const initialValues = JSON.parse(settings.home_values || '[]');

  const [trustLogos, setTrustLogos] = useState<TrustLogo[]>(initialTrustLogos);
  const [values, setValues] = useState<ValueItem[]>(initialValues);
  const [newLogoName, setNewLogoName] = useState('');
  const [newLogoUrl, setNewLogoUrl] = useState('');

  const { data, setData, post, processing } = useForm({
    hero_badge: settings.hero_badge,
    hero_title: settings.hero_title,
    hero_title_highlight: settings.hero_title_highlight,
    hero_description: settings.hero_description,
    hero_image_main: settings.hero_image_main,
    hero_product_name: settings.hero_product_name,
    trust_logos: settings.trust_logos,
    home_values: settings.home_values,
    // Section visibility
    section_hero_visible: settings.section_hero_visible ?? true,
    section_trust_visible: settings.section_trust_visible ?? true,
    section_categories_visible: settings.section_categories_visible ?? true,
    section_catalog_visible: settings.section_catalog_visible ?? true,
    section_values_visible: settings.section_values_visible ?? true,
    section_products_visible: settings.section_products_visible ?? true,
    section_testimonials_visible: settings.section_testimonials_visible ?? true,
    section_newsletter_visible: settings.section_newsletter_visible ?? true,
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
    if (newLogoName.trim()) {
      const updated = [
        ...trustLogos,
        { name: newLogoName.trim(), logo_url: newLogoUrl.trim() },
      ];
      setTrustLogos(updated);
      setData('trust_logos', JSON.stringify(updated));
      setNewLogoName('');
      setNewLogoUrl('');
    }
  };

  const removeTrustLogo = (index: number) => {
    const updated = trustLogos.filter((_, i) => i !== index);
    setTrustLogos(updated);
    setData('trust_logos', JSON.stringify(updated));
  };

  // Values handlers
  const updateValue = (
    index: number,
    field: keyof ValueItem,
    value: string,
  ) => {
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

  const toggleSection = (key: string) => {
    const fieldName = `section_${key}_visible` as keyof typeof data;
    setData(fieldName, !data[fieldName]);
  };

  return (
    <AdminLayout
      breadcrumbs={[
        { title: 'Pengaturan', href: '/admin/settings' },
        { title: 'Homepage', href: '/admin/settings/homepage' },
      ]}
    >
      <Head title="Pengaturan Homepage" />

      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/settings"
              className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                Pengaturan Homepage
              </h1>
              <p className="mt-1 text-neutral-500">
                Kelola tampilan halaman utama toko Anda
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section Visibility */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
                <Eye className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Visibilitas Section
                </h2>
                <p className="text-sm text-neutral-500">
                  Tampilkan atau sembunyikan section di homepage
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {SECTIONS.map((section) => {
                const fieldName =
                  `section_${section.key}_visible` as keyof typeof data;
                const isVisible = data[fieldName] as boolean;
                return (
                  <button
                    key={section.key}
                    type="button"
                    onClick={() => toggleSection(section.key)}
                    className={`flex items-center gap-3 rounded-xl border p-4 transition-all ${
                      isVisible
                        ? 'border-teal-200 bg-teal-50'
                        : 'border-neutral-200 bg-neutral-50 opacity-60'
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        isVisible ? 'bg-teal-100' : 'bg-neutral-200'
                      }`}
                    >
                      <section.icon
                        className={`h-5 w-5 ${isVisible ? 'text-teal-600' : 'text-neutral-400'}`}
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <p
                        className={`text-sm font-medium ${isVisible ? 'text-neutral-900' : 'text-neutral-500'}`}
                      >
                        {section.label}
                      </p>
                      <p className="text-xs text-neutral-400">{section.desc}</p>
                    </div>
                    {isVisible ? (
                      <Eye className="h-4 w-4 text-teal-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-neutral-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hero Section Settings */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Home className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-neutral-900">
                Hero Section
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={data.hero_badge}
                  onChange={(e) => setData('hero_badge', e.target.value)}
                  placeholder="Koleksi Terbaru 2025"
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Product Name (Hero)
                </label>
                <input
                  type="text"
                  value={data.hero_product_name}
                  onChange={(e) => setData('hero_product_name', e.target.value)}
                  placeholder="Kursi Santai Premium"
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Judul Utama
                </label>
                <input
                  type="text"
                  value={data.hero_title}
                  onChange={(e) => setData('hero_title', e.target.value)}
                  placeholder="Desain yang"
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Judul Highlight
                </label>
                <input
                  type="text"
                  value={data.hero_title_highlight}
                  onChange={(e) =>
                    setData('hero_title_highlight', e.target.value)
                  }
                  placeholder="bernafas."
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Deskripsi Hero
                </label>
                <textarea
                  value={data.hero_description}
                  onChange={(e) => setData('hero_description', e.target.value)}
                  rows={3}
                  placeholder="Furniture minimalis dari bahan berkelanjutan..."
                  className="w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Hero Images */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <Image className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-neutral-900">
                Gambar Hero
              </h2>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Gambar Utama (URL)
              </label>
              <input
                type="url"
                value={data.hero_image_main}
                onChange={(e) => setData('hero_image_main', e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
              />
              {data.hero_image_main && (
                <img
                  src={data.hero_image_main}
                  alt="Preview"
                  className="mt-3 h-40 w-full rounded-lg object-cover"
                />
              )}
            </div>
          </div>

          {/* Trust Logos */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                <Globe className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Trust Logos / Press
                </h2>
                <p className="text-sm text-neutral-500">
                  Logo media/brand yang pernah memuat
                </p>
              </div>
            </div>

            {/* Existing Logos */}
            <div className="mb-4 space-y-3">
              {trustLogos.map((logo, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg border border-neutral-100 bg-neutral-50 p-3"
                >
                  {logo.logo_url ? (
                    <img
                      src={logo.logo_url}
                      alt={logo.name}
                      className="h-8 w-auto object-contain"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-neutral-200">
                      <Type className="h-4 w-4 text-neutral-400" />
                    </div>
                  )}
                  <span className="flex-1 text-sm font-medium text-neutral-700">
                    {logo.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeTrustLogo(index)}
                    className="text-neutral-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Logo */}
            <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-4">
              <p className="mb-3 text-sm font-medium text-neutral-700">
                Tambah Logo Baru
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  value={newLogoName}
                  onChange={(e) => setNewLogoName(e.target.value)}
                  placeholder="Nama brand/media"
                  className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
                <input
                  type="url"
                  value={newLogoUrl}
                  onChange={(e) => setNewLogoUrl(e.target.value)}
                  placeholder="URL logo (opsional)"
                  className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={addTrustLogo}
                disabled={!newLogoName.trim()}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
              >
                <Plus size={16} />
                Tambah
              </button>
            </div>
          </div>

          {/* Values / Features */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                  <Quote className="h-5 w-5 text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Nilai / Fitur Unggulan
                </h2>
              </div>
              <button
                type="button"
                onClick={addValue}
                className="inline-flex items-center gap-2 rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200"
              >
                <Plus size={16} />
                Tambah
              </button>
            </div>
            <div className="space-y-4">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-neutral-100 bg-neutral-50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-500">
                      Item {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeValue(index)}
                      className="text-neutral-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs text-neutral-500">
                        Icon
                      </label>
                      <select
                        value={value.icon}
                        onChange={(e) =>
                          updateValue(index, 'icon', e.target.value)
                        }
                        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-neutral-900 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                      >
                        <option value="leaf">🌿 Leaf</option>
                        <option value="truck">🚚 Truck</option>
                        <option value="shield-check">🛡️ Shield Check</option>
                        <option value="heart">❤️ Heart</option>
                        <option value="star">⭐ Star</option>
                        <option value="clock">⏰ Clock</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-xs text-neutral-500">
                        Judul
                      </label>
                      <input
                        type="text"
                        value={value.title}
                        onChange={(e) =>
                          updateValue(index, 'title', e.target.value)
                        }
                        placeholder="Bahan Berkelanjutan"
                        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-neutral-900 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="mb-1 block text-xs text-neutral-500">
                        Deskripsi
                      </label>
                      <textarea
                        value={value.desc}
                        onChange={(e) =>
                          updateValue(index, 'desc', e.target.value)
                        }
                        rows={2}
                        placeholder="Setiap produk menggunakan kayu dari hutan yang dikelola secara bertanggung jawab..."
                        className="w-full resize-none rounded-lg border border-neutral-200 bg-white px-3 py-2 text-neutral-900 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={processing}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 font-medium text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
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
