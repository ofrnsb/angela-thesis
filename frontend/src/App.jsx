import React, { useState, useEffect } from 'react';
import './index.css';
import AboutPage from './components/AboutPage';

// Simulasi data untuk demo (tanpa blockchain)
const DEMO_MODE = true;

// Data dummy untuk simulasi
const initialAccounts = {
  '1234567890': { accountNumber: '1234567890', accountName: 'Budi Santoso', balance: 10000000, bank: 'BM' },
  '0987654321': { accountNumber: '0987654321', accountName: 'Siti Nurhaliza', balance: 5000000, bank: 'BM' },
  '1111111111': { accountNumber: '1111111111', accountName: 'Ahmad Yani', balance: 8000000, bank: 'BCA' },
};

const initialProducts = [
  { id: '1', name: 'Token Listrik 20kWh', price: 50000, description: 'Token listrik untuk 20kWh - PLN' },
  { id: '2', name: 'Token Listrik 50kWh', price: 125000, description: 'Token listrik untuk 50kWh - PLN' },
  { id: '3', name: 'Pulsa 50.000', price: 50000, description: 'Pulsa seluler 50.000 untuk semua operator' },
  { id: '4', name: 'Paket Data 10GB', price: 75000, description: 'Paket data internet 10GB - 30 hari' },
];

function App() {
  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem('demo_accounts');
    return saved ? JSON.parse(saved) : initialAccounts;
  });
  
  const [products] = useState(initialProducts);
  const [currentBank, setCurrentBank] = useState('BM');
  const [userAccountNumber, setUserAccountNumber] = useState('');
  const [userAccountName, setUserAccountName] = useState('');
  const [balance, setBalance] = useState('0');
  const [activeTab, setActiveTab] = useState('account');
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [showAboutPage, setShowAboutPage] = useState(false);

  // Form states
  const [transferForm, setTransferForm] = useState({
    toAccount: '',
    amount: '',
    description: ''
  });
  const [externalTransferForm, setExternalTransferForm] = useState({
    toBankCode: 'BCA',
    toAccount: '',
    amount: '',
    description: ''
  });
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    // Simpan ke localStorage setiap kali accounts berubah
    localStorage.setItem('demo_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    if (userAccountNumber && accounts[userAccountNumber]) {
      setBalance(accounts[userAccountNumber].balance.toString());
      setUserAccountName(accounts[userAccountNumber].accountName);
    } else {
      setBalance('0');
    }
  }, [userAccountNumber, accounts]);

  const switchBank = (bankCode) => {
    setCurrentBank(bankCode);
    setUserAccountNumber('');
    setBalance('0');
    showAlert('success', `Berpindah ke ${bankCode === 'BM' ? 'Bank Mandiri' : 'Bank BCA'}`);
  };

  const createAccount = () => {
    if (!userAccountNumber || !userAccountName) {
      showAlert('error', 'Mohon isi nomor rekening dan nama');
      return;
    }

    if (accounts[userAccountNumber]) {
      showAlert('error', 'Rekening sudah ada');
      return;
    }

    const newAccount = {
      accountNumber: userAccountNumber,
      accountName: userAccountName,
      balance: 0,
      bank: currentBank
    };

    setAccounts({ ...accounts, [userAccountNumber]: newAccount });
    showAlert('success', 'Rekening berhasil dibuat!');
  };

  const deposit = () => {
    if (!userAccountNumber || !depositAmount) {
      showAlert('error', 'Mohon isi nomor rekening dan jumlah deposit');
      return;
    }

    if (!accounts[userAccountNumber]) {
      showAlert('error', 'Rekening tidak ditemukan');
      return;
    }

    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      showAlert('error', 'Jumlah deposit tidak valid');
      return;
    }

    const updatedAccounts = { ...accounts };
    updatedAccounts[userAccountNumber].balance += amount;
    setAccounts(updatedAccounts);
    showAlert('success', `Deposit Rp ${parseFloat(depositAmount).toLocaleString('id-ID')} berhasil!`);
    setDepositAmount('');
  };

  const withdraw = () => {
    if (!userAccountNumber || !withdrawAmount) {
      showAlert('error', 'Mohon isi nomor rekening dan jumlah penarikan');
      return;
    }

    if (!accounts[userAccountNumber]) {
      showAlert('error', 'Rekening tidak ditemukan');
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      showAlert('error', 'Jumlah penarikan tidak valid');
      return;
    }

    if (accounts[userAccountNumber].balance < amount) {
      showAlert('error', 'Saldo tidak mencukupi');
      return;
    }

    const updatedAccounts = { ...accounts };
    updatedAccounts[userAccountNumber].balance -= amount;
    setAccounts(updatedAccounts);
    showAlert('success', `Penarikan Rp ${parseFloat(withdrawAmount).toLocaleString('id-ID')} berhasil!`);
    setWithdrawAmount('');
  };

  const transferInternal = () => {
    if (!userAccountNumber || !transferForm.toAccount || !transferForm.amount) {
      showAlert('error', 'Mohon lengkapi semua field');
      return;
    }

    if (!accounts[userAccountNumber]) {
      showAlert('error', 'Rekening pengirim tidak ditemukan');
      return;
    }

    if (!accounts[transferForm.toAccount]) {
      showAlert('error', 'Rekening penerima tidak ditemukan');
      return;
    }

    if (userAccountNumber === transferForm.toAccount) {
      showAlert('error', 'Tidak dapat transfer ke rekening sendiri');
      return;
    }

    const amount = parseFloat(transferForm.amount);
    if (isNaN(amount) || amount <= 0) {
      showAlert('error', 'Jumlah transfer tidak valid');
      return;
    }

    if (accounts[userAccountNumber].balance < amount) {
      showAlert('error', 'Saldo tidak mencukupi');
      return;
    }

    const updatedAccounts = { ...accounts };
    updatedAccounts[userAccountNumber].balance -= amount;
    updatedAccounts[transferForm.toAccount].balance += amount;
    setAccounts(updatedAccounts);
    showAlert('success', `Transfer Rp ${parseFloat(transferForm.amount).toLocaleString('id-ID')} berhasil!`);
    setTransferForm({ toAccount: '', amount: '', description: '' });
  };

  const transferExternal = () => {
    if (!userAccountNumber || !externalTransferForm.toAccount || !externalTransferForm.amount) {
      showAlert('error', 'Mohon lengkapi semua field');
      return;
    }

    if (!accounts[userAccountNumber]) {
      showAlert('error', 'Rekening pengirim tidak ditemukan');
      return;
    }

    const amount = parseFloat(externalTransferForm.amount);
    if (isNaN(amount) || amount <= 0) {
      showAlert('error', 'Jumlah transfer tidak valid');
      return;
    }

    if (accounts[userAccountNumber].balance < amount) {
      showAlert('error', 'Saldo tidak mencukupi');
      return;
    }

    // Simulasi transfer antar bank
    const updatedAccounts = { ...accounts };
    updatedAccounts[userAccountNumber].balance -= amount;
    
    // Jika rekening tujuan ada, tambahkan saldo
    if (accounts[externalTransferForm.toAccount]) {
      updatedAccounts[externalTransferForm.toAccount].balance += amount;
    } else {
      // Buat rekening baru jika belum ada
      updatedAccounts[externalTransferForm.toAccount] = {
        accountNumber: externalTransferForm.toAccount,
        accountName: 'Penerima',
        balance: amount,
        bank: externalTransferForm.toBankCode
      };
    }
    
    setAccounts(updatedAccounts);
    showAlert('success', `Transfer antar bank Rp ${parseFloat(externalTransferForm.amount).toLocaleString('id-ID')} berhasil!`);
    setExternalTransferForm({ toBankCode: 'BCA', toAccount: '', amount: '', description: '' });
  };

  const purchaseProduct = (productId) => {
    if (!userAccountNumber) {
      showAlert('error', 'Mohon masukkan nomor rekening Anda');
      return;
    }

    if (!accounts[userAccountNumber]) {
      showAlert('error', 'Rekening tidak ditemukan');
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) {
      showAlert('error', 'Produk tidak ditemukan');
      return;
    }

    if (accounts[userAccountNumber].balance < product.price) {
      showAlert('error', 'Saldo tidak mencukupi');
      return;
    }

    const updatedAccounts = { ...accounts };
    updatedAccounts[userAccountNumber].balance -= product.price;
    setAccounts(updatedAccounts);
    showAlert('success', `Produk ${product.name} berhasil dibeli!`);
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: '', message: '' }), 5000);
  };

  if (showAboutPage) {
    return <AboutPage onBack={() => setShowAboutPage(false)} />;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Sistem Perbankan dengan Smart Contract</h1>
        <button 
          onClick={() => setShowAboutPage(true)}
          style={{ background: '#28a745', width: 'auto', padding: '10px 20px' }}
        >
          Penjelasan Smart Contract
        </button>
      </div>

      <div className="card" style={{ background: '#fff3cd', border: '2px solid #ffc107', marginBottom: '20px' }}>
        <p style={{ margin: 0, color: '#856404' }}>
          <strong>Mode Demo:</strong> Aplikasi ini berjalan dalam mode simulasi untuk pembelajaran. 
          Tidak memerlukan MetaMask atau koneksi blockchain.
        </p>
      </div>

      {alert.message && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      <div className="card">
        <h2>Pilih Bank</h2>
        <div style={{ marginTop: '15px' }}>
          <button 
            onClick={() => switchBank('BM')} 
            style={{ marginRight: '10px', width: 'auto', background: currentBank === 'BM' ? '#667eea' : '#ccc' }}
          >
            Bank Mandiri
          </button>
          <button 
            onClick={() => switchBank('BCA')} 
            style={{ width: 'auto', background: currentBank === 'BCA' ? '#667eea' : '#ccc' }}
          >
            Bank BCA
          </button>
        </div>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          Rekening
        </button>
        <button 
          className={`tab ${activeTab === 'transfer' ? 'active' : ''}`}
          onClick={() => setActiveTab('transfer')}
        >
          Transfer
        </button>
        <button 
          className={`tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Produk
        </button>
      </div>

      {/* Tab Rekening */}
      <div className={`tab-content ${activeTab === 'account' ? 'active' : ''}`}>
        <div className="card">
          <h2>Buat/Buka Rekening</h2>
          <div className="form-group">
            <label>Nomor Rekening</label>
            <input
              type="text"
              value={userAccountNumber}
              onChange={(e) => setUserAccountNumber(e.target.value)}
              placeholder="Contoh: 1234567890"
            />
          </div>
          <div className="form-group">
            <label>Nama Pemilik Rekening</label>
            <input
              type="text"
              value={userAccountName}
              onChange={(e) => setUserAccountName(e.target.value)}
              placeholder="Nama lengkap"
            />
          </div>
          <button onClick={createAccount}>Buat Rekening</button>
        </div>

        {userAccountNumber && (
          <div className="card">
            <h2>Informasi Rekening</h2>
            <div className="account-info">
              <p><strong>Nomor Rekening:</strong> {userAccountNumber}</p>
              <p><strong>Nama:</strong> {userAccountName || accounts[userAccountNumber]?.accountName || '-'}</p>
              <p className="balance"><strong>Saldo:</strong> Rp {parseFloat(balance || 0).toLocaleString('id-ID')}</p>
            </div>

            <h3>Deposit</h3>
            <div className="form-group">
              <label>Jumlah (Rupiah)</label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="0.0"
                step="0.001"
              />
            </div>
            <button onClick={deposit}>Deposit</button>

            <h3 style={{ marginTop: '30px' }}>Penarikan</h3>
            <div className="form-group">
              <label>Jumlah (Rupiah)</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="0.0"
                step="0.001"
              />
            </div>
            <button onClick={withdraw}>Tarik</button>
          </div>
        )}
      </div>

      {/* Tab Transfer */}
      <div className={`tab-content ${activeTab === 'transfer' ? 'active' : ''}`}>
        <div className="card">
          <h2>Transfer Antar Rekening (Sesama Bank)</h2>
          <div className="form-group">
            <label>Nomor Rekening Pengirim</label>
            <input
              type="text"
              value={userAccountNumber}
              onChange={(e) => setUserAccountNumber(e.target.value)}
              placeholder="Nomor rekening Anda"
            />
          </div>
          <div className="form-group">
            <label>Nomor Rekening Penerima</label>
            <input
              type="text"
              value={transferForm.toAccount}
              onChange={(e) => setTransferForm({ ...transferForm, toAccount: e.target.value })}
              placeholder="Nomor rekening tujuan"
            />
          </div>
          <div className="form-group">
            <label>Jumlah (ETH)</label>
            <input
              type="number"
              value={transferForm.amount}
              onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
              placeholder="0"
              step="1000"
            />
          </div>
          <div className="form-group">
            <label>Deskripsi (Opsional)</label>
            <input
              type="text"
              value={transferForm.description}
              onChange={(e) => setTransferForm({ ...transferForm, description: e.target.value })}
              placeholder="Keterangan transfer"
            />
          </div>
          <button onClick={transferInternal}>Transfer</button>
        </div>

        <div className="card">
          <h2>Transfer Antar Bank</h2>
          <div className="form-group">
            <label>Nomor Rekening Pengirim</label>
            <input
              type="text"
              value={userAccountNumber}
              onChange={(e) => setUserAccountNumber(e.target.value)}
              placeholder="Nomor rekening Anda"
            />
          </div>
          <div className="form-group">
            <label>Bank Tujuan</label>
            <select
              value={externalTransferForm.toBankCode}
              onChange={(e) => setExternalTransferForm({ ...externalTransferForm, toBankCode: e.target.value })}
            >
              <option value="BCA">Bank BCA</option>
              <option value="BM">Bank Mandiri</option>
            </select>
          </div>
          <div className="form-group">
            <label>Nomor Rekening Penerima</label>
            <input
              type="text"
              value={externalTransferForm.toAccount}
              onChange={(e) => setExternalTransferForm({ ...externalTransferForm, toAccount: e.target.value })}
              placeholder="Nomor rekening tujuan"
            />
          </div>
          <div className="form-group">
            <label>Jumlah (ETH)</label>
            <input
              type="number"
              value={externalTransferForm.amount}
              onChange={(e) => setExternalTransferForm({ ...externalTransferForm, amount: e.target.value })}
              placeholder="0"
              step="1000"
            />
          </div>
          <div className="form-group">
            <label>Deskripsi (Opsional)</label>
            <input
              type="text"
              value={externalTransferForm.description}
              onChange={(e) => setExternalTransferForm({ ...externalTransferForm, description: e.target.value })}
              placeholder="Keterangan transfer"
            />
          </div>
          <button onClick={transferExternal}>Transfer Antar Bank</button>
        </div>
      </div>

      {/* Tab Produk */}
      <div className={`tab-content ${activeTab === 'products' ? 'active' : ''}`}>
        <div className="card">
          <h2>Daftar Produk</h2>
          <div className="product-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <h4>{product.name}</h4>
                <p>{product.description}</p>
                <p className="product-price">Rp {product.price.toLocaleString('id-ID')}</p>
                <button onClick={() => purchaseProduct(product.id)}>
                  Beli Sekarang
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
