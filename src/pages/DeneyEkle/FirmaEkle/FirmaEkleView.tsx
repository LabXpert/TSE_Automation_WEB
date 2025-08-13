import React from 'react';

const FirmaEkleView: React.FC = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ color: '#dc2626', marginBottom: '20px' }}>Firma Ekleme Sayfası</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <label>Firma Adı:</label>
        <input type="text" style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label>Telefon:</label>
        <input type="text" style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label>Adres:</label>
        <textarea style={{ width: '100%', padding: '8px', marginTop: '5px', height: '80px' }} />
      </div>
      
      <button style={{
        backgroundColor: '#dc2626',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        marginRight: '10px'
      }}>
        Kaydet
      </button>
      
      <button style={{
        backgroundColor: '#gray',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px'
      }}>
        İptal
      </button>
    </div>
  );
};

export default FirmaEkleView;
