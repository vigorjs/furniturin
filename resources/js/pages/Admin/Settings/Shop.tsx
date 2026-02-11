import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Flame, Save } from 'lucide-react';

interface ShopSettingsProps {
  settings: {
    hot_sale_end_date: string;
    hot_sale_timer_visible: boolean;
  };
}

export default function ShopSettings({ settings }: ShopSettingsProps) {
  const { data, setData, post, processing, errors } = useForm({
    hot_sale_end_date: settings.hot_sale_end_date,
    hot_sale_timer_visible: settings.hot_sale_timer_visible,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/settings/shop');
  };

  return (
    <AdminLayout
      breadcrumbs={[
        { title: 'Pengaturan', href: '/admin/settings' },
        { title: 'Toko', href: '/admin/settings/shop' },
      ]}
    >
      <Head title="Pengaturan Toko" />

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
                Pengaturan Toko
              </h1>
              <p className="mt-1 text-neutral-500">
                Konfigurasi umum toko dan penjualan
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hot Sale Settings */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                <Flame className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Hot Sale
                </h2>
                <p className="text-sm text-neutral-500">
                  Konfigurasi penawaran spesial
                </p>
              </div>
            </div>

            <div className="max-w-md space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Waktu Berakhir Hot Sale
                </label>
                <p className="mb-3 text-sm text-neutral-500">
                  Tentukan kapan penawaran Hot Sale akan berakhir. Countdown
                  timer di halaman Hot Sale akan mengikut waktu ini.
                </p>
                <input
                  type="datetime-local"
                  value={data.hot_sale_end_date || ''}
                  onChange={(e) => setData('hot_sale_end_date', e.target.value)}
                  className={`w-full rounded-lg border bg-white px-4 py-2.5 text-neutral-900 transition-all focus:ring-2 focus:ring-teal-500/20 focus:outline-none ${
                    errors.hot_sale_end_date
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-neutral-200 focus:border-teal-500'
                  }`}
                />
                {errors.hot_sale_end_date && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.hot_sale_end_date}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                <input
                  type="checkbox"
                  id="hot_sale_timer_visible"
                  checked={data.hot_sale_timer_visible}
                  onChange={(e) =>
                    setData('hot_sale_timer_visible', e.target.checked)
                  }
                  className="h-5 w-5 rounded border-neutral-300 text-teal-600 focus:ring-teal-500"
                />
                <label
                  htmlFor="hot_sale_timer_visible"
                  className="cursor-pointer text-sm font-medium text-neutral-700 select-none"
                >
                  Tampilkan Countdown Timer
                </label>
              </div>
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
