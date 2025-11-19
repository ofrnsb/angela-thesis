import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './index.css';
import AboutPage from './components/AboutPage';

// Alamat kontrak (akan diisi setelah deployment)
const BANK_MANDIRI_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const BANK_BCA_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const INTER_BANK_NETWORK_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';

// ABI untuk Bank contract
const BANK_ABI = [
  "function bankName() view returns (string)",
  "function bankCode() view returns (string)",
  "function createAccount(string memory _accountNumber, string memory _accountName) external",
  "function deposit(string memory _accountNumber) payable",
  "function withdraw(string memory _accountNumber, uint256 _amount) external",
  "function transferInternal(string memory _fromAccount, string memory _toAccount, uint256 _amount, string memory _description) external",
  "function transferExternal(string memory _fromAccount, string memory _toBankCode, string memory _toAccount, uint256 _amount, string memory _description) external",
  "function purchaseProduct(string memory _accountNumber, uint256 _productId) external",
  "function addProduct(uint256 _productId, string memory _productName, uint256 _price, string memory _description) external",
  "function getAccount(string memory _accountNumber) view returns (tuple(address accountAddress, string accountNumber, string accountName, uint256 balance, bool exists, uint256 createdAt))",
  "function getBalance(string memory _accountNumber) view returns (uint256)",
  "function getProduct(uint256 _productId) view returns (tuple(uint256 productId, string productName, uint256 price, bool isActive, string description))",
  "function getAllProductIds() view returns (uint256[])",
  "event AccountCreated(string indexed accountNumber, address indexed accountAddress, string accountName, uint256 timestamp)",
  "event TransferInternal(string indexed fromAccount, string indexed toAccount, uint256 amount, string description, uint256 timestamp)",
  "event TransferExternal(string indexed fromAccount, string indexed toBankCode, string indexed toAccount, uint256 amount, string description, uint256 timestamp)",
  "event ProductPurchased(string indexed accountNumber, uint256 indexed productId, uint256 amount, string productName, uint256 timestamp)"
];

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [currentBank, setCurrentBank] = useState(null);
  const [bankContract, setBankContract] = useState(null);
  const [userAccountNumber, setUserAccountNumber] = useState('');
  const [userAccountName, setUserAccountName] = useState('');
  const [balance, setBalance] = useState('0');
  const [activeTab, setActiveTab] = useState('account');
  const [products, setProducts] = useState([]);
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
    connectWallet();
    loadProducts();
  }, []);

  useEffect(() => {
    if (userAccountNumber && bankContract) {
      loadBalance();
    }
  }, [userAccountNumber, bankContract]);

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        
        setProvider(provider);
        setSigner(signer);
        setAccount(accounts[0]);

        // Default ke Bank Mandiri
        const bankContract = new ethers.Contract(BANK_MANDIRI_ADDRESS, BANK_ABI, signer);
        setBankContract(bankContract);
        setCurrentBank('BM');

        showAlert('success', 'Wallet terhubung!');
      } else {
        showAlert('error', 'MetaMask tidak terdeteksi. Silakan install MetaMask.');
      }
    } catch (error) {
      showAlert('error', `Error: ${error.message}`);
    }
  };

  const switchBank = async (bankCode) => {
    try {
      const address = bankCode === 'BM' ? BANK_MANDIRI_ADDRESS : BANK_BCA_ADDRESS;
      const contract = new ethers.Contract(address, BANK_ABI, signer);
      setBankContract(contract);
      setCurrentBank(bankCode);
      setUserAccountNumber('');
      setBalance('0');
      showAlert('success', `Berpindah ke ${bankCode === 'BM' ? 'Bank Mandiri' : 'Bank BCA'}`);
    } catch (error) {
      showAlert('error', `Error: ${error.message}`);
    }
  };

  const createAccount = async () => {
    try {
      if (!userAccountNumber || !userAccountName) {
        showAlert('error', 'Mohon isi nomor rekening dan nama');
        return;
      }

      const tx = await bankContract.createAccount(userAccountNumber, userAccountName);
      await tx.wait();
      showAlert('success', 'Rekening berhasil dibuat!');
      loadBalance();
    } catch (error) {
      showAlert('error', `Error: ${error.message}`);
    }
  };

  const loadBalance = async () => {
    try {
      if (!userAccountNumber) return;
      const balance = await bankContract.getBalance(userAccountNumber);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  };

  const deposit = async () => {
    try {
      if (!userAccountNumber || !depositAmount) {
        showAlert('error', 'Mohon isi nomor rekening dan jumlah deposit');
        return;
      }

      const amount = ethers.parseEther(depositAmount);
      const tx = await bankContract.deposit(userAccountNumber, { value: amount });
      await tx.wait();
      showAlert('success', `Deposit ${depositAmount} ETH berhasil!`);
      setDepositAmount('');
      loadBalance();
    } catch (error) {
      showAlert('error', `Error: ${error.message}`);
    }
  };

  const withdraw = async () => {
    try {
      if (!userAccountNumber || !withdrawAmount) {
        showAlert('error', 'Mohon isi nomor rekening dan jumlah penarikan');
        return;
      }

      const amount = ethers.parseEther(withdrawAmount);
      const tx = await bankContract.withdraw(userAccountNumber, amount);
      await tx.wait();
      showAlert('success', `Penarikan ${withdrawAmount} ETH berhasil!`);
      setWithdrawAmount('');
      loadBalance();
    } catch (error) {
      showAlert('error', `Error: ${error.message}`);
    }
  };

  const transferInternal = async () => {
    try {
      if (!userAccountNumber || !transferForm.toAccount || !transferForm.amount) {
        showAlert('error', 'Mohon lengkapi semua field');
        return;
      }

      const amount = ethers.parseEther(transferForm.amount);
      const tx = await bankContract.transferInternal(
        userAccountNumber,
        transferForm.toAccount,
        amount,
        transferForm.description || 'Transfer Internal'
      );
      await tx.wait();
      showAlert('success', `Transfer ${transferForm.amount} ETH berhasil!`);
      setTransferForm({ toAccount: '', amount: '', description: '' });
      loadBalance();
    } catch (error) {
      showAlert('error', `Error: ${error.message}`);
    }
  };

  const transferExternal = async () => {
    try {
      if (!userAccountNumber || !externalTransferForm.toAccount || !externalTransferForm.amount) {
        showAlert('error', 'Mohon lengkapi semua field');
        return;
      }

      const amount = ethers.parseEther(externalTransferForm.amount);
      const tx = await bankContract.transferExternal(
        userAccountNumber,
        externalTransferForm.toBankCode,
        externalTransferForm.toAccount,
        amount,
        externalTransferForm.description || 'Transfer Antar Bank'
      );
      await tx.wait();
      showAlert('success', `Transfer antar bank ${externalTransferForm.amount} ETH berhasil!`);
      setExternalTransferForm({ toBankCode: 'BCA', toAccount: '', amount: '', description: '' });
      loadBalance();
    } catch (error) {
      showAlert('error', `Error: ${error.message}`);
    }
  };

  const loadProducts = async () => {
    try {
      if (!bankContract) return;
      
      const productIds = await bankContract.getAllProductIds();
      const productPromises = productIds.map(id => bankContract.getProduct(id));
      const productData = await Promise.all(productPromises);
      
      setProducts(productData.map((p, i) => ({
        id: productIds[i].toString(),
        name: p.productName,
        price: ethers.formatEther(p.price),
        description: p.description
      })));
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const purchaseProduct = async (productId) => {
    try {
      if (!userAccountNumber) {
        showAlert('error', 'Mohon masukkan nomor rekening Anda');
        return;
      }

      const tx = await bankContract.purchaseProduct(userAccountNumber, productId);
      await tx.wait();
      showAlert('success', 'Produk berhasil dibeli!');
      loadBalance();
    } catch (error) {
      showAlert('error', `Error: ${error.message}`);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: '', message: '' }), 5000);
  };

  if (showAboutPage) {
    return <AboutPage onBack={() => setShowAboutPage(false)} />;
  }

  if (!account) {
    return (
      <div className="container">
        <div className="card">
          <h2>Koneksi Wallet</h2>
          <p>Silakan hubungkan wallet MetaMask Anda untuk melanjutkan.</p>
          <button onClick={connectWallet}>Hubungkan MetaMask</button>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button 
              onClick={() => setShowAboutPage(true)}
              style={{ background: '#28a745', width: 'auto' }}
            >
              📚 Pelajari tentang Smart Contract
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>🏦 Sistem Perbankan dengan Smart Contract</h1>
        <button 
          onClick={() => setShowAboutPage(true)}
          style={{ background: '#28a745', width: 'auto', padding: '10px 20px' }}
        >
          📚 Penjelasan Smart Contract
        </button>
      </div>

      {alert.message && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      <div className="card">
        <h2>Informasi Wallet</h2>
        <p><strong>Alamat:</strong> {account}</p>
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
              <p><strong>Nama:</strong> {userAccountName}</p>
              <p className="balance"><strong>Saldo:</strong> {balance} ETH</p>
            </div>

            <h3>Deposit</h3>
            <div className="form-group">
              <label>Jumlah (ETH)</label>
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
              <label>Jumlah (ETH)</label>
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
              placeholder="0.0"
              step="0.001"
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
              placeholder="0.0"
              step="0.001"
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
          {products.length === 0 ? (
            <p>Tidak ada produk tersedia. Silakan hubungi admin untuk menambahkan produk.</p>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <h4>{product.name}</h4>
                  <p>{product.description}</p>
                  <p className="product-price">{product.price} ETH</p>
                  <button onClick={() => purchaseProduct(product.id)}>
                    Beli Sekarang
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

