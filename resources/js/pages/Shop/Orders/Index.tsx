import { Head, Link, router } from '@inertiajs/react';
import { Package, ChevronRight, Clock, Truck, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Header, Footer } from '@/components/shop';
import { PaginatedResponse } from '@/types/shop';

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
    total_formatted: string;
    items: OrderItem[];
    created_at: string;
}

interface Props {
    orders: PaginatedResponse<Order>;
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
    pending: <Clock size={16} />,
    processing: <AlertCircle size={16} />,
    shipped: <Truck size={16} />,
    delivered: <CheckCircle size={16} />,
    cancelled: <XCircle size={16} />,
};

export default function OrdersIndex({ orders }: Props) {
    return (
        <>
            <Head title="Pesanan Saya - Latif Living" />
            <div className="bg-noise" />
            <Header cartCount={0} onCartClick={() => {}} onLogoClick={() => router.visit('/shop')} />

            <main className="min-h-screen bg-sand-50 pt-28 pb-20">
                <div className="max-w-4xl mx-auto px-6 md:px-12">
                    <h1 className="font-serif text-3xl text-terra-900 mb-8">Pesanan Saya</h1>

                    {orders.data.length > 0 ? (
                        <div className="space-y-4">
                            {orders.data.map((order) => (
                                <OrderCard key={order.id} order={order} />
                            ))}

                            {/* Pagination */}
                            {orders.meta.last_page > 1 && (
                                <div className="flex justify-center gap-2 mt-8">
                                    {orders.meta.links.map((link, idx) => (
                                        <Link
                                            key={idx}
                                            href={link.url || '#'}
                                            className={`px-4 py-2 rounded-lg text-sm ${
                                                link.active
                                                    ? 'bg-terra-900 text-white'
                                                    : link.url
                                                    ? 'bg-white text-terra-700 hover:bg-terra-100'
                                                    : 'bg-terra-100 text-terra-400 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <EmptyState />
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}

function OrderCard({ order }: { order: Order }) {
    const firstItem = order.items[0];
    const imageUrl = firstItem?.product?.images?.[0]?.image_url || 'https://via.placeholder.com/100';
    const otherItemsCount = order.items.length - 1;

    return (
        <Link
            href={`/shop/orders/${order.id}`}
            className="block bg-white rounded-2xl p-6 border border-terra-100 hover:border-terra-200 hover:shadow-sm transition-all"
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm text-terra-500">#{order.order_number}</p>
                    <p className="text-xs text-terra-400 mt-1">
                        {new Date(order.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'long', year: 'numeric'
                        })}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${order.status.color}`}>
                        {STATUS_ICONS[order.status.value]}
                        {order.status.label}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <img src={imageUrl} alt={firstItem?.product_name} className="w-16 h-16 rounded-lg object-cover bg-sand-100" />
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-terra-900 truncate">{firstItem?.product_name}</p>
                    <p className="text-sm text-terra-500">{firstItem?.quantity} x Rp {firstItem?.unit_price.toLocaleString('id-ID')}</p>
                    {otherItemsCount > 0 && (
                        <p className="text-xs text-terra-400 mt-1">+{otherItemsCount} produk lainnya</p>
                    )}
                </div>
                <div className="text-right">
                    <p className="text-sm text-terra-500">Total</p>
                    <p className="font-semibold text-terra-900">{order.total_formatted}</p>
                </div>
                <ChevronRight size={20} className="text-terra-300" />
            </div>
        </Link>
    );
}

function EmptyState() {
    return (
        <div className="text-center py-20 bg-white rounded-2xl">
            <div className="w-20 h-20 bg-sand-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package size={32} className="text-terra-300" />
            </div>
            <h3 className="text-xl font-medium text-terra-900 mb-2">Belum Ada Pesanan</h3>
            <p className="text-terra-500 mb-8">Anda belum memiliki riwayat pesanan</p>
            <Link href="/shop/products" className="inline-flex items-center gap-2 bg-terra-900 text-white px-6 py-3 rounded-full hover:bg-wood transition-colors">
                Mulai Belanja
            </Link>
        </div>
    );
}

