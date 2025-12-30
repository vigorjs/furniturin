<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\ProductStatus;
use App\Enums\SaleType;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = $this->getProductsData();

        foreach ($products as $productData) {
            $category = Category::where('name', $productData['category'])->first();

            if (!$category) {
                continue;
            }

            Product::firstOrCreate(
                ['sku' => $productData['sku']],
                [
                    'category_id' => $category->id,
                    'name' => $productData['name'],
                    'slug' => Str::slug($productData['name']) . '-' . Str::random(5),
                    'short_description' => $productData['short_description'],
                    'description' => $productData['description'],
                    'price' => $productData['price'],
                    'compare_price' => $productData['compare_price'] ?? null,
                    'cost_price' => (int) ($productData['price'] * 0.6),
                    'stock_quantity' => $productData['stock'],
                    'low_stock_threshold' => 5,
                    'track_stock' => true,
                    'material' => $productData['material'],
                    'color' => $productData['color'],
                    'weight' => $productData['weight'],
                    'length' => $productData['dimensions']['length'],
                    'width' => $productData['dimensions']['width'],
                    'height' => $productData['dimensions']['height'],
                    'specifications' => $productData['specifications'],
                    'status' => ProductStatus::ACTIVE,
                    'sale_type' => $productData['sale_type'] ?? SaleType::REGULAR,
                    'is_featured' => $productData['is_featured'] ?? false,
                    'is_new_arrival' => $productData['is_new_arrival'] ?? false,
                    'discount_percentage' => $productData['discount'] ?? null,
                    'discount_starts_at' => isset($productData['discount']) ? now() : null,
                    'discount_ends_at' => isset($productData['discount']) ? now()->addDays(30) : null,
                    'meta_title' => $productData['name'] . ' - Toko Furniture',
                    'meta_description' => $productData['short_description'],
                ]
            );
        }

        // Generate dynamic products
        Product::factory()->count(50)->create();
    }

    /** @return array<int, array<string, mixed>> */
    private function getProductsData(): array
    {
        return [
            [
                'sku' => 'SFA-001',
                'name' => 'Sofa Minimalis 3 Seater',
                'category' => 'Sofa',
                'short_description' => 'Sofa minimalis modern untuk 3 orang',
                'description' => 'Sofa minimalis dengan desain modern, cocok untuk ruang tamu. Bahan berkualitas tinggi dengan busa empuk.',
                'price' => 4500000,
                'compare_price' => 5500000,
                'stock' => 15,
                'material' => 'Kayu Jati',
                'color' => 'Abu-abu',
                'weight' => 45.0,
                'dimensions' => ['length' => 200, 'width' => 85, 'height' => 80],
                'specifications' => ['garansi' => '2 Tahun', 'kapasitas' => '3 Orang'],
                'is_featured' => true,
                'is_new_arrival' => true,
                'discount' => 15,
                'sale_type' => SaleType::HOT_SALE,
            ],
            [
                'sku' => 'TMP-001',
                'name' => 'Tempat Tidur King Size Kayu Jati',
                'category' => 'Tempat Tidur',
                'short_description' => 'Tempat tidur king size dari kayu jati solid',
                'description' => 'Tempat tidur ukuran king size dengan rangka kayu jati solid. Desain elegan dan kokoh.',
                'price' => 8500000,
                'stock' => 8,
                'material' => 'Kayu Jati',
                'color' => 'Coklat Tua',
                'weight' => 120.0,
                'dimensions' => ['length' => 200, 'width' => 180, 'height' => 45],
                'specifications' => ['garansi' => '5 Tahun', 'ukuran_kasur' => '180x200 cm'],
                'is_featured' => true,
            ],
            [
                'sku' => 'MJM-001',
                'name' => 'Meja Makan 6 Kursi Minimalis',
                'category' => 'Meja Makan',
                'short_description' => 'Set meja makan untuk 6 orang',
                'description' => 'Meja makan minimalis dengan 6 kursi. Cocok untuk keluarga besar.',
                'price' => 6500000,
                'compare_price' => 7500000,
                'stock' => 12,
                'material' => 'Kayu Mahoni',
                'color' => 'Natural',
                'weight' => 85.0,
                'dimensions' => ['length' => 160, 'width' => 90, 'height' => 75],
                'specifications' => ['garansi' => '3 Tahun', 'kapasitas' => '6 Orang'],
                'is_featured' => true,
                'discount' => 10,
            ],
            [
                'sku' => 'LMP-001',
                'name' => 'Lemari Pakaian 3 Pintu',
                'category' => 'Lemari Pakaian',
                'short_description' => 'Lemari pakaian besar dengan 3 pintu',
                'description' => 'Lemari pakaian dengan kapasitas besar, 3 pintu dengan cermin.',
                'price' => 5500000,
                'stock' => 10,
                'material' => 'MDF',
                'color' => 'Putih',
                'weight' => 95.0,
                'dimensions' => ['length' => 150, 'width' => 60, 'height' => 200],
                'specifications' => ['garansi' => '2 Tahun', 'jumlah_pintu' => '3'],
                'is_new_arrival' => true,
            ],
            [
                'sku' => 'MJK-001',
                'name' => 'Meja Kerja Minimalis',
                'category' => 'Meja Kerja',
                'short_description' => 'Meja kerja untuk work from home',
                'description' => 'Meja kerja minimalis dengan laci penyimpanan. Ideal untuk WFH.',
                'price' => 1800000,
                'stock' => 25,
                'material' => 'Plywood',
                'color' => 'Coklat Muda',
                'weight' => 25.0,
                'dimensions' => ['length' => 120, 'width' => 60, 'height' => 75],
                'specifications' => ['garansi' => '1 Tahun', 'jumlah_laci' => '2'],
            ],
        ];
    }
}
