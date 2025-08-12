import { useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';

function SidebarComponent() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar 
        collapsed={collapsed}
        backgroundColor="#213547"
        rootStyles={{
          color: '#ffffff',
        }}
      >
        {/* Header */}
        <div style={{ 
          padding: '20px', 
          borderBottom: '1px solid #34495e',
          textAlign: 'center',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h3 style={{ 
            color: 'white', 
            margin: 0,
            fontSize: collapsed ? '14px' : '18px'
          }}>
            {collapsed ? 'TSE' : 'TSE Automation'}
          </h3>
        </div>

        {/* Toggle Button */}
        <div style={{ 
          padding: '10px', 
          textAlign: 'center',
          borderBottom: '1px solid #34495e'
        }}>
          <button
            onClick={toggleSidebar}
            style={{
              background: 'none',
              border: '1px solid #34495e',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              width: collapsed ? '40px' : 'auto'
            }}
          >
            {collapsed ? '☰' : '←'}
          </button>
        </div>

        {/* Menu Items */}
        <Menu
          menuItemStyles={{
            button: ({ active }) => ({
              color: active ? '#61dafb' : '#ffffff',
              backgroundColor: active ? '#34495e' : 'transparent',
              '&:hover': {
                backgroundColor: '#34495e',
                color: '#61dafb'
              },
              padding: '10px 20px',
              position: 'relative'
            }),
          }}
        >
          <MenuItem 
            active={location.pathname === '/deney-ekle' || location.pathname === '/'}
            component={<Link to="/deney-ekle" />}
          >
            <span style={{ marginRight: collapsed ? '0' : '10px' }}>➕</span>
            {!collapsed && 'Deney Ekle'}
            {collapsed && <span style={{ position: 'absolute', right: '8px' }}>›</span>}
          </MenuItem>

          <MenuItem 
            active={location.pathname === '/duzenle-sil'}
            component={<Link to="/duzenle-sil" />}
          >
            <span style={{ marginRight: collapsed ? '0' : '10px' }}>✏️</span>
            {!collapsed && 'Düzenle/Sil'}
            {collapsed && <span style={{ position: 'absolute', right: '8px' }}>›</span>}
          </MenuItem>

          <MenuItem 
            active={location.pathname === '/raporla'}
            component={<Link to="/raporla" />}
          >
            <span style={{ marginRight: collapsed ? '0' : '10px' }}>📊</span>
            {!collapsed && 'Raporla'}
            {collapsed && <span style={{ position: 'absolute', right: '8px' }}>›</span>}
          </MenuItem>
        </Menu>

        {/* Footer */}
        {!collapsed && (
          <div style={{ 
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            right: '20px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#7f8c8d'
          }}>
            © 2025 TSE Automation
          </div>
        )}
      </Sidebar>
    </div>
  );
}

export default SidebarComponent;