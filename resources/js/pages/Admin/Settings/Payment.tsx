import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Banknote, ChevronLeft, Clock, CreditCard, Save } from 'lucide-react';

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
        <AdminLayout
            breadcrumbs={[
                { title: 'Pengaturan', href: '/admin/settings' },
                { title: 'Pembayaran', href: '/admin/settings/payment' },
            ]}
        >
            <Head title="Pengaturan Pembayaran" />

            <div className="mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/settings"
                        className="rounded-lg p-2 text-terra-600 transition-colors hover:bg-terra-100"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-terra-900">
                            Pengaturan Pembayaran
                        </h1>
                        <p className="mt-1 text-terra-500">
                            Kelola rekening bank dan biaya COD
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Bank Account Settings */}
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                                <CreditCard className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-terra-900">
                                    Rekening Bank
                                </h2>
                                <p className="text-sm text-terra-500">
                                    Info rekening untuk transfer bank
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-terra-700">
                                    Nama Bank
                                </label>
                                <input
                                    type="text"
                                    value={data.bank_name}
                                    onChange={(e) =>
                                        setData('bank_name', e.target.value)
                                    }
                                    placeholder="BCA"
                                    className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-terra-700">
                                    Nomor Rekening
                                </label>
                                <input
                                    type="text"
                                    value={data.bank_account_number}
                                    onChange={(e) =>
                                        setData(
                                            'bank_account_number',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="1234567890"
                                    className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-terra-700">
                                    Atas Nama
                                </label>
                                <input
                                    type="text"
                                    value={data.bank_account_name}
                                    onChange={(e) =>
                                        setData(
                                            'bank_account_name',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Latif Living"
                                    className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* COD Settings */}
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                <Banknote className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-terra-900">
                                    Bayar di Tempat (COD)
                                </h2>
                                <p className="text-sm text-terra-500">
                                    Biaya tambahan untuk pembayaran COD
                                </p>
                            </div>
                        </div>
                        <div className="max-w-xs">
                            <label className="mb-2 block text-sm font-medium text-terra-700">
                                Biaya COD (Rp)
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="1000"
                                value={data.cod_fee}
                                onChange={(e) =>
                                    setData(
                                        'cod_fee',
                                        parseInt(e.target.value) || 0,
                                    )
                                }
                                className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                            />
                            <p className="mt-2 text-xs text-terra-500">
                                Set ke 0 untuk gratis
                            </p>
                        </div>
                    </div>

                    {/* Payment Deadline */}
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                                <Clock className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-terra-900">
                                    Batas Waktu Pembayaran
                                </h2>
                                <p className="text-sm text-terra-500">
                                    Waktu maksimal untuk transfer bank
                                </p>
                            </div>
                        </div>
                        <div className="max-w-xs">
                            <label className="mb-2 block text-sm font-medium text-terra-700">
                                Batas Waktu (Jam)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="168"
                                value={data.payment_deadline_hours}
                                onChange={(e) =>
                                    setData(
                                        'payment_deadline_hours',
                                        parseInt(e.target.value) || 24,
                                    )
                                }
                                className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                            />
                            <p className="mt-2 text-xs text-terra-500">
                                Contoh: 24 jam, 48 jam, dll
                            </p>
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
