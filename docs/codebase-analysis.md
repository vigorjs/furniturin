# Furniturin - Codebase Analysis Report

Dokumen ini berisi analisa lengkap fitur, komponen, dan paket yang ada di proyek Furniturin.

---

## 📊 Ringkasan Proyek

- **Total File TS/TSX**: 258 files
- **Frontend**: React 19 + Inertia.js + Tailwind CSS 4
- **Backend**: Laravel 11 + Fortify
- **Database Models**: 14 models (User, Product, Order, Cart, Category, dll)

---

## ✅ Fitur yang Sudah Diimplementasi

### Shop (Customer-facing)

| Fitur            | Status      | Catatan                                                      |
| ---------------- | ----------- | ------------------------------------------------------------ |
| Homepage/Landing | ✅ Complete | Hero, Products, Catalog, Trust sections                      |
| Product Listing  | ✅ Complete | Filter, sort, pagination                                     |
| Product Detail   | ✅ Complete | Images, variants, reviews                                    |
| Categories       | ✅ Complete | Nested categories                                            |
| Cart             | ✅ Complete | Add, update, remove, save for later                          |
| Wishlist         | ✅ Complete | Toggle, list                                                 |
| Checkout         | ✅ Complete | Address, shipping, payment selection                         |
| Orders           | ✅ Complete | List, detail, cancel                                         |
| Compare Products | ✅ Complete | Side-by-side comparison                                      |
| Custom Order     | ✅ Complete | Form submission                                              |
| Sale Pages       | ✅ Complete | Hot Sale, Clearance, Stock Sale                              |
| Static Pages     | ✅ Complete | About, Contact, FAQ, Terms, Privacy, Shipping, Return Policy |
| Newsletter       | ✅ Complete | Subscribe/unsubscribe                                        |
| Catalog Flipbook | ✅ Complete | DearFlip integration                                         |

### Admin Panel

| Fitur             | Status      | Catatan                         |
| ----------------- | ----------- | ------------------------------- |
| Dashboard         | ✅ Complete | Stats, charts                   |
| Products CRUD     | ✅ Complete | Images, variants, stock         |
| Categories CRUD   | ✅ Complete | Nested, featured                |
| Orders Management | ✅ Complete | Status update, detail           |
| Customers         | ✅ Complete | List, detail                    |
| Users/Staff       | ✅ Complete | Roles, permissions              |
| Reviews           | ✅ Complete | Approve, delete                 |
| Reports           | ✅ Complete | Sales reports                   |
| Settings          | ✅ Complete | Site settings, payment settings |
| Notifications     | ✅ Complete | List                            |
| Profile           | ✅ Complete | 2FA, password, avatar           |

### Auth

| Fitur            | Status      | Catatan               |
| ---------------- | ----------- | --------------------- |
| Login/Register   | ✅ Complete | Email verification    |
| 2FA              | ✅ Complete | TOTP, recovery codes  |
| Password Reset   | ✅ Complete | Email-based           |
| Profile Settings | ✅ Complete | Update info, password |

---

## ⚠️ Fitur yang UI Ada tapi Belum Lengkap/Aktif

### 1. **Payment Gateway Integration** 🔴 HIGH PRIORITY

**Status**: UI ada, backend TIDAK ADA integrasi payment gateway

**Detail**:

- Checkout UI mendukung `bank_transfer` dan `COD`
- Order dibuat dengan status `pending`
- **TIDAK ADA** integrasi Midtrans, Xendit, atau payment gateway lainnya
- Pembayaran hanya manual (bank transfer + konfirmasi admin)

**Files terkait**:

- `app/Enums/PaymentMethod.php`
- `app/Actions/Order/CreateOrderAction.php`
- `resources/js/pages/Shop/Checkout/Index.tsx`

**Rekomendasi**: Integrasikan Midtrans atau Xendit untuk pembayaran otomatis

---

### 2. **Email Notifications** 🟡 MEDIUM PRIORITY

**Status**: Model ada, implementasi email mungkin belum lengkap

**Perlu dicek**:

- Order confirmation email
- Payment reminder email
- Shipping notification email
- Password reset email (mungkin sudah ada via Fortify)

---

### 3. **Stock Tracking** 🟢 IMPLEMENTED

**Status**: Sudah diimplementasi

- Stock dikurangi saat order dibuat
- `track_stock` field di Product model

---

### 4. **Coupon/Discount System** 🟡 PARTIAL

**Status**: Field ada di Order model tapi sistem coupon belum diimplementasi

- `coupon_code` dan `discount_amount` ada di Order
- Tidak ada Coupon model atau validation

---

### 5. **Product Reviews** 🟢 IMPLEMENTED

**Status**: Sudah ada

- Customer bisa beri review
- Admin bisa approve/delete

---

### 6. **Image Upload** 🔴 NOT WORKING

**Status**: Storage link BELUM dibuat, menyebabkan upload gambar tidak berfungsi

**Masalah**:

- `public/storage` symlink tidak ada
- Upload images di Product/Category tidak tersimpan dengan benar
- Gambar yang diupload tidak bisa diakses dari browser

**Solusi**:

```bash
php artisan storage:link
```

**Files terkait**:

- `app/Http/Controllers/Admin/ProductController.php` (lines 95-103)
- `app/Http/Controllers/Admin/CategoryController.php` (lines 98, 128)
- `storage/app/public/` → should be linked to → `public/storage/`

**Catatan**: Setelah menjalankan `storage:link`, folder `public/storage` akan menjadi symlink ke `storage/app/public`

## 📦 Unused Node Packages (Bisa Dihapus)

| Package          | Ukuran  | Alasan                                 |
| ---------------- | ------- | -------------------------------------- |
| `react-pageflip` | ~50KB   | Tidak digunakan lagi, diganti DearFlip |
| `react-pdf`      | ~500KB+ | Tidak digunakan lagi, diganti DearFlip |

**Cara hapus**:

```bash
npm uninstall react-pageflip react-pdf
```

---

## 🧹 Components yang Perlu Diperiksa

### Digunakan tapi mungkin perlu review:

| Component        | Lokasi                               | Status                                          |
| ---------------- | ------------------------------------ | ----------------------------------------------- |
| `CustomCursor`   | `components/shop/CustomCursor.tsx`   | ✅ Digunakan di ShopLayout                      |
| `CompareDrawer`  | `components/shop/CompareDrawer.tsx`  | ⚠️ Tidak terlihat di layout, perlu dicek        |
| `RecentlyViewed` | `components/shop/RecentlyViewed.tsx` | ⚠️ Export functions ada, perlu dicek penggunaan |
| `QuickViewModal` | `components/shop/QuickViewModal.tsx` | Perlu dicek                                     |
| `ShareModal`     | `components/shop/ShareModal.tsx`     | Perlu dicek                                     |

### UI Components (ShadCN) - Semua digunakan:

- button, input, label, checkbox, select, dialog, dropdown-menu, dll.

---

## 🔧 Rekomendasi Perbaikan

### Prioritas Tinggi

1. **Integrasikan Payment Gateway**
    - Pilih: Midtrans (populer di Indonesia) atau Xendit
    - Buat endpoint callback untuk update payment status
    - Tambahkan halaman pembayaran dengan instruksi

2. **Hapus Unused Packages**
    ```bash
    npm uninstall react-pageflip react-pdf
    ```

### Prioritas Sedang

3. **Implementasi Coupon System**
    - Buat model Coupon
    - Validasi di checkout
    - Admin CRUD untuk coupon

4. **Email Notifications**
    - Order confirmation
    - Payment reminder
    - Shipping updates

### Prioritas Rendah

5. **Review Unused Components**
    - Audit penggunaan CompareDrawer
    - Audit penggunaan QuickViewModal
    - Hapus yang tidak digunakan

---

## 📁 Struktur File Penting

```
app/
├── Actions/Order/CreateOrderAction.php   # Order creation
├── Enums/
│   ├── OrderStatus.php
│   ├── PaymentMethod.php                 # bank_transfer, cod
│   └── PaymentStatus.php
├── Http/Controllers/
│   ├── Admin/                            # 12 controllers
│   └── Shop/                             # 8 controllers
└── Models/                               # 14 models

resources/js/
├── components/
│   ├── shop/                             # 24 shop components
│   └── ui/                               # 26 UI components
├── layouts/
│   ├── ShopLayout.tsx
│   └── admin/admin-layout.tsx
└── pages/
    ├── Admin/                            # 26 files
    └── Shop/                             # 22 files

public/
├── assets/pdf/                           # PDF catalogs
└── dflip/                                # DearFlip library
```

---

## 📝 Catatan Tambahan

1. **TypeScript**: Proyek menggunakan TypeScript dengan strict mode
2. **Styling**: Tailwind CSS 4 dengan custom design tokens
3. **State Management**: Inertia.js (server-driven)
4. **Authentication**: Laravel Fortify dengan 2FA
5. **SEO**: Structured data dan meta tags sudah ada

---

_Dokumen ini dibuat pada: 2026-01-08_
