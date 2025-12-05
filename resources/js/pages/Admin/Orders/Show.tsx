import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Package, User, MapPin, CreditCard } from 'lucide-react';

interface OrderItem {
    id: number;
    product_id: number;
    product_name: string;
    product_image: string | null;
    quantity: number;
    price: number;
    price_formatted: string;
    subtotal: number;
    subtotal_formatted: string;
    product: { id: number; name: string; images: Array<{ image_url: string }> } | null;
}

interface Order {
    id: number;
    order_number: string;
    user: { id: number; name: string; email: string } | null;
    shipping_name: string;
    shipping_phone: string;
    shipping_email: string;
    shipping_address: string;
    shipping_city: string;
    shipping_province: string;
    shipping_postal_code: string;
    items: OrderItem[];
    subtotal_formatted: string;
    shipping_cost_formatted: string;
    discount_formatted: string;
    total_formatted: string;
    status: { value: string; label: string };
    payment_status: { value: string; label: string };
    payment_method: { value: string; label: string };
    customer_notes: string | null;
    admin_notes: string | null;
    tracking_number: string | null;
    created_at: string;
}

interface ShowOrderProps {
    order: Order;
    statuses: Array<{ value: string; name: string }>;
    paymentStatuses: Array<{ value: string; name: string }>;
}

export default function ShowOrder({ order, statuses }: ShowOrderProps) {
    // Safe access to nested objects
    const status = order.status || { value: 'pending', label: 'Menunggu' };
    const paymentStatus = order.payment_status || { value: 'pending', label: 'Menunggu' };
    const paymentMethod = order.payment_method || { value: 'unknown', label: 'Unknown' };
    const items: OrderItem[] = Array.isArray(order.items) ? order.items : [];

    const { data, setData, put, processing } = useForm({ status: status.value });

    const handleStatusChange = (newStatus: string) => {
        setData('status', newStatus);
        put(`/admin/orders/${order.id}`, { preserveScroll: true });
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Pesanan', href: '/admin/orders' },
            { title: order.order_number, href: `/admin/orders/${order.id}` }
        ]}>
            <Head title={`Pesanan ${order.order_number}`} />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/orders" className="p-2 rounded-lg text-terra-600 hover:bg-terra-100 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-terra-900">{order.order_number}</h1>
                            <p className="text-terra-500 mt-1">{new Date(order.created_at).toLocaleString('id-ID')}</p>
                        </div>
                    </div>
                    <select value={data.status} onChange={(e) => handleStatusChange(e.target.value)} disabled={processing} className="px-4 py-2.5 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all">
                        {statuses.map((s) => (<option key={s.value} value={s.value}>{s.name}</option>))}
                    </select>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-terra-100">
                            <div className="p-6 border-b border-terra-100"><h2 className="text-lg font-semibold text-terra-900">Item Pesanan</h2></div>
                            <div className="divide-y divide-terra-100">
                                {items.map((item) => (
                                    <div key={item.id} className="p-4 flex items-center gap-4">
                                        <div className="w-16 h-16 bg-terra-100 rounded-lg flex items-center justify-center overflow-hidden">
                                            {item.product?.images?.[0]?.image_url ? (
                                                <img src={item.product.images[0].image_url} alt={item.product_name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Package className="w-6 h-6 text-terra-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-terra-900">{item.product_name}</p>
                                            <p className="text-sm text-terra-500">{item.price_formatted} × {item.quantity}</p>
                                        </div>
                                        <p className="font-medium text-terra-900">{item.subtotal_formatted}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 bg-sand-50 space-y-2">
                                <div className="flex justify-between text-sm"><span className="text-terra-600">Subtotal</span><span className="text-terra-900">{order.subtotal_formatted}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-terra-600">Ongkir</span><span className="text-terra-900">{order.shipping_cost_formatted}</span></div>
                                {order.discount_formatted && <div className="flex justify-between text-sm"><span className="text-terra-600">Diskon</span><span className="text-green-600">-{order.discount_formatted}</span></div>}
                                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-terra-200"><span className="text-terra-900">Total</span><span className="text-terra-900">{order.total_formatted}</span></div>
                            </div>
                        </div>
                    </div>
                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                            <div className="flex items-center gap-3 mb-4"><User className="w-5 h-5 text-terra-500" /><h2 className="font-semibold text-terra-900">Pelanggan</h2></div>
                            <div className="space-y-2 text-sm">
                                <p className="font-medium text-terra-900">{order.shipping_name}</p>
                                <p className="text-terra-600">{order.shipping_email}</p>
                                <p className="text-terra-600">{order.shipping_phone}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                            <div className="flex items-center gap-3 mb-4"><MapPin className="w-5 h-5 text-terra-500" /><h2 className="font-semibold text-terra-900">Alamat Pengiriman</h2></div>
                            <div className="text-sm text-terra-600 space-y-1">
                                <p>{order.shipping_address}</p>
                                <p>{order.shipping_city}, {order.shipping_province} {order.shipping_postal_code}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                            <div className="flex items-center gap-3 mb-4"><CreditCard className="w-5 h-5 text-terra-500" /><h2 className="font-semibold text-terra-900">Pembayaran</h2></div>
                            <div className="text-sm space-y-2">
                                <div className="flex justify-between"><span className="text-terra-600">Metode</span><span className="text-terra-900">{paymentMethod.label}</span></div>
                                <div className="flex justify-between"><span className="text-terra-600">Status</span><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${paymentStatus.value === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{paymentStatus.label}</span></div>
                            </div>
                        </div>
                        {order.tracking_number && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                                <h2 className="font-semibold text-terra-900 mb-2">No. Resi</h2>
                                <p className="text-sm text-terra-900 font-mono">{order.tracking_number}</p>
                            </div>
                        )}
                        {order.customer_notes && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                                <h2 className="font-semibold text-terra-900 mb-2">Catatan Pelanggan</h2>
                                <p className="text-sm text-terra-600">{order.customer_notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

