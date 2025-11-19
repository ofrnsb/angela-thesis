# Quick Start Guide

Panduan cepat untuk menjalankan sistem perbankan dengan smart contract.

## Langkah Cepat

### 1. Install Dependencies

```bash
# Install dependencies untuk smart contract
npm install

# Install dependencies untuk frontend
cd frontend
npm install
cd ..
```

### 2. Compile Smart Contracts

```bash
npm run compile
```

### 3. Jalankan Local Blockchain

Buka terminal baru dan jalankan:

```bash
npm run node
```

Hardhat akan menampilkan beberapa account dengan private keys. **Simpan private keys ini** untuk di-import ke MetaMask.

### 4. Deploy Smart Contracts

Buka terminal baru (jangan tutup terminal node) dan jalankan:

```bash
npm run deploy:local
```

**PENTING:** Salin alamat kontrak yang di-deploy dan update di `frontend/src/App.jsx`:
- `BANK_MANDIRI_ADDRESS`
- `BANK_BCA_ADDRESS`
- `INTER_BANK_NETWORK_ADDRESS`

### 5. Tambahkan Produk (Opsional)

```bash
npm run add-products
```

### 6. Setup MetaMask

1. Buka MetaMask extension
2. Klik network dropdown → Add Network
3. Tambahkan:
   - **Network Name:** Hardhat Local
   - **RPC URL:** http://127.0.0.1:8545
   - **Chain ID:** 1337
   - **Currency Symbol:** ETH

4. Import account dari Hardhat:
   - Copy private key dari terminal Hardhat node
   - Di MetaMask: Account menu → Import Account → Paste private key

### 7. Jalankan Frontend

Buka terminal baru dan jalankan:

```bash
npm run dev
```

Aplikasi akan terbuka di http://localhost:3000

## Testing Flow

1. **Buat Rekening:**
   - Hubungkan MetaMask
   - Pilih bank (Bank Mandiri atau BCA)
   - Masukkan nomor rekening: `1234567890`
   - Masukkan nama: `Budi Santoso`
   - Klik "Buat Rekening"

2. **Deposit:**
   - Masukkan nomor rekening: `1234567890`
   - Masukkan jumlah: `2.0` ETH
   - Klik "Deposit"

3. **Transfer Internal:**
   - Buat rekening kedua dengan nomor berbeda (misal: `0987654321`)
   - Di tab Transfer, masukkan:
     - Rekening pengirim: `1234567890`
     - Rekening penerima: `0987654321`
     - Jumlah: `0.5` ETH
   - Klik "Transfer"

4. **Beli Produk:**
   - Buka tab "Produk"
   - Pastikan nomor rekening sudah diisi
   - Klik "Beli Sekarang" pada produk yang diinginkan

## Troubleshooting

### MetaMask tidak terhubung
- Pastikan MetaMask menggunakan network "Hardhat Local"
- Pastikan chain ID adalah 1337

### Transaksi gagal
- Pastikan wallet memiliki cukup ETH (Hardhat node memberikan 10000 ETH per account)
- Pastikan nomor rekening sudah dibuat
- Pastikan saldo mencukupi

### Frontend tidak bisa connect ke contract
- Pastikan alamat kontrak di `App.jsx` sudah di-update dengan alamat dari deployment
- Pastikan Hardhat node masih berjalan
- Refresh browser

### Produk tidak muncul
- Jalankan `npm run add-products` setelah deployment
- Refresh browser

## Catatan

- Hardhat node harus tetap berjalan saat menggunakan aplikasi
- Setiap kali restart Hardhat node, kontrak perlu di-deploy ulang
- Private keys dari Hardhat node hanya untuk development, jangan gunakan di mainnet!

