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
}

