<?php

declare(strict_types=1);

namespace App\Http\Controllers\Shop;

use App\Actions\Order\CreateOrderAction;
use App\Enums\PaymentMethod;
use App\Http\Controllers\Controller;
use App\Http\Requests\Shop\CheckoutRequest;
use App\Http\Resources\AddressResource;
use App\Http\Resources\CartResource;
use App\Http\Resources\OrderResource;
use App\Models\Address;
use App\Models\Cart;
use App\Models\User;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller implements HasMiddleware
{
    /** @return array<int, Middleware> */
    public static function middleware(): array
    {
        return [
            new Middleware('auth'),
        ];
    }

    public function index(Request $request): Response|RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        /** @var Cart|null $cart */
        $cart = $user->cart?->load('items.product.images');

        if (! $cart || $cart->items->isEmpty()) {
            return redirect()
                ->route('shop.cart.index')
                ->with('error', 'Keranjang belanja Anda kosong.');
        }

        $addresses = $user->addresses()->orderByDesc('is_default')->get();

        return Inertia::render('Shop/Checkout/Index', [
            'cart' => new CartResource($cart),
            'addresses' => AddressResource::collection($addresses),
            'paymentMethods' => PaymentMethod::cases(),
        ]);
    }

    public function store(CheckoutRequest $request, CreateOrderAction $action): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        /** @var Cart|null $cart */
        $cart = $user->cart?->load('items.product');

        if (! $cart || $cart->items->isEmpty()) {
            return redirect()
                ->route('shop.cart.index')
                ->with('error', 'Keranjang belanja Anda kosong.');
        }

        $validated = $request->validated();

        // Get shipping data from address or form
        if (isset($validated['address_id'])) {
            /** @var Address $address */
            $address = Address::findOrFail($validated['address_id']);
            $shippingData = [
                'shipping_name' => $address->recipient_name,
                'shipping_phone' => $address->phone,
                'shipping_email' => $user->email,
                'shipping_address' => $address->full_address,
                'shipping_city' => $address->city,
                'shipping_province' => $address->province,
                'shipping_postal_code' => $address->postal_code,
                'payment_method' => $validated['payment_method'],
                'shipping_method' => $validated['shipping_method'],
                'customer_notes' => $validated['customer_notes'] ?? null,
                'coupon_code' => $validated['coupon_code'] ?? null,
            ];
        } else {
            $shippingData = [
                'shipping_name' => $validated['shipping_name'],
                'shipping_phone' => $validated['shipping_phone'],
                'shipping_email' => $validated['shipping_email'],
                'shipping_address' => $validated['shipping_address'],
                'shipping_city' => $validated['shipping_city'],
                'shipping_province' => $validated['shipping_province'],
                'shipping_postal_code' => $validated['shipping_postal_code'],
                'payment_method' => $validated['payment_method'],
                'shipping_method' => $validated['shipping_method'],
                'customer_notes' => $validated['customer_notes'] ?? null,
                'coupon_code' => $validated['coupon_code'] ?? null,
            ];

            // Save address if requested
            if (! empty($validated['save_address'])) {
                $user->addresses()->create([
                    'label' => 'Alamat Baru',
                    'recipient_name' => $validated['shipping_name'],
                    'phone' => $validated['shipping_phone'],
                    'address' => $validated['shipping_address'],
                    'city' => $validated['shipping_city'],
                    'province' => $validated['shipping_province'],
                    'postal_code' => $validated['shipping_postal_code'],
                ]);
            }
        }

        $order = $action->execute($user, $cart, $shippingData);

        return redirect()
            ->route('shop.orders.show', $order)
            ->with('success', 'Pesanan berhasil dibuat. Nomor pesanan: '.$order->order_number);
    }

    public function success(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        $order = $user->orders()->latest()->first();

        return Inertia::render('Shop/Checkout/Success', [
            'order' => $order ? new OrderResource($order->load('items')) : null,
        ]);
    }
}
