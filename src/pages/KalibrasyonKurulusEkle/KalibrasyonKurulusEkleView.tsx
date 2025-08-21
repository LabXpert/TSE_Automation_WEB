import React from 'react';
import type { KalibrasyonKurulusu } from '../../models/Makine';

interface KalibrasyonKurulusInput {
  org_name: string;
  contact_name?: string;
  phone?: string;
  email?: string;
}

interface KalibrasyonKurulusEkleViewProps {
  kuruluslar: KalibrasyonKurulusu[];
  formData: KalibrasyonKurulusInput;
  loading: boolean;
  error: string;
  success: string;
  editingKuruluş: KalibrasyonKurulusu | null;
  searchTerm: string;
  currentPage: number;
  totalPages: number;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (field: keyof KalibrasyonKurulusInput, value: string) => void;
  onEdit: (kuruluş: KalibrasyonKurulusu) => void;
  onDelete: (id: number) => void;
  onSearch: () => void;
  onSearchTermChange: (term: string) => void;
  onPageChange: (page: number) => void;
  onReset: () => void;
}

const KalibrasyonKurulusEkleView: React.FC<KalibrasyonKurulusEkleViewProps> = ({
  kuruluslar,
  formData,
  loading,
  error,
  success,
  editingKuruluş,
  searchTerm,
  currentPage,
  totalPages,
  onSubmit,
  onInputChange,
  onEdit,
  onDelete,
  onSearch,
  onSearchTermChange,
  onPageChange,
  onReset
}) => {
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
          {editingKuruluş ? 'Kalibrasyon Kuruluşu Düzenle' : 'Yeni Kalibrasyon Kuruluşu Ekle'}
        </h1>
        <p style={{
          color: '#64748b',
          fontSize: '16px',
          margin: 0
        }}>
          {editingKuruluş ? 'Mevcut kuruluş bilgilerini güncelleyin' : 'Kalibrasyon hizmeti veren kuruluş bilgilerini girin'}
        </p>

        {/* Düzenleme modu uyarısı */}
        {editingKuruluş && (
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
            <span>Mevcut kuruluş düzenleniyor. Değişiklikleri kaydetmeyi unutmayın!</span>
          </div>
        )}
      </div>

      {/* Alert Messages */}
      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '24px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          backgroundColor: '#d1fae5',
          border: '1px solid #a7f3d0',
          color: '#065f46',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '24px',
          fontSize: '14px'
        }}>
          {success}
        </div>
      )}

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
          height: '600px',
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          position: 'sticky',
          top: '32px'
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
              Kalibrasyon Kuruluşu Bilgileri
            </h2>
            <p style={{ 
              fontSize: '14px', 
              color: '#64748b', 
              margin: '0' 
            }}>
              {editingKuruluş ? 'Kuruluş bilgilerini güncelleyin' : 'Yeni kalibrasyon kuruluşu için gerekli bilgileri girin'}
            </p>
          </div>

          <form onSubmit={onSubmit} style={{ 
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

              {/* Kuruluş Adı */}
              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Kuruluş Adı <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Örn: TSE Kalibrasyon Laboratuvarı"
                  value={formData.org_name}
                  onChange={(e) => onInputChange('org_name', e.target.value)}
                  required
                  disabled={loading}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    border: `2px solid #e5e7eb`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: loading ? '#f9fafb' : '#ffffff',
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

              {/* İletişim Kişisi */}
              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  İletişim Kişisi *
                </label>
                <input
                  type="text"
                  placeholder="Örn: Ali Veli"
                  value={formData.contact_name || ''}
                  onChange={(e) => onInputChange('contact_name', e.target.value)}
                  required
                  disabled={loading}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    border: `2px solid #e5e7eb`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: loading ? '#f9fafb' : '#ffffff',
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
                  Telefon *
                </label>
                <input
                  type="tel"
                  placeholder="Örn: +90 312 XXX XX XX"
                  value={formData.phone || ''}
                  onChange={(e) => onInputChange('phone', e.target.value)}
                  required
                  disabled={loading}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    border: `2px solid #e5e7eb`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: loading ? '#f9fafb' : '#ffffff',
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

              {/* E-posta */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  E-posta
                </label>
                <input
                  type="email"
                  placeholder="Örn: info@example.com"
                  value={formData.email || ''}
                  onChange={(e) => onInputChange('email', e.target.value)}
                  disabled={loading}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    border: `2px solid #e5e7eb`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: loading ? '#f9fafb' : '#ffffff',
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

            {/* Buttons */}
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
              {editingKuruluş && (
                <button
                  type="button"
                  onClick={onReset}
                  disabled={loading}
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
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(107, 114, 128, 0.3)',
                    opacity: loading ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(107, 114, 128, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(107, 114, 128, 0.3)';
                    }
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
                disabled={loading}
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
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)',
                  opacity: loading ? 0.7 : 1
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
                {loading ? 'Kaydediliyor...' : editingKuruluş ? 'Güncelle' : 'Kaydet'}
              </button>
            </div>
          </form>
        </div>

        {/* Sağ Panel - Liste */}
        <div style={{
          height: '600px',
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          overflowY: 'auto'
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
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Kalibrasyon Kuruluşları
            <span style={{
              fontSize: '14px',
              color: '#64748b',
              fontWeight: '400'
            }}>
              ({kuruluslar.length} kayıt)
            </span>
          </h2>

          {/* Search Box */}
          <div style={{
            marginBottom: '20px',
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              position: 'relative',
              width: '100%'
            }}>
              <input
                type="text"
                placeholder="Kuruluş ara (ad, iletişim kişi, telefon, email...)"
                value={searchTerm}
                onChange={(e) => {
                  onSearchTermChange(e.target.value);
                  onSearch();
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 48px',
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
              <svg
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '16px',
                  height: '16px',
                  color: '#9ca3af'
                }}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {kuruluslar.length === 0 ? (
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
              </div>
              <div style={{ fontSize: '18px', marginBottom: '8px', color: '#374151' }}>
                Henüz kalibrasyon kuruluşu kaydı bulunmuyor
              </div>
              <div style={{ fontSize: '14px' }}>
                İlk kuruluş kaydınızı oluşturmak için yukarıdaki formu kullanın
              </div>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: '12px',
              maxHeight: '500px',
              overflowY: 'auto'
            }}>
              {kuruluslar.map((kuruluş, index) => (
                <div
                  key={kuruluş.id}
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
                          {kuruluş.org_name}
                        </h3>
                        <span style={{
                          backgroundColor: '#10b981',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '500'
                        }}>
                          Aktif
                        </span>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '12px',
                        marginTop: '12px'
                      }}>
                        {kuruluş.contact_name && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <span style={{
                              fontSize: '12px',
                              color: '#64748b',
                              fontWeight: '500'
                            }}>
                              İletişim Kişisi:
                            </span>
                            <span style={{
                              fontSize: '14px',
                              color: '#1e293b',
                              fontWeight: '500'
                            }}>
                              {kuruluş.contact_name}
                            </span>
                          </div>
                        )}

                        {kuruluş.phone && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <span style={{
                              fontSize: '12px',
                              color: '#64748b',
                              fontWeight: '500'
                            }}>
                              Telefon:
                            </span>
                            <span style={{
                              fontSize: '14px',
                              color: '#1e293b',
                              fontWeight: '500'
                            }}>
                              {kuruluş.phone}
                            </span>
                          </div>
                        )}

                        {kuruluş.email && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <span style={{
                              fontSize: '12px',
                              color: '#64748b',
                              fontWeight: '500'
                            }}>
                              E-posta:
                            </span>
                            <span style={{
                              fontSize: '14px',
                              color: '#1e293b',
                              fontWeight: '500'
                            }}>
                              {kuruluş.email}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}>
                      <button
                        onClick={() => onEdit(kuruluş)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#2563eb';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#3b82f6';
                        }}
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => onDelete(kuruluş.id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'center',
              gap: '8px'
            }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    backgroundColor: page === currentPage ? '#dc2626' : 'white',
                    color: page === currentPage ? 'white' : '#374151',
                    borderRadius: '4px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KalibrasyonKurulusEkleView;
