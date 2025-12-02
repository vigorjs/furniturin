<?php

declare(strict_types=1);

use App\Http\Controllers\Shop\AddressController;
use App\Http\Controllers\Shop\CartController;
use App\Http\Controllers\Shop\CheckoutController;
use App\Http\Controllers\Shop\OrderController;
use App\Http\Controllers\Shop\ProductController;
use App\Http\Controllers\Shop\WishlistController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Shop Routes
|--------------------------------------------------------------------------
|
| Routes untuk toko online. Beberapa routes memerlukan autentikasi.
|
*/

// Public routes - Produk
Route::prefix('shop')->name('shop.')->group(function () {
    // Homepage - Landing page with products
    Route::get('/', fn() => \Inertia\Inertia::render('Shop/Home'))->name('home');

    // Products
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('/products/{product:slug}', [ProductController::class, 'show'])->name('products.show');

    // Categories
    Route::get('/categories', function () {
        $categories = \App\Models\Category::where('is_active', true)
            ->whereNull('parent_id')
            ->with('children')
            ->withCount('products')
            ->orderBy('sort_order')
            ->get();

        return \Inertia\Inertia::render('Shop/Categories/Index', [
            'categories' => \App\Http\Resources\CategoryResource::collection($categories),
        ]);
    })->name('categories.index');
    Route::get('/category/{category:slug}', [ProductController::class, 'byCategory'])->name('products.category');

    // Sale Pages
    Route::get('/hot-sale', [ProductController::class, 'hotSale'])->name('products.hot-sale');
    Route::get('/clearance', [ProductController::class, 'clearance'])->name('products.clearance');

    // Cart (accessible by guests and authenticated users)
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::put('/cart/{cartItem}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{cartItem}', [CartController::class, 'destroy'])->name('cart.destroy');
    Route::delete('/cart', [CartController::class, 'clear'])->name('cart.clear');
    Route::post('/cart/merge', [CartController::class, 'merge'])->name('cart.merge');

    // Authenticated routes
    Route::middleware(['auth', 'verified'])->group(function () {
        // Wishlist
        Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
        Route::post('/wishlist/{product}', [WishlistController::class, 'toggle'])->name('wishlist.toggle');
        Route::delete('/wishlist/{product}', [WishlistController::class, 'destroy'])->name('wishlist.destroy');
        Route::get('/wishlist/check/{product}', [WishlistController::class, 'check'])->name('wishlist.check');

        // Checkout
        Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
        Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
        Route::get('/checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');

        // Orders
        Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
        Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');

        // Addresses
        Route::resource('addresses', AddressController::class)->except(['create', 'show', 'edit']);
        Route::post('/addresses/{address}/default', [AddressController::class, 'setDefault'])->name('addresses.default');
    });
});

