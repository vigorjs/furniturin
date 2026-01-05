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
        // Disable foreign key checks to allow truncation
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        Product::truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        $products = $this->getProductsData();

        foreach ($products as $productData) {
            $category = Category::where('name', $productData['category'])->first();

            // Try to find sub-category if main category not found, or just fuzzy match
            if (!$category) {
                // Try finding by like if exact match fails, or skip
                 $category = Category::where('name', 'like', '%' . $productData['category'] . '%')->first();
            }

            if (!$category) {
                continue;
            }

            Product::create([
                'category_id' => $category->id,
                'sku' => $productData['sku'],
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
            ]);
        }
    }

    /** @return array<int, array<string, mixed>> */
    private function getProductsData(): array
    {
        return [
            // RUANG TAMU
            [
                'sku' => 'SFA-001',
                'name' => 'Sofa Minimalis 3 Seater Grey',
                'category' => 'Sofa',
                'short_description' => 'Sofa minimalis modern untuk 3 orang dengan bahan kain premium',
                'description' => 'Sofa tri-seater dengan desain skandinavia yang minimalis. Menggunakan rangka kayu solid dan busa high-density yang tidak mudah kempes. Lapisan kain fabric premium yang lembut dan mudah dibersihkan.',
                'price' => 4500000,
                'compare_price' => 5500000,
                'stock' => 15,
                'material' => 'Kayu Solid, Fabric, Busa HD',
                'color' => 'Abu-abu',
                'weight' => 45.0,
                'dimensions' => ['length' => 210, 'width' => 85, 'height' => 80],
                'specifications' => ['garansi' => '2 Tahun Rangka', 'kapasitas' => '3 Orang', 'kain' => 'Canvas Premium'],
                'is_featured' => true,
                'is_new_arrival' => true,
                'discount' => 15,
                'sale_type' => SaleType::HOT_SALE,
            ],
            [
                'sku' => 'SFA-L-002',
                'name' => 'Sofa L-Shape Corner Modern',
                'category' => 'Sofa',
                'short_description' => 'Sofa sudut bentuk L yang luas dan nyaman',
                'description' => 'Sofa corner L-shape yang memaksimalkan sudut ruang tamu Anda. Cocok untuk berkumpul bersama keluarga besar. Dilengkapi bantal peluk.',
                'price' => 7800000,
                'compare_price' => 8900000,
                'stock' => 5,
                'material' => 'Kayu Mahoni, Velvet',
                'color' => 'Navy Blue',
                'weight' => 65.0,
                'dimensions' => ['length' => 240, 'width' => 160, 'height' => 85],
                'specifications' => ['garansi' => '2 Tahun', 'orientasi' => 'Kanan/Kiri Flexible'],
                'is_featured' => true,
            ],
            [
                'sku' => 'MJT-001',
                'name' => 'Coffee Table Industrial',
                'category' => 'Meja Tamu',
                'short_description' => 'Meja tamu bergaya industrial dengan kaki besi',
                'description' => 'Meja tamu (coffee table) dengan perpaduan kayu jati solid dan kaki besi hollow hitam. Tampilan maskulin dan kokoh untuk ruang tamu modern industrial.',
                'price' => 1250000,
                'stock' => 20,
                'material' => 'Kayu Jati, Besi Hollow',
                'color' => 'Natural Wood & Black',
                'weight' => 12.0,
                'dimensions' => ['length' => 100, 'width' => 60, 'height' => 45],
                'specifications' => ['finishing' => 'Matte', 'ketebalan_top' => '3cm'],
            ],
            [
                'sku' => 'RTV-001',
                'name' => 'Rak TV Gantung Minimalis',
                'category' => 'Rak TV',
                'short_description' => 'Rak TV floating/gantung untuk kesan modern',
                'description' => 'Rak TV model gantung yang hemat tempat dan membuat ruangan terasa lebih luas. Dilengkapi 3 laci penyimpanan tertutup dan area kabel yang rapi.',
                'price' => 1850000,
                'stock' => 10,
                'material' => 'Plywood HPL',
                'color' => 'Putih Glossy',
                'weight' => 18.0,
                'dimensions' => ['length' => 150, 'width' => 40, 'height' => 30],
                'specifications' => ['max_load' => '30kg', 'ukuran_tv' => 'Up to 55 inch'],
                'is_new_arrival' => true,
            ],

            // KAMAR TIDUR
            [
                'sku' => 'TMP-001',
                'name' => 'Tempat Tidur King Size Jati',
                'category' => 'Tempat Tidur',
                'short_description' => 'Rangka tempat tidur king size kayu jati solid',
                'description' => 'Tempat tidur king size (180x200) dari kayu jati pilihan. Desain headboard klasik modern dengan ukiran minimalis. Sangat kokoh dan awet puluhan tahun.',
                'price' => 8500000,
                'stock' => 8,
                'material' => 'Kayu Jati Grade A',
                'color' => 'Walnut Brown',
                'weight' => 120.0,
                'dimensions' => ['length' => 210, 'width' => 190, 'height' => 110], // height headboard
                'specifications' => ['garansi' => '5 Tahun', 'ukuran_kasur' => '180x200 cm', 'sistem_rakit' => 'Knock-down'],
                'is_featured' => true,
            ],
             [
                'sku' => 'LMP-001',
                'name' => 'Lemari Pakaian 3 Pintu Cermin',
                'category' => 'Lemari Pakaian',
                'short_description' => 'Lemari pakaian 3 pintu dengan cermin full body',
                'description' => 'Lemari pakaian luas dengan 3 pintu ayun (swing). Pintu tengah dilengkapi cermin full body. Interior lega dengan gantungan baju dan banyak rak lipat.',
                'price' => 5500000,
                'stock' => 10,
                'material' => 'MDF, Laminate oak',
                'color' => 'White Oak',
                'weight' => 95.0,
                'dimensions' => ['length' => 150, 'width' => 60, 'height' => 200],
                'specifications' => ['garansi' => '1 Tahun', 'fitur' => 'Soft close hinge'],
            ],
            [
                'sku' => 'NKS-001',
                'name' => 'Nakas Bedside Table 2 Laci',
                'category' => 'Nakas',
                'short_description' => 'Meja samping tempat tidur mungil fungsional',
                'description' => 'Nakas atau meja samping tempat tidur dengan 2 laci penyimpanan. Cocok untuk menaruh lampu tidur, HP, dan buku bacaan malam.',
                'price' => 750000,
                'stock' => 30,
                'material' => 'Partikel Board',
                'color' => 'Putih',
                'weight' => 8.0,
                'dimensions' => ['length' => 45, 'width' => 40, 'height' => 50],
                'specifications' => ['rel_laci' => 'Metal runner'],
            ],

            // RUANG MAKAN
            [
                'sku' => 'MJM-001',
                'name' => 'Set Meja Makan 6 Kursi Scandi',
                'category' => 'Meja Makan',
                'short_description' => 'Set meja makan keluarga 6 kursi desain scandinavian',
                'description' => 'Momen makan bersama lebih hangat dengan set meja makan ini. Terdiri dari 1 meja persegi panjang dan 6 kursi dengan dudukan empuk. Kaki kayu solid yang estetik.',
                'price' => 6500000,
                'compare_price' => 7500000,
                'stock' => 12,
                'material' => 'Kayu Karet (Rubberwood)',
                'color' => 'Natural & Grey Fabric',
                'weight' => 85.0,
                'dimensions' => ['length' => 160, 'width' => 90, 'height' => 75],
                'specifications' => ['finishing' => 'Nitrocellulose', 'kain_kursi' => 'Polyester'],
                'is_featured' => true,
                'discount' => 10,
                'sale_type' => SaleType::STOCK_SALE,
            ],

            // RUANG KERJA
            [
                'sku' => 'MJK-001',
                'name' => 'Meja Kerja WFH Adjustable',
                'category' => 'Meja Kerja',
                'short_description' => 'Meja kerja manual adjustable height',
                'description' => 'Meja kerja modern yang ketinggiannya bisa diatur (manual). Kaki besi kokoh berbentuk T. Top table luas untuk dual monitor setup.',
                'price' => 2400000,
                'stock' => 15,
                'material' => 'Besi, MDF',
                'color' => 'Hitam & Kayu',
                'weight' => 30.0,
                'dimensions' => ['length' => 140, 'width' => 70, 'height' => 75],
                'specifications' => ['height_range' => '70-110cm', 'cable_management' => 'Yes'],
            ],
            [
                'sku' => 'KKS-001',
                'name' => 'Kursi Kantor Ergonomis Mesh',
                'category' => 'Kursi Kantor',
                'short_description' => 'Kursi kerja jaring anti gerah dengan lumbar support',
                'description' => 'Kerja seharian tanpa sakit punggung. Kursi ergonomis dengan sandaran mesh (jaring) yang sirkulasi udaranya baik. Dilengkapi headrest dan support tulang belakang.',
                'price' => 1650000,
                'compare_price' => 2000000,
                'stock' => 50,
                'material' => 'Nylon, Mesh, Besi',
                'color' => 'Hitam Full',
                'weight' => 14.0,
                'dimensions' => ['length' => 60, 'width' => 60, 'height' => 120],
                'specifications' => ['mekanisme' => 'Tilting', 'gas_lift' => 'Class 4'],
                'is_featured' => true,
            ],

            // DAPUR
            [
                'sku' => 'RKD-001',
                'name' => 'Rak Dapur Troli 3 Susun',
                'category' => 'Rak Dapur',
                'short_description' => 'Rak troli serbaguna dengan roda',
                'description' => 'Rak penyimpanan bumbu atau peralatan masak yang bisa digeser kemana saja. 3 tingkat keranjang besi yang kuat. Solusi praktis dapur sempit.',
                'price' => 450000,
                'stock' => 100,
                'material' => 'Besi Powder Coating',
                'color' => 'Putih/Hitam',
                'weight' => 4.0,
                'dimensions' => ['length' => 45, 'width' => 30, 'height' => 80],
                'specifications' => ['roda' => '4 roda (2 rem)'],
            ],

            // KAMAR ANAK
            [
                'sku' => 'TTA-001',
                'name' => 'Tempat Tidur Tingkat Anak',
                'category' => 'Tempat Tidur Anak',
                'short_description' => 'Bunk bed aman dan hemat tempat',
                'description' => 'Tempat tidur tingkat (bunk bed) solusi untuk kamar kakak beradik. Tangga yang aman dan pagar pengaman di ranjang atas. Konstruksi sangat kokoh.',
                'price' => 5200000,
                'stock' => 5,
                'material' => 'Kayu Mahoni Solid',
                'color' => 'Putih Duco',
                'weight' => 90.0,
                'dimensions' => ['length' => 200, 'width' => 100, 'height' => 170],
                'specifications' => ['ukuran_kasur' => '90x200 (x2)', 'beban_max' => '80kg per bed'],
            ],

            // DEKORASI
            [
                'sku' => 'LMP-H-001',
                'name' => 'Lampu Hias Gantung Industrial',
                'category' => 'Lampu',
                'short_description' => 'Lampu gantung cafe style sangkar besi',
                'description' => 'Lampu gantung dekoratif berbentuk diamond dari besi. Memberikan aksen hangat dan estetik untuk ruang makan atau ruang tamu. Fitting E27 standar.',
                'price' => 250000,
                'stock' => 60,
                'material' => 'Besi',
                'color' => 'Hitam Matte',
                'weight' => 1.0,
                'dimensions' => ['length' => 25, 'width' => 25, 'height' => 30],
                'specifications' => ['kabel' => '1 meter adjustable', 'bohlam' => 'Tidak termasuk'],
            ],
            [
                'sku' => 'VAS-001',
                'name' => 'Set Vas Keramik Nordic',
                'category' => 'Vas & Pot',
                'short_description' => 'Set 3 vas bunga keramik',
                'description' => 'Hiasan meja cantik berupa set 3 vas keramik dengan berbagai bentuk dan ukuran. Warna pastel yang lembut cocok untuk berbagai tema ruangan.',
                'price' => 350000,
                'stock' => 25,
                'material' => 'Keramik',
                'color' => 'Mix Pastel',
                'weight' => 2.0,
                'dimensions' => ['length' => 10, 'width' => 10, 'height' => 20], // avg
                'specifications' => ['isi' => '3 pcs'],
            ],
            
            // OUTDOOR
            [
                'sku' => 'KTS-001',
                'name' => 'Kursi Teras Rotan Sinteters',
                'category' => 'Kursi Taman',
                'short_description' => 'Set 2 kursi + 1 meja teras',
                'description' => 'Santai sore di teras dengan kursi rotan sintetis ini. Tahan hujan dan panas. Rangka besi anti karat. Sudah termasuk cushion duduk.',
                'price' => 2200000,
                'stock' => 10,
                'material' => 'Rotan PE, Besi',
                'color' => 'Coklat Honey',
                'weight' => 15.0,
                'dimensions' => ['length' => 60, 'width' => 60, 'height' => 80],
                'specifications' => ['tahan_cuaca' => 'Ya, Outdoor use'],
                'is_featured' => true,
            ]
        ];
    }
}
