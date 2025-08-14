import { BrowserRouter } from 'react-router-dom';
import Rotalar from './rotalar/Rotalar';
import SidebarComponent from './components/Sidebar';
import './styles/App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App" style={{ 
        display: 'flex', 
        height: '100vh', 
        width: '100vw',
        overflow: 'hidden',
        margin: 0,
        padding: 0
      }}>
        {/* Sidebar */}
        <SidebarComponent />
        
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
    </BrowserRouter>
  );
}

export default App;
