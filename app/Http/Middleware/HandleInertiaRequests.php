<?php

namespace App\Http\Middleware;

use App\Models\PromoBanner;
use App\Models\Setting;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $user = $request->user();

        // Fetch featured categories for global navbar
        // Cache to avoid query on every page load
        $featuredCategories = Cache::remember('featured_categories_navbar', 3600, function () {
            return \App\Models\Category::query()
                ->active()
                ->root() // Only top level
                ->with(['children' => function ($query) {
                    $query->active()->orderBy('sort_order');
                }])
                ->orderBy('sort_order')
                ->limit(11) // Limit logic updated to match shop page
                ->get()
                ->map(function ($category) {
                     // Ensure image_url is appended or available
                     $category->image_url = $category->image_url;
                     return $category;
                });
        });

        // Fetch active promo banners for shop frontend
        $activePromoBanners = Cache::remember('active_promo_banners', 300, function () {
            return PromoBanner::active()
                ->ordered()
                ->get()
                ->map(function ($banner) {
                    return [
                        'id' => $banner->id,
                        'title' => $banner->title,
                        'description' => $banner->description,
                        'cta_text' => $banner->cta_text,
                        'cta_link' => $banner->cta_link,
                        'icon' => $banner->icon,
                        'bg_gradient' => $banner->bg_gradient,
                        'display_type' => $banner->display_type,
                    ];
                });
        });

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $user ? [
                    ...$user->toArray(),
                    'roles' => $user->getRoleNames(),
                ] : null,
            ],
            'wishlistCount' => $user ? $user->wishlists()->count() : 0,
            'sidebarOpen' => !$request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'siteSettings' => fn() => $this->getSiteSettings(),
            'featuredCategories' => $featuredCategories,
            'activePromoBanners' => $activePromoBanners,
        ];
    }

    /**
     * Get site settings from cache or database.
     *
     * @return array<string, mixed>
     */
    private function getSiteSettings(): array
    {
        return Cache::remember('site_settings', 3600, function () {
            $settings = Setting::all()->pluck('value', 'key')->toArray();

            return [
                'site_name' => $settings['site_name'] ?? 'Furniturin',
                'site_description' => $settings['site_description'] ?? 'Toko furnitur premium Indonesia',
                'contact_email' => $settings['contact_email'] ?? '',
                'contact_phone' => $settings['contact_phone'] ?? '',
                'contact_whatsapp' => $settings['contact_whatsapp'] ?? '',
                'address' => $settings['address'] ?? '',
                'facebook_url' => $settings['facebook_url'] ?? '',
                'instagram_url' => $settings['instagram_url'] ?? '',
                'tiktok_url' => $settings['tiktok_url'] ?? '',
            ];
        });
    }
}
