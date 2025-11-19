# Sistem Perbankan dengan Smart Contract

Sistem perbankan sederhana berbasis blockchain menggunakan smart contract untuk mengelola transaksi perbankan di Indonesia. Sistem ini mencakup transfer antar rekening, transfer antar bank, dan pembelian produk digital seperti token listrik.

## ✨ Fitur Baru

- **📚 Halaman Penjelasan Smart Contract**: Halaman edukasi yang menjelaskan smart contract dengan bahasa yang mudah dipahami untuk non-technical users. Cocok untuk presentasi thesis!
- **🚀 GitHub Pages Ready**: Aplikasi siap di-deploy ke GitHub Pages dengan GitHub Actions

## 📋 Daftar Isi

1. [Contoh Case Implementasi](#1-contoh-case-implementasi)
2. [Bentuk atau Wujud Smart Contract](#2-bentuk-atau-wujud-smart-contract)
3. [Peran Smart Contract pada Transaksi Perbankan](#3-peran-smart-contract-pada-transaksi-perbankan)
4. [Cara Kerja Smart Contract](#4-cara-kerja-smart-contract)
5. [Instalasi dan Setup](#instalasi-dan-setup)
6. [Cara Menggunakan](#cara-menggunakan)

---

## 1. Contoh Case Implementasi

### 1.1 Transfer Antar Rekening (Sesama Bank)

**Skenario:**
- Budi memiliki rekening di Bank Mandiri dengan nomor rekening "1234567890"
- Siti memiliki rekening di Bank Mandiri dengan nomor rekening "0987654321"
- Budi ingin transfer 0.5 ETH ke rekening Siti

**Implementasi:**
```solidity
transferInternal(
    "1234567890",      // Rekening pengirim
    "0987654321",      // Rekening penerima
    0.5 ether,         // Jumlah transfer
    "Pembayaran tagihan" // Deskripsi
)
```

**Hasil:**
- Saldo Budi berkurang 0.5 ETH
- Saldo Siti bertambah 0.5 ETH
- Transaksi tercatat di blockchain dan tidak dapat diubah

### 1.2 Transfer Antar Bank

**Skenario:**
- Budi memiliki rekening di Bank Mandiri (kode: BM)
- Siti memiliki rekening di Bank BCA (kode: BCA)
- Budi ingin transfer 1 ETH ke rekening Siti di Bank BCA

**Implementasi:**
```solidity
transferExternal(
    "1234567890",      // Rekening pengirim (BM)
    "BCA",             // Kode bank tujuan
    "1111111111",      // Rekening penerima (BCA)
    1 ether,           // Jumlah transfer
    "Transfer gaji"    // Deskripsi
)
```

**Hasil:**
- Saldo Budi di Bank Mandiri berkurang 1 ETH
- Sistem mencatat transfer ke Bank BCA
- Bank BCA menerima notifikasi untuk menambahkan saldo ke rekening Siti

### 1.3 Pembelian Produk Digital (Token Listrik)

**Skenario:**
- Bank menyediakan produk token listrik dengan ID 1, harga 0.1 ETH
- Budi ingin membeli token listrik menggunakan saldo rekeningnya

**Implementasi:**
```solidity
// Admin bank menambahkan produk
addProduct(
    1,                    // ID produk
    "Token Listrik 20kWh", // Nama produk
    0.1 ether,            // Harga
    "Token listrik untuk 20kWh" // Deskripsi
)

// Budi membeli produk
purchaseProduct(
    "1234567890",  // Nomor rekening Budi
    1              // ID produk
)
```

**Hasil:**
- Saldo Budi berkurang 0.1 ETH
- Transaksi pembelian tercatat di blockchain
- Token listrik dapat dikirim ke alamat email atau nomor telepon Budi

### 1.4 Deposit dan Withdrawal

**Skenario:**
- Budi ingin deposit 2 ETH ke rekeningnya
- Setelah itu, Budi ingin menarik 0.5 ETH

**Implementasi:**
```solidity
// Deposit
deposit("1234567890") // Mengirim 2 ETH bersama transaksi

// Withdrawal
withdraw("1234567890", 0.5 ether)
```

**Hasil:**
- Saldo Budi bertambah 2 ETH setelah deposit
- Saldo Budi berkurang 0.5 ETH setelah withdrawal
- ETH dikirim kembali ke wallet Budi

---

## 2. Bentuk atau Wujud Smart Contract

### 2.1 Struktur Smart Contract

Sistem ini terdiri dari dua smart contract utama:

#### A. Contract `Bank.sol`

Contract utama yang mengelola operasi perbankan:

```solidity
contract Bank is Ownable, ReentrancyGuard {
    // Struktur data rekening
    struct Account {
        address accountAddress;  // Alamat wallet pemilik
        string accountNumber;    // Nomor rekening
        string accountName;      // Nama pemilik
        uint256 balance;        // Saldo dalam wei
        bool exists;            // Status rekening
        uint256 createdAt;      // Timestamp pembuatan
    }

    // Struktur data produk
    struct Product {
        uint256 productId;      // ID produk
        string productName;     // Nama produk
        uint256 price;          // Harga dalam wei
        bool isActive;          // Status aktif
        string description;     // Deskripsi produk
    }

    // Mapping untuk menyimpan data
    mapping(string => Account) public accounts;
    mapping(address => string) public addressToAccountNumber;
    mapping(uint256 => Product) public products;
}
```

**Fitur Utama:**
- ✅ Pembuatan rekening baru
- ✅ Deposit dan withdrawal
- ✅ Transfer internal (sesama bank)
- ✅ Transfer eksternal (antar bank)
- ✅ Manajemen produk digital
- ✅ Pembelian produk

#### B. Contract `InterBankNetwork.sol`

Contract untuk mengelola jaringan antar bank:

```solidity
contract InterBankNetwork is Ownable {
    // Mapping bank berdasarkan kode
    mapping(string => address) public banks;
    
    // Fungsi untuk registrasi bank
    function registerBank(string memory _bankCode, address _bankAddress)
    
    // Fungsi untuk transfer antar bank
    function transferInterBank(...)
}
```

**Fitur Utama:**
- ✅ Registrasi bank ke dalam jaringan
- ✅ Koordinasi transfer antar bank
- ✅ Validasi bank yang terdaftar

### 2.2 Karakteristik Smart Contract

1. **Immutability (Tidak Dapat Diubah)**
   - Setelah di-deploy, kode smart contract tidak dapat diubah
   - Transaksi yang sudah tercatat tidak dapat dihapus

2. **Transparency (Transparansi)**
   - Semua transaksi dapat dilihat di blockchain
   - Saldo dan data rekening dapat diverifikasi publik

3. **Decentralization (Desentralisasi)**
   - Tidak ada otoritas pusat yang mengontrol
   - Operasi dikelola oleh jaringan blockchain

4. **Security (Keamanan)**
   - Menggunakan `ReentrancyGuard` untuk mencegah serangan reentrancy
   - Validasi input untuk mencegah error
   - Access control dengan `Ownable`

---

## 3. Peran Smart Contract pada Transaksi Perbankan

### 3.1 Sebagai Pencatat Transaksi (Transaction Ledger)

Smart contract berfungsi sebagai buku besar digital yang:
- Mencatat semua transaksi secara permanen
- Menyimpan riwayat transaksi yang tidak dapat diubah
- Menyediakan audit trail yang transparan

**Contoh:**
```solidity
event TransferInternal(
    string indexed fromAccount,
    string indexed toAccount,
    uint256 amount,
    string description,
    uint256 timestamp
);
```

### 3.2 Sebagai Penjaga Aturan Bisnis (Business Logic Enforcer)

Smart contract memastikan aturan bisnis dijalankan secara otomatis:
- Validasi saldo sebelum transfer
- Mencegah transfer ke rekening yang tidak valid
- Menegakkan batasan dan persyaratan transaksi

**Contoh:**
```solidity
require(accounts[_fromAccount].balance >= _amount, "Saldo tidak mencukupi");
require(accounts[_toAccount].exists, "Rekening penerima tidak ditemukan");
```

### 3.3 Sebagai Penengah Terpercaya (Trusted Intermediary)

Smart contract menghilangkan kebutuhan pihak ketiga:
- Tidak perlu bank sentral untuk validasi
- Tidak perlu clearing house untuk transfer antar bank
- Otomatisasi mengurangi biaya operasional

### 3.4 Sebagai Penyimpan Aset Digital (Digital Asset Custodian)

Smart contract mengelola aset digital:
- Menyimpan saldo dalam bentuk cryptocurrency (ETH)
- Mengelola produk digital seperti token listrik
- Memastikan keamanan aset dengan enkripsi blockchain

### 3.5 Sebagai Automator Proses (Process Automator)

Smart contract mengotomatisasi proses perbankan:
- Eksekusi otomatis saat kondisi terpenuhi
- Tidak memerlukan intervensi manual
- Mengurangi waktu proses transaksi

**Keuntungan:**
- ⚡ Transaksi lebih cepat (detik vs hari)
- 💰 Biaya lebih rendah (tidak ada biaya admin manual)
- 🔒 Lebih aman (tidak ada risiko human error)
- 📊 Transparansi penuh (semua pihak dapat melihat)

---

## 4. Cara Kerja Smart Contract

### 4.1 Alur Kerja Umum

```
1. User mengirim transaksi → 2. Transaksi divalidasi → 3. Smart contract dieksekusi → 4. State diupdate → 5. Event diemit
```

### 4.2 Detail Proses Transfer Internal

**Step 1: User Meminta Transfer**
```
User → Frontend → MetaMask → Blockchain Network
```

**Step 2: Validasi di Smart Contract**
```solidity
// Pengecekan yang dilakukan:
1. Rekening pengirim ada? (accounts[_fromAccount].exists)
2. Rekening penerima ada? (accounts[_toAccount].exists)
3. Pemilik rekening valid? (accountAddress == msg.sender)
4. Saldo mencukupi? (balance >= amount)
5. Jumlah valid? (amount > 0)
```

**Step 3: Eksekusi Transfer**
```solidity
// Update state
accounts[_fromAccount].balance -= _amount;  // Kurangi saldo pengirim
accounts[_toAccount].balance += _amount;    // Tambah saldo penerima
```

**Step 4: Emit Event**
```solidity
emit TransferInternal(
    _fromAccount,
    _toAccount,
    _amount,
    _description,
    block.timestamp
);
```

**Step 5: Transaksi Tercatat di Blockchain**
- Transaksi masuk ke block
- Block ditambahkan ke blockchain
- Transaksi menjadi permanen dan tidak dapat diubah

### 4.3 Alur Transfer Antar Bank

```
1. User meminta transfer antar bank
   ↓
2. Bank pengirim mengurangi saldo
   ↓
3. InterBankNetwork mencatat transfer
   ↓
4. Event dikirim ke bank tujuan
   ↓
5. Bank tujuan menambahkan saldo (dalam implementasi nyata)
```

### 4.4 Mekanisme Keamanan

#### A. Reentrancy Guard
```solidity
modifier nonReentrant() {
    require(!locked, "ReentrancyGuard: reentrant call");
    locked = true;
    _;
    locked = false;
}
```
Mencegah serangan di mana fungsi dipanggil berulang kali sebelum selesai.

#### B. Access Control
```solidity
modifier onlyOwner() {
    require(owner() == msg.sender, "Ownable: caller is not the owner");
    _;
}
```
Hanya owner yang dapat menambahkan produk atau mengubah pengaturan.

#### C. Input Validation
```solidity
require(_amount > 0, "Jumlah transfer harus lebih dari 0");
require(accounts[_accountNumber].exists, "Rekening tidak ditemukan");
```
Memastikan input valid sebelum diproses.

### 4.5 Gas dan Biaya Transaksi

Setiap operasi di blockchain memerlukan gas:
- **Create Account**: ~100,000 gas
- **Deposit**: ~50,000 gas
- **Transfer Internal**: ~80,000 gas
- **Transfer External**: ~100,000 gas
- **Purchase Product**: ~70,000 gas

Biaya = Gas Used × Gas Price

### 4.6 State Management

Smart contract menyimpan state di storage blockchain:
- **Mapping**: Untuk data terstruktur (accounts, products)
- **Array**: Untuk daftar (accountNumbers, productIds)
- **Variables**: Untuk informasi umum (bankName, bankCode)

State ini bersifat persistent dan dapat dibaca oleh siapa saja.

---

## Instalasi dan Setup

### Prasyarat

- Node.js (v18 atau lebih baru)
- npm atau yarn
- MetaMask extension di browser
- Git

### Langkah Instalasi

1. **Clone atau download project**
```bash
cd "angela-smart-contract copy"
```

2. **Install dependencies untuk smart contract**
```bash
npm install
```

3. **Install dependencies untuk frontend**
```bash
cd frontend
npm install
cd ..
```

4. **Compile smart contracts**
```bash
npm run compile
```

5. **Jalankan local blockchain (terminal 1)**
```bash
npm run node
```

6. **Deploy smart contracts (terminal 2)**
```bash
npm run deploy:local
```

**Catatan:** Alamat kontrak default Hardhat sudah di-set di `frontend/src/App.jsx`. Jika Anda deploy dalam urutan berbeda, salin alamat kontrak yang di-deploy dan update di `frontend/src/App.jsx`:
- `BANK_MANDIRI_ADDRESS`
- `BANK_BCA_ADDRESS`
- `INTER_BANK_NETWORK_ADDRESS`

7. **Jalankan frontend (terminal 3)**
```bash
npm run dev
```

8. **Buka browser**
- Buka http://localhost:3000
- Pastikan MetaMask terhubung ke network localhost (chainId: 1337)
- Import account dari Hardhat node ke MetaMask untuk testing

### Setup MetaMask untuk Local Network

1. Buka MetaMask
2. Klik network dropdown → Add Network
3. Tambahkan network:
   - Network Name: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 1337
   - Currency Symbol: ETH

4. Import account dari Hardhat:
   - Ketika menjalankan `npm run node`, Hardhat akan menampilkan private keys
   - Import private key tersebut ke MetaMask

---

## Cara Menggunakan

### 0. Halaman Penjelasan Smart Contract

Sebelum menggunakan aplikasi, Anda dapat membaca penjelasan lengkap tentang smart contract:

1. Klik tombol **"📚 Penjelasan Smart Contract"** di pojok kanan atas
2. Atau klik **"📚 Pelajari tentang Smart Contract"** di halaman awal
3. Halaman ini menjelaskan:
   - Apa itu smart contract (dengan analogi sederhana)
   - Mengapa smart contract penting
   - Penggunaan di dunia nyata (saham, perbankan, big companies)
   - Bagaimana smart contract bekerja di sistem perbankan
   - Keuntungan smart contract
   - Contoh implementasi
   - Masa depan blockchain dan smart contract

**Halaman ini sangat cocok untuk presentasi thesis!** Bahasa yang digunakan mudah dipahami untuk non-technical audience.

### 1. Membuat Rekening

1. Buka aplikasi di browser
2. Hubungkan MetaMask wallet
3. Pilih bank (Bank Mandiri atau Bank BCA)
4. Masukkan nomor rekening dan nama
5. Klik "Buat Rekening"
6. Konfirmasi transaksi di MetaMask

### 2. Deposit

1. Pastikan sudah memiliki rekening
2. Masukkan nomor rekening Anda
3. Masukkan jumlah ETH yang ingin di-deposit
4. Klik "Deposit"
5. Konfirmasi transaksi di MetaMask

### 3. Transfer Internal

1. Buka tab "Transfer"
2. Masukkan nomor rekening pengirim
3. Masukkan nomor rekening penerima
4. Masukkan jumlah transfer
5. (Opsional) Tambahkan deskripsi
6. Klik "Transfer"
7. Konfirmasi transaksi

### 4. Transfer Antar Bank

1. Buka tab "Transfer"
2. Scroll ke bagian "Transfer Antar Bank"
3. Masukkan nomor rekening pengirim
4. Pilih bank tujuan
5. Masukkan nomor rekening penerima di bank tujuan
6. Masukkan jumlah transfer
7. Klik "Transfer Antar Bank"
8. Konfirmasi transaksi

### 5. Membeli Produk

1. Buka tab "Produk"
2. Pilih produk yang ingin dibeli
3. Pastikan nomor rekening sudah diisi
4. Klik "Beli Sekarang"
5. Konfirmasi transaksi

**Catatan:** Untuk menambahkan produk, admin harus menggunakan fungsi `addProduct` melalui Hardhat console atau membuat script khusus.

---

## Struktur Project

```
angela-smart-contract/
├── contracts/
│   ├── Bank.sol                 # Smart contract utama untuk bank
│   └── InterBankNetwork.sol     # Smart contract untuk jaringan antar bank
├── scripts/
│   └── deploy.js                # Script untuk deploy contracts
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Komponen utama React
│   │   ├── main.jsx             # Entry point React
│   │   └── index.css            # Styling
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── hardhat.config.js            # Konfigurasi Hardhat
├── package.json
└── README.md                     # Dokumentasi ini
```

---

## Teknologi yang Digunakan

- **Solidity**: Bahasa pemrograman untuk smart contract
- **Hardhat**: Development framework untuk Ethereum
- **React**: Framework untuk frontend
- **Vite**: Build tool untuk React
- **Ethers.js**: Library untuk berinteraksi dengan blockchain
- **OpenZeppelin**: Library untuk smart contract yang aman

---

## Keamanan

Smart contract ini menggunakan:
- ✅ OpenZeppelin Contracts untuk security best practices
- ✅ ReentrancyGuard untuk mencegah reentrancy attacks
- ✅ Ownable untuk access control
- ✅ Input validation untuk semua fungsi
- ✅ Event logging untuk audit trail

---

## Deployment ke GitHub Pages

Aplikasi ini sudah dikonfigurasi untuk di-deploy ke GitHub Pages. Lihat **[DEPLOYMENT.md](DEPLOYMENT.md)** untuk panduan lengkap.

**Quick Deploy:**
1. Push repository ke GitHub
2. Aktifkan GitHub Pages di Settings → Pages (pilih GitHub Actions)
3. Update base path di `frontend/vite.config.js` sesuai nama repo
4. Push perubahan - GitHub Actions akan otomatis deploy!

## Catatan Penting

1. **Ini adalah prototype/demo**: Smart contract ini dibuat untuk tujuan edukasi dan demonstrasi. Untuk implementasi produksi, diperlukan audit keamanan yang lebih ketat.

2. **Gas fees**: Setiap transaksi memerlukan biaya gas. Pastikan wallet memiliki cukup ETH.

3. **Network**: Pastikan menggunakan network yang benar (localhost untuk development, testnet untuk testing, mainnet untuk produksi).

4. **Private keys**: Jangan pernah membagikan private key atau seed phrase Anda kepada siapa pun.

---

## Kontribusi

Project ini dibuat untuk keperluan edukasi. Silakan fork dan modifikasi sesuai kebutuhan.

---

## Lisensi

MIT License - bebas digunakan untuk keperluan apapun.

---

## Penutup

Sistem perbankan dengan smart contract ini menunjukkan bagaimana blockchain dapat digunakan untuk mengotomatisasi dan meningkatkan transparansi dalam sistem perbankan tradisional. Dengan smart contract, transaksi menjadi lebih cepat, lebih aman, dan lebih transparan.

Untuk pertanyaan atau masalah, silakan buat issue di repository ini.

