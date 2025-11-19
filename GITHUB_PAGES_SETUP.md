# Quick Setup GitHub Pages

## 🚀 Langkah Cepat (5 Menit)

### 1. Update Base Path

Edit file `frontend/vite.config.js`, ubah baris ini:

```javascript
base: process.env.NODE_ENV === 'production' ? '/NAMA_REPO_ANDA/' : '/',
```

**Ganti `NAMA_REPO_ANDA` dengan nama repository GitHub Anda.**

**Contoh:**
- Jika repo name: `angela-smart-contract` → `'/angela-smart-contract/'`
- Jika deploy ke root (username.github.io) → `'/'`

### 2. Push ke GitHub

```bash
git add .
git commit -m "Setup for GitHub Pages"
git push origin main
```

### 3. Aktifkan GitHub Pages

1. Buka repository di GitHub
2. Klik **Settings** → **Pages**
3. Di bagian **Source**, pilih **GitHub Actions**
4. Klik **Save**

### 4. Tunggu Deployment

- Buka tab **Actions** di repository
- Tunggu workflow "Deploy to GitHub Pages" selesai (2-3 menit)
- Setelah selesai, aplikasi akan tersedia di:
  `https://USERNAME.github.io/NAMA_REPO/`

## ✅ Selesai!

Aplikasi sudah online di GitHub Pages! 🎉

---

## 📝 Catatan

- Setiap push ke `main` branch akan otomatis trigger deployment
- Pastikan base path sudah benar, jika tidak asset tidak akan ter-load
- Untuk melihat halaman penjelasan, klik tombol **"📚 Penjelasan Smart Contract"** di aplikasi

## 🔧 Troubleshooting

**Blank page?**
- Pastikan base path di `vite.config.js` sesuai nama repo
- Clear browser cache (Ctrl+Shift+R)

**GitHub Actions gagal?**
- Pastikan file `.github/workflows/deploy.yml` ada
- Check error di tab Actions

