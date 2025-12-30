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
        $categories = [
            [
                'name' => 'Ruang Tamu',
                'description' => 'Furniture untuk ruang tamu yang nyaman dan elegan',
                'is_featured' => true,
                'children' => [
                    ['name' => 'Sofa', 'description' => 'Berbagai jenis sofa untuk kenyamanan keluarga'],
                    ['name' => 'Meja Tamu', 'description' => 'Meja tamu dengan berbagai desain'],
                    ['name' => 'Rak TV', 'description' => 'Rak TV modern dan minimalis'],
                    ['name' => 'Kursi Tamu', 'description' => 'Kursi tamu untuk menyambut tamu'],
                ],
            ],
            [
                'name' => 'Kamar Tidur',
                'description' => 'Furniture kamar tidur untuk istirahat yang berkualitas',
                'is_featured' => true,
                'children' => [
                    ['name' => 'Tempat Tidur', 'description' => 'Tempat tidur berbagai ukuran'],
                    ['name' => 'Lemari Pakaian', 'description' => 'Lemari pakaian dengan kapasitas besar'],
                    ['name' => 'Nakas', 'description' => 'Nakas samping tempat tidur'],
                    ['name' => 'Meja Rias', 'description' => 'Meja rias dengan cermin'],
                ],
            ],
            [
                'name' => 'Ruang Makan',
                'description' => 'Furniture ruang makan untuk kebersamaan keluarga',
                'is_featured' => true,
                'children' => [
                    ['name' => 'Meja Makan', 'description' => 'Meja makan berbagai ukuran'],
                    ['name' => 'Kursi Makan', 'description' => 'Kursi makan yang nyaman'],
                    ['name' => 'Bufet', 'description' => 'Bufet untuk menyimpan peralatan makan'],
                ],
            ],
            [
                'name' => 'Ruang Kerja',
                'description' => 'Furniture untuk produktivitas kerja dari rumah',
                'is_featured' => false,
                'children' => [
                    ['name' => 'Meja Kerja', 'description' => 'Meja kerja ergonomis'],
                    ['name' => 'Kursi Kantor', 'description' => 'Kursi kantor yang nyaman'],
                    ['name' => 'Rak Buku', 'description' => 'Rak buku untuk menyimpan dokumen'],
                ],
            ],
            [
                'name' => 'Outdoor',
                'description' => 'Furniture untuk area luar ruangan',
                'is_featured' => false,
                'children' => [
                    ['name' => 'Kursi Taman', 'description' => 'Kursi untuk area taman'],
                    ['name' => 'Meja Taman', 'description' => 'Meja untuk area outdoor'],
                    ['name' => 'Ayunan', 'description' => 'Ayunan untuk bersantai'],
                ],
            ],
        ];

        $sortOrder = 1;
        foreach ($categories as $categoryData) {
            $parent = Category::firstOrCreate(
                ['slug' => Str::slug($categoryData['name'])],
                [
                    'name' => $categoryData['name'],
                    'description' => $categoryData['description'],
                    'is_active' => true,
                    'is_featured' => $categoryData['is_featured'],
                    'sort_order' => $sortOrder++,
                    'meta_title' => $categoryData['name'] . ' - Toko Furniture',
                    'meta_description' => $categoryData['description'],
                ]
            );

            $childSortOrder = 1;
            foreach ($categoryData['children'] as $childData) {
                Category::firstOrCreate(
                    ['slug' => Str::slug($childData['name'])],
                    [
                        'parent_id' => $parent->id,
                        'name' => $childData['name'],
                        'description' => $childData['description'],
                        'is_active' => true,
                        'is_featured' => false,
                        'sort_order' => $childSortOrder++,
                        'meta_title' => $childData['name'] . ' - ' . $categoryData['name'],
                        'meta_description' => $childData['description'],
                    ]
                );
            }
        }
    }
}
