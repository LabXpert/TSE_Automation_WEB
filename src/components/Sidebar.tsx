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

  // CSS animasyonları için style element
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
  `;
  if (!document.head.querySelector('[data-sidebar-styles]')) {
    styleElement.setAttribute('data-sidebar-styles', 'true');
    document.head.appendChild(styleElement);
  }

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
          padding: collapsed ? '20px 12px' : '24px 20px', 
          borderBottom: '1px solid #e2e8f0',
          textAlign: 'center',
          height: '90px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Logo Icon */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: collapsed ? '0' : '6px',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: collapsed ? '0' : '12px',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                width: collapsed ? '36px' : '44px',
                height: collapsed ? '36px' : '44px',
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 245, 247, 0.95) 100%)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                {/* İç glow efekti */}
                <div style={{
                  position: 'absolute',
                  top: '1px',
                  left: '1px',
                  right: '1px',
                  height: '50%',
                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 100%)',
                  borderRadius: '12px 12px 0 0',
                  pointerEvents: 'none'
                }} />
                
                <img 
                  src="/tse-logo.png" 
                  alt="TSE Logo"
                  style={{ 
                    width: collapsed ? '22px' : '28px',
                    height: collapsed ? '22px' : '28px',
                    objectFit: 'contain',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    zIndex: 1,
                    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))'
                  }}
                  onError={(e) => {
                    // Eğer logo yüklenemezse, eski icon'u göster
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.parentElement?.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'flex';
                    }
                  }}
                />
              </div>
              <div style={{
                width: collapsed ? '32px' : '40px',
                height: collapsed ? '32px' : '40px',
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <svg 
                  width={collapsed ? '18' : '22'} 
                  height={collapsed ? '18' : '22'} 
                  viewBox="0 0 24 24" 
                  fill="white"
                  style={{ 
                    transition: 'all 0.3s ease'
                  }}
                >
                  <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                  <path d="M2 17L12 22L22 17"/>
                  <path d="M2 12L12 17L22 12"/>
                </svg>
              </div>
            </div>
            
            {!collapsed && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                animation: 'fadeIn 0.3s ease-in-out'
              }}>
                <div style={{
                  color: 'white',
                  fontWeight: '800',
                  fontSize: '18px',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.2',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                }}>
                  TSE LABORATUVAR SİSTEMİ
                </div>
              </div>
            )}
          </div>

          {collapsed && (
            <div style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: '700',
              fontSize: '10px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              marginTop: '4px',
              animation: 'fadeIn 0.3s ease-in-out'
            }}>
              TSE
            </div>
          )}
          
          {/* Decorative elements */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)'
          }} />
          
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)'
          }} />

          {/* Background pattern */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '80px',
            height: '80px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            borderRadius: '50%'
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
            {collapsed ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
              </svg>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
                  <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z"/>
                </svg>
                Daralt
              </>
            )}
          </button>
        </div>

        {/* Menu Items */}
        <div style={{ padding: '8px 0' }}>
          <Menu
            menuItemStyles={{
              button: ({ active }) => ({
                color: active ? '#dc2626' : '#475569',
                backgroundColor: active ? '#fecaca' : 'transparent',
                margin: '4px 12px',
                borderRadius: '8px',
                fontWeight: active ? '600' : '500',
                fontSize: '14px',
                padding: '12px 16px',
                border: 'none',
                transition: 'all 0.2s ease',
                position: 'relative',
                '&:hover': {
                  backgroundColor: active ? '#fecaca' : '#f8fafc',
                  color: active ? '#dc2626' : '#1e293b',
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
                  backgroundColor: '#dc2626',
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
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 2V4H7C5.9 4 5 4.9 5 6V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V6C19 4.9 18.1 4 17 4H15V2H9ZM17 6V18H7V6H17ZM12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15Z"/>
                  </svg>
                </span>
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
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5ZM5 5H19V19H5V5ZM7 7V9H17V7H7ZM7 11V13H17V11H7ZM7 15V17H14V15H7Z"/>
                  </svg>
                </span>
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