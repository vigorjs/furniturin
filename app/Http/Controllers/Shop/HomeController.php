<?php

declare(strict_types=1);

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\Setting;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        // Featured Products (6 items)
        $featuredProducts = Product::active()
            ->featured()
            ->with(['category', 'images'])
            ->orderByDesc('sold_count')
            ->limit(6)
            ->get();

        // Featured Categories (for navbar display)
        $featuredCategories = Category::where('is_active', true)
            ->where('is_featured', true)
            ->whereNull('parent_id')
            ->orderBy('sort_order')
            ->get();

        // Testimonials (approved reviews with high rating)
        $testimonials = ProductReview::where('is_approved', true)
            ->where('rating', '>=', 4)
            ->whereNotNull('comment')
            ->with('user')
            ->latest()
            ->limit(3)
            ->get()
            ->map(fn (ProductReview $review) => [
                'id' => $review->id,
                'text' => $review->comment,
                'rating' => $review->rating,
                'author' => $review->user?->name ?? 'Pelanggan',
                'location' => $review->user?->city ?? 'Indonesia',
            ]);

        // Hero Settings
        $heroSettings = [
            'badge' => Setting::get('hero_badge', 'Koleksi Terbaru 2025'),
            'title' => Setting::get('hero_title', 'Desain yang'),
            'title_highlight' => Setting::get('hero_title_highlight', 'bernafas.'),
            'description' => Setting::get('hero_description', 'Furniture minimalis dari bahan berkelanjutan. Dibuat untuk mereka yang menemukan kemewahan dalam kesederhanaan.'),
            'image_main' => Setting::get('hero_image_main', '/images/placeholder-hero.svg'),
            'image_secondary' => Setting::get('hero_image_secondary', '/images/placeholder-hero.svg'),
            'product_name' => Setting::get('hero_product_name', 'Kursi Santai Premium'),
        ];

        // Trust/Press Logos
        $trustLogos = json_decode(Setting::get('trust_logos', '["Kompas", "Tempo", "Forbes Indonesia", "Bisnis Indonesia", "The Jakarta Post"]'), true);

        // Values/Features
        $values = json_decode(Setting::get('home_values', json_encode([
            ['icon' => 'leaf', 'title' => 'Bahan Berkelanjutan', 'desc' => 'Setiap produk menggunakan kayu dari hutan yang dikelola secara bertanggung jawab dan bahan daur ulang.'],
            ['icon' => 'truck', 'title' => 'Gratis Pengiriman', 'desc' => 'Pengiriman gratis untuk pembelian di atas Rp 5 juta ke seluruh Indonesia.'],
            ['icon' => 'shield-check', 'title' => 'Garansi Selamanya', 'desc' => 'Garansi seumur hidup untuk semua kerusakan struktural karena kami percaya dengan kualitas kami.'],
        ])), true);

        // Page-specific Site Settings for SEO (siteSettings is shared via middleware)
        $pageSiteSettings = [
            'name' => Setting::get('site_name', 'Latif Living'),
            'description' => Setting::get('site_description', 'Toko furnitur premium Indonesia'),
        ];

        return Inertia::render('Shop/Home', [
            'featuredProducts' => ProductResource::collection($featuredProducts),
            'featuredCategories' => CategoryResource::collection($featuredCategories),
            'testimonials' => $testimonials,
            'heroSettings' => $heroSettings,
            'trustLogos' => $trustLogos,
            'values' => $values,
            'pageSiteSettings' => $pageSiteSettings,
        ]);
    }
}
