// ...existing imports...
import React from 'react';
import type { DeneyTuru } from '../../models/DeneyTurleri';

interface DeneyTuruEkleViewProps {
  formData: {
    name: string;
    base_price: string;
  };
  errors: { [key: string]: string };
  deneyTurleriListesi: DeneyTuru[];
  duzenlemeModu: boolean;
  handleInputChange: (field: string, value: string) => void;
  kaydet: () => void;
  deneyTuruDuzenle: (id: number) => void;
  deneyTuruSilmeOnayi: (id: number) => void;
  duzenlemeyiIptalEt: () => void;
}

const DeneyTuruEkleView: React.FC<DeneyTuruEkleViewProps> = ({
  formData,
  errors,
  deneyTurleriListesi,
  duzenlemeModu,
  handleInputChange,
  kaydet,
  deneyTuruDuzenle,
  deneyTuruSilmeOnayi,
  duzenlemeyiIptalEt
}) => {


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    kaydet();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2
    }).format(price);
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
          {duzenlemeModu ? 'Deney Türü Bilgilerini Düzenle' : 'Yeni Deney Türü Ekle'}
        </h1>
        <p style={{ 
          color: '#64748b',
          fontSize: '16px',
          margin: 0
        }}>
          {duzenlemeModu ? 'Mevcut deney türü bilgilerini güncelleyin' : 'Sisteme yeni deney türü ekleyin'}
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
            <span><strong>Düzenleme Modu:</strong> Mevcut deney türü düzenleniyor. Değişiklikleri kaydetmeyi unutmayın!</span>
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
          height: '500px',
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
              Deney Türü Bilgileri
            </h2>
            <p style={{ 
              fontSize: '14px', 
              color: '#64748b', 
              margin: '0' 
            }}>
              {duzenlemeModu ? 'Deney türü bilgilerini güncelleyin' : 'Yeni deney türü için gerekli bilgileri girin'}
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
              gap: '20px',
              flex: 1,
              overflowY: 'auto',
              paddingRight: '8px',
              paddingBottom: '16px'
            }}>
              {/* Deney Türü Adı */}
              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Deney Türü Adı *
                </label>
                <input 
                  type="text" 
                  placeholder="Örn: Çekme Deneyi, Sertlik Testi"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    border: `2px solid ${errors.name ? '#dc2626' : '#e5e7eb'}`,
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

              {/* Temel Fiyat */}
              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Temel Fiyat (TL) *
                </label>
                <input 
                  type="number" 
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={formData.base_price}
                  onChange={(e) => handleInputChange('base_price', e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    border: `2px solid ${errors.base_price ? '#dc2626' : '#e5e7eb'}`,
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
                    e.target.style.borderColor = errors.base_price ? '#dc2626' : '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {errors.base_price && (
                  <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                    {errors.base_price}
                  </p>
                )}
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
                {duzenlemeModu ? 'Güncelle' : 'Deney Türü Ekle'}
              </button>
            </div>
          </form>
        </div>

        {/* Sağ Panel - Deney Türleri Listesi (Scroll) */}
        <div style={{
          height: '500px',
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
              <path d="M9 2V4H7C5.9 4 5 4.9 5 6V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V6C19 4.9 18.1 4 17 4H15V2H9ZM17 6V18H7V6H17ZM12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15Z"/>
            </svg>
            Kayıtlı Deney Türleri
            <span style={{ 
              fontSize: '14px',
              color: '#64748b',
              fontWeight: '400'
            }}>
              ({deneyTurleriListesi.length} tür)
            </span>
          </h2>
          
          <div style={{ 
            padding: '16px',
            flex: 1,
            overflowY: 'auto'
          }}>
            {deneyTurleriListesi.length === 0 ? (
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
                    <path d="M9 2V4H7C5.9 4 5 4.9 5 6V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V6C19 4.9 18.1 4 17 4H15V2H9ZM17 6V18H7V6H17ZM12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15Z"/>
                  </svg>
                </div>
                <div>Henüz deney türü bulunmuyor</div>
                <div style={{ fontSize: '14px', marginTop: '8px' }}>
                  İlk deney türünü eklemek için formu doldurun
                </div>
              </div>
            ) : (
              <div style={{ 
                display: 'grid',
                gap: '12px'
              }}>
                {deneyTurleriListesi.slice().reverse().map((deneyTuru, index) => (
                  <div key={deneyTuru.id} style={{
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
                            marginBottom: '8px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {deneyTuru.name}
                          </h4>
                          <div style={{ 
                            fontSize: '12px',
                            color: '#64748b',
                            marginBottom: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <span style={{ fontWeight: '500' }}>💰 Temel Fiyat:</span>
                            <span style={{ 
                              color: '#059669', 
                              fontWeight: '600'
                            }}>
                              {formatPrice(deneyTuru.base_price || 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => deneyTuruDuzenle(deneyTuru.id)}
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
                          onClick={() => deneyTuruSilmeOnayi(deneyTuru.id)}
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

export default DeneyTuruEkleView;
