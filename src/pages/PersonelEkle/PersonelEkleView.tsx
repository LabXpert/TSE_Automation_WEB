import React from 'react';
import type { Personel } from '../../models/Personel';

interface PersonelEkleViewProps {
  formData: {
    ad: string;
    soyad: string;
    unvan: string;
  };
  errors: { [key: string]: string };
  personelListesi: Personel[];
  duzenlemeModu: boolean;
  handleInputChange: (field: string, value: string) => void;
  kaydet: () => void;
  personelDuzenle: (id: number) => void;
  personelSilmeOnayi: (id: number) => void;
  duzenlemeyiIptalEt: () => void;
}

const PersonelEkleView: React.FC<PersonelEkleViewProps> = ({
  formData,
  errors,
  personelListesi,
  duzenlemeModu,
  handleInputChange,
  kaydet,
  personelDuzenle,
  personelSilmeOnayi,
  duzenlemeyiIptalEt
}) => {

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
      {/* Header */}
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
          {duzenlemeModu ? 'Personel Bilgilerini Düzenle' : 'Yeni Personel Ekle'}
        </h1>
        <p style={{
          color: '#64748b',
          fontSize: '16px',
          margin: 0
        }}>
          {duzenlemeModu ? 'Mevcut personel bilgilerini güncelleyin' : 'Yeni personel bilgilerini girin'}
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
            <span>Mevcut personel düzenleniyor. Değişiklikleri kaydetmeyi unutmayın!</span>
          </div>
        )}
      </div>

      {/* Ana Layout */}
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
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          position: 'sticky',
          top: '32px'
        }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#0f172a',
              margin: '0 0 8px 0'
            }}>
              Personel Bilgileri
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#64748b',
              margin: '0'
            }}>
              Personel bilgilerini ekleyin veya güncelleyin
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '20px' }}>
              
              {/* Ad */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Ad *
                </label>
                <input
                  type="text"
                  value={formData.ad}
                  onChange={(e) => handleInputChange('ad', e.target.value)}
                  placeholder="Personel adını giriniz..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: errors.ad ? '2px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    if (!errors.ad) {
                      e.target.style.borderColor = '#dc2626';
                      e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.ad) {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                />
                {errors.ad && (
                  <p style={{
                    color: '#ef4444',
                    fontSize: '12px',
                    marginTop: '4px',
                    margin: '4px 0 0 0'
                  }}>
                    {errors.ad}
                  </p>
                )}
              </div>

              {/* Soyad */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Soyad *
                </label>
                <input
                  type="text"
                  value={formData.soyad}
                  onChange={(e) => handleInputChange('soyad', e.target.value)}
                  placeholder="Personel soyadını giriniz..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: errors.soyad ? '2px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    if (!errors.soyad) {
                      e.target.style.borderColor = '#dc2626';
                      e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.soyad) {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                />
                {errors.soyad && (
                  <p style={{
                    color: '#ef4444',
                    fontSize: '12px',
                    marginTop: '4px',
                    margin: '4px 0 0 0'
                  }}>
                    {errors.soyad}
                  </p>
                )}
              </div>

              {/* Ünvan */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Ünvan *
                </label>
                <input
                  type="text"
                  value={formData.unvan}
                  onChange={(e) => handleInputChange('unvan', e.target.value)}
                  placeholder="Personel ünvanını giriniz..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: errors.unvan ? '2px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    if (!errors.unvan) {
                      e.target.style.borderColor = '#dc2626';
                      e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.unvan) {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                />
                {errors.unvan && (
                  <p style={{
                    color: '#ef4444',
                    fontSize: '12px',
                    marginTop: '4px',
                    margin: '4px 0 0 0'
                  }}>
                    {errors.unvan}
                  </p>
                )}
              </div>

            </div>

            {/* Butonlar */}
            <div style={{
              marginTop: '32px',
              display: 'flex',
              justifyContent: 'center',
              gap: '16px'
            }}>
              <button
                type="submit"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 28px',
                  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(220, 38, 38, 0.3)';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                {duzenlemeModu ? 'Güncelle' : 'Kaydet'}
              </button>

              {duzenlemeModu && (
                <button
                  type="button"
                  onClick={duzenlemeyiIptalEt}
                  style={{
                    padding: '14px 28px',
                    background: '#ffffff',
                    color: '#6b7280',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#9ca3af';
                    e.currentTarget.style.color = '#374151';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.color = '#6b7280';
                  }}
                >
                  İptal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Sağ Panel - Personel Listesi */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{
            fontSize: '22px',
            fontWeight: '600',
            color: '#0f172a',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            Personel Listesi
            <span style={{
              fontSize: '14px',
              color: '#64748b',
              fontWeight: '400'
            }}>
              ({personelListesi.length} kayıt)
            </span>
          </h2>

          {personelListesi.length === 0 ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              color: '#64748b',
              fontSize: '16px'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '16px',
                color: '#94a3b8'
              }}>
                👥
              </div>
              <div style={{ fontSize: '18px', marginBottom: '8px', color: '#374151' }}>
                Henüz personel kaydı bulunmuyor
              </div>
              <div style={{ fontSize: '14px' }}>
                İlk personel kaydınızı oluşturmak için yukarıdaki formu kullanın
              </div>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: '12px',
              maxHeight: '500px',
              overflowY: 'auto'
            }}>
              {personelListesi.map((personel, index) => (
                <div
                  key={personel.id}
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '16px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#dc2626';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(220, 38, 38, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px'
                      }}>
                        <span style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '24px',
                          height: '24px',
                          backgroundColor: '#dc2626',
                          color: 'white',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {index + 1}
                        </span>
                        <h3 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#0f172a',
                          margin: 0
                        }}>
                          {personel.first_name} {personel.last_name}
                        </h3>
                      </div>
                      
                      <div style={{
                        fontSize: '14px',
                        color: '#64748b',
                        marginBottom: '4px'
                      }}>
                        <strong>Ünvan:</strong> {personel.title}
                      </div>
                      
                      <div style={{
                        fontSize: '12px',
                        color: '#9ca3af'
                      }}>
                        Kayıt Tarihi: {new Date(personel.created_at).toLocaleDateString('tr-TR')}
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <button
                        onClick={() => personelDuzenle(personel.id)}
                        style={{
                          padding: '6px 12px',
                          background: '#dc2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#b91c1c';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#dc2626';
                        }}
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => personelSilmeOnayi(personel.id)}
                        style={{
                          padding: '6px 12px',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#dc2626';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#ef4444';
                        }}
                      >
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
  );
};

export default PersonelEkleView;
