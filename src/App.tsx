import { BrowserRouter, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Rotalar from './routes/Rotalar';
import SidebarComponent from './components/Sidebar';
import CalibrationAlertModal from './components/CalibrationAlertModal';
import './styles/App.css';

interface CalibrationAlert {
  id: number;
  serial_no: string;
  equipment_name: string;
  brand?: string;
  model?: string;
  last_calibration_date: string;
  next_calibration_date: string;
  calibration_org_name?: string;
  calibration_contact_name?: string;
  calibration_email?: string;
  calibration_phone?: string;
  days_overdue?: number;
  days_remaining?: number;
  status: 'expired' | 'expiring_soon';
  priority: 'critical' | 'warning';
}

interface AlertSummary {
  totalExpired: number;
  totalExpiringSoon: number;
  alerts: CalibrationAlert[];
  hasAlerts: boolean;
}

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  // Kalibrasyon uyarıları için state
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertChecked, setAlertChecked] = useState(false);
  const [alertData, setAlertData] = useState<AlertSummary | null>(null);
  const [loading, setLoading] = useState(false);

  // API çağrıları
  const fetchAlertSummary = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/alerts/calibration/summary');
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Uyarı özeti alınırken hata:', error);
      return { hasAlerts: false, totalExpired: 0, totalExpiringSoon: 0 };
    }
  };

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/alerts/calibration');
      const data = await response.json();
      setAlertData(data.data);
      return data.data;
    } catch (error) {
      console.error('Uyarılar alınırken hata:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Login sonrası uyarı kontrolü - SADECE İLK DEFA
  useEffect(() => {
    const checkForAlerts = async () => {
      // Sadece login olmuş, login sayfasında değil ve daha önce kontrol edilmemişse
      if (isLoggedIn && !isLoginPage && !alertChecked) {
        try {
          setAlertChecked(true); // Kontrol edildi olarak işaretle
          
          const summary = await fetchAlertSummary();
          
          if (summary.hasAlerts) {
            // Detaylı uyarı verilerini çek
            await fetchAlerts();
            
            // Modal'ı göster
            setShowAlertModal(true);
          }
        } catch (error) {
          console.error('Uyarı kontrolü sırasında hata:', error);
        }
      }
    };

    // Kısa bir gecikme ile kontrol et (UI render'ı tamamlandıktan sonra)
    const timer = setTimeout(checkForAlerts, 1000);
    
    return () => clearTimeout(timer);
  }, [isLoggedIn, isLoginPage, alertChecked]);

  // Logout olduğunda alert kontrolünü sıfırla
  useEffect(() => {
    if (!isLoggedIn) {
      setAlertChecked(false);
      setShowAlertModal(false);
      setAlertData(null);
    }
  }, [isLoggedIn]);

  // Modal kapatma
  const handleCloseModal = () => {
    setShowAlertModal(false);
  };

  return (
    <div className="App" style={{ 
      display: 'flex', 
      height: '100vh', 
      width: '100vw',
      overflow: 'hidden',
      margin: 0,
      padding: 0
    }}>
      {/* Sidebar - sadece login olunmuş durumda ve login sayfasında değilken göster */}
      {isLoggedIn && !isLoginPage && <SidebarComponent />}
      
      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        backgroundColor: '#ffffff'
      }}>
        <Rotalar />
      </div>

      {/* Kalibrasyon Uyarı Modal'ı */}
      <CalibrationAlertModal
        isOpen={showAlertModal}
        onClose={handleCloseModal}
        alertData={alertData}
        loading={loading}
      />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;