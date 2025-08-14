import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Company } from '../../../../backend/services/apiService';

interface FirmaEkleViewProps {
  // State'ler
  formData: {
    name: string;
    tax_no: string;
    contact_name: string;
    phone: string;
    address: string;
    email: string;
  };
  errors: {[key: string]: string};
  firmaListesi: Company[];
  duzenlemeModu: boolean;
  loading: boolean;
  
  // Fonksiyonlar
  handleInputChange: (field: string, value: string) => void;
  kaydet: () => void;
  firmaDuzenle: (id: string) => void;
  firmaSilmeOnayi: (id: string) => void;
  duzenlemeyiIptalEt: () => void;
}

const FirmaEkleView: React.FC<FirmaEkleViewProps> = ({
  formData,
  errors,
  firmaListesi,
  duzenlemeModu,
  loading,
  handleInputChange,
  kaydet,
  firmaDuzenle,
  firmaSilmeOnayi,
  duzenlemeyiIptalEt
}) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    if (duzenlemeModu) {
      duzenlemeyiIptalEt();
    } else {
      navigate('/deney-ekle');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    kaydet();
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
          {duzenlemeModu ? 'Firma Bilgilerini Düzenle' : 'Yeni Firma Ekle'}
        </h1>
        <p style={{ 
          color: '#64748b',
          fontSize: '16px',
          margin: 0
        }}>
          {duzenlemeModu ? 'Mevcut firma bilgilerini güncelleyin' : 'Sisteme yeni firma bilgilerini ekleyin'}
        </p>
        
        {/* Loading Indicator */}
        {loading && (
          <div style={{
            marginTop: '16px',
            padding: '12px 16px',
            backgroundColor: '#dbeafe',
            border: '1px solid #3b82f6',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#1d4ed8',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⏳</span>
            <span>İşlem yapılıyor...</span>
          </div>
        )}
        
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
            <span><strong>Düzenleme Modu:</strong> Mevcut firma düzenleniyor. Değişiklikleri kaydetmeyi unutmayın!</span>
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
          height: '600px',
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
              Firma Bilgileri
            </h2>
            <p style={{ 
              fontSize: '14px', 
              color: '#64748b', 
              margin: '0' 
            }}>
              {duzenlemeModu ? 'Firma bilgilerini güncelleyin' : 'Yeni firma için gerekli bilgileri girin'}
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

              {/* Firma Adı */}
              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Firma Adı *
                </label>
                <input 
                  type="text" 
                  placeholder="Örn: ABC Makina San. Tic. Ltd. Şti."
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={loading}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    border: `2px solid ${errors.name ? '#dc2626' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: loading ? '#f9fafb' : '#ffffff',
                    color: '#374151',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    if (!loading) {
                      e.target.style.borderColor = '#dc2626';
                      e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.name ? '#dc2626' : '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {errors.name && (
                  <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Vergi No */}
              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Vergi Numarası *
                </label>
                <input 
                  type="text" 
                  placeholder="10 haneli vergi numarası"
                  value={formData.tax_no}
                  onChange={(e) => handleInputChange('tax_no', e.target.value)}
                  disabled={loading}
                  maxLength={10}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    border: `2px solid ${errors.tax_no ? '#dc2626' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: loading ? '#f9fafb' : '#ffffff',
                    color: '#374151',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    if (!loading) {
                      e.target.style.borderColor = '#dc2626';
                      e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.tax_no ? '#dc2626' : '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {errors.tax_no && (
                  <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                    {errors.tax_no}
                  </p>
                )}
              </div>

              {/* Yetkili İsmi */}
              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Yetkili Kişi *
                </label>
                <input 
                  type="text" 
                  placeholder="Yetkili kişinin adı soyadı"
                  value={formData.contact_name}
                  onChange={(e) => handleInputChange('contact_name', e.target.value)}
                  disabled={loading}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    border: `2px solid ${errors.contact_name ? '#dc2626' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: loading ? '#f9fafb' : '#ffffff',
                    color: '#374151',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    if (!loading) {
                      e.target.style.borderColor = '#dc2626';
                      e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.contact_name ? '#dc2626' : '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {errors.contact_name && (
                  <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                    {errors.contact_name}
                  </p>
                )}
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
                  Telefon *
                </label>
                <input 
                  type="tel" 
                  placeholder="0212 123 45 67"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={loading}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    border: `2px solid ${errors.phone ? '#dc2626' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: loading ? '#f9fafb' : '#ffffff',
                    color: '#374151',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    if (!loading) {
                      e.target.style.borderColor = '#dc2626';
                      e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.phone ? '#dc2626' : '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {errors.phone && (
                  <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                    {errors.phone}
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
                  placeholder="info@firma.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={loading}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    border: errors.email ? '2px solid #dc2626' : '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: loading ? '#f9fafb' : '#ffffff',
                    color: '#374151',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    if (!loading) {
                      e.target.style.borderColor = '#dc2626';
                      e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                    }
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

              {/* Adres */}
              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Adres
                </label>
                <textarea 
                  placeholder="Firma adresi"
                  rows={2}
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={loading}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: loading ? '#f9fafb' : '#ffffff',
                    color: '#374151',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box',
                    resize: 'none',
                    fontFamily: 'inherit',
                    height: '60px'
                  }}
                  onFocus={(e) => {
                    if (!loading) {
                      e.target.style.borderColor = '#dc2626';
                      e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                    }
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
                  disabled={loading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: loading ? '#9ca3af' : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(107, 114, 128, 0.3)'
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
                type="button"
                onClick={handleCancel}
                disabled={loading}
                style={{
                  display: duzenlemeModu ? 'none' : 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: loading ? '#f3f4f6' : '#f8fafc',
                  color: loading ? '#9ca3af' : '#374151',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                İptal
              </button>

              <button
                type="submit"
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: loading ? '#9ca3af' : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(220, 38, 38, 0.2)';
                  }
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 21H5C4.45 21 4 20.55 4 20V4C4 3.45 4.45 3 5 3H16L20 7V20C20 20.55 19.55 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 21V13H7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 3V8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {loading ? 'Kaydediliyor...' : (duzenlemeModu ? 'Güncelle' : 'Firma Ekle')}
              </button>
            </div>
          </form>
        </div>

        {/* Sağ Panel - Firma Listesi (Scroll) */}
        <div style={{
          height: '600px',
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
              <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
              <path d="M2 17L12 22L22 17"/>
              <path d="M2 12L12 17L22 12"/>
            </svg>
            Sistemdeki Firmalar
            <span style={{ 
              fontSize: '14px',
              color: '#64748b',
              fontWeight: '400'
            }}>
              ({firmaListesi.length} firma)
            </span>
          </h2>
          
          <div style={{ 
            padding: '16px',
            flex: 1,
            overflowY: 'auto'
          }}>
            {loading ? (
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
                  ⏳
                </div>
                <div>Firmalar yükleniyor...</div>
              </div>
            ) : firmaListesi.length === 0 ? (
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
                    <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                    <path d="M2 17L12 22L22 17"/>
                    <path d="M2 12L12 17L22 12"/>
                  </svg>
                </div>
                <div>Henüz firma bulunmuyor</div>
                <div style={{ fontSize: '14px', marginTop: '8px' }}>
                  İlk firmayı eklemek için formu doldurun
                </div>
              </div>
            ) : (
              <div style={{ 
                display: 'grid',
                gap: '12px'
              }}>
                {firmaListesi.slice().reverse().map((firma) => (
                  <div key={firma.id} style={{
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
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                            <path d="M2 17L12 22L22 17"/>
                            <path d="M2 12L12 17L22 12"/>
                          </svg>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{ 
                            margin: 0, 
                            color: '#0f172a',
                            fontSize: '14px',
                            fontWeight: '600',
                            marginBottom: '4px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {firma.name}
                          </h4>
                          <div style={{ 
                            fontSize: '12px',
                            color: '#64748b',
                            marginBottom: '8px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {firma.email}
                          </div>
                          {firma.phone && (
                            <div style={{ 
                              fontSize: '12px',
                              color: '#64748b',
                              marginBottom: '4px'
                            }}>
                              📞 {firma.phone}
                            </div>
                          )}
                          {firma.address && (
                            <div style={{ 
                              fontSize: '12px',
                              color: '#64748b',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              📍 {firma.address}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => firmaDuzenle(firma.id)}
                          disabled={loading}
                          style={{
                            padding: '8px 12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            backgroundColor: loading ? '#9ca3af' : '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => {
                            if (!loading) {
                              e.currentTarget.style.backgroundColor = '#b91c1c';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (!loading) {
                              e.currentTarget.style.backgroundColor = '#dc2626';
                            }
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px', verticalAlign: 'middle' }}>
                            <path d="M14.06 9L15 9.94L5.92 19H5V18.08L14.06 9ZM17.66 3C17.41 3 17.15 3.1 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C18.17 3.09 17.92 3 17.66 3ZM14.06 6.19L3 17.25V21H6.75L17.81 9.94L14.06 6.19Z"/>
                          </svg>
                          Düzenle
                        </button>
                        <button 
                          onClick={() => firmaSilmeOnayi(firma.id)}
                          disabled={loading}
                          style={{
                            padding: '8px 12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            backgroundColor: loading ? '#9ca3af' : '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => {
                            if (!loading) {
                              e.currentTarget.style.backgroundColor = '#dc2626';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (!loading) {
                              e.currentTarget.style.backgroundColor = '#ef4444';
                            }
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

export default FirmaEkleView;