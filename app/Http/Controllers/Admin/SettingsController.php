<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(): Response
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        return Inertia::render('Admin/Settings/Index', [
            'settings' => [
                'site_name' => $settings['site_name'] ?? 'Latif Living',
                'site_description' => $settings['site_description'] ?? '',
                'site_email' => $settings['site_email'] ?? '',
                'site_phone' => $settings['site_phone'] ?? '',
                'site_address' => $settings['site_address'] ?? '',
                'shipping_cost' => $settings['shipping_cost'] ?? 0,
                'free_shipping_threshold' => $settings['free_shipping_threshold'] ?? 0,
                'tax_rate' => $settings['tax_rate'] ?? 0,
                'currency' => $settings['currency'] ?? 'IDR',
                'social_facebook' => $settings['social_facebook'] ?? '',
                'social_instagram' => $settings['social_instagram'] ?? '',
                'social_twitter' => $settings['social_twitter'] ?? '',
                'social_whatsapp' => $settings['social_whatsapp'] ?? '',
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'site_name' => ['required', 'string', 'max:255'],
            'site_description' => ['nullable', 'string', 'max:500'],
            'site_email' => ['nullable', 'email', 'max:255'],
            'site_phone' => ['nullable', 'string', 'max:20'],
            'site_address' => ['nullable', 'string', 'max:500'],
            'shipping_cost' => ['nullable', 'numeric', 'min:0'],
            'free_shipping_threshold' => ['nullable', 'numeric', 'min:0'],
            'tax_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'currency' => ['nullable', 'string', 'max:10'],
            'social_facebook' => ['nullable', 'url', 'max:255'],
            'social_instagram' => ['nullable', 'url', 'max:255'],
            'social_twitter' => ['nullable', 'url', 'max:255'],
            'social_whatsapp' => ['nullable', 'string', 'max:20'],
        ]);

        foreach ($validated as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value ?? '']
            );
        }

        return back()->with('success', 'Pengaturan berhasil disimpan.');
    }

    /**
     * Homepage settings page
     */
    public function homepage(): Response
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        return Inertia::render('Admin/Settings/Homepage', [
            'settings' => [
                // Hero Section
                'hero_badge' => $settings['hero_badge'] ?? 'Koleksi Terbaru 2025',
                'hero_title' => $settings['hero_title'] ?? 'Desain yang',
                'hero_title_highlight' => $settings['hero_title_highlight'] ?? 'bernafas.',
                'hero_description' => $settings['hero_description'] ?? 'Furniture minimalis dari bahan berkelanjutan. Dibuat untuk mereka yang menemukan kemewahan dalam kesederhanaan.',
                'hero_image_main' => $settings['hero_image_main'] ?? 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2000&auto=format&fit=crop',
                'hero_image_secondary' => $settings['hero_image_secondary'] ?? 'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?q=80&w=600&auto=format&fit=crop',
                'hero_product_name' => $settings['hero_product_name'] ?? 'Kursi Santai Premium',
                // Trust Logos (JSON array)
                'trust_logos' => $settings['trust_logos'] ?? '["Kompas", "Tempo", "Forbes Indonesia", "Bisnis Indonesia", "The Jakarta Post"]',
                // Values (JSON array)
                'home_values' => $settings['home_values'] ?? json_encode([
                    ['icon' => 'leaf', 'title' => 'Bahan Berkelanjutan', 'desc' => 'Setiap produk menggunakan kayu dari hutan yang dikelola secara bertanggung jawab dan bahan daur ulang.'],
                    ['icon' => 'truck', 'title' => 'Gratis Pengiriman', 'desc' => 'Pengiriman gratis untuk pembelian di atas Rp 5 juta ke seluruh Indonesia.'],
                    ['icon' => 'shield-check', 'title' => 'Garansi Selamanya', 'desc' => 'Garansi seumur hidup untuk semua kerusakan struktural karena kami percaya dengan kualitas kami.'],
                ]),
            ],
        ]);
    }

    /**
     * Update homepage settings
     */
    public function updateHomepage(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'hero_badge' => ['nullable', 'string', 'max:100'],
            'hero_title' => ['nullable', 'string', 'max:100'],
            'hero_title_highlight' => ['nullable', 'string', 'max:100'],
            'hero_description' => ['nullable', 'string', 'max:500'],
            'hero_image_main' => ['nullable', 'url', 'max:500'],
            'hero_image_secondary' => ['nullable', 'url', 'max:500'],
            'hero_product_name' => ['nullable', 'string', 'max:100'],
            'trust_logos' => ['nullable', 'string'],
            'home_values' => ['nullable', 'string'],
        ]);

        foreach ($validated as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value ?? '']
            );
        }

        return back()->with('success', 'Pengaturan homepage berhasil disimpan.');
    }
}

