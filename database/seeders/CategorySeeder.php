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
            [
                'name' => 'Dapur',
                'description' => 'Furniture dan perlengkapan dapur modern',
                'is_featured' => true,
                'children' => [
                    ['name' => 'Kitchen Set', 'description' => 'Set dapur lengkap custom'],
                    ['name' => 'Rak Dapur', 'description' => 'Rak penyimpanan dapur'],
                    ['name' => 'Meja Dapur', 'description' => 'Meja persiapan dapur'],
                ],
            ],
            [
                'name' => 'Kamar Anak',
                'description' => 'Furniture khusus untuk kamar anak-anak',
                'is_featured' => false,
                'children' => [
                    ['name' => 'Tempat Tidur Anak', 'description' => 'Tempat tidur aman untuk anak'],
                    ['name' => 'Meja Belajar', 'description' => 'Meja belajar ergonomis untuk anak'],
                    ['name' => 'Lemari Anak', 'description' => 'Lemari dengan desain menarik'],
                    ['name' => 'Rak Mainan', 'description' => 'Rak penyimpanan mainan'],
                ],
            ],
            [
                'name' => 'Kamar Mandi',
                'description' => 'Furniture dan aksesoris kamar mandi',
                'is_featured' => false,
                'children' => [
                    ['name' => 'Vanity', 'description' => 'Meja wastafel dengan cermin'],
                    ['name' => 'Rak Handuk', 'description' => 'Rak untuk handuk dan perlengkapan'],
                    ['name' => 'Kabinet Kamar Mandi', 'description' => 'Kabinet penyimpanan'],
                ],
            ],
            [
                'name' => 'Lorong & Entrance',
                'description' => 'Furniture untuk area masuk dan lorong rumah',
                'is_featured' => false,
                'children' => [
                    ['name' => 'Meja Konsol', 'description' => 'Meja dekoratif untuk lorong'],
                    ['name' => 'Rak Sepatu', 'description' => 'Rak penyimpanan sepatu'],
                    ['name' => 'Gantungan Baju', 'description' => 'Stand gantungan pakaian'],
                    ['name' => 'Cermin Besar', 'description' => 'Cermin dekoratif untuk entrance'],
                ],
            ],
            [
                'name' => 'Dekorasi',
                'description' => 'Aksesoris dan dekorasi pelengkap ruangan',
                'is_featured' => true,
                'children' => [
                    ['name' => 'Lampu', 'description' => 'Lampu dekoratif dan fungsional'],
                    ['name' => 'Vas & Pot', 'description' => 'Vas bunga dan pot tanaman'],
                    ['name' => 'Jam Dinding', 'description' => 'Jam dekoratif untuk dinding'],
                    ['name' => 'Pigura', 'description' => 'Frame foto dan artwork'],
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
                // Use parent-child slug to avoid collisions
                $childSlug = Str::slug($categoryData['name'] . ' ' . $childData['name']);
                Category::firstOrCreate(
                    ['slug' => $childSlug],
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

