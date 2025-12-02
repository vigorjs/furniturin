# Latif Living - E-Commerce Furniture

Latif Living adalah platform e-commerce modern yang dirancang untuk penjualan furniture dan perabotan rumah tangga berkualitas tinggi. Proyek ini dibangun dengan stack teknologi terkini untuk memastikan kinerja, skalabilitas, dan pengalaman pengguna.

## 🚀 Fitur

### Storefront (Toko Online)
- Katalog produk dengan filter dan pencarian
- Kategori produk hierarkis
- Keranjang belanja (guest & user)
- Checkout dengan multiple payment method
- Review dan rating produk
- Wishlist produk

### Admin Panel
- Dashboard dengan statistik penjualan
- Manajemen produk (CRUD, gambar, stok)
- Manajemen kategori
- Manajemen pesanan
- Laporan penjualan

### Fitur Teknis
- Role-based access control (Admin, Customer)
- Two-factor authentication
- Media management untuk gambar produk
- API filtering dan sorting
- Currency handling (IDR)

## 📋 Persyaratan Sistem

- PHP 8.2+
- Composer 2.x
- Node.js 18+
- MySQL 8.0+ / MariaDB 10.6+
- Redis (opsional, untuk cache & queue)

## 🛠️ Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/prassaaa/latif-ecommerce
cd latif-ecommerce
```

### 2. Install Dependencies

```bash
composer install
npm install
```

### 3. Konfigurasi Environment

```bash
cp .env.example .env
php artisan key:generate
```

Edit file `.env` sesuai konfigurasi database Anda:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=latif_ecommerce
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Migrasi & Seeder

```bash
php artisan migrate
php artisan db:seed
```

### 5. Link Storage

```bash
php artisan storage:link
```

### 6. Build Assets

```bash
npm run build
```

### 7. Jalankan Server

```bash
php artisan serve
```

Akses aplikasi di `http://localhost:8000`

## 🧪 Testing

Project ini menggunakan [Pest PHP](https://pestphp.com/) untuk testing.

```bash
# Jalankan semua tests
./vendor/bin/pest

# Jalankan dengan coverage
./vendor/bin/pest --coverage

# Jalankan test spesifik
./vendor/bin/pest --filter="ProductTest"
```

### Static Analysis

```bash
./vendor/bin/phpstan analyse
```

## 📁 Struktur Project

```
app/
├── Actions/          # Business logic actions (Single Responsibility)
├── Enums/            # PHP 8.1+ Enums
├── Http/
│   ├── Controllers/  # Admin & Shop controllers
│   ├── Requests/     # Form Request validation
│   └── Resources/    # API Resources
├── Models/           # Eloquent Models
└── Providers/        # Service Providers

database/
├── factories/        # Model Factories untuk testing
├── migrations/       # Database migrations
└── seeders/          # Database seeders

resources/
├── js/               # React + TypeScript components
└── views/            # Blade templates

tests/
├── Feature/          # Feature tests
└── Unit/             # Unit tests
```

## 🔧 Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Laravel 12 |
| Frontend | React 19 + TypeScript |
| Routing | Inertia.js |
| Styling | Tailwind CSS |
| Database | MySQL/MariaDB |
| Testing | Pest PHP |
| Static Analysis | Larastan (PHPStan) |

## 📦 Package Utama

- **spatie/laravel-permission** - Role & permission management
- **spatie/laravel-medialibrary** - Media/image management
- **spatie/laravel-query-builder** - API filtering & sorting
- **spatie/laravel-data** - DTOs & data transformation
- **cknow/laravel-money** - Currency handling
- **inertiajs/inertia-laravel** - Laravel Inertia adapter

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan buat pull request atau buka issue untuk diskusi.

1. Fork repository
2. Buat branch fitur (`git checkout -b fitur/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Tambah fitur amazing'`)
4. Push ke branch (`git push origin fitur/AmazingFeature`)
5. Buka Pull Request

## 📄 Lisensi

Project ini dilisensikan di bawah [MIT License](LICENSE).

## 👨‍💻 Author

**Latif Living Team**

---

Made with ❤️ using Laravel & React

