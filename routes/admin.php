<?php

declare(strict_types=1);

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| Routes untuk admin panel. Semua routes di sini memerlukan autentikasi
| dan role admin.
|
*/

Route::middleware(['auth', 'verified', 'role:admin|super-admin|manager|staff'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Categories
    Route::resource('categories', CategoryController::class)->except(['show']);

    // Products
    Route::resource('products', ProductController::class);

    // Orders
    Route::resource('orders', OrderController::class)->only(['index', 'show', 'update']);

    // Customers (view only)
    Route::get('/customers', [CustomerController::class, 'index'])->name('customers.index');
    Route::get('/customers/{customer}', [CustomerController::class, 'show'])->name('customers.show');

    // Reviews (ProductReview model)
    Route::get('/reviews', [ReviewController::class, 'index'])->name('reviews.index');
    Route::patch('/reviews/{review}/approve', [ReviewController::class, 'approve'])->name('reviews.approve');
    Route::patch('/reviews/{review}/reject', [ReviewController::class, 'reject'])->name('reviews.reject');
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy'])->name('reviews.destroy');

    // Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
});

// Super Admin only routes
Route::middleware(['auth', 'verified', 'role:super-admin|admin'])->prefix('admin')->name('admin.')->group(function () {
    // User Management
    Route::resource('users', UserController::class);

    // Settings
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingsController::class, 'update'])->name('settings.update');
});

