import React from 'react';
import type { Makine, MakineInput, KalibrasyonKurulusu } from '../../models/Makine';

interface MakineEkleViewProps {
  makineler: Makine[];
  kalibrasyonKuruluslari: KalibrasyonKurulusu[];
  formData: MakineInput;
  loading: boolean;
  error: string;
  success: string;
  editingMakine: Makine | null;
  searchTerm: string;
  currentPage: number;
  totalPages: number;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (field: keyof MakineInput, value: any) => void;
  onEdit: (makine: Makine) => void;
  onDelete: (id: number) => void;
  onSearch: () => void;
  onSearchTermChange: (term: string) => void;
  onPageChange: (page: number) => void;
  onReset: () => void;
}

const MakineEkleView: React.FC<MakineEkleViewProps> = ({
  makineler,
  kalibrasyonKuruluslari,
  formData,
  loading,
  error,
  success,
  editingMakine,
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
          {editingMakine ? 'Makine Bilgilerini Düzenle' : 'Yeni Makine Kaydı'}
        </h1>
        <p style={{
          color: '#64748b',
          fontSize: '16px',
          margin: 0
        }}>
          {editingMakine ? 'Mevcut makine bilgilerini güncelleyin' : 'Laboratuvar makinesi ve kalibrasyon bilgilerini girin'}
        </p>

        {/* Düzenleme modu uyarısı */}
        {editingMakine && (
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
            <span>Mevcut makine düzenleniyor. Değişiklikleri kaydetmeyi unutmayın!</span>
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
          backgroundColor: '#dcfce7',
          border: '1px solid #bbf7d0',
          color: '#166534',
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
              Makine Bilgileri
            </h2>
            <p style={{ 
              fontSize: '14px', 
              color: '#64748b', 
              margin: '0' 
            }}>
              {editingMakine ? 'Makine bilgilerini güncelleyin' : 'Yeni makine için gerekli bilgileri girin'}
            </p>
          </div>

          <form id="makineForm" onSubmit={onSubmit} style={{ 
            display: 'flex', 
            flexDirection: 'column',
            height: 'calc(100% - 160px)'
          }}>
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              paddingRight: '8px',
              overflowY: 'auto',
              maxHeight: '400px'
            }}>

              {/* Ekipman Adı */}
              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Ekipman Adı <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Örn: Spektrometre"
                  value={formData.equipment_name}
                  onChange={(e) => onInputChange('equipment_name', e.target.value)}
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

              {/* Seri No */}
              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Seri Numarası <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Örn: TSE-001-2024"
                  value={formData.serial_no}
                  onChange={(e) => onInputChange('serial_no', e.target.value)}
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

              {/* Model */}
              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Model
                </label>
                <input
                  type="text"
                  placeholder="Örn: XRF-2024"
                  value={formData.model}
                  onChange={(e) => onInputChange('model', e.target.value)}
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

              {/* Marka */}
              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Marka
                </label>
                <input
                  type="text"
                  placeholder="Örn: Shimadzu"
                  value={formData.brand}
                  onChange={(e) => onInputChange('brand', e.target.value)}
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

              {/* Ölçüm Aralığı */}
              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Ölçüm Aralığı
                </label>
                <input
                  type="text"
                  placeholder="Örn: 0-100 kg, 200-800 nm"
                  value={formData.measurement_range}
                  onChange={(e) => onInputChange('measurement_range', e.target.value)}
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

              {/* Kalibrasyon Kuruluşu */}
              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Kalibrasyon Kuruluşu <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  value={formData.calibration_org_id}
                  onChange={(e) => onInputChange('calibration_org_id', parseInt(e.target.value))}
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
                >
                  <option value="">Kalibrasyon kuruluşu seçin</option>
                  {kalibrasyonKuruluslari.map((kuruluş) => (
                    <option key={kuruluş.id} value={kuruluş.id}>
                      {kuruluş.org_name}
                    </option>
                  ))}
                </select>
              </div>
{/* Kalibrasyon Aralığı */}
              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Kalibrasyon Aralığı (Yıl) <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="Kaç yılda bir kalibre edilecek"
                  value={formData.calibration_interval}
                  onChange={(e) => onInputChange('calibration_interval', parseInt(e.target.value) || 1)}
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
                <div style={{
                  fontSize: '12px',
                  color: '#64748b',
                  marginTop: '4px'
                }}>
                  Bu makinenin kaç yılda bir kalibre edileceğini belirtin (1-10 yıl arası)
                </div>
              </div>
              
              {/* Son Kalibrasyon Tarihi */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Son Kalibrasyon Tarihi <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="date"
                  value={typeof formData.last_calibration_date === 'string' 
                    ? formData.last_calibration_date 
                    : formData.last_calibration_date instanceof Date 
                      ? formData.last_calibration_date.toISOString().split('T')[0]
                      : ''}
                  onChange={(e) => onInputChange('last_calibration_date', e.target.value)}
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

            </div>
          </form>

          {/* Butonlar - Form Dışında Sabit */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '16px',
            borderTop: '1px solid #e2e8f0',
            paddingTop: '16px',
            backgroundColor: '#ffffff',
            marginTop: '16px'
          }}>
            {editingMakine && (
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
              form="makineForm"
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
              {loading ? 'Kaydediliyor...' : editingMakine ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </div>

        {/* Sağ Panel - Makine Listesi */}
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
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M4 22h16V10l-4 2V6l-4 2V2H4v20zM2 22h20v2H2v-2z" />
              </svg>
              Kayıtlı Makineler ({makineler.length} kayıt)
            </h2>


          {/* Arama Alanı */}
          <div style={{
            marginBottom: '20px',
            position: 'relative'
          }}>
            <input
              type="text"
              placeholder="Makine adı, seri no veya model ile ara..."
              value={searchTerm}
              onChange={(e) => {
                onSearchTermChange(e.target.value);
                onSearch();
              }}
              style={{
                width: '100%',
                padding: '12px 16px 12px 40px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#dc2626';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
              }}
            />
            <div style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
              pointerEvents: 'none'
            }}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
          </div>

          {makineler.length === 0 ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              color: '#64748b',
              fontSize: '16px'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '16px',
                color: '#94a3b8',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 6L13 7H9L7 6L1 7V9L7 8V18H9V12H15V18H17V8L21 9Z"/>
                  <path d="M19.36 2.72L20.78 4.14L15.06 9.85C16.13 11.39 16.28 13.24 15.38 14.44L9.06 8.12C10.26 7.22 12.11 7.37 13.65 8.44L19.36 2.72Z"/>
                </svg>
              </div>
              <div style={{ fontSize: '18px', marginBottom: '8px', color: '#374151' }}>
                Henüz makine kaydı bulunmuyor
              </div>
              <div style={{ fontSize: '14px' }}>
                İlk makine kaydınızı oluşturmak için soldaki formu kullanın
              </div>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: '12px',
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              {makineler.map((makine, index) => (
                <div
                  key={makine.id}
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '16px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                      {/* Numara */}
                      <div style={{
                        minWidth: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: '#dc2626',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '2px'
                      }}>
                        {index + 1}
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#0f172a',
                          margin: '0 0 4px 0'
                        }}>
                          {makine.equipment_name}
                        </h3>
                        <p style={{
                          fontSize: '14px',
                          color: '#64748b',
                          margin: '0'
                        }}>
                          Seri No: {makine.serial_no}
                        </p>
                      </div>
                    </div>
                    
                    {/* Düzenleme ve Silme Butonları */}
                    <div style={{
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <button
                        onClick={() => onEdit(makine)}
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
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#2563eb';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#3b82f6';
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 4H4C3.45 4 3 4.45 3 5V20C3 20.55 3.45 21 4 21H19C19.55 21 20 20.55 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18.5 2.5C18.89 2.11 19.39 1.89 19.93 1.89C20.47 1.89 20.97 2.11 21.36 2.5C21.75 2.89 21.97 3.39 21.97 3.93C21.97 4.47 21.75 4.97 21.36 5.36L12 14.83L8 16L9.17 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(makine.id)}
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
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#dc2626';
                        }}
                        onMouseLeave={(e) => {
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
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '8px',
                    fontSize: '12px',
                    color: '#64748b'
                  }}>
                    <div>
                      <span style={{ fontWeight: '500' }}>Model:</span> {makine.model}
                    </div>
                    <div>
                      <span style={{ fontWeight: '500' }}>Marka:</span> {makine.brand}
                    </div>
                    <div>
                      <span style={{ fontWeight: '500' }}>Son Kalibrasyon:</span> {
                        typeof makine.last_calibration_date === 'string' 
                          ? new Date(makine.last_calibration_date).toLocaleDateString('tr-TR')
                          : makine.last_calibration_date instanceof Date 
                            ? makine.last_calibration_date.toLocaleDateString('tr-TR')
                            : 'Tarih belirtilmemiş'
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sayfalama */}
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
                    border: currentPage === page ? '2px solid #dc2626' : '1px solid #e5e7eb',
                    borderRadius: '6px',
                    background: currentPage === page ? '#dc2626' : '#ffffff',
                    color: currentPage === page ? '#ffffff' : '#374151',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: currentPage === page ? '600' : '400',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== page) {
                      e.currentTarget.style.borderColor = '#dc2626';
                      e.currentTarget.style.color = '#dc2626';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== page) {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.color = '#374151';
                    }
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

export default MakineEkleView;
