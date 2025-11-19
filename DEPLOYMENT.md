# Panduan Deployment ke GitHub Pages

## Metode 1: Menggunakan GitHub Actions (Otomatis) - RECOMMENDED

GitHub Actions akan otomatis deploy setiap kali ada push ke branch `main` atau `master`.

### Langkah-langkah:

1. **Pastikan repository sudah di-push ke GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/USERNAME/REPO_NAME.git
   git push -u origin main
   ```

2. **Aktifkan GitHub Pages di repository settings:**
   - Buka repository di GitHub
   - Pergi ke **Settings** → **Pages**
   - Di bagian **Source**, pilih **GitHub Actions**
   - Simpan

3. **Update base path di `frontend/vite.config.js`:**
   ```javascript
   base: process.env.NODE_ENV === 'production' ? '/NAMA_REPO_ANDA/' : '/',
   ```
   Ganti `NAMA_REPO_ANDA` dengan nama repository GitHub Anda.
   
   **Contoh:**
   - Jika repo name adalah `angela-smart-contract`, maka: `'/angela-smart-contract/'`
   - Jika deploy ke root domain (username.github.io), maka: `'/'`

4. **Push perubahan:**
   ```bash
   git add .
   git commit -m "Setup GitHub Pages"
   git push
   ```

5. **Tunggu GitHub Actions selesai:**
   - Buka tab **Actions** di repository
   - Tunggu workflow selesai (sekitar 2-3 menit)
   - Setelah selesai, aplikasi akan tersedia di:
     `https://USERNAME.github.io/NAMA_REPO/`

## Metode 2: Manual Deploy dengan gh-pages

### Langkah-langkah:

1. **Install gh-pages:**
   ```bash
   cd frontend
   npm install --save-dev gh-pages
   ```

2. **Update base path di `frontend/vite.config.js`** (sama seperti metode 1)

3. **Deploy:**
   ```bash
   cd frontend
   npm run deploy
   ```

4. **Aktifkan GitHub Pages:**
   - Buka repository di GitHub
   - Pergi ke **Settings** → **Pages**
   - Di bagian **Source**, pilih branch `gh-pages` dan folder `/ (root)`
   - Simpan

## Catatan Penting:

### ⚠️ Base Path Configuration

Base path sangat penting untuk GitHub Pages. Jika salah, asset tidak akan ter-load.

**Untuk repository dengan nama custom:**
```javascript
base: '/nama-repo/'
```

**Untuk username.github.io (root domain):**
```javascript
base: '/'
```

### 🔧 Troubleshooting

**Problem: Blank page atau asset tidak ter-load**
- Pastikan base path di `vite.config.js` sesuai dengan nama repository
- Pastikan semua file sudah di-commit dan di-push
- Clear browser cache dan hard refresh (Ctrl+Shift+R)

**Problem: GitHub Actions gagal**
- Pastikan workflow file ada di `.github/workflows/deploy.yml`
- Pastikan branch name adalah `main` atau `master`
- Check error di tab Actions

**Problem: Smart contract tidak bekerja di GitHub Pages**
- GitHub Pages hanya host frontend static
- Smart contract perlu di-deploy ke testnet/mainnet terlebih dahulu
- Update contract addresses di `frontend/src/App.jsx` dengan addresses dari deployment testnet/mainnet
- Untuk demo lokal, tetap gunakan `npm run dev` di localhost

### 📝 Update Contract Addresses untuk Production

Jika ingin menggunakan smart contract yang sudah di-deploy ke testnet/mainnet:

1. Deploy smart contracts ke testnet (sepolia, goerli, dll)
2. Update addresses di `frontend/src/App.jsx`:
   ```javascript
   const BANK_MANDIRI_ADDRESS = '0x...'; // Address dari deployment
   const BANK_BCA_ADDRESS = '0x...';
   const INTER_BANK_NETWORK_ADDRESS = '0x...';
   ```
3. Rebuild dan redeploy:
   ```bash
   cd frontend
   npm run build
   git add .
   git commit -m "Update contract addresses"
   git push
   ```

### 🌐 URL Setelah Deploy

Setelah deployment berhasil, aplikasi akan tersedia di:
- **Custom repo:** `https://USERNAME.github.io/NAMA_REPO/`
- **Root domain:** `https://USERNAME.github.io/`

## Quick Deploy Checklist

- [ ] Repository sudah di-push ke GitHub
- [ ] Base path di `vite.config.js` sudah benar
- [ ] GitHub Pages sudah diaktifkan (Settings → Pages)
- [ ] GitHub Actions workflow sudah berjalan (jika pakai metode 1)
- [ ] Aplikasi sudah bisa diakses di URL GitHub Pages

---

**Note:** Untuk demo smart contract yang sebenarnya bekerja, Anda perlu:
1. Deploy contracts ke testnet/mainnet
2. Update contract addresses
3. User perlu connect ke network yang sama di MetaMask

