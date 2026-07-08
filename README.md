# Facegram

Social media app — Laravel 13 backend API + React 19 SPA frontend.

---

## Daftar Isi

- [Prasyarat](#prasyarat)
- [Clone & Setup](#clone--setup)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Backend](#2-backend)
  - [3. Frontend](#3-frontend)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Catatan](#catatan)

---

## Prasyarat

Pastikan sudah terinstall di sistem kamu:

| Tools         | Version     |
|---------------|-------------|
| PHP           | ^8.3        |
| Composer      | latest      |
| MySQL / MariaDB | 8.x / 10.x |
| Node.js       | ^20         |
| pnpm          | latest      |
| npm           | (bundled with Node.js) |
---

## Clone & Setup

### 1. Clone Repository

```bash
git clone https://github.com/Ynhaein/facegram.git
cd facegram
```

> **Laragon / XAMPP / htdocs:**  
> Clone langsung ke folder `C:\laragon\www\` atau `C:\xampp\htdocs\`.  
> Hasilnya akan seperti `C:\laragon\www\facegram\`.

---

### 2. Backend

Masuk ke folder backend:

```bash
cd backend
```

**Install dependencies:**

```bash
composer install
```

**Buat file environment:**

```bash
copy .env.example .env
```

Sesuaikan konfigurasi database di `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=facegram
DB_USERNAME=root
DB_PASSWORD=
```

Buat database `facegram` di MySQL / phpMyAdmin.

**Generate key & migrate:**

```bash
php artisan key:generate
php artisan migrate
```

**Buat storage symlink (untuk upload gambar):**

```bash
php artisan storage:link
```

---

### 3. Frontend

Masuk ke folder frontend:

```bash
cd frontend
```

**Install dependencies:**

Menggunakan **pnpm** (direkomendasikan):

```bash
pnpm install
```

Atau menggunakan **npm**:

```bash
npm install
```

---

## Menjalankan Aplikasi

### Backend

Dari folder `backend/`:

```bash
php artisan serve
```

Backend berjalan di `http://127.0.0.1:8000`.

### Frontend

Dari folder `frontend/` (terminal terpisah):

**pnpm:**

```bash
pnpm dev
```

**npm:**

```bash
npm run dev
```

Frontend berjalan di `http://localhost:5173`.

### Alternatif (semua dalam satu terminal)

Dari folder `backend/`:

```bash
composer run dev
```

Menjalankan artisan serve, queue:listen, dan Vite dev server secara bersamaan.

---

## Catatan

- Pastikan MySQL server aktif sebelum menjalankan backend.
- API base URL frontend sudah diatur ke `http://127.0.0.1:8000/api` di `src/api.js`.
- File upload tersimpan di `storage/app/public/posts/` — pastikan `php artisan storage:link` sudah dijalankan.
- Untuk testing backend: `composer run test` (Pest).
- Untuk lint frontend: `pnpm lint` atau `npm run lint`.
