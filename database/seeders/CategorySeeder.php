<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // Main/Featured Categories (4 kategori utama)
        $mainCategories = [
            [
                'name' => 'Outdoor',
                'description' => 'Furniture untuk area luar ruangan, taman, dan teras',
                'is_featured' => true,
            ],
            [
                'name' => 'Indoor',
                'description' => 'Furniture untuk area dalam ruangan',
                'is_featured' => true,
            ],
            [
                'name' => 'Interior',
                'description' => 'Furniture dan dekorasi interior ruangan',
                'is_featured' => true,
            ],
            [
                'name' => 'Joglo',
                'description' => 'Furniture bergaya tradisional Jawa',
                'is_featured' => true,
            ],
        ];

        // Product Categories (13 kategori dari katalog PDF)
        // 6 pertama adalah featured untuk total 10 featured
        $productCategories = [
            // Featured product categories (6)
            ['name' => 'Dining Table', 'description' => 'Meja makan berbagai ukuran dan gaya', 'is_featured' => true],
            ['name' => 'Dining Chair', 'description' => 'Kursi makan yang nyaman dan elegan', 'is_featured' => true],
            ['name' => 'Sofa & Bench', 'description' => 'Sofa dan bangku untuk kenyamanan keluarga', 'is_featured' => true],
            ['name' => 'Coffee Table', 'description' => 'Meja kopi dengan berbagai desain', 'is_featured' => true],
            ['name' => 'Bed Frames', 'description' => 'Rangka tempat tidur berbagai ukuran', 'is_featured' => true],
            ['name' => 'Lounge Chair', 'description' => 'Kursi santai untuk bersantai', 'is_featured' => true],
            // Non-featured product categories (7)
            ['name' => 'Accessories', 'description' => 'Aksesoris furniture pelengkap', 'is_featured' => false],
            ['name' => 'Bar Stool', 'description' => 'Kursi bar untuk area dapur dan bar', 'is_featured' => false],
            ['name' => 'Bookshelf', 'description' => 'Rak buku untuk penyimpanan dan display', 'is_featured' => false],
            ['name' => 'Desk', 'description' => 'Meja kerja untuk produktivitas', 'is_featured' => false],
            ['name' => 'Dresser & Wardrobe', 'description' => 'Lemari pakaian dan meja rias', 'is_featured' => false],
            ['name' => 'Nightstand', 'description' => 'Nakas samping tempat tidur', 'is_featured' => false],
            ['name' => 'Sideboard & TV Cabinet', 'description' => 'Bufet dan rak TV modern', 'is_featured' => false],
        ];

        $sortOrder = 1;

        // Create main categories
        foreach ($mainCategories as $categoryData) {
            Category::firstOrCreate(
                ['slug' => Str::slug($categoryData['name'])],
                [
                    'name' => $categoryData['name'],
                    'description' => $categoryData['description'],
                    'is_active' => true,
                    'is_featured' => $categoryData['is_featured'],
                    'sort_order' => $sortOrder++,
                    'meta_title' => $categoryData['name'] . ' - Furniturin',
                    'meta_description' => $categoryData['description'],
                ]
            );
        }

        // Create product categories
        foreach ($productCategories as $categoryData) {
            Category::firstOrCreate(
                ['slug' => Str::slug($categoryData['name'])],
                [
                    'name' => $categoryData['name'],
                    'description' => $categoryData['description'],
                    'is_active' => true,
                    'is_featured' => $categoryData['is_featured'],
                    'sort_order' => $sortOrder++,
                    'meta_title' => $categoryData['name'] . ' - Furniturin',
                    'meta_description' => $categoryData['description'],
                ]
            );
        }
    }
}

