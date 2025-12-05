import { Head, Link, useForm } from '@inertiajs/react';
import { MapPin, CreditCard, Truck, Plus, Check, ArrowLeft, Loader2, Package, Banknote, Building2 } from 'lucide-react';
import { ShopLayout } from '@/layouts/ShopLayout';

interface Address {
    id: number;
    label: string;
    recipient_name: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postal_code: string;
    is_default: boolean;
    full_address: string;
}

interface CartItem {
    id: number;
    quantity: number;
    unit_price_formatted: string;
    subtotal_formatted: string;
    product: {
        id: number;
        name: string;
        images: { url: string; is_primary: boolean }[];
    };
}

interface Cart {
    items_count: number;
    subtotal: number;
    subtotal_formatted: string;
    items: CartItem[];
}

interface PaymentMethod {
    value: string;
    name: string;
    description: string;
    fee: number;
}

interface PaymentSettings {
    cod_fee: number;
    payment_deadline_hours: number;
}

interface Props {
    cart: Cart;
    addresses: Address[];
    paymentMethods: PaymentMethod[];
    paymentSettings: PaymentSettings;
}

export default function CheckoutIndex({ cart, addresses, paymentMethods, paymentSettings }: Props) {
    // Ensure addresses is always an array
    const addressList = Array.isArray(addresses) ? addresses : [];
    const paymentList = Array.isArray(paymentMethods) ? paymentMethods : [];

    // Ensure cart has items array
    const safeCart: Cart = {
        items_count: cart?.items_count || 0,
        subtotal: cart?.subtotal || 0,
        subtotal_formatted: cart?.subtotal_formatted || 'Rp 0',
        items: Array.isArray(cart?.items) ? cart.items : [],
    };

    const defaultAddress = addressList.find(a => a.is_default)?.id || addressList[0]?.id || null;
    const defaultPayment = paymentList[0]?.value || '';

    const { data, setData, post, processing, errors } = useForm({
        address_id: defaultAddress,
        payment_method: defaultPayment,
        shipping_method: 'regular',
        customer_notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.address_id || !data.payment_method) return;

        post('/shop/checkout', {
            preserveScroll: true,
        });
    };

    const getProductImage = (product: CartItem['product']) => {
        const primary = product.images?.find(img => img.is_primary);
        return primary?.url || product.images?.[0]?.url || '/images/placeholder.jpg';
    };

    return (
        <>
            <Head title="Checkout - Latif Living" />
            <div className="bg-noise" />
            <ShopLayout>
            <main className="min-h-screen bg-sand-50 pt-28 pb-20">
                <div className="max-w-6xl mx-auto px-6 md:px-12">
                    <Link href="/shop/cart" className="inline-flex items-center gap-2 text-terra-600 hover:text-terra-900 mb-6">
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Keranjang
                    </Link>

                    <h1 className="font-serif text-3xl text-terra-900 mb-8">Checkout</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                {/* Shipping Address */}
                                <div className="bg-white rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="font-serif text-xl text-terra-900 flex items-center gap-2">
                                            <MapPin className="w-5 h-5" /> Alamat Pengiriman
                                        </h2>
                                        <Link href="/shop/addresses" className="text-wood hover:text-terra-900 text-sm flex items-center gap-1">
                                            <Plus className="w-4 h-4" /> Tambah Alamat
                                        </Link>
                                    </div>
                                    {addressList.length > 0 ? (
                                        <div className="space-y-3">
                                            {addressList.map((addr) => (
                                                <label key={addr.id} className={`block p-4 border-2 rounded-xl cursor-pointer transition-colors ${data.address_id === addr.id ? 'border-wood bg-wood/5' : 'border-terra-100 hover:border-terra-200'}`}>
                                                    <div className="flex items-start gap-3">
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${data.address_id === addr.id ? 'border-wood bg-wood' : 'border-terra-300'}`}>
                                                            {data.address_id === addr.id && <Check className="w-3 h-3 text-white" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-medium text-terra-900">{addr.label}</span>
                                                                {addr.is_default && <span className="text-xs bg-wood/10 text-wood px-2 py-0.5 rounded">Utama</span>}
                                                            </div>
                                                            <p className="text-terra-700">{addr.recipient_name} • {addr.phone}</p>
                                                            <p className="text-terra-500 text-sm">{addr.full_address}</p>
                                                        </div>
                                                    </div>
                                                    <input type="radio" name="address" value={addr.id} checked={data.address_id === addr.id} onChange={() => setData('address_id', addr.id)} className="hidden" />
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <MapPin className="w-12 h-12 mx-auto text-terra-200 mb-3" />
                                            <p className="text-terra-500 mb-4">Belum ada alamat tersimpan</p>
                                            <Link href="/shop/addresses" className="inline-flex items-center gap-2 bg-terra-900 text-white px-4 py-2 rounded-lg hover:bg-terra-800">
                                                <Plus className="w-4 h-4" /> Tambah Alamat
                                            </Link>
                                        </div>
                                    )}
                                    {errors.address_id && <p className="text-red-500 text-sm mt-2">{errors.address_id}</p>}
                                </div>

                                {/* Shipping Method */}
                                <ShippingSection selectedShipping={data.shipping_method} setSelectedShipping={(v) => setData('shipping_method', v)} error={errors.shipping_method} />

                                {/* Payment Method */}
                                <PaymentSection paymentMethods={paymentList} selectedPayment={data.payment_method} setSelectedPayment={(v) => setData('payment_method', v)} error={errors.payment_method} />
                            </div>

                            {/* Order Summary */}
                            <OrderSummary cart={safeCart} getProductImage={getProductImage} processing={processing} selectedAddress={data.address_id} selectedPayment={data.payment_method} selectedShipping={data.shipping_method} paymentSettings={paymentSettings} errors={errors} />
                        </div>
                    </form>
                </div>
            </main>
            </ShopLayout>
        </>
    );
}

// Shipping methods data
const SHIPPING_METHODS = [
    { value: 'regular', name: 'Reguler (3-5 hari)', price: 0, priceLabel: 'Gratis' },
    { value: 'express', name: 'Express (1-2 hari)', price: 50000, priceLabel: 'Rp 50.000' },
];

const getShippingCost = (method: string): number => {
    return SHIPPING_METHODS.find(m => m.value === method)?.price || 0;
};

const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};

interface ShippingSectionProps {
    selectedShipping: string;
    setSelectedShipping: (value: string) => void;
    error?: string;
}

function ShippingSection({ selectedShipping, setSelectedShipping, error }: ShippingSectionProps) {
    return (
        <div className="bg-white rounded-2xl p-6">
            <h2 className="font-serif text-xl text-terra-900 flex items-center gap-2 mb-4">
                <Package className="w-5 h-5" /> Metode Pengiriman
            </h2>
            <div className="space-y-3">
                {SHIPPING_METHODS.map((method) => (
                    <label key={method.value} className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-colors ${selectedShipping === method.value ? 'border-wood bg-wood/5' : 'border-terra-100 hover:border-terra-200'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedShipping === method.value ? 'border-wood bg-wood' : 'border-terra-300'}`}>
                                {selectedShipping === method.value && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <div className="flex items-center gap-2">
                                <Truck className="w-5 h-5" />
                                <span className="text-terra-900">{method.name}</span>
                            </div>
                        </div>
                        <span className="text-wood font-medium">{method.priceLabel}</span>
                        <input type="radio" name="shipping" value={method.value} checked={selectedShipping === method.value} onChange={() => setSelectedShipping(method.value)} className="hidden" />
                    </label>
                ))}
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    );
}

interface PaymentSectionProps {
    paymentMethods: PaymentMethod[];
    selectedPayment: string;
    setSelectedPayment: (value: string) => void;
    error?: string;
}

function PaymentSection({ paymentMethods, selectedPayment, setSelectedPayment, error }: PaymentSectionProps) {
    return (
        <div className="bg-white rounded-2xl p-6">
            <h2 className="font-serif text-xl text-terra-900 flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5" /> Metode Pembayaran
            </h2>
            <div className="space-y-3">
                {paymentMethods.map((method) => (
                    <label key={method.value} className={`block p-4 border-2 rounded-xl cursor-pointer transition-colors ${selectedPayment === method.value ? 'border-wood bg-wood/5' : 'border-terra-100 hover:border-terra-200'}`}>
                        <div className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${selectedPayment === method.value ? 'border-wood bg-wood' : 'border-terra-300'}`}>
                                {selectedPayment === method.value && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    {method.value === 'bank_transfer' ? <Building2 className="w-5 h-5 text-blue-600" /> : <Banknote className="w-5 h-5 text-green-600" />}
                                    <span className="font-medium text-terra-900">{method.name}</span>
                                    {method.fee > 0 && (
                                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                                            +{formatCurrency(method.fee)}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-terra-500">{method.description}</p>
                            </div>
                        </div>
                        <input type="radio" name="payment" value={method.value} checked={selectedPayment === method.value} onChange={() => setSelectedPayment(method.value)} className="hidden" />
                    </label>
                ))}
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    );
}

interface OrderSummaryProps {
    cart: Cart;
    getProductImage: (product: CartItem['product']) => string;
    processing: boolean;
    selectedAddress: number | null;
    selectedPayment: string;
    selectedShipping: string;
    paymentSettings: PaymentSettings;
    errors: Record<string, string>;
}

function OrderSummary({ cart, getProductImage, processing, selectedAddress, selectedPayment, selectedShipping, paymentSettings, errors }: OrderSummaryProps) {
    const hasErrors = Object.keys(errors).length > 0;
    const shippingCost = getShippingCost(selectedShipping);
    const codFee = selectedPayment === 'cod' ? (paymentSettings?.cod_fee || 0) : 0;
    const subtotal = cart.subtotal || 0;
    const total = subtotal + shippingCost + codFee;

    return (
        <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-28">
                <h2 className="font-serif text-xl text-terra-900 mb-4">Ringkasan Pesanan</h2>

                {/* Items */}
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                    {cart.items.map((item) => (
                        <div key={item.id} className="flex gap-3">
                            <div className="w-14 h-14 bg-terra-100 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={getProductImage(item.product)} alt={item.product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-terra-900 text-sm line-clamp-1">{item.product.name}</p>
                                <p className="text-terra-500 text-sm">{item.quantity}x {item.unit_price_formatted}</p>
                            </div>
                            <span className="text-terra-900 text-sm font-medium">{item.subtotal_formatted}</span>
                        </div>
                    ))}
                </div>

                <div className="border-t border-terra-100 pt-4 space-y-2 mb-4">
                    <div className="flex justify-between text-terra-600">
                        <span>Subtotal</span>
                        <span>{cart.subtotal_formatted}</span>
                    </div>
                    <div className="flex justify-between text-terra-600">
                        <span>Ongkos Kirim</span>
                        <span className={shippingCost > 0 ? 'text-terra-900' : 'text-terra-500'}>
                            {shippingCost > 0 ? formatCurrency(shippingCost) : 'Gratis'}
                        </span>
                    </div>
                    {codFee > 0 && (
                        <div className="flex justify-between text-terra-600">
                            <span>Biaya COD</span>
                            <span className="text-orange-600">{formatCurrency(codFee)}</span>
                        </div>
                    )}
                </div>

                <div className="border-t border-terra-100 pt-4 mb-6">
                    <div className="flex justify-between">
                        <span className="font-medium text-terra-900">Total</span>
                        <span className="font-serif text-2xl text-terra-900">{formatCurrency(total)}</span>
                    </div>
                </div>

                <button type="submit" disabled={processing || !selectedAddress || !selectedPayment} className="w-full bg-terra-900 text-white py-4 rounded-full font-medium hover:bg-terra-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {processing ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" /> Memproses...
                        </>
                    ) : (
                        'Buat Pesanan'
                    )}
                </button>

                {(!selectedAddress || !selectedPayment) && (
                    <p className="text-red-500 text-sm text-center mt-3">
                        {!selectedAddress ? 'Pilih alamat pengiriman' : 'Pilih metode pembayaran'}
                    </p>
                )}

                {hasErrors && (
                    <div className="mt-3 p-3 bg-red-50 rounded-lg">
                        <p className="text-red-600 text-sm font-medium mb-1">Terjadi kesalahan:</p>
                        <ul className="text-red-500 text-sm list-disc list-inside">
                            {Object.values(errors).map((error, i) => (
                                <li key={i}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

