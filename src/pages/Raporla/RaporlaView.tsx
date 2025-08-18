import React from 'react';
import type { DeneyKaydi } from '../../models/Deney.tsx';

interface RaporlaViewProps {
  kayitlariListesi: DeneyKaydi[];
  tumKayitSayisi: number;
  aramaMetni: string;
  aramaYap: (metin: string) => void;
  aramayiTemizle: () => void;
  // Tarih filtreleme props
  baslangicTarihi: string;
  bitisTarihi: string;
  tarihPaneliAcik: boolean;
  setBaslangicTarihi: (tarih: string) => void;
  setBitisTarihi: (tarih: string) => void;
  setTarihPaneliAcik: (acik: boolean) => void;
  hizliTarihSec: (gun: number) => void;
  tarihFiltreleriniTemizle: () => void;
  // Personel filtreleme props
  secilenPersoneller: string[];
  personelPaneliAcik: boolean;
  tumPersoneller: string[];
  setPersonelPaneliAcik: (acik: boolean) => void;
  personelSec: (personel: string) => void;
  tumPersonelleriSec: () => void;
  personelFiltreleriniTemizle: () => void;
  // Deney türü filtreleme props
  secilenDeneyTurleri: string[];
  deneyTuruPaneliAcik: boolean;
  tumDeneyTurleri: string[];
  setDeneyTuruPaneliAcik: (acik: boolean) => void;
  deneyTuruSec: (deneyTuru: string) => void;
  tumDeneyTurleriniSec: () => void;
  deneyTuruFiltreleriniTemizle: () => void;
  // Durum filtreleme props (Uygunluk + Akredite birleşik)
  secilenDurumlar: string[];
  durumPaneliAcik: boolean;
  setDurumPaneliAcik: (acik: boolean) => void;
  durumSec: (durum: string) => void;
  tumDurumlarıSec: () => void;
  durumFiltreleriniTemizle: () => void;
}

const RaporlaView: React.FC<RaporlaViewProps> = ({ 
  kayitlariListesi, 
  aramaMetni, 
  aramaYap, 
  aramayiTemizle,
  // Tarih filtreleme props
  baslangicTarihi,
  bitisTarihi,
  tarihPaneliAcik,
  setBaslangicTarihi,
  setBitisTarihi,
  setTarihPaneliAcik,
  hizliTarihSec,
  tarihFiltreleriniTemizle,
  // Personel filtreleme props
  secilenPersoneller,
  personelPaneliAcik,
  tumPersoneller,
  setPersonelPaneliAcik,
  personelSec,
  tumPersonelleriSec,
  personelFiltreleriniTemizle,
  // Deney türü filtreleme props
  secilenDeneyTurleri,
  deneyTuruPaneliAcik,
  tumDeneyTurleri,
  setDeneyTuruPaneliAcik,
  deneyTuruSec,
  tumDeneyTurleriniSec,
  deneyTuruFiltreleriniTemizle,
  // Durum filtreleme props (Uygunluk + Akredite birleşik)
  secilenDurumlar,
  durumPaneliAcik,
  setDurumPaneliAcik,
  durumSec,
  tumDurumlarıSec,
  durumFiltreleriniTemizle
}) => {
  return (
    <div style={{ padding: '32px', fontFamily: 'inherit', minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '32px', textAlign: 'left', borderBottom: '2px solid #dc2626', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0', letterSpacing: '-0.025em' }}>Deney Raporları</h1>
        <p style={{ color: '#64748b', fontSize: '16px', margin: 0 }}>Kayıtlı tüm deney verilerini görüntüleyin</p>
      </div>

      {/* Arama Bölümü */}
      <div style={{
        background: '#ffffff',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          {/* Arama Kutusu */}
          <div style={{ 
            flex: '1',
            minWidth: '300px',
            position: 'relative',
            maxWidth: '500px'
          }}>
            <input
              type="text"
              placeholder="Firma adı, başvuru no, deney türü veya personel adı ile arayın..."
              value={aramaMetni}
              onChange={(e) => aramaYap(e.target.value)}
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
            
            {/* Arama iconu */}
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="#6b7280"
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}
            >
              <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5S5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14Z"/>
            </svg>

            {/* Temizle butonu */}
            {aramaMetni && (
              <button
                onClick={aramayiTemizle}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#6b7280">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>

          {/* Tarih Filtreleme Butonu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setTarihPaneliAcik(!tarihPaneliAcik)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                background: (baslangicTarihi || bitisTarihi) ? '#fef3c7' : '#ffffff',
                border: `2px solid ${(baslangicTarihi || bitisTarihi) ? '#f59e0b' : '#e5e7eb'}`,
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: (baslangicTarihi || bitisTarihi) ? '#92400e' : '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (!baslangicTarihi && !bitisTarihi) {
                  e.currentTarget.style.borderColor = '#dc2626';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!baslangicTarihi && !bitisTarihi) {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H18V1H16V3H8V1H6V3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19Z"/>
              </svg>
              {(baslangicTarihi || bitisTarihi) ? 'Tarih Filtresi Aktif' : 'Tarih Filtresi'}
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                style={{ 
                  transition: 'transform 0.2s ease',
                  transform: tarihPaneliAcik ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              >
                <path d="M7 10L12 15L17 10H7Z"/>
              </svg>
            </button>

            {/* Tarih Filtreleme Paneli */}
            {tarihPaneliAcik && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: '0',
                marginTop: '8px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                zIndex: 1000,
                minWidth: '350px'
              }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#0f172a',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H18V1H16V3H8V1H6V3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19Z"/>
                  </svg>
                  Tarih Aralığı Seçin
                </div>

                {/* Hızlı Seçim Butonları */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '16px',
                  flexWrap: 'wrap'
                }}>
                  {[
                    { label: 'Son 7 Gün', gun: 7 },
                    { label: 'Son 15 Gün', gun: 15 },
                    { label: 'Son 30 Gün', gun: 30 },
                    { label: 'Son 90 Gün', gun: 90 }
                  ].map(({ label, gun }) => (
                    <button
                      key={gun}
                      onClick={() => hizliTarihSec(gun)}
                      style={{
                        padding: '6px 12px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#374151',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#dc2626';
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.borderColor = '#dc2626';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f8fafc';
                        e.currentTarget.style.color = '#374151';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Manuel Tarih Seçimi */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '4px'
                    }}>
                      Başlangıç Tarihi
                    </label>
                    <input
                      type="date"
                      value={baslangicTarihi}
                      onChange={(e) => setBaslangicTarihi(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '13px',
                        backgroundColor: '#ffffff',
                        color: '#374151',
                        outline: 'none',
                        transition: 'border-color 0.2s ease',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#dc2626';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0';
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '4px'
                    }}>
                      Bitiş Tarihi
                    </label>
                    <input
                      type="date"
                      value={bitisTarihi}
                      onChange={(e) => setBitisTarihi(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '13px',
                        backgroundColor: '#ffffff',
                        color: '#374151',
                        outline: 'none',
                        transition: 'border-color 0.2s ease',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#dc2626';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0';
                      }}
                    />
                  </div>
                </div>

                {/* Panel Butonları */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <button
                    onClick={tarihFiltreleriniTemizle}
                    style={{
                      padding: '8px 16px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#374151',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
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
                    Temizle
                  </button>
                  
                  <button
                    onClick={() => setTarihPaneliAcik(false)}
                    style={{
                      padding: '8px 16px',
                      background: '#dc2626',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#ffffff',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#b91c1c';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#dc2626';
                    }}
                  >
                    Kapat
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Personel Filtreleme Butonu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setPersonelPaneliAcik(!personelPaneliAcik)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                background: secilenPersoneller.length > 0 ? '#fef3c7' : '#ffffff',
                border: `2px solid ${secilenPersoneller.length > 0 ? '#f59e0b' : '#e5e7eb'}`,
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: secilenPersoneller.length > 0 ? '#92400e' : '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (secilenPersoneller.length === 0) {
                  e.currentTarget.style.borderColor = '#dc2626';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (secilenPersoneller.length === 0) {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 6L13 7H9L7 6L1 7V9L7 8V18H9V12H15V18H17V8L21 9Z"/>
              </svg>
              {secilenPersoneller.length > 0 ? `Personel (${secilenPersoneller.length})` : 'Personel Filtresi'}
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                style={{ 
                  transition: 'transform 0.2s ease',
                  transform: personelPaneliAcik ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              >
                <path d="M7 10L12 15L17 10H7Z"/>
              </svg>
            </button>

            {/* Personel Filtreleme Paneli */}
            {personelPaneliAcik && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: '0',
                marginTop: '8px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                zIndex: 1000,
                minWidth: '300px',
                maxHeight: '400px',
                overflow: 'auto'
              }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#0f172a',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 6L13 7H9L7 6L1 7V9L7 8V18H9V12H15V18H17V8L21 9Z"/>
                  </svg>
                  Sorumlu Personel Seçin
                </div>

                {/* Hızlı Seçim Butonları */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '16px',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={tumPersonelleriSec}
                    style={{
                      padding: '6px 12px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#374151',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#dc2626';
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.borderColor = '#dc2626';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.color = '#374151';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  >
                    Tümünü Seç
                  </button>
                </div>

                {/* Personel Listesi */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  marginBottom: '16px'
                }}>
                  {tumPersoneller.map((personel) => (
                    <label
                      key={personel}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease',
                        backgroundColor: secilenPersoneller.includes(personel) ? '#fef3c7' : 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (!secilenPersoneller.includes(personel)) {
                          e.currentTarget.style.backgroundColor = '#f8fafc';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!secilenPersoneller.includes(personel)) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={secilenPersoneller.includes(personel)}
                        onChange={() => personelSec(personel)}
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: '#dc2626'
                        }}
                      />
                      <span style={{
                        fontSize: '14px',
                        color: '#374151',
                        fontWeight: secilenPersoneller.includes(personel) ? '600' : '400'
                      }}>
                        {personel}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Panel Butonları */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <button
                    onClick={personelFiltreleriniTemizle}
                    style={{
                      padding: '8px 16px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#374151',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
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
                    Temizle
                  </button>
                  
                  <button
                    onClick={() => setPersonelPaneliAcik(false)}
                    style={{
                      padding: '8px 16px',
                      background: '#dc2626',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#ffffff',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#b91c1c';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#dc2626';
                    }}
                  >
                    Kapat
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Deney Türü Filtreleme Butonu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDeneyTuruPaneliAcik(!deneyTuruPaneliAcik)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                background: secilenDeneyTurleri.length > 0 ? '#fef3c7' : '#ffffff',
                border: `2px solid ${secilenDeneyTurleri.length > 0 ? '#f59e0b' : '#e5e7eb'}`,
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: secilenDeneyTurleri.length > 0 ? '#92400e' : '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (secilenDeneyTurleri.length === 0) {
                  e.currentTarget.style.borderColor = '#dc2626';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (secilenDeneyTurleri.length === 0) {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 11H7V9H9V11ZM13 11H11V9H13V11ZM17 11H15V9H17V11ZM19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19Z"/>
              </svg>
              {secilenDeneyTurleri.length > 0 ? `Deney Türü (${secilenDeneyTurleri.length})` : 'Deney Türü Filtresi'}
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                style={{ 
                  transition: 'transform 0.2s ease',
                  transform: deneyTuruPaneliAcik ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              >
                <path d="M7 10L12 15L17 10H7Z"/>
              </svg>
            </button>

            {/* Deney Türü Filtreleme Paneli */}
            {deneyTuruPaneliAcik && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: '0',
                marginTop: '8px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                zIndex: 1000,
                minWidth: '300px',
                maxHeight: '400px',
                overflow: 'auto'
              }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#0f172a',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 11H7V9H9V11ZM13 11H11V9H13V11ZM17 11H15V9H17V11ZM19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19Z"/>
                  </svg>
                  Deney Türü Seçin
                </div>

                {/* Hızlı Seçim Butonları */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '16px',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={tumDeneyTurleriniSec}
                    style={{
                      padding: '6px 12px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#374151',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#dc2626';
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.borderColor = '#dc2626';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.color = '#374151';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  >
                    Tümünü Seç
                  </button>
                </div>

                {/* Deney Türü Listesi */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  marginBottom: '16px'
                }}>
                  {tumDeneyTurleri.map((deneyTuru) => (
                    <label
                      key={deneyTuru}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease',
                        backgroundColor: secilenDeneyTurleri.includes(deneyTuru) ? '#fef3c7' : 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (!secilenDeneyTurleri.includes(deneyTuru)) {
                          e.currentTarget.style.backgroundColor = '#f8fafc';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!secilenDeneyTurleri.includes(deneyTuru)) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={secilenDeneyTurleri.includes(deneyTuru)}
                        onChange={() => deneyTuruSec(deneyTuru)}
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: '#dc2626'
                        }}
                      />
                      <span style={{
                        fontSize: '14px',
                        color: '#374151',
                        fontWeight: secilenDeneyTurleri.includes(deneyTuru) ? '600' : '400'
                      }}>
                        {deneyTuru}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Panel Butonları */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <button
                    onClick={deneyTuruFiltreleriniTemizle}
                    style={{
                      padding: '8px 16px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#374151',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
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
                    Temizle
                  </button>
                  
                  <button
                    onClick={() => setDeneyTuruPaneliAcik(false)}
                    style={{
                      padding: '8px 16px',
                      background: '#dc2626',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#ffffff',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#b91c1c';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#dc2626';
                    }}
                  >
                    Kapat
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Durum Filtreleme Butonu (Uygunluk + Akredite Birleşik) */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDurumPaneliAcik(!durumPaneliAcik)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                background: secilenDurumlar.length > 0 ? '#fef3c7' : '#ffffff',
                border: `2px solid ${secilenDurumlar.length > 0 ? '#f59e0b' : '#e5e7eb'}`,
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: secilenDurumlar.length > 0 ? '#92400e' : '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (secilenDurumlar.length === 0) {
                  e.currentTarget.style.borderColor = '#dc2626';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (secilenDurumlar.length === 0) {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.82L5.82 21L7 14L2 9L8.91 8.26L12 2ZM9 20L7 22L2 17L3.5 15.5L7 19L20.5 5.5L22 7L9 20Z"/>
              </svg>
              {secilenDurumlar.length > 0 ? `Durum Filtresi (${secilenDurumlar.length})` : 'Durum Filtresi'}
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                style={{ 
                  transition: 'transform 0.2s ease',
                  transform: durumPaneliAcik ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              >
                <path d="M7 10L12 15L17 10H7Z"/>
              </svg>
            </button>

            {/* Durum Filtreleme Paneli */}
            {durumPaneliAcik && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: '0',
                marginTop: '8px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                zIndex: 1000,
                minWidth: '320px',
                maxHeight: '400px',
                overflow: 'auto'
              }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#0f172a',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.82L5.82 21L7 14L2 9L8.91 8.26L12 2ZM9 20L7 22L2 17L3.5 15.5L7 19L20.5 5.5L22 7L9 20Z"/>
                  </svg>
                  Test Durumu Seçin
                </div>

                {/* Hızlı Seçim Butonları */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '16px',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={tumDurumlarıSec}
                    style={{
                      padding: '6px 12px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#374151',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#dc2626';
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.borderColor = '#dc2626';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.color = '#374151';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  >
                    Tümünü Seç
                  </button>
                </div>

                {/* Uygunluk Bölümü */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#475569',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 20L7 22L2 17L3.5 15.5L7 19L20.5 5.5L22 7L9 20Z"/>
                    </svg>
                    Uygunluk Durumu
                  </div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    {['Uygun', 'Uygun Değil'].map((uygunluk) => (
                      <label
                        key={uygunluk}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease',
                          backgroundColor: secilenDurumlar.includes(uygunluk) ? '#fef3c7' : 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          if (!secilenDurumlar.includes(uygunluk)) {
                            e.currentTarget.style.backgroundColor = '#f8fafc';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!secilenDurumlar.includes(uygunluk)) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={secilenDurumlar.includes(uygunluk)}
                          onChange={() => durumSec(uygunluk)}
                          style={{
                            width: '16px',
                            height: '16px',
                            accentColor: '#dc2626'
                          }}
                        />
                        <span style={{
                          fontSize: '14px',
                          color: '#374151',
                          fontWeight: secilenDurumlar.includes(uygunluk) ? '600' : '400'
                        }}>
                          {uygunluk}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Akredite Bölümü */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#475569',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.82L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
                    </svg>
                    Akreditasyon Durumu
                  </div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    {['Akredite', 'Akredite Değil'].map((akredite) => (
                      <label
                        key={akredite}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease',
                          backgroundColor: secilenDurumlar.includes(akredite) ? '#fef3c7' : 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          if (!secilenDurumlar.includes(akredite)) {
                            e.currentTarget.style.backgroundColor = '#f8fafc';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!secilenDurumlar.includes(akredite)) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={secilenDurumlar.includes(akredite)}
                          onChange={() => durumSec(akredite)}
                          style={{
                            width: '16px',
                            height: '16px',
                            accentColor: '#dc2626'
                          }}
                        />
                        <span style={{
                          fontSize: '14px',
                          color: '#374151',
                          fontWeight: secilenDurumlar.includes(akredite) ? '600' : '400'
                        }}>
                          {akredite}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Panel Butonları */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <button
                    onClick={durumFiltreleriniTemizle}
                    style={{
                      padding: '8px 16px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#374151',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
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
                    Temizle
                  </button>
                  
                  <button
                    onClick={() => setDurumPaneliAcik(false)}
                    style={{
                      padding: '8px 16px',
                      background: '#dc2626',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#ffffff',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#b91c1c';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#dc2626';
                    }}
                  >
                    Kapat
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Arama önerileri */}
        {aramaMetni && kayitlariListesi.length === 0 && (
          <div style={{
            marginTop: '16px',
            padding: '12px 16px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#991b1b'
          }}>
            <strong>Sonuç bulunamadı!</strong> Arama kriterlerinizi değiştirmeyi deneyin:
            <ul style={{ marginTop: '8px', marginBottom: 0, paddingLeft: '20px' }}>
              <li>Yazım hatası olup olmadığını kontrol edin</li>
              <li>Daha genel terimler kullanın</li>
              <li>Firma adı, başvuru numarası, deney türü veya personel adı ile aramayı deneyin</li>
            </ul>
          </div>
        )}
      </div>

      {/* Veri Tablosu */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
            <path d="M3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5ZM5 5H19V19H5V5ZM7 7V9H17V7H7ZM7 11V13H17V11H7ZM7 15V17H14V15H7Z"/>
          </svg>
          Tüm Kayıtlar
          <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '400' }}>({kayitlariListesi.length} kayıt)</span>
        </h2>
        {kayitlariListesi.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748b', fontSize: '16px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', color: '#94a3b8', display: 'flex', justifyContent: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM12 17C13.1 17 14 16.1 14 15C14 13.9 13.1 13 12 13C10.9 13 10 13.9 10 15C10 16.1 10.9 17 12 17ZM12 7C10.9 7 10 7.9 10 9C10 10.1 10.9 11 12 11C13.1 11 14 10.1 14 9C14 7.9 13.1 7 12 7Z"/>
              </svg>
            </div>
            <div style={{ fontSize: '20px', marginBottom: '8px', color: '#374151' }}>Henüz kayıt bulunmuyor</div>
            <div style={{ fontSize: '14px' }}>Yeni deney kayıtları eklemek için "Deney Ekle" sayfasını ziyaret edin</div>
          </div>
        ) : (
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', tableLayout: 'fixed' }}>
              <thead>
                <tr style={{ background: '#7f1d1d', color: 'white' }}>
                  <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', borderRight: '1px solid #991b1b', width: '4%' }}>SIRA</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', borderRight: '1px solid #991b1b', width: '16%' }}>FİRMA ADI</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', borderRight: '1px solid #991b1b', width: '9%' }}>BAŞVURU NO</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', borderRight: '1px solid #991b1b', width: '9%' }}>BAŞVURU TARİHİ</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', borderRight: '1px solid #991b1b', width: '7%' }}>TÜR</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', borderRight: '1px solid #991b1b', width: '16%' }}>DENEY TÜRÜ</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', borderRight: '1px solid #991b1b', width: '13%' }}>SORUMLU PERSONEL</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', borderRight: '1px solid #991b1b', width: '8%' }}>AKREDİTE</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', borderRight: '1px solid #991b1b', width: '8%' }}>UYGUNLUK</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', width: '10%' }}>ÜCRET</th>
                </tr>
              </thead>
              <tbody>
                {kayitlariListesi.map((kayit, kayitIndex) => (
                  kayit.deneyler.map((deney, deneyIndex) => (
                    <tr key={`${kayit.id}-${deney.id}`} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s ease' }}
                      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}>
                      <td style={{ padding: '10px 8px', textAlign: 'center', borderRight: '1px solid #f1f5f9', fontWeight: '600', color: '#374151', fontSize: '12px' }}>{kayitIndex + 1}.{deneyIndex + 1}</td>
                      <td style={{ padding: '10px 8px', borderRight: '1px solid #f1f5f9', fontWeight: '600', color: '#0f172a', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{kayit.firmaAdi}</td>
                      <td style={{ padding: '10px 8px', borderRight: '1px solid #f1f5f9', color: '#374151', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{kayit.basvuruNo}</td>
                      <td style={{ padding: '10px 8px', borderRight: '1px solid #f1f5f9', color: '#374151', fontSize: '12px' }}>{new Date(kayit.basvuruTarihi).toLocaleDateString('tr-TR')}</td>
                      <td style={{ padding: '10px 8px', borderRight: '1px solid #f1f5f9', textAlign: 'center' }}>
                        <span style={{ padding: '3px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: '600', background: kayit.belgelendirmeTuru === 'belgelendirme' ? '#fed7aa' : '#fef7cd', color: kayit.belgelendirmeTuru === 'belgelendirme' ? '#c2410c' : '#a16207', border: `1px solid ${kayit.belgelendirmeTuru === 'belgelendirme' ? '#f97316' : '#ca8a04'}` }}>{kayit.belgelendirmeTuru === 'belgelendirme' ? 'BELG.' : 'ÖZEL'}</span>
                      </td>
                      <td style={{ padding: '10px 8px', borderRight: '1px solid #f1f5f9', fontWeight: '600', color: '#0f172a', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{deney.deneyTuru}</td>
                      <td style={{ padding: '10px 8px', borderRight: '1px solid #f1f5f9', color: '#374151', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{deney.sorumluPersonel}</td>
                      <td style={{ padding: '10px 8px', borderRight: '1px solid #f1f5f9', textAlign: 'center' }}>
                        <span style={{ padding: '3px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: '600', background: deney.akredite ? '#dcfce7' : '#fee2e2', color: deney.akredite ? '#166534' : '#dc2626', border: `1px solid ${deney.akredite ? '#16a34a' : '#ef4444'}` }}>{deney.akredite ? 'EVET' : 'HAYIR'}</span>
                      </td>
                      <td style={{ padding: '10px 8px', borderRight: '1px solid #f1f5f9', textAlign: 'center' }}>
                        <span style={{ padding: '3px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: '600', background: deney.uygunluk ? '#ddd6fe' : '#f3f4f6', color: deney.uygunluk ? '#5b21b6' : '#6b7280', border: `1px solid ${deney.uygunluk ? '#8b5cf6' : '#d1d5db'}` }}>{deney.uygunluk ? 'EVET' : 'HAYIR'}</span>
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'center', fontWeight: '600', color: '#0f172a', fontSize: '12px' }}>{deney.unit_price != null ? `${deney.unit_price} ₺` : '-'}</td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RaporlaView;
