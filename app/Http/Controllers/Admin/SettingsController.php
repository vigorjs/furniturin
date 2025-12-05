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
                'contact_email' => $settings['contact_email'] ?? '',
                'contact_phone' => $settings['contact_phone'] ?? '',
                'contact_whatsapp' => $settings['contact_whatsapp'] ?? '',
                'address' => $settings['address'] ?? '',
                'facebook_url' => $settings['facebook_url'] ?? '',
                'instagram_url' => $settings['instagram_url'] ?? '',
                'tiktok_url' => $settings['tiktok_url'] ?? '',
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'site_name' => ['required', 'string', 'max:255'],
            'site_description' => ['nullable', 'string', 'max:500'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:20'],
            'contact_whatsapp' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
            'facebook_url' => ['nullable', 'url', 'max:255'],
            'instagram_url' => ['nullable', 'url', 'max:255'],
            'tiktok_url' => ['nullable', 'url', 'max:255'],
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
                'hero_image_main' => $settings['hero_image_main'] ?? '/images/placeholder-hero.svg',
                'hero_image_secondary' => $settings['hero_image_secondary'] ?? '/images/placeholder-hero.svg',
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

    /**
     * Payment settings page
     */
    public function payment(): Response
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        return Inertia::render('Admin/Settings/Payment', [
            'settings' => [
                // Bank Account
                'bank_name' => $settings['bank_name'] ?? 'BCA',
                'bank_account_number' => $settings['bank_account_number'] ?? '',
                'bank_account_name' => $settings['bank_account_name'] ?? '',
                // COD Settings
                'cod_fee' => (int) ($settings['cod_fee'] ?? 5000),
                // Payment Deadline
                'payment_deadline_hours' => (int) ($settings['payment_deadline_hours'] ?? 24),
            ],
        ]);
    }

    /**
     * Update payment settings
     */
    public function updatePayment(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'bank_name' => ['required', 'string', 'max:100'],
            'bank_account_number' => ['required', 'string', 'max:50'],
            'bank_account_name' => ['required', 'string', 'max:100'],
            'cod_fee' => ['required', 'integer', 'min:0'],
            'payment_deadline_hours' => ['required', 'integer', 'min:1', 'max:168'],
        ]);

        foreach ($validated as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => (string) $value]
            );
        }

        return back()->with('success', 'Pengaturan pembayaran berhasil disimpan.');
    }
}

