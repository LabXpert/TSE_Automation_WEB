// ...existing imports...
import React from 'react';
import type { User } from '../../models/User';

interface KullaniciEkleViewProps {
  formData: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    unvan: string;
    phone: string;
  };
  errors: { [key: string]: string };
  kullaniciListesi: User[];
  duzenlemeModu: boolean;
  handleInputChange: (field: string, value: string) => void;
  kaydet: () => void;
  kullaniciDuzenle: (id: number) => void;
  kullaniciSilmeOnayi: (id: number) => void;
  duzenlemeyiIptalEt: () => void;
}

const KullaniciEkleView: React.FC<KullaniciEkleViewProps> = ({
  formData,
  errors,
  kullaniciListesi,
  duzenlemeModu,
  handleInputChange,
  kaydet,
  kullaniciDuzenle,
  kullaniciSilmeOnayi,
  duzenlemeyiIptalEt
}) => {


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    kaydet();
  };

  const getRoleBadgeColor = (role: string) => {
    return role === 'admin' ? '#dc2626' : '#059669';
  };

  const getRoleText = (role: string) => {
    return role === 'admin' ? 'Admin' : 'Kullanıcı';
  };

  return (
    <div style={{ 
      padding: '32px', 
      fontFamily: 'inherit',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
    }}>
      {/* Page Header */}
      <div style={{ 
        marginBottom: '32px',
        borderBottom: '2px solid #dc2626',
        paddingBottom: '16px'
      }}>
        <h1 style={{ 
          fontSize: '32px',
          fontWeight: '700',
          color: '#0f172a',
          margin: '0 0 8px 0',
          letterSpacing: '-0.025em'
        }}>
          {duzenlemeModu ? 'Kullanıcı Bilgilerini Düzenle' : 'Yeni Kullanıcı Ekle'}
        </h1>
        <p style={{ 
          color: '#64748b',
          fontSize: '16px',
          margin: 0
        }}>
          {duzenlemeModu ? 'Mevcut kullanıcı bilgilerini güncelleyin' : 'Sisteme yeni kullanıcı ekleyin'}
        </p>
        
        {/* Düzenleme modu uyarısı */}
        {duzenlemeModu && (
          <div style={{
            marginTop: '16px',
            padding: '12px 16px',
            backgroundColor: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#92400e',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⚠️</span>
            <span><strong>Düzenleme Modu:</strong> Mevcut kullanıcı düzenleniyor. Değişiklikleri kaydetmeyi unutmayın!</span>
          </div>
        )}
      </div>

      {/* Ana Layout: Sol-Sağ Düzen */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: window.innerWidth > 1024 ? '600px 1fr' : '1fr',
        gap: '24px', 
        marginBottom: '32px',
        alignItems: 'start'
      }}>
        
        {/* Sol Panel - Form */}
        <div style={{
          width: '600px',
          height: '700px',
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          position: 'sticky',
          top: '32px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Başlık */}
          <div style={{ 
            marginBottom: '24px'
          }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: '#0f172a', 
              margin: '0 0 8px 0' 
            }}>
              Kullanıcı Bilgileri
            </h2>
            <p style={{ 
              fontSize: '14px', 
              color: '#64748b', 
              margin: '0' 
            }}>
              {duzenlemeModu ? 'Kullanıcı bilgilerini güncelleyin' : 'Yeni kullanıcı için gerekli bilgileri girin'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: 0,
            overflow: 'hidden'
          }}>
            <div style={{ 
              display: 'grid', 
              gap: '14px',
              flex: 1,
              overflowY: 'auto',
              paddingRight: '8px',
              paddingBottom: '16px',
              scrollbarWidth: 'thin',
              scrollbarColor: '#cbd5e1 #f1f5f9'
            }}
            className="form-scrollbar">
              <style>{`
                .form-scrollbar::-webkit-scrollbar {
                  width: 6px;
                }
                .form-scrollbar::-webkit-scrollbar-track {
                  background: #f1f5f9;
                  border-radius: 3px;
                }
                .form-scrollbar::-webkit-scrollbar-thumb {
                  background: #cbd5e1;
                  border-radius: 3px;
                }
                .form-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: #94a3b8;
                }
              `}</style>

              {/* Kullanıcı Adı */}
              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Kullanıcı Adı *
                </label>
                <input 
                  type="text" 
                  placeholder="Örn: john_doe"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    border: `2px solid ${errors.username ? '#dc2626' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: '#ffffff',
                    color: '#374151',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#dc2626';
                    e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.username ? '#dc2626' : '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {errors.username && (
                  <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Ad */}
              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Ad *
                </label>
                <input 
                  type="text" 
                  placeholder="Adınız"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    border: `2px solid ${errors.first_name ? '#dc2626' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: '#ffffff',
                    color: '#374151',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#dc2626';
                    e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.first_name ? '#dc2626' : '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {errors.first_name && (
                  <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                    {errors.first_name}
                  </p>
                )}
              </div>

              {/* Soyad */}
              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Soyad *
                </label>
                <input 
                  type="text" 
                  placeholder="Soyadınız"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    border: `2px solid ${errors.last_name ? '#dc2626' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: '#ffffff',
                    color: '#374151',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#dc2626';
                    e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.last_name ? '#dc2626' : '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {errors.last_name && (
                  <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                    {errors.last_name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Email Adresi *
                </label>
                <input 
                  type="email"
                  placeholder="ornek@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    border: errors.email ? '2px solid #dc2626' : '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: '#ffffff',
                    color: '#374151',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#dc2626';
                    e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.email ? '#dc2626' : '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {errors.email && (
                  <span style={{ color: '#dc2626', fontSize: '12px', fontWeight: '500' }}>
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Şifre */}
              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Şifre {duzenlemeModu ? '(değiştirmek için doldurun)' : '*'}
                </label>
                <input 
                  type="password" 
                  placeholder={duzenlemeModu ? "Yeni şifre (opsiyonel)" : "En az 6 karakter"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    border: `2px solid ${errors.password ? '#dc2626' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: '#ffffff',
                    color: '#374151',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#dc2626';
                    e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.password ? '#dc2626' : '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {errors.password && (
                  <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Rol */}
              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Rol *
                </label>
                <select 
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: '#ffffff',
                    color: '#374151',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#dc2626';
                    e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="user">Kullanıcı</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Ünvan */}
              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Ünvan
                </label>
                <input 
                  type="text" 
                  placeholder="Örn: Mühendis, Tekniker"
                  value={formData.unvan}
                  onChange={(e) => handleInputChange('unvan', e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: '#ffffff',
                    color: '#374151',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#dc2626';
                    e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Telefon */}
              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Telefon
                </label>
                <input 
                  type="tel" 
                  placeholder="0212 123 45 67"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: '#ffffff',
                    color: '#374151',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#dc2626';
                    e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Butonlar */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '16px',
              borderTop: '1px solid #e2e8f0',
              paddingTop: '16px',
              flexShrink: 0,
              backgroundColor: '#ffffff',
              marginTop: '8px'
            }}>
              {duzenlemeModu && (
                <button
                  type="button"
                  onClick={duzenlemeyiIptalEt}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(107, 114, 128, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(107, 114, 128, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(107, 114, 128, 0.3)';
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  İptal
                </button>
              )}
              <button
                type="submit"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(220, 38, 38, 0.2)';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 21H5C4.45 21 4 20.55 4 20V4C4 3.45 4.45 3 5 3H16L20 7V20C20 20.55 19.55 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 21V13H7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 3V8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {duzenlemeModu ? 'Güncelle' : 'Kullanıcı Ekle'}
              </button>
            </div>
          </form>
        </div>

        {/* Sağ Panel - Kullanıcı Listesi (Scroll) */}
        <div style={{
          height: '700px',
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingRight: '8px',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          background: 'white',
          minWidth: '0',
          display: 'flex',
          flexDirection: 'column',
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e1 #f1f5f9'
        }}
        className="custom-scrollbar">
          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f1f5f9;
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #cbd5e1;
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #94a3b8;
            }
          `}</style>
          
          <h2 style={{ 
            fontSize: '22px',
            fontWeight: '600',
            color: '#0f172a',
            marginBottom: '0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'white',
            padding: '20px 16px 16px 16px',
            borderRadius: '12px 12px 0 0',
            borderBottom: '1px solid #f1f5f9',
            flexShrink: 0
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
            </svg>
            Kayıtlı Kullanıcılar
            <span style={{ 
              fontSize: '14px',
              color: '#64748b',
              fontWeight: '400'
            }}>
              ({kullaniciListesi.length} kullanıcı)
            </span>
          </h2>
          
          <div style={{ 
            padding: '16px',
            flex: 1,
            overflowY: 'auto'
          }}>
            {kullaniciListesi.length === 0 ? (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                color: '#64748b',
                fontSize: '16px'
              }}>
                <div style={{ 
                  fontSize: '48px', 
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="#94a3b8">
                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
                  </svg>
                </div>
                <div>Henüz kullanıcı bulunmuyor</div>
                <div style={{ fontSize: '14px', marginTop: '8px' }}>
                  İlk kullanıcıyı eklemek için formu doldurun
                </div>
              </div>
            ) : (
              <div style={{ 
                display: 'grid',
                gap: '12px'
              }}>
                {kullaniciListesi.slice().reverse().map((kullanici, index) => (
                  <div key={kullanici.id} style={{
                    marginBottom: '16px',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '16px',
                    transition: 'all 0.2s ease',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: '16px',
                      alignItems: 'start'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px'
                      }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: '600',
                          flexShrink: 0
                        }}>
                          {index + 1}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '4px'
                          }}>
                            <h4 style={{ 
                              margin: 0, 
                              color: '#0f172a',
                              fontSize: '14px',
                              fontWeight: '600',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {kullanici.username}
                            </h4>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '10px',
                              fontWeight: '600',
                              color: 'white',
                              backgroundColor: getRoleBadgeColor(kullanici.role)
                            }}>
                              {getRoleText(kullanici.role)}
                            </span>
                          </div>
                          <div style={{ 
                            fontSize: '12px',
                            color: '#0f172a',
                            marginBottom: '4px',
                            fontWeight: '500'
                          }}>
                            {kullanici.first_name} {kullanici.last_name}
                          </div>
                          <div style={{ 
                            fontSize: '12px',
                            color: '#64748b',
                            marginBottom: '8px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            📧 {kullanici.email}
                          </div>
                          {kullanici.unvan && (
                            <div style={{ 
                              fontSize: '12px',
                              color: '#64748b',
                              marginBottom: '4px'
                            }}>
                              🎯 {kullanici.unvan}
                            </div>
                          )}
                          {kullanici.phone && (
                            <div style={{ 
                              fontSize: '12px',
                              color: '#64748b'
                            }}>
                              📞 {kullanici.phone}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => kullaniciDuzenle(kullanici.id)}
                          style={{
                            padding: '8px 12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#b91c1c';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#dc2626';
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px', verticalAlign: 'middle' }}>
                            <path d="M14.06 9L15 9.94L5.92 19H5V18.08L14.06 9ZM17.66 3C17.41 3 17.15 3.1 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C18.17 3.09 17.92 3 17.66 3ZM14.06 6.19L3 17.25V21H6.75L17.81 9.94L14.06 6.19Z"/>
                          </svg>
                          Düzenle
                        </button>
                        <button 
                          onClick={() => kullaniciSilmeOnayi(kullanici.id)}
                          style={{
                            padding: '8px 12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#dc2626';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#ef4444';
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px', verticalAlign: 'middle' }}>
                            <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z"/>
                          </svg>
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KullaniciEkleView;
