<?php

declare(strict_types=1);

use App\Http\Controllers\Shop\AddressController;
use App\Http\Controllers\Shop\CartController;
use App\Http\Controllers\Shop\CheckoutController;
use App\Http\Controllers\Shop\OrderController;
use App\Http\Controllers\Shop\ProductController;
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
    Route::get('/category/{category:slug}', [ProductController::class, 'byCategory'])->name('products.category');

    // Cart (accessible by guests and authenticated users)
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::put('/cart/{cartItem}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{cartItem}', [CartController::class, 'destroy'])->name('cart.destroy');
    Route::delete('/cart', [CartController::class, 'clear'])->name('cart.clear');
    Route::post('/cart/merge', [CartController::class, 'merge'])->name('cart.merge');

    // Authenticated routes
    Route::middleware(['auth', 'verified'])->group(function () {
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

