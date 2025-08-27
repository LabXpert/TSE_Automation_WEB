// src/components/Sidebar.tsx
import { useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function SidebarComponent() {
  const [collapsed, setCollapsed] = useState(false);
  const [kayitIslemleriAcik, setKayitIslemleriAcik] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Kullanıcı bilgilerini localStorage'dan al
  const getUserInfo = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  };

  const user = getUserInfo();
  const isAdmin = user?.role === 'admin';

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleKayitIslemleri = () => {
    setKayitIslemleriAcik(!kayitIslemleriAcik);
  };

  const handleLogout = () => {
    // LocalStorage'ı temizle
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('savedUsername');
    
    // Login sayfasına yönlendir
    navigate('/login');
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
    .dropdown-content {
      overflow: hidden;
      transition: max-height 0.6s ease, opacity 0.6s ease;
      max-height: 0;
      opacity: 0;
    }
    
    .dropdown-content.open {
      max-height: 300px;
      opacity: 1;
    }
  `;
  if (!document.head.querySelector('[data-sidebar-styles]')) {
    styleElement.setAttribute('data-sidebar-styles', 'true');
    document.head.appendChild(styleElement);
  }

  // Kayıt işlemleri sayfalarını kontrol et
  const kayitIslemleriSayfalar = ['/personel-ekle', '/kullanici-ekle', '/deney-turu-ekle', '/makine-ekle', '/kalibrasyon-kurulus-ekle'];
  const kayitIslemleriAktif = kayitIslemleriSayfalar.includes(location.pathname);

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
              background: '#dc2626',
              border: 'none',
              color: '#ffffff',
              padding: '0',
              borderRadius: '50%',
              cursor: 'pointer',
              width: '40px',
              height: '40px',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 6px rgba(220, 38, 38, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#b91c1c';
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 4px 10px rgba(220, 38, 38, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#dc2626';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(220, 38, 38, 0.2)';
            }}
          >
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              style={{ 
                transition: 'transform 0.2s ease',
                transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)'
              }}
            >
              <path d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z" />
            </svg>
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
            {/* Deney Yönetimi */}
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

            {/* Raporlama */}
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

            {/* Makine Raporlama */}
            <MenuItem 
              active={location.pathname === '/makine-raporla'}
              component={<Link to="/makine-raporla" />}
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
                    <path d="M12,18.5C15.5,18.5 19.31,16.69 21.58,12C19.31,7.31 15.5,5.5 12,5.5C8.5,5.5 4.69,7.31 2.42,12C4.69,16.69 8.5,18.5 12,18.5M12,7C14.76,7 17,9.24 17,12C17,14.76 14.76,17 12,17C9.24,17 7,14.76 7,12C7,9.24 9.24,7 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z"/>
                  </svg>
                </span>
                {!collapsed && (
                  <span style={{ 
                    letterSpacing: '-0.01em',
                    lineHeight: '1.4'
                  }}>
                    Makine Raporlama
                  </span>
                )}
              </div>
            </MenuItem>

            
            {/* Analiz Dashboard */}
            <MenuItem 
              active={location.pathname === '/analiz'}
              component={<Link to="/analiz" />}
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
                    <path d="M3,3V21H21V19H5V3H3M9,17H7V10H9V17M13,17H11V7H13V17M17,17H15V13H17V17Z"/>
                  </svg>
                </span>
                {!collapsed && (
                  <span style={{ 
                    letterSpacing: '-0.01em',
                    lineHeight: '1.4'
                  }}>
                    Analiz Dashboard
                  </span>
                )}
              </div>
            </MenuItem>


            {/* Kayıt İşlemleri - Sadece Admin'ler İçin */}
            {isAdmin && (
              <>
                {/* Kayıt İşlemleri - Dropdown Ana Menü */}
                <MenuItem 
                  active={kayitIslemleriAktif}
                  onClick={toggleKayitIslemleri}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: collapsed ? '0' : '12px',
                    justifyContent: 'space-between',
                    width: '100%'
                  }}>
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
                          <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4.9 21.1 5.8 22 7 22H17C18.1 22 19 21.1 19 20V8L14 2ZM17 20H7V4H13V9H17V20Z"/>
                        </svg>
                      </span>
                      {!collapsed && (
                        <span style={{ 
                          letterSpacing: '-0.01em',
                          lineHeight: '1.4'
                        }}>
                          Kayıt İşlemleri
                        </span>
                      )}
                    </div>
                    {!collapsed && (
                      <svg 
                        width="12" 
                        height="12" 
                        viewBox="0 0 24 24" 
                        fill="currentColor"
                        style={{ 
                          transition: 'transform 0.3s ease',
                          transform: kayitIslemleriAcik ? 'rotate(90deg)' : 'rotate(0deg)'
                        }}
                      >
                        <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
                      </svg>
                    )}
                  </div>
                </MenuItem>

                {/* Kayıt İşlemleri Alt Menüler */}
                {!collapsed && (
                  <div 
                    className={`dropdown-content ${kayitIslemleriAcik ? 'open' : ''}`}
                    style={{
                      marginLeft: '8px',
                      borderLeft: '2px solid #f1f5f9',
                      paddingLeft: '4px',
                      marginTop: '4px'
                    }}
                  >
                    {/* Personel Kayıtları */}
                    <MenuItem 
                      active={location.pathname === '/personel-ekle'}
                      component={<Link to="/personel-ekle" />}
                      style={{
                        margin: '3px 8px',
                        fontSize: '13px',
                        padding: '8px 12px'
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px',
                        paddingLeft: '8px'
                      }}>
                        <span style={{ 
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '16px',
                          height: '16px'
                        }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        </span>
                        <span style={{ 
                          letterSpacing: '-0.01em',
                          lineHeight: '1.4',
                          fontSize: '13px'
                        }}>
                          Personel Kayıtları
                        </span>
                      </div>
                    </MenuItem>

                    {/* Kullanıcı Kayıtları */}
                    <MenuItem 
                      active={location.pathname === '/kullanici-ekle'}
                      component={<Link to="/kullanici-ekle" />}
                      style={{
                        margin: '3px 8px',
                        fontSize: '13px',
                        padding: '8px 12px'
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px',
                        paddingLeft: '8px'
                      }}>
                        <span style={{ 
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '16px',
                          height: '16px'
                        }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L12 4L3 7V9C3 10.1 3.9 11 5 11V17H7V11H9V17H11V11H13V17H15V11H17V17H19V11C20.1 11 21 10.1 21 9ZM7 19V21H17V19H7Z"/>
                          </svg>
                        </span>
                        <span style={{ 
                          letterSpacing: '-0.01em',
                          lineHeight: '1.4',
                          fontSize: '13px'
                        }}>
                          Kullanıcı Kayıtları
                        </span>
                      </div>
                    </MenuItem>

                    {/* Deney Türü Kayıtları */}
                    <MenuItem 
                      active={location.pathname === '/deney-turu-ekle'}
                      component={<Link to="/deney-turu-ekle" />}
                      style={{
                        margin: '3px 8px',
                        fontSize: '13px',
                        padding: '8px 12px'
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px',
                        paddingLeft: '8px'
                      }}>
                        <span style={{ 
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '16px',
                          height: '16px'
                        }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 11H7V9H9V11ZM13 11H11V9H13V11ZM17 11H15V9H17V11ZM19 3H18V1H16V3H8V1H6V3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19Z"/>
                          </svg>
                        </span>
                        <span style={{ 
                          letterSpacing: '-0.01em',
                          lineHeight: '1.4',
                          fontSize: '13px'
                        }}>
                          Deney Türü Kayıtları
                        </span>
                      </div>
                    </MenuItem>

                    {/* Makine Kayıtları */}
                    <MenuItem 
                      active={location.pathname === '/makine-ekle'}
                      component={<Link to="/makine-ekle" />}
                      style={{
                        margin: '3px 8px',
                        fontSize: '13px',
                        padding: '8px 12px'
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px',
                        paddingLeft: '8px'
                      }}>
                        <span style={{ 
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '16px',
                          height: '16px'
                        }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12,18.5C15.5,18.5 19.31,16.69 21.58,12C19.31,7.31 15.5,5.5 12,5.5C8.5,5.5 4.69,7.31 2.42,12C4.69,16.69 8,18.5 12,18.5M12,7C14.76,7 17,9.24 17,12C17,14.76 14.76,17 12,17C9.24,17 7,14.76 7,12C7,9.24 9.24,7 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z"/>
                          </svg>
                        </span>
                        <span style={{ 
                          letterSpacing: '-0.01em',
                          lineHeight: '1.4',
                          fontSize: '13px'
                        }}>
                          Makine Kayıtları
                        </span>
                      </div>
                    </MenuItem>

                    {/* Kalibrasyon Kuruluşları */}
                    <MenuItem 
                      active={location.pathname === '/kalibrasyon-kurulus-ekle'}
                      component={<Link to="/kalibrasyon-kurulus-ekle" />}
                      style={{
                        margin: '3px 8px',
                        fontSize: '13px',
                        padding: '8px 12px'
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px',
                        paddingLeft: '8px'
                      }}>
                        <span style={{ 
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '16px',
                          height: '16px'
                        }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12,2L2,7L12,12L22,7L12,2M17,13V18A1,1 0 0,1 16,19H8A1,1 0 0,1 7,18V13H5V18A3,3 0 0,0 8,21H16A3,3 0 0,0 19,18V13H17Z"/>
                          </svg>
                        </span>
                        <span style={{ 
                          letterSpacing: '-0.01em',
                          lineHeight: '1.4',
                          fontSize: '13px'
                        }}>
                          Kalibrasyon Kuruluşları
                        </span>
                      </div>
                    </MenuItem>
                  </div>
                )}
              </>
            )}

            {/* Çıkış Yap */}
            <MenuItem 
              onClick={handleLogout}
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
                    <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"/>
                  </svg>
                </span>
                {!collapsed && (
                  <span style={{ 
                    letterSpacing: '-0.01em',
                    lineHeight: '1.4'
                  }}>
                    Çıkış Yap
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