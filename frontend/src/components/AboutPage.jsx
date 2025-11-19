import React from 'react';
import './AboutPage.css';

function AboutPage({ onBack }) {
  return (
    <div className="about-container">
      <button className="back-button" onClick={onBack}>
        ← Kembali ke Aplikasi
      </button>

      <div className="about-content">
        <h1>📚 Penjelasan Smart Contract untuk Sistem Perbankan</h1>
        
        <section className="about-section">
          <h2>1. Apa itu Smart Contract?</h2>
          <div className="explanation-box">
            <p>
              <strong>Smart Contract</strong> adalah program komputer yang berjalan di blockchain 
              yang secara otomatis menjalankan perjanjian atau kontrak ketika kondisi tertentu terpenuhi. 
              Bayangkan seperti mesin penjual otomatis: Anda memasukkan uang, memilih produk, 
              dan mesin secara otomatis memberikan produk tersebut tanpa perlu campur tangan manusia.
            </p>
            <div className="analogy-box">
              <h3>💡 Analogi Sederhana:</h3>
              <p>
                Jika perjanjian tradisional memerlukan notaris, saksi, dan dokumen kertas yang bisa hilang 
                atau diubah, smart contract adalah perjanjian digital yang:
              </p>
              <ul>
                <li>✅ <strong>Tidak bisa diubah</strong> - Setelah dibuat, tidak bisa dimanipulasi</li>
                <li>✅ <strong>Otomatis</strong> - Menjalankan sendiri tanpa perlu manusia</li>
                <li>✅ <strong>Transparan</strong> - Semua orang bisa melihat (tapi tidak bisa mengubah)</li>
                <li>✅ <strong>Terpercaya</strong> - Tidak ada pihak ketiga yang bisa curang</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>2. Mengapa Smart Contract Penting?</h2>
          <div className="explanation-box">
            <h3>🌍 Penggunaan di Dunia Nyata:</h3>
            <div className="use-cases">
              <div className="use-case-card">
                <h4>📈 Perdagangan Saham & Investasi</h4>
                <p>
                  Banyak platform trading menggunakan smart contract untuk:
                </p>
                <ul>
                  <li>Otomatisasi pembelian dan penjualan saham</li>
                  <li>Pembagian dividen otomatis</li>
                  <li>Transparansi dalam transaksi</li>
                  <li>Mengurangi biaya perantara (broker)</li>
                </ul>
              </div>

              <div className="use-case-card">
                <h4>🏦 Perbankan & Keuangan</h4>
                <p>
                  Bank-bank besar mulai menggunakan smart contract untuk:
                </p>
                <ul>
                  <li>Transfer uang antar bank yang lebih cepat</li>
                  <li>Pinjaman otomatis dengan syarat tertentu</li>
                  <li>Asuransi dengan klaim otomatis</li>
                  <li>Pembayaran tagihan otomatis</li>
                </ul>
              </div>

              <div className="use-case-card">
                <h4>🏢 Perusahaan Besar (Big Companies)</h4>
                <p>
                  Perusahaan seperti IBM, Microsoft, dan lainnya menggunakan smart contract untuk:
                </p>
                <ul>
                  <li>Supply chain management (manajemen rantai pasok)</li>
                  <li>Kontrak dengan supplier otomatis</li>
                  <li>Verifikasi produk dan keaslian</li>
                  <li>Pembayaran otomatis berdasarkan delivery</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>3. Bagaimana Smart Contract Bekerja di Sistem Perbankan?</h2>
          <div className="explanation-box">
            <h3>🔄 Proses Transfer Uang Tradisional vs Smart Contract:</h3>
            
            <div className="comparison">
              <div className="comparison-card traditional">
                <h4>❌ Sistem Tradisional</h4>
                <ol>
                  <li>Anda minta transfer ke bank</li>
                  <li>Bank memverifikasi manual</li>
                  <li>Bank memproses (bisa 1-3 hari)</li>
                  <li>Bank memotong biaya admin</li>
                  <li>Uang sampai ke tujuan</li>
                </ol>
                <p className="disadvantage">
                  ⏱️ Lama, 💰 Mahal, 🔒 Kurang transparan
                </p>
              </div>

              <div className="comparison-card smart">
                <h4>✅ Dengan Smart Contract</h4>
                <ol>
                  <li>Anda kirim permintaan transfer</li>
                  <li>Smart contract verifikasi otomatis</li>
                  <li>Smart contract eksekusi langsung (detik)</li>
                  <li>Biaya minimal (hanya gas fee)</li>
                  <li>Uang langsung sampai</li>
                </ol>
                <p className="advantage">
                  ⚡ Cepat, 💵 Murah, 🔍 Transparan
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>4. Keuntungan Smart Contract untuk Perbankan</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">⚡</div>
              <h3>Kecepatan</h3>
              <p>
                Transaksi bisa selesai dalam hitungan detik atau menit, 
                bukan hari seperti sistem tradisional.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">💰</div>
              <h3>Biaya Rendah</h3>
              <p>
                Mengurangi biaya operasional karena tidak perlu banyak 
                pegawai untuk memproses transaksi.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🔒</div>
              <h3>Keamanan Tinggi</h3>
              <p>
                Data tersimpan di blockchain yang sangat sulit diretas 
                atau dimanipulasi.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">👁️</div>
              <h3>Transparansi</h3>
              <p>
                Semua transaksi tercatat dan bisa diverifikasi, 
                mengurangi risiko korupsi atau penipuan.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🤖</div>
              <h3>Otomatisasi</h3>
              <p>
                Tidak perlu campur tangan manusia, mengurangi 
                risiko human error.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🌐</div>
              <h3>Global</h3>
              <p>
                Bisa digunakan di mana saja di dunia, 
                tidak terbatas geografis.
              </p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>5. Contoh Implementasi dalam Aplikasi Ini</h2>
          <div className="explanation-box">
            <h3>🎯 Fitur yang Tersedia:</h3>
            
            <div className="feature-example">
              <h4>1. Transfer Antar Rekening (Sesama Bank)</h4>
              <p>
                Ketika Anda transfer uang ke rekening lain di bank yang sama, 
                smart contract akan:
              </p>
              <ul>
                <li>Memverifikasi bahwa rekening Anda memiliki saldo cukup</li>
                <li>Memverifikasi bahwa rekening tujuan ada</li>
                <li>Mengurangi saldo Anda dan menambah saldo penerima secara otomatis</li>
                <li>Mencatat transaksi di blockchain (tidak bisa dihapus atau diubah)</li>
              </ul>
            </div>

            <div className="feature-example">
              <h4>2. Transfer Antar Bank</h4>
              <p>
                Transfer ke bank lain juga otomatis melalui smart contract:
              </p>
              <ul>
                <li>Smart contract bank Anda mengurangi saldo</li>
                <li>Smart contract jaringan antar bank mencatat transfer</li>
                <li>Bank tujuan menerima notifikasi dan menambahkan saldo</li>
                <li>Semua proses terjadi dalam hitungan detik</li>
              </ul>
            </div>

            <div className="feature-example">
              <h4>3. Pembelian Produk Digital</h4>
              <p>
                Membeli token listrik, pulsa, atau produk digital lainnya:
              </p>
              <ul>
                <li>Smart contract memverifikasi saldo Anda</li>
                <li>Mengurangi saldo sesuai harga produk</li>
                <li>Mencatat pembelian di blockchain</li>
                <li>Produk langsung terkirim (dalam implementasi nyata)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>6. Mengapa Blockchain dan Smart Contract adalah Masa Depan?</h2>
          <div className="explanation-box">
            <div className="future-box">
              <h3>🚀 Tren Global:</h3>
              <ul>
                <li>
                  <strong>Bank Sentral di berbagai negara</strong> sedang mengembangkan 
                  mata uang digital (CBDC) berbasis blockchain
                </li>
                <li>
                  <strong>Perusahaan teknologi besar</strong> seperti IBM, Microsoft, 
                  dan Amazon sudah menggunakan blockchain untuk berbagai layanan
                </li>
                <li>
                  <strong>Bank-bank internasional</strong> seperti JPMorgan, HSBC, 
                  dan lainnya sudah mengimplementasikan smart contract
                </li>
                <li>
                  <strong>Pemerintah</strong> mulai menggunakan blockchain untuk 
                  transparansi dan efisiensi
                </li>
              </ul>

              <div className="quote-box">
                <p className="quote">
                  "Smart contract akan mengubah cara kita melakukan bisnis, 
                  sama seperti internet mengubah cara kita berkomunikasi."
                </p>
                <p className="quote-author">- Para ahli teknologi dan keuangan</p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>7. Kesimpulan</h2>
          <div className="conclusion-box">
            <p>
              Smart contract adalah teknologi revolusioner yang membawa transparansi, 
              kecepatan, dan keamanan ke dalam sistem perbankan dan keuangan. 
              Meskipun masih relatif baru, teknologi ini sudah digunakan oleh 
              banyak institusi besar di dunia.
            </p>
            <p>
              Aplikasi ini adalah contoh sederhana bagaimana smart contract dapat 
              digunakan untuk mengotomatisasi transaksi perbankan, membuat proses 
              lebih cepat, lebih murah, dan lebih transparan.
            </p>
            <p className="highlight">
              💡 Dengan smart contract, masa depan perbankan akan lebih efisien, 
              transparan, dan dapat diakses oleh semua orang!
            </p>
          </div>
        </section>

        <div className="cta-box">
          <h3>Siap Mencoba?</h3>
          <p>Coba fitur-fitur smart contract di aplikasi ini!</p>
          <button className="cta-button" onClick={onBack}>
            Coba Aplikasi Sekarang →
          </button>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;

