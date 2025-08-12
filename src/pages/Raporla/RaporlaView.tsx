import { Link } from 'react-router-dom';

function RaporlaView() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1 style={{ color: '#213547' }}>Raporla Sayfası</h1>
      
      <div style={{ marginTop: '30px' }}>
        <Link to="/deney-ekle">
          <button style={{ margin: '10px', padding: '10px 20px' }}>
            Deney Ekle Sayfası
          </button>
        </Link>
        
        <Link to="/duzenle-sil">
          <button style={{ margin: '10px', padding: '10px 20px' }}>
            Deney Düzenle/Sil Sayfası
          </button>
        </Link>
        
        <Link to="/raporla">
          <button style={{ margin: '10px', padding: '10px 20px' }}>
            Raporla Sayfası
          </button>
        </Link>
      </div>
    </div>
  );
}

export default RaporlaView;