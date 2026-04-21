<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Artisan Web Routes (for cPanel deployment)
|--------------------------------------------------------------------------
| These routes allow running artisan commands via web browser
| Protected by simple token check
| IMPORTANT: Set ARTISAN_TOKEN in your .env file
*/

// Helper function to check token
function checkArtisanToken()
{
    $token = config('app.artisan_token');

    if (!$token || request()->input('token') !== $token) {
        abort(403, 'Unauthorized. Invalid or missing token.');
    }
}

Route::prefix('artisan')->middleware('web')->group(function () {
    // Populate locale-specific settings
    Route::get('/populate-locale', function () {
        checkArtisanToken();

        try {
            Artisan::call('settings:populate-locale');

            return response()->json([
                'success' => true,
                'output' => Artisan::output(),
                'message' => 'Locale settings populated successfully!',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => config('app.debug') ? $e->getTraceAsString() : null,
            ], 500);
        }
    })->name('artisan.populate-locale');

    // Clear all caches
    Route::get('/clear-cache', function () {
        checkArtisanToken();

        try {
            Artisan::call('cache:clear');
            Artisan::call('config:clear');
            Artisan::call('route:clear');
            Artisan::call('view:clear');

            return response()->json([
                'success' => true,
                'message' => 'All caches cleared successfully!',
                'cleared' => ['cache', 'config', 'route', 'view'],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    })->name('artisan.clear-cache');

    // Optimize for production
    Route::get('/optimize', function () {
        checkArtisanToken();

        try {
            Artisan::call('config:cache');
            Artisan::call('route:cache');
            Artisan::call('view:cache');

            return response()->json([
                'success' => true,
                'message' => 'Application optimized for production!',
                'cached' => ['config', 'route', 'view'],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    })->name('artisan.optimize');

    // Run migrations
    Route::get('/migrate', function () {
        checkArtisanToken();

        try {
            Artisan::call('migrate', ['--force' => true]);

            return response()->json([
                'success' => true,
                'output' => Artisan::output(),
                'message' => 'Migrations executed successfully!',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => config('app.debug') ? $e->getTraceAsString() : null,
            ], 500);
        }
    })->name('artisan.migrate');

    // Storage link
    Route::get('/storage-link', function () {
        checkArtisanToken();

        try {
            Artisan::call('storage:link');

            return response()->json([
                'success' => true,
                'output' => Artisan::output(),
                'message' => 'Storage link created successfully!',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    })->name('artisan.storage-link');

    // Extract vendor.tar.gz uploaded by CI pipeline
    // Supports ?force=1 to re-extract even if hash matches last extraction
    Route::get('/extract-vendor', function () {
        checkArtisanToken();

        @set_time_limit(0);
        @ini_set('memory_limit', '512M');

        $tarGz = base_path('vendor.tar.gz');
        $hashFile = base_path('vendor.tar.gz.extracted');

        if (!file_exists($tarGz)) {
            return response()->json([
                'success' => false,
                'error' => 'vendor.tar.gz not found at ' . $tarGz,
            ], 404);
        }

        $currentHash = sha1_file($tarGz);
        $lastHash = file_exists($hashFile) ? trim(file_get_contents($hashFile)) : null;

        if ($currentHash === $lastHash && !request()->boolean('force')) {
            return response()->json([
                'success' => true,
                'skipped' => true,
                'message' => 'Vendor already extracted for this hash, skipping',
                'hash' => $currentHash,
            ]);
        }

        $method = null;

        try {
            // Try tar binary first (much faster than PHP-based extraction)
            if (function_exists('exec')) {
                $cmd = 'tar -xzf ' . escapeshellarg($tarGz) . ' -C ' . escapeshellarg(base_path()) . ' 2>&1';
                $output = [];
                $exitCode = 1;
                exec($cmd, $output, $exitCode);

                if ($exitCode === 0) {
                    $method = 'tar';
                }
            }

            // Fallback: PharData (pure PHP, works even if exec() is disabled)
            if ($method === null) {
                $phar = new PharData($tarGz);
                $phar->extractTo(base_path(), null, true);
                // PharData may leave a .tar sidecar when decompressing .tar.gz
                $tarSidecar = base_path('vendor.tar');
                if (file_exists($tarSidecar)) {
                    @unlink($tarSidecar);
                }
                $method = 'phardata';
            }

            file_put_contents($hashFile, $currentHash);

            return response()->json([
                'success' => true,
                'method' => $method,
                'hash' => $currentHash,
                'vendor_exists' => is_dir(base_path('vendor')),
                'message' => 'Vendor extracted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    })->name('artisan.extract-vendor');

    // List all available commands
    Route::get('/list', function () {
        checkArtisanToken();

        return response()->json([
            'available_routes' => [
                'populate-locale' => url('/artisan/populate-locale?token=YOUR_TOKEN'),
                'clear-cache' => url('/artisan/clear-cache?token=YOUR_TOKEN'),
                'optimize' => url('/artisan/optimize?token=YOUR_TOKEN'),
                'migrate' => url('/artisan/migrate?token=YOUR_TOKEN'),
                'storage-link' => url('/artisan/storage-link?token=YOUR_TOKEN'),
                'extract-vendor' => url('/artisan/extract-vendor?token=YOUR_TOKEN'),
            ],
            'note' => 'Replace YOUR_TOKEN with the value from ARTISAN_TOKEN in .env',
        ]);
    })->name('artisan.list');

    // Test route (no sensitive actions)
    Route::get('/test', function () {
        checkArtisanToken();

        return response()->json([
            'success' => true,
            'message' => 'Token is valid! Artisan routes are working.',
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
        ]);
    })->name('artisan.test');
});
