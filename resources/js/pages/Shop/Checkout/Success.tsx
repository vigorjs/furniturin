import { ShopLayout } from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Home, Package } from 'lucide-react';

interface Order {
    id: number;
    order_number: string;
    total_formatted: string;
    payment_method: {
        value: string;
        label: string;
    };
    status: {
        value: string;
        label: string;
    };
}

interface Props {
    order?: Order;
}

export default function CheckoutSuccess({ order }: Props) {
    const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
    const siteName = siteSettings?.site_name || 'Furniturin';

    return (
        <>
            <Head title={`Pesanan Berhasil - ${siteName}`} />
            <div className="bg-noise" />
            <ShopLayout>
                <main className="min-h-screen bg-sand-50 pt-28 pb-20">
                    <div className="mx-auto max-w-2xl px-6 md:px-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-sm bg-white p-8 text-center md:p-12"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    delay: 0.2,
                                    type: 'spring',
                                    stiffness: 200,
                                }}
                                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
                            >
                                <CheckCircle className="h-10 w-10 text-green-600" />
                            </motion.div>

                            <h1 className="mb-3 font-serif text-3xl text-terra-900">
                                Pesanan Berhasil!
                            </h1>
                            <p className="mb-8 text-terra-500">
                                Terima kasih telah berbelanja di {siteName}.
                                Pesanan Anda sedang diproses.
                            </p>

                            {order && (
                                <div className="mb-8 rounded-sm bg-sand-50 p-6 text-left">
                                    <div className="mb-4 flex items-center gap-3">
                                        <Package className="h-5 w-5 text-terra-600" />
                                        <span className="font-medium text-terra-900">
                                            Detail Pesanan
                                        </span>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-terra-500">
                                                Nomor Pesanan
                                            </span>
                                            <span className="font-medium text-terra-900">
                                                {order.order_number}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-terra-500">
                                                Total
                                            </span>
                                            <span className="font-medium text-terra-900">
                                                {order.total_formatted}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-terra-500">
                                                Metode Pembayaran
                                            </span>
                                            <span className="font-medium text-terra-900">
                                                {order.payment_method.label}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-terra-500">
                                                Status
                                            </span>
                                            <span className="font-medium text-terra-900">
                                                {order.status.label}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                <Link
                                    href="/shop/orders"
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-terra-900 px-6 py-3 text-white transition-colors hover:bg-terra-800"
                                >
                                    <Package className="h-4 w-4" /> Lihat
                                    Pesanan
                                </Link>
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-terra-200 px-6 py-3 text-terra-700 transition-colors hover:bg-terra-50"
                                >
                                    <Home className="h-4 w-4" /> Kembali ke
                                    Beranda
                                </Link>
                            </div>
                        </motion.div>

                        {/* Tips */}
                        <div className="mt-8 rounded-sm bg-wood/10 p-6">
                            <h3 className="mb-3 font-medium text-terra-900">
                                Langkah Selanjutnya
                            </h3>
                            <ul className="space-y-2 text-sm text-terra-600">
                                <li className="flex items-start gap-2">
                                    <ArrowRight className="mt-0.5 h-4 w-4 text-wood" />
                                    <span>
                                        Kami akan mengirimkan konfirmasi pesanan
                                        ke email Anda
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <ArrowRight className="mt-0.5 h-4 w-4 text-wood" />
                                    <span>
                                        Pesanan akan diproses setelah pembayaran
                                        dikonfirmasi
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <ArrowRight className="mt-0.5 h-4 w-4 text-wood" />
                                    <span>
                                        Anda dapat melacak status pesanan di
                                        halaman Pesanan Saya
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </main>
            </ShopLayout>
        </>
    );
}
