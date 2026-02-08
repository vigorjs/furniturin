<?php
/**
 * Cache Clear Script for cPanel - v3
 * Properly handles database cache driver
 * DELETE THIS FILE AFTER USE!
 */

$secretKey = 'furniturin2026clear';

if (!isset($_GET['key']) || $_GET['key'] !== $secretKey) {
    http_response_code(403);
    die('Forbidden - Invalid key. Use: ?key=' . $secretKey);
}

echo "<pre style='font-family: monospace; background: #1a1a1a; color: #00ff00; padding: 20px;'>";
echo "=== Laravel Cache Clear Script v3 ===\n\n";

// Find Laravel root - cPanel structure: /laravel/ contains app, /public_html/ is web root
$possibleRoots = [
    __DIR__,
    dirname(__DIR__),
    dirname(__DIR__) . '/laravel',           // /home/user/laravel when script is in /home/user/public_html
    '/home/furnit59/laravel',                 // Direct path
    realpath(__DIR__ . '/../laravel'),        // Relative to public_html
];

$laravelRoot = null;

foreach ($possibleRoots as $path) {
    $realPath = realpath($path);
    if ($realPath && file_exists($realPath . '/artisan')) {
        $laravelRoot = $realPath;
        echo "✓ Found Laravel at: $realPath\n\n";
        break;
    }
}

if (!$laravelRoot) {
    echo "Laravel not found! Debugging info:\n\n";
    echo "Current script location: " . __DIR__ . "\n";
    echo "Parent directory: " . dirname(__DIR__) . "\n\n";
    
    echo "Files in current directory:\n";
    foreach (scandir(__DIR__) as $f) {
        echo "  - $f\n";
    }
    
    echo "\nFiles in parent directory:\n";
    $parent = @scandir(dirname(__DIR__));
    if ($parent) {
        foreach ($parent as $f) {
            echo "  - $f\n";
        }
    }
    
    echo "\n\nPlease tell me the folder structure so I can fix the script.";
    echo "</pre>";
    exit;
}

chdir($laravelRoot);

// Bootstrap Laravel properly
require $laravelRoot . '/vendor/autoload.php';
$app = require_once $laravelRoot . '/bootstrap/app.php';

try {
    // Boot the application
    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
    $kernel->bootstrap();

    echo "1. Clearing application cache (database)...\n";
    Illuminate\Support\Facades\Cache::flush();
    echo "   ✓ Application cache cleared!\n";

    echo "\n2. Clearing specific keys...\n";
    $keys = [
        'featured_categories_navbar',
        'site_settings',
        'active_promo_banners',
    ];
    foreach ($keys as $key) {
        Illuminate\Support\Facades\Cache::forget($key);
        echo "   ✓ Cleared: $key\n";
    }

    echo "\n3. Running artisan commands...\n";
    
    $kernel->call('config:clear');
    echo "   ✓ config:clear\n";
    
    $kernel->call('view:clear');
    echo "   ✓ view:clear\n";
    
    $kernel->call('route:clear');
    echo "   ✓ route:clear\n";

    echo "\n=== ALL CACHE CLEARED! ===\n";
    echo "\n⚠️  DELETE THIS FILE NOW!\n";
    echo "\nRefresh your website to see the changes.\n";

} catch (Exception $e) {
    echo "\n❌ Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
}

echo "</pre>";

