// src/components/Sidebar.tsx
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
        backgroundColor="#ffffff"
        rootStyles={{
          color: '#0f172a',
          border: 'none',
          boxShadow: '4px 0 24px -2px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)'
        }}
      >
        {/* Header */}
        <div style={{ 
          padding: collapsed ? '24px 16px' : '24px 24px', 
          borderBottom: '1px solid #e2e8f0',
          textAlign: 'center',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          position: 'relative'
        }}>
          <div style={{
            color: 'white',
            fontWeight: '700',
            fontSize: collapsed ? '16px' : '20px',
            letterSpacing: '-0.025em'
          }}>
            {collapsed ? 'TSE' : 'TSE Automation'}
          </div>
          
          {/* Decorative element */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)'
          }} />
        </div>

        {/* Toggle Button */}
        <div style={{ 
          padding: '16px', 
          textAlign: 'center',
          borderBottom: '1px solid #f1f5f9'
        }}>
          <button
            onClick={toggleSidebar}
            style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              border: '1px solid #e2e8f0',
              color: '#64748b',
              padding: '10px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              width: collapsed ? '44px' : 'auto',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
            }}
          >
            {collapsed ? '→' : '← Daralt'}
          </button>
        </div>

        {/* Menu Items */}
        <div style={{ padding: '8px 0' }}>
          <Menu
            menuItemStyles={{
              button: ({ active }) => ({
                color: active ? '#2563eb' : '#475569',
                backgroundColor: active ? '#dbeafe' : 'transparent',
                margin: '4px 12px',
                borderRadius: '8px',
                fontWeight: active ? '600' : '500',
                fontSize: '14px',
                padding: '12px 16px',
                border: 'none',
                transition: 'all 0.2s ease',
                position: 'relative',
                '&:hover': {
                  backgroundColor: active ? '#dbeafe' : '#f8fafc',
                  color: active ? '#2563eb' : '#1e293b',
                  transform: 'translateX(2px)'
                },
                '&::before': active ? {
                  content: '""',
                  position: 'absolute',
                  left: '-12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '3px',
                  height: '20px',
                  backgroundColor: '#2563eb',
                  borderRadius: '2px'
                } : {}
              }),
            }}
          >
            <MenuItem 
              active={location.pathname === '/deney-ekle' || location.pathname === '/'}
              component={<Link to="/deney-ekle" />}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: collapsed ? '0' : '12px' 
              }}>
                <span style={{ 
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                  height: '20px'
                }}>🧪</span>
                {!collapsed && (
                  <span style={{ 
                    letterSpacing: '-0.01em',
                    lineHeight: '1.4'
                  }}>
                    Deney Yönetimi
                  </span>
                )}
              </div>
            </MenuItem>

            <MenuItem 
              active={location.pathname === '/raporla'}
              component={<Link to="/raporla" />}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: collapsed ? '0' : '12px' 
              }}>
                <span style={{ 
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                  height: '20px'
                }}>📊</span>
                {!collapsed && (
                  <span style={{ 
                    letterSpacing: '-0.01em',
                    lineHeight: '1.4'
                  }}>
                    Raporlama
                  </span>
                )}
              </div>
            </MenuItem>
          </Menu>
        </div>

        {/* Footer */}
        {!collapsed && (
          <div style={{ 
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            right: '20px',
            textAlign: 'center',
            fontSize: '11px',
            color: '#94a3b8',
            fontWeight: '500',
            letterSpacing: '0.025em'
          }}>
            © 2025 TSE Automation
            <div style={{
              marginTop: '4px',
              fontSize: '10px',
              color: '#cbd5e1'
            }}>
              v1.0.0
            </div>
          </div>
        )}
      </Sidebar>
    </div>
  );
}

export default SidebarComponent;