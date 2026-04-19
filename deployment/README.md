# CI/CD Deployment Guide (GitHub Actions → cPanel)

Auto-deploy ke cPanel setiap push/merge ke branch `main`.

## Arsitektur

```
Developer push ke main
        │
        ▼
  GitHub Actions (ubuntu-latest)
        │
        ├─ composer install --no-dev
        ├─ npm ci && npm run build
        │
        ▼
   rsync over SSH → cPanel
        │
        ▼
   SSH execute post-deploy.sh
        ├─ php artisan migrate --force
        ├─ php artisan optimize:clear
        ├─ config/route/view/event cache
        └─ php artisan queue:restart
```

## One-Time Setup Checklist

### A. Setup di cPanel

#### 1. Upgrade PHP ke 8.2+ (WAJIB)

1. Login cPanel → **MultiPHP Manager**
2. Centang domain `furniturin.com`
3. Pilih **PHP 8.3 (ea-php83)** atau **PHP 8.2 (ea-php82)**
4. Klik **Apply**

> Saat ini masih di PHP 7.4 — Laravel 12 tidak akan jalan sampai ini di-upgrade.

#### 2. Generate SSH Key Pair

1. cPanel → **SSH Access** → **Manage SSH Keys**
2. **Generate a New Key**:
   - Key Name: `github_actions_deploy`
   - Passphrase: **KOSONGKAN** (biar bisa auto-login dari GH Actions)
   - Key Type: `RSA`
   - Key Size: `4096`
3. Klik **Generate Key**
4. Setelah dibuat, klik **Manage Authorization** di sebelah key → **Authorize**
5. Download private key:
   - Klik **View/Download** di key `github_actions_deploy`
   - Download file `.ppk` atau copy isi private key (format `-----BEGIN RSA PRIVATE KEY-----`)
   - **Simpan aman — akan dipasang di GitHub Secrets**

#### 3. Catat SSH Connection Info

Dari cPanel halaman utama, lihat di sidebar kanan "General Information":
- **SSH Host**: biasanya `wirobrajan.idweb.host` (atau IP server)
- **SSH Port**: biasanya `22` — tapi cPanel sering pakai custom port seperti `2083` atau `7822`. Tanya provider hosting kalau tidak yakin.
- **SSH User**: `furnit59`
- **Home Path**: `/home/furnit59`
- **Deploy Path**: `/home/furnit59/public_html`

> Untuk test SSH dari komputer lokal (setelah authorize key):
> ```bash
> ssh -p <PORT> furnit59@wirobrajan.idweb.host
> ```

#### 4. Setup Cron Jobs

cPanel → **Cron Jobs** → tambahkan dua cron berikut:

**Cron 1 — Laravel Scheduler (setiap menit)**
```
* * * * * cd /home/furnit59/public_html && /usr/local/bin/ea-php83 artisan schedule:run >> /dev/null 2>&1
```

**Cron 2 — Queue Worker (setiap menit, auto-restart)**
```
* * * * * cd /home/furnit59/public_html && /usr/local/bin/ea-php83 artisan queue:work --stop-when-empty --max-time=55 >> /dev/null 2>&1
```

> Ganti `ea-php83` sesuai versi PHP yang dipilih di step A.1.
> `--max-time=55` memastikan worker restart tiap menit — mencegah memory leak.

#### 5. Pastikan File `.env` Ada di Server

Karena `.env` tidak ikut ter-deploy (by design — biar credential production aman), pastikan file `.env` di `/home/furnit59/public_html/.env` sudah terisi dengan credentials production:

```env
APP_NAME="Furniturin"
APP_ENV=production
APP_KEY=base64:xxx          # jangan ubah — kalau sudah ada biarkan
APP_DEBUG=false
APP_URL=https://furniturin.com
APP_LOCALE=id

DB_CONNECTION=mysql
DB_HOST=localhost
DB_DATABASE=latif_ecommerce
DB_USERNAME=xxx
DB_PASSWORD=xxx

QUEUE_CONNECTION=database
CACHE_STORE=database
SESSION_DRIVER=database

# Midtrans (production keys)
midtrans_server_key=xxx
midtrans_client_key=xxx
midtrans_is_production=true

# RajaOngkir
RAJAONGKIR_API_KEY=xxx
```

---

### B. Setup di GitHub Repository

Buka repo GitHub → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.

Tambahkan 5 secrets berikut:

| Secret Name | Isi |
|---|---|
| `SSH_HOST` | `wirobrajan.idweb.host` |
| `SSH_PORT` | `22` (atau port SSH custom dari hosting provider) |
| `SSH_USER` | `furnit59` |
| `SSH_PRIVATE_KEY` | Isi full private key yang di-generate di step A.2 (termasuk `-----BEGIN ... -----` dan `-----END ... -----`) |
| `DEPLOY_PATH` | `/home/furnit59/public_html` |

---

### C. Verifikasi Setup

#### Test SSH Manual (dari komputer lokal)

```bash
# Simpan private key ke file
nano ~/.ssh/furnit59_deploy
chmod 600 ~/.ssh/furnit59_deploy

# Test koneksi
ssh -i ~/.ssh/furnit59_deploy -p <PORT> furnit59@wirobrajan.idweb.host

# Kalau berhasil, akan masuk ke home directory
# Test artisan
cd public_html && php artisan --version
```

Kalau `php artisan --version` error, pastikan:
1. PHP version sudah 8.2+ (cek `php -v`)
2. `.env` ada di `/home/furnit59/public_html/`
3. Folder `storage/` dan `bootstrap/cache/` writable (permission 775)

#### Test Deploy Manual Trigger

1. GitHub → repo → **Actions** tab
2. Pilih workflow **Deploy to cPanel**
3. Klik **Run workflow** → pilih branch `main` → **Run workflow**
4. Lihat logs — kalau semua hijau ✅, deploy berhasil

---

## Cara Kerja Deploy

Setelah setup selesai, **setiap push ke `main` otomatis deploy**. Flow-nya:

1. **Checkout code** di GitHub runner
2. **Build dependencies** (Composer + NPM) — vendor & public/build di-generate di runner
3. **Sync via rsync** — hanya file yang berubah yang di-upload (cepat, biasanya < 2 menit setelah build pertama)
4. **Execute post-deploy.sh** — migrate, cache, queue restart

## File yang TIDAK Ikut Deploy

Lihat `deployment/rsync-exclude.txt`. Secara garis besar:
- `.env` (server punya sendiri)
- `storage/logs/`, `storage/framework/sessions/`, dll (runtime data)
- `.git/`, `.github/`, `node_modules/`, `tests/`, dokumentasi dev

## Troubleshooting

### Deploy berhasil tapi website 500 error

```bash
# SSH ke server, cek log
ssh -p <PORT> furnit59@wirobrajan.idweb.host
cd public_html
tail -100 storage/logs/laravel.log
```

### Migrate gagal

Kemungkinan DB credentials di `.env` salah. Fix `.env` lalu re-run deploy (trigger ulang dari GitHub Actions tab).

### Queue job tidak jalan

Cek cron job di cPanel sudah benar dan PHP path sesuai versi yang aktif.

### Rollback

Jika deploy error dan production down:

**Option 1 — Revert di Git**
```bash
git revert <commit-sha>
git push origin main
# Auto-deploy akan restore ke versi sebelumnya
```

**Option 2 — Manual via SSH**
```bash
ssh -p <PORT> furnit59@wirobrajan.idweb.host
cd public_html
# Restore backup terakhir (kalau pakai JetBackup) atau kembalikan manual
```

## Security Notes

- Private key di GitHub Secrets **tidak bisa dibaca ulang** setelah di-save — simpan backup di password manager
- Kalau private key bocor: langsung **Deauthorize** di cPanel → SSH Access → Manage Keys, lalu generate key baru
- `.env` **tidak pernah ikut deploy** — production credentials hanya ada di server
- Password cPanel yang Boss share sebelumnya **WAJIB diganti** setelah setup selesai
