import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Package, MapPin, CreditCard, Truck, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Header, Footer } from '@/components/shop';
import { useState } from 'react';

interface OrderStatus {
    value: string;
    label: string;
    color: string;
}

interface OrderItem {
    id: number;
    product_name: string;
    product_sku: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    product?: {
        id: number;
        slug: string;
        images?: { image_url: string }[];
    };
}

interface Order {
    id: number;
    order_number: string;
    status: OrderStatus;
    payment_status: OrderStatus;
    payment_method: { value: string; label: string };
    subtotal_formatted: string;
    discount_formatted: string;
    shipping_cost_formatted: string;
    total_formatted: string;
    shipping_name: string;
    shipping_phone: string;
    shipping_address: string;
    shipping_city: string;
    shipping_province: string;
    shipping_postal_code: string;
    tracking_number?: string;
    customer_notes?: string;
    items: OrderItem[];
    created_at: string;
    shipped_at?: string;
    delivered_at?: string;
    cancelled_at?: string;
    cancellation_reason?: string;
}

interface Props {
    order: Order;
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
    pending: <Clock size={20} />,
    processing: <AlertCircle size={20} />,
    shipped: <Truck size={20} />,
    delivered: <CheckCircle size={20} />,
    cancelled: <XCircle size={20} />,
};

export default function OrderShow({ order }: Props) {
    const [cancelling, setCancelling] = useState(false);

    const handleCancel = async () => {
        if (!confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) return;
        setCancelling(true);
        router.post(`/shop/orders/${order.id}/cancel`, {}, {
            onFinish: () => setCancelling(false),
        });
    };

    const canCancel = order.status.value === 'pending';

    return (
        <>
            <Head title={`Pesanan #${order.order_number} - Latif Living`} />
            <div className="bg-noise" />
            <Header cartCount={0} onCartClick={() => {}} onLogoClick={() => router.visit('/shop')} />

            <main className="min-h-screen bg-sand-50 pt-28 pb-20">
                <div className="max-w-4xl mx-auto px-6 md:px-12">
                    {/* Back Button */}
                    <Link href="/shop/orders" className="inline-flex items-center gap-2 text-terra-600 hover:text-terra-900 mb-6">
                        <ArrowLeft size={18} />
                        <span>Kembali ke Pesanan</span>
                    </Link>

                    {/* Header */}
                    <div className="bg-white rounded-2xl p-6 mb-6">
                        <div className="flex items-start justify-between flex-wrap gap-4">
                            <div>
                                <h1 className="font-serif text-2xl text-terra-900">Pesanan #{order.order_number}</h1>
                                <p className="text-sm text-terra-500 mt-1">
                                    {new Date(order.created_at).toLocaleDateString('id-ID', {
                                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${order.status.color}`}>
                                    {STATUS_ICONS[order.status.value]}
                                    {order.status.label}
                                </span>
                                {canCancel && (
                                    <button
                                        onClick={handleCancel}
                                        disabled={cancelling}
                                        className="px-4 py-2 border border-red-200 text-red-600 rounded-full text-sm hover:bg-red-50 disabled:opacity-50"
                                    >
                                        {cancelling ? 'Membatalkan...' : 'Batalkan'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {order.tracking_number && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                                <p className="text-sm text-blue-800">
                                    <strong>No. Resi:</strong> {order.tracking_number}
                                </p>
                            </div>
                        )}

                        {order.cancellation_reason && (
                            <div className="mt-4 p-4 bg-red-50 rounded-xl">
                                <p className="text-sm text-red-800">
                                    <strong>Alasan Pembatalan:</strong> {order.cancellation_reason}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Items */}
                        <div className="md:col-span-2 bg-white rounded-2xl p-6">
                            <h2 className="font-medium text-terra-900 mb-4 flex items-center gap-2">
                                <Package size={18} />Produk Dipesan
                            </h2>
                            <div className="space-y-4">
                                {order.items.map((item) => {
                                    const imageUrl = item.product?.images?.[0]?.image_url || 'https://via.placeholder.com/80';
                                    return (
                                        <div key={item.id} className="flex gap-4 pb-4 border-b border-terra-100 last:border-0 last:pb-0">
                                            <img src={imageUrl} alt={item.product_name} className="w-20 h-20 rounded-lg object-cover bg-sand-100" />
                                            <div className="flex-1">
                                                {item.product ? (
                                                    <Link href={`/shop/products/${item.product.slug}`} className="font-medium text-terra-900 hover:text-wood">
                                                        {item.product_name}
                                                    </Link>
                                                ) : (
                                                    <p className="font-medium text-terra-900">{item.product_name}</p>
                                                )}
                                                <p className="text-sm text-terra-500">SKU: {item.product_sku}</p>
                                                <p className="text-sm text-terra-500">{item.quantity} x Rp {item.unit_price.toLocaleString('id-ID')}</p>
                                            </div>
                                            <p className="font-medium text-terra-900">Rp {item.subtotal.toLocaleString('id-ID')}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Shipping */}
                            <div className="bg-white rounded-2xl p-6">
                                <h2 className="font-medium text-terra-900 mb-4 flex items-center gap-2">
                                    <MapPin size={18} />Alamat Pengiriman
                                </h2>
                                <p className="font-medium text-terra-900">{order.shipping_name}</p>
                                <p className="text-sm text-terra-600">{order.shipping_phone}</p>
                                <p className="text-sm text-terra-600 mt-2">{order.shipping_address}</p>
                                <p className="text-sm text-terra-600">{order.shipping_city}, {order.shipping_province} {order.shipping_postal_code}</p>
                            </div>

                            {/* Payment */}
                            <div className="bg-white rounded-2xl p-6">
                                <h2 className="font-medium text-terra-900 mb-4 flex items-center gap-2">
                                    <CreditCard size={18} />Pembayaran
                                </h2>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-terra-500">Metode</span>
                                    <span className="text-terra-900">{order.payment_method.label}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-terra-500">Status</span>
                                    <span className={order.payment_status.color}>{order.payment_status.label}</span>
                                </div>
                                <div className="border-t border-terra-100 pt-3 mt-3 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-terra-500">Subtotal</span>
                                        <span>{order.subtotal_formatted}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-terra-500">Ongkir</span>
                                        <span>{order.shipping_cost_formatted}</span>
                                    </div>
                                    <div className="flex justify-between font-medium text-terra-900 pt-2 border-t border-terra-100">
                                        <span>Total</span>
                                        <span>{order.total_formatted}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}

