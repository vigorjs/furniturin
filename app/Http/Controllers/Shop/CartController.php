<?php

declare(strict_types=1);

namespace App\Http\Controllers\Shop;

use App\Actions\Cart\AddToCartAction;
use App\Actions\Cart\ClearCartAction;
use App\Actions\Cart\MergeCartsAction;
use App\Actions\Cart\RemoveFromCartAction;
use App\Actions\Cart\UpdateCartItemAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Shop\AddToCartRequest;
use App\Http\Requests\Shop\UpdateCartItemRequest;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(Request $request): Response
    {
        $cart = $this->getCart($request);
        $cart?->load('items.product.images');

        return Inertia::render('Shop/Cart/Index', [
            'cart' => $cart ? new CartResource($cart) : null,
        ]);
    }

    public function store(AddToCartRequest $request, AddToCartAction $action): JsonResponse
    {
        $validated = $request->validated();

        /** @var Product $product */
        $product = Product::findOrFail($validated['product_id']);

        $cartItem = $action->execute(
            $product,
            (int) $validated['quantity'],
            $request->user(),
            $request->session()->getId()
        );

        $cart = $cartItem->cart->load('items.product.images');

        return response()->json([
            'message' => 'Produk berhasil ditambahkan ke keranjang.',
            'cart' => new CartResource($cart),
        ]);
    }

    public function update(
        UpdateCartItemRequest $request,
        CartItem $cartItem,
        UpdateCartItemAction $action
    ): JsonResponse {
        $action->execute($cartItem, (int) $request->validated('quantity'));

        $cart = $cartItem->cart->fresh()->load('items.product.images');

        return response()->json([
            'message' => 'Keranjang berhasil diperbarui.',
            'cart' => new CartResource($cart),
        ]);
    }

    public function destroy(CartItem $cartItem, RemoveFromCartAction $action): JsonResponse
    {
        $cart = $cartItem->cart;
        $action->execute($cartItem);

        $cart = $cart->fresh()->load('items.product.images');

        return response()->json([
            'message' => 'Produk berhasil dihapus dari keranjang.',
            'cart' => new CartResource($cart),
        ]);
    }

    public function clear(Request $request, ClearCartAction $action): JsonResponse
    {
        $cart = $this->getCart($request);

        if ($cart) {
            $action->execute($cart);
        }

        return response()->json([
            'message' => 'Keranjang berhasil dikosongkan.',
        ]);
    }

    public function merge(Request $request, MergeCartsAction $action): JsonResponse
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $cart = $action->execute($user, $request->session()->getId());

        return response()->json([
            'message' => 'Keranjang berhasil digabungkan.',
            'cart' => new CartResource($cart),
        ]);
    }

    private function getCart(Request $request): ?Cart
    {
        $user = $request->user();

        if ($user) {
            /** @var Cart|null $userCart */
            $userCart = $user->cart?->load('items.product');

            return $userCart;
        }

        return Cart::query()
            ->where('session_id', $request->session()->getId())
            ->with('items.product')
            ->first();
    }
}
