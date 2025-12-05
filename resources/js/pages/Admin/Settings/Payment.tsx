import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Save, CreditCard, Banknote, Clock, ChevronLeft } from 'lucide-react';

interface PaymentSettingsProps {
    settings: {
        bank_name: string;
        bank_account_number: string;
        bank_account_name: string;
        cod_fee: number;
        payment_deadline_hours: number;
    };
}

export default function PaymentSettings({ settings }: PaymentSettingsProps) {
    const { data, setData, post, processing } = useForm(settings);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/settings/payment');
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Pengaturan', href: '/admin/settings' },
            { title: 'Pembayaran', href: '/admin/settings/payment' }
        ]}>
            <Head title="Pengaturan Pembayaran" />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/settings" className="p-2 rounded-lg text-terra-600 hover:bg-terra-100 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-terra-900">Pengaturan Pembayaran</h1>
                        <p className="text-terra-500 mt-1">Kelola rekening bank dan biaya COD</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Bank Account Settings */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-terra-900">Rekening Bank</h2>
                                <p className="text-sm text-terra-500">Info rekening untuk transfer bank</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-terra-700 mb-2">Nama Bank</label>
                                <input type="text" value={data.bank_name} onChange={(e) => setData('bank_name', e.target.value)} placeholder="BCA" className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-terra-700 mb-2">Nomor Rekening</label>
                                <input type="text" value={data.bank_account_number} onChange={(e) => setData('bank_account_number', e.target.value)} placeholder="1234567890" className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-terra-700 mb-2">Atas Nama</label>
                                <input type="text" value={data.bank_account_name} onChange={(e) => setData('bank_account_name', e.target.value)} placeholder="Latif Living" className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all" />
                            </div>
                        </div>
                    </div>

                    {/* COD Settings */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                                <Banknote className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-terra-900">Bayar di Tempat (COD)</h2>
                                <p className="text-sm text-terra-500">Biaya tambahan untuk pembayaran COD</p>
                            </div>
                        </div>
                        <div className="max-w-xs">
                            <label className="block text-sm font-medium text-terra-700 mb-2">Biaya COD (Rp)</label>
                            <input type="number" min="0" step="1000" value={data.cod_fee} onChange={(e) => setData('cod_fee', parseInt(e.target.value) || 0)} className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all" />
                            <p className="text-xs text-terra-500 mt-2">Set ke 0 untuk gratis</p>
                        </div>
                    </div>

                    {/* Payment Deadline */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                                <Clock className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-terra-900">Batas Waktu Pembayaran</h2>
                                <p className="text-sm text-terra-500">Waktu maksimal untuk transfer bank</p>
                            </div>
                        </div>
                        <div className="max-w-xs">
                            <label className="block text-sm font-medium text-terra-700 mb-2">Batas Waktu (Jam)</label>
                            <input type="number" min="1" max="168" value={data.payment_deadline_hours} onChange={(e) => setData('payment_deadline_hours', parseInt(e.target.value) || 24)} className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all" />
                            <p className="text-xs text-terra-500 mt-2">Contoh: 24 jam, 48 jam, dll</p>
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

