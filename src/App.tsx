import { BrowserRouter, useLocation } from 'react-router-dom';
import Rotalar from './routes/Rotalar';
import SidebarComponent from './components/Sidebar';
import './styles/App.css';

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

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