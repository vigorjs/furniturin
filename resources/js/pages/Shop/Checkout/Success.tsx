import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import { ShopLayout } from '@/layouts/ShopLayout';
import { motion } from 'framer-motion';
import { SiteSettings } from '@/types';

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
    const siteName = siteSettings?.site_name || 'Latif Living';

    return (
        <>
            <Head title={`Pesanan Berhasil - ${siteName}`} />
            <div className="bg-noise" />
            <ShopLayout>
            <main className="min-h-screen bg-sand-50 pt-28 pb-20">
                <div className="max-w-2xl mx-auto px-6 md:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-sm p-8 md:p-12 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </motion.div>

                        <h1 className="font-serif text-3xl text-terra-900 mb-3">Pesanan Berhasil!</h1>
                        <p className="text-terra-500 mb-8">
                            Terima kasih telah berbelanja di {siteName}. Pesanan Anda sedang diproses.
                        </p>

                        {order && (
                            <div className="bg-sand-50 rounded-sm p-6 mb-8 text-left">
                                <div className="flex items-center gap-3 mb-4">
                                    <Package className="w-5 h-5 text-terra-600" />
                                    <span className="font-medium text-terra-900">Detail Pesanan</span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-terra-500">Nomor Pesanan</span>
                                        <span className="font-medium text-terra-900">{order.order_number}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-terra-500">Total</span>
                                        <span className="font-medium text-terra-900">{order.total_formatted}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-terra-500">Metode Pembayaran</span>
                                        <span className="font-medium text-terra-900">{order.payment_method.label}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-terra-500">Status</span>
                                        <span className="font-medium text-terra-900">{order.status.label}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/shop/orders"
                                className="inline-flex items-center justify-center gap-2 bg-terra-900 text-white px-6 py-3 rounded-full hover:bg-terra-800 transition-colors"
                            >
                                <Package className="w-4 h-4" /> Lihat Pesanan
                            </Link>
                            <Link
                                href="/shop"
                                className="inline-flex items-center justify-center gap-2 border-2 border-terra-200 text-terra-700 px-6 py-3 rounded-full hover:bg-terra-50 transition-colors"
                            >
                                <Home className="w-4 h-4" /> Kembali ke Beranda
                            </Link>
                        </div>
                    </motion.div>

                    {/* Tips */}
                    <div className="mt-8 bg-wood/10 rounded-sm p-6">
                        <h3 className="font-medium text-terra-900 mb-3">Langkah Selanjutnya</h3>
                        <ul className="space-y-2 text-sm text-terra-600">
                            <li className="flex items-start gap-2">
                                <ArrowRight className="w-4 h-4 mt-0.5 text-wood" />
                                <span>Kami akan mengirimkan konfirmasi pesanan ke email Anda</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <ArrowRight className="w-4 h-4 mt-0.5 text-wood" />
                                <span>Pesanan akan diproses setelah pembayaran dikonfirmasi</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <ArrowRight className="w-4 h-4 mt-0.5 text-wood" />
                                <span>Anda dapat melacak status pesanan di halaman Pesanan Saya</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </main>
            </ShopLayout>
        </>
    );
}

