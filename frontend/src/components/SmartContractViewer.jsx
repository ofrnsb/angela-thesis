import React from 'react';
import './SmartContractViewer.css';

function SmartContractViewer({ contractCode, transactionType, onClose }) {
  const getTransactionTypeLabel = (type) => {
    const labels = {
      'createAccount': 'Pembuatan Rekening',
      'deposit': 'Deposit',
      'withdraw': 'Penarikan',
      'transferInternal': 'Transfer Antar Rekening (Sesama Bank)',
      'transferExternal': 'Transfer Antar Bank',
      'purchaseProduct': 'Pembelian Produk'
    };
    return labels[type] || type;
  };

  return (
    <div className="contract-viewer-overlay" onClick={onClose}>
      <div className="contract-viewer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="contract-viewer-header">
          <h2>Smart Contract yang Dieksekusi</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="contract-viewer-content">
          <div className="transaction-type-badge">
            Tipe Transaksi: {getTransactionTypeLabel(transactionType)}
          </div>
          <pre className="contract-code">
            <code>{contractCode}</code>
          </pre>
          <div className="contract-explanation">
            <p>
              <strong>Penjelasan:</strong> Kode di atas adalah smart contract yang dieksekusi 
              untuk transaksi ini. Dalam implementasi nyata, kode ini akan berjalan di blockchain 
              dan transaksi akan tercatat secara permanen dan tidak dapat diubah.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SmartContractViewer;

