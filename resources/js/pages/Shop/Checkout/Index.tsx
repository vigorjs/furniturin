import { ShopLayout } from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
  ArrowLeft,
  Banknote,
  Building2,
  Check,
  CreditCard,
  Loader2,
  MapPin,
  Package,
  Plus,
  Truck,
} from 'lucide-react';
import React from 'react';

interface Address {
  id: number;
  label: string;
  recipient_name: string;
  phone: string;
  address: string;
  city: string;
  city_id: string; // Added for RajaOngkir
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

export default function CheckoutIndex({
  cart,
  addresses,
  paymentMethods,
  paymentSettings,
}: Props) {
  // Ensure addresses is always an array
  const addressList = Array.isArray(addresses) ? addresses : [];
  const paymentList = Array.isArray(paymentMethods) ? paymentMethods : [];

  const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
  const siteName = siteSettings?.site_name || 'Furniturin';

  // Ensure cart has items array
  const safeCart: Cart = {
    items_count: cart?.items_count || 0,
    subtotal: cart?.subtotal || 0,
    subtotal_formatted: cart?.subtotal_formatted || 'Rp 0',
    items: Array.isArray(cart?.items) ? cart.items : [],
  };

  const defaultAddress =
    addressList.find((a) => a.is_default)?.id || addressList[0]?.id || null;
  const defaultPayment = paymentList[0]?.value || '';

  const { data, setData, post, processing, errors } = useForm({
    address_id: defaultAddress,
    payment_method: defaultPayment,
    shipping_method: 'jne', // Default to 'jne' or similar
    customer_notes: '',
  });

  // Shipping Cost State Lifted
  const [shippingCost, setShippingCost] = React.useState(0);
  const [loadingShipping, setLoadingShipping] = React.useState(false);

  React.useEffect(() => {
    const fetchShipping = async () => {
      if (!data.address_id) {
        setShippingCost(0);
        return;
      }

      const address = addressList.find((a) => a.id === data.address_id);
      if (!address || !address.city_id) {
        setShippingCost(0);
        return;
      }

      setLoadingShipping(true);
      // Calculate total weight (assuming 1kg per item for now)
      const weight = safeCart.items.reduce(
        (acc, item) => acc + item.quantity * 1000,
        0,
      );

      const courier = 'jne';

      const cost = await getShippingCost(address.city_id, weight, courier);
      setShippingCost(cost);
      setLoadingShipping(false);
    };

    fetchShipping();
  }, [data.address_id, safeCart.items]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.address_id || !data.payment_method) return;

    post('/shop/checkout', {
      preserveScroll: true,
    });
  };

  const getProductImage = (product: CartItem['product']) => {
    const primary = product.images?.find((img) => img.is_primary);
    return (
      primary?.url ||
      product.images?.[0]?.url ||
      '/images/placeholder-product.svg'
    );
  };

  return (
    <>
      <Head title={`Checkout - ${siteName}`} />
      <div className="bg-noise" />
      <ShopLayout>
        <main className="min-h-screen bg-sand-50 pt-8 pb-20">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <Link
              href="/shop/products"
              className="mb-6 inline-flex items-center gap-2 text-terra-600 hover:text-terra-900"
            >
              <ArrowLeft className="h-4 w-4" /> Lanjutkan Belanja
            </Link>

            <h1 className="mb-8 font-serif text-3xl text-terra-900">
              Checkout
            </h1>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                  {/* Shipping Address */}
                  <div className="rounded-sm bg-white p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="flex items-center gap-2 font-serif text-xl text-terra-900">
                        <MapPin className="h-5 w-5" /> Alamat Pengiriman
                      </h2>
                      <Link
                        href="/shop/addresses"
                        className="flex items-center gap-1 text-sm text-wood hover:text-terra-900"
                      >
                        <Plus className="h-4 w-4" /> Tambah Alamat
                      </Link>
                    </div>
                    {addressList.length > 0 ? (
                      <div className="space-y-3">
                        {addressList.map((addr) => (
                          <label
                            key={addr.id}
                            className={`block cursor-pointer rounded-sm border-2 p-4 transition-colors ${data.address_id === addr.id ? 'border-wood bg-wood/5' : 'border-terra-100 hover:border-terra-200'}`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${data.address_id === addr.id ? 'border-wood bg-wood' : 'border-terra-300'}`}
                              >
                                {data.address_id === addr.id && (
                                  <Check className="h-3 w-3 text-white" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="mb-1 flex items-center gap-2">
                                  <span className="font-medium text-terra-900">
                                    {addr.label}
                                  </span>
                                  {addr.is_default && (
                                    <span className="rounded bg-wood/10 px-2 py-0.5 text-xs text-wood">
                                      Utama
                                    </span>
                                  )}
                                </div>
                                <p className="text-terra-700">
                                  {addr.recipient_name} • {addr.phone}
                                </p>
                                <p className="text-sm text-terra-500">
                                  {addr.full_address}
                                </p>
                              </div>
                            </div>
                            <input
                              type="radio"
                              name="address"
                              value={addr.id}
                              checked={data.address_id === addr.id}
                              onChange={() => setData('address_id', addr.id)}
                              className="hidden"
                            />
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <MapPin className="mx-auto mb-3 h-12 w-12 text-terra-200" />
                        <p className="mb-4 text-terra-500">
                          Belum ada alamat tersimpan
                        </p>
                        <Link
                          href="/shop/addresses"
                          className="inline-flex items-center gap-2 rounded-lg bg-terra-900 px-4 py-2 text-white hover:bg-terra-800"
                        >
                          <Plus className="h-4 w-4" /> Tambah Alamat
                        </Link>
                      </div>
                    )}
                    {errors.address_id && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.address_id}
                      </p>
                    )}
                  </div>

                  {/* Shipping Method */}
                  <ShippingSection
                    shippingCost={shippingCost}
                    loading={loadingShipping}
                  />

                  {/* Payment Method */}
                  <PaymentSection
                    paymentMethods={paymentList}
                    selectedPayment={data.payment_method}
                    setSelectedPayment={(v) => setData('payment_method', v)}
                    error={errors.payment_method}
                  />
                </div>

                {/* Order Summary */}
                <OrderSummary
                  cart={safeCart}
                  addresses={addressList}
                  getProductImage={getProductImage}
                  processing={processing}
                  selectedAddress={data.address_id}
                  selectedPayment={data.payment_method}
                  selectedShipping={data.shipping_method}
                  paymentSettings={paymentSettings}
                  errors={errors}
                  shippingCost={shippingCost}
                  loadingShipping={loadingShipping}
                />
              </div>
            </form>
          </div>
        </main>
      </ShopLayout>
    </>
  );
}

// Shipping methods data removed

const getShippingCost = async (
  destinationId: string,
  weight: number,
  courier: string,
): Promise<number> => {
  try {
    const response = await fetch('/api/shipping/cost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        destination: destinationId,
        weight: weight,
        courier: courier,
      }),
    });
    const data = await response.json();
    const costs = data[0]?.costs;
    // Default to first service cost (usually OKE/REG/YES, we might want to let user pick sub-service)
    // For now, let's assume we map 'regular' to 'jne' REG service logic in backend but here we just take the first one or specific
    if (costs && costs.length > 0) {
      return costs[0].cost[0].value;
    }
    return 0;
  } catch (e) {
    console.error('Failed to calc shipping', e);
    return 0;
  }
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

interface ShippingSectionProps {
  shippingCost: number;
  loading: boolean;
}

function ShippingSection({ shippingCost, loading }: ShippingSectionProps) {
  return (
    <div className="rounded-sm bg-white p-6">
      <h2 className="mb-4 flex items-center gap-2 font-serif text-xl text-terra-900">
        <Package className="h-5 w-5" /> Metode Pengiriman
      </h2>
      <div className="space-y-3">
        <div
          className={`flex items-center justify-between rounded-sm border-2 border-wood bg-wood/5 p-4 transition-colors`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 border-wood bg-wood`}
            >
              <Check className="h-3 w-3 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              <span className="text-terra-900">JNE Reguler</span>
            </div>
          </div>
          <span className="font-medium text-wood">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : shippingCost > 0 ? (
              formatCurrency(shippingCost)
            ) : (
              'Menghitung...'
            )}
          </span>
        </div>
        <p className="text-xs text-terra-500">
          *Biaya ongkir dihitung otomatis berdasarkan alamat pengiriman.
        </p>
      </div>
    </div>
  );
}

interface PaymentSectionProps {
  paymentMethods: PaymentMethod[];
  selectedPayment: string;
  setSelectedPayment: (value: string) => void;
  error?: string;
}

function PaymentSection({
  paymentMethods,
  selectedPayment,
  setSelectedPayment,
  error,
}: PaymentSectionProps) {
  return (
    <div className="rounded-sm bg-white p-6">
      <h2 className="mb-4 flex items-center gap-2 font-serif text-xl text-terra-900">
        <CreditCard className="h-5 w-5" /> Metode Pembayaran
      </h2>
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <label
            key={method.value}
            className={`block cursor-pointer rounded-sm border-2 p-4 transition-colors ${selectedPayment === method.value ? 'border-wood bg-wood/5' : 'border-terra-100 hover:border-terra-200'}`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${selectedPayment === method.value ? 'border-wood bg-wood' : 'border-terra-300'}`}
              >
                {selectedPayment === method.value && (
                  <Check className="h-3 w-3 text-white" />
                )}
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  {method.value === 'bank_transfer' ? (
                    <Building2 className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Banknote className="h-5 w-5 text-green-600" />
                  )}
                  <span className="font-medium text-terra-900">
                    {method.name}
                  </span>
                  {method.fee > 0 && (
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-700">
                      +{formatCurrency(method.fee)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-terra-500">{method.description}</p>
              </div>
            </div>
            <input
              type="radio"
              name="payment"
              value={method.value}
              checked={selectedPayment === method.value}
              onChange={() => setSelectedPayment(method.value)}
              className="hidden"
            />
          </label>
        ))}
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}

interface OrderSummaryProps {
  cart: Cart;
  addresses: Address[]; // Need full list to find selected address details
  getProductImage: (product: CartItem['product']) => string;
  processing: boolean;
  selectedAddress: number | null;
  selectedPayment: string;
  selectedShipping: string;
  paymentSettings: PaymentSettings;
  errors: Record<string, string>;
  shippingCost: number;
  loadingShipping: boolean;
}

function OrderSummary({
  cart,
  addresses,
  getProductImage,
  processing,
  selectedAddress,
  selectedPayment,
  selectedShipping,
  paymentSettings,
  errors,
  shippingCost,
  loadingShipping,
}: OrderSummaryProps) {
  const hasErrors = Object.keys(errors).length > 0;

  // State for shipping cost removed (lifted up)

  const codFee = selectedPayment === 'cod' ? paymentSettings?.cod_fee || 0 : 0;
  const subtotal = cart.subtotal || 0;
  const total = subtotal + shippingCost + codFee;

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-28 rounded-sm bg-white p-6">
        <h2 className="mb-4 font-serif text-xl text-terra-900">
          Ringkasan Pesanan
        </h2>

        {/* Items */}
        <div className="mb-4 max-h-60 space-y-3 overflow-y-auto">
          {cart.items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-terra-100">
                <img
                  src={getProductImage(item.product)}
                  alt={item.product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm text-terra-900">
                  {item.product.name}
                </p>
                <p className="text-sm text-terra-500">
                  {item.quantity}x {item.unit_price_formatted}
                </p>
              </div>
              <span className="text-sm font-medium text-terra-900">
                {item.subtotal_formatted}
              </span>
            </div>
          ))}
        </div>

        <div className="mb-4 space-y-2 border-t border-terra-100 pt-4">
          <div className="flex justify-between text-terra-600">
            <span>Subtotal</span>
            <span>{cart.subtotal_formatted}</span>
          </div>
          <div className="flex justify-between text-terra-600">
            <span>Ongkos Kirim</span>
            <span
              className={shippingCost > 0 ? 'text-terra-900' : 'text-terra-500'}
            >
              {loadingShipping ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : shippingCost > 0 ? (
                formatCurrency(shippingCost)
              ) : (
                'Gratis'
              )}
            </span>
          </div>
          {codFee > 0 && (
            <div className="flex justify-between text-terra-600">
              <span>Biaya COD</span>
              <span className="text-orange-600">{formatCurrency(codFee)}</span>
            </div>
          )}
        </div>

        <div className="mb-6 border-t border-terra-100 pt-4">
          <div className="flex justify-between">
            <span className="font-medium text-terra-900">Total</span>
            <span className="font-serif text-2xl text-terra-900">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={
            processing ||
            !selectedAddress ||
            !selectedPayment ||
            loadingShipping
          }
          className="flex w-full items-center justify-center gap-2 rounded-sm bg-teal-600 py-4 font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {processing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Memproses...
            </>
          ) : (
            'Buat Pesanan'
          )}
        </button>

        {(!selectedAddress || !selectedPayment) && (
          <p className="mt-3 text-center text-sm text-red-500">
            {!selectedAddress
              ? 'Pilih alamat pengiriman'
              : 'Pilih metode pembayaran'}
          </p>
        )}

        {hasErrors && (
          <div className="mt-3 rounded-lg bg-red-50 p-3">
            <p className="mb-1 text-sm font-medium text-red-600">
              Terjadi kesalahan:
            </p>
            <ul className="list-inside list-disc text-sm text-red-500">
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
