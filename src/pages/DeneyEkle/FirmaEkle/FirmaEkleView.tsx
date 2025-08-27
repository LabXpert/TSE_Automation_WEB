// ...existing imports...
import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Firma } from '../../../models/Firma';

interface FirmaEkleViewProps {
  formData: {
    ad: string;
    vergiNo: string;
    yetkili: string;
    telefon: string;
    adres: string;
    email: string;
  };
  errors: { [key: string]: string };
  firmaListesi: Firma[];
  duzenlemeModu: boolean;
  handleInputChange: (field: string, value: string) => void;
  kaydet: () => void;
  firmaDuzenle: (id: number) => void;
  firmaSilmeOnayi: (id: number) => void;
  duzenlemeyiIptalEt: () => void;
}

const FirmaEkleView: React.FC<FirmaEkleViewProps> = ({
  formData,
  errors,
  firmaListesi,
  duzenlemeModu,
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
                  value={formData.ad}
                  onChange={(e) => handleInputChange('ad', e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    border: `2px solid ${errors.ad ? '#dc2626' : '#e5e7eb'}`,
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
                    e.target.style.borderColor = errors.ad ? '#dc2626' : '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {errors.ad && (
                  <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                    {errors.ad}
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
                  value={formData.vergiNo}
                  onChange={(e) => handleInputChange('vergiNo', e.target.value)}
                  maxLength={10}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    border: `2px solid ${errors.vergiNo ? '#dc2626' : '#e5e7eb'}`,
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
                    e.target.style.borderColor = errors.vergiNo ? '#dc2626' : '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {errors.vergiNo && (
                  <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                    {errors.vergiNo}
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
                  value={formData.yetkili}
                  onChange={(e) => handleInputChange('yetkili', e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    border: `2px solid ${errors.yetkili ? '#dc2626' : '#e5e7eb'}`,
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
                    e.target.style.borderColor = errors.yetkili ? '#dc2626' : '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {errors.yetkili && (
                  <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                    {errors.yetkili}
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
                  value={formData.telefon}
                  onChange={(e) => handleInputChange('telefon', e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    border: `2px solid ${errors.telefon ? '#dc2626' : '#e5e7eb'}`,
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
                    e.target.style.borderColor = errors.telefon ? '#dc2626' : '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {errors.telefon && (
                  <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                    {errors.telefon}
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

              {/* Adres */}
              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Adres *
                </label>
                <textarea 
                  placeholder="Firma adresi"
                  rows={2}
                  value={formData.adres}
                  onChange={(e) => handleInputChange('adres', e.target.value)}
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
                    boxSizing: 'border-box',
                    resize: 'none',
                    fontFamily: 'inherit',
                    height: '60px'
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
                type="button"
                onClick={handleCancel}
                style={{
                  display: duzenlemeModu ? 'none' : 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: '#f8fafc',
                  color: '#374151',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f1f5f9';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                İptal
              </button>

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
                {duzenlemeModu ? 'Güncelle' : 'Firma Ekle'}
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
            Son Eklenen Firmalar
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
            {firmaListesi.length === 0 ? (
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
                {firmaListesi.slice().reverse().map((firma, index) => (
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
                          {index + 1}
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
                              Tel: {firma.phone}
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
                              Adres: {firma.address}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => firmaDuzenle(firma.id)}
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
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 4H4C3.45 4 3 4.45 3 5V20C3 20.55 3.45 21 4 21H19C19.55 21 20 20.55 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18.5 2.5C18.89 2.11 19.39 1.89 19.93 1.89C20.47 1.89 20.97 2.11 21.36 2.5C21.75 2.89 21.97 3.39 21.97 3.93C21.97 4.47 21.75 4.97 21.36 5.36L12 14.83L8 16L9.17 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        </button>
                        <button 
                          onClick={() => firmaSilmeOnayi(firma.id)}
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
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M19 6V20C19 20.55 18.55 21 18 21H6C5.45 21 5 20.55 5 20V6M8 6V4C8 3.45 8.45 3 9 3H15C15.55 3 16 3.45 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
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