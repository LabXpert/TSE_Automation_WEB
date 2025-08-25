import React, { useState } from 'react';
import KalibrasyonModal from '../../components/KalibrasyonModal';

interface MakineData {
  id: number;
  serial_no: string;
  equipment_name: string;
  brand: string;
  model: string;
  measurement_range: string;
  last_calibration_date: string;
  calibration_org_name: string;
  calibration_contact_name?: string;
  calibration_email?: string;
  calibration_phone?: string;
}

interface Props {
  makineData: MakineData[];
  loading: boolean;
  error: string | null;
  getKalibrasyonDurumu?: (lastCalibrationDate: string) => {
    sonrakiTarih: string;
    durum: string;
    durumText: string;
  };
  exceleCikart?: () => Promise<void>;
  // Filtreleme props'ları
  aramaMetni: string;
  setAramaMetni: (metin: string) => void;
  secilenMarka: string;
  setSecilenMarka: (marka: string) => void;
  secilenModel: string;
  setSecilenModel: (model: string) => void;
  secilenKalibrasyonOrg: string;
  setSecilenKalibrasyonOrg: (org: string) => void;
  secilenDurumlar: string[];
  setSecilenDurumlar: (durumlar: string[]) => void;
  // Benzersiz seçenekler
  markalar: string[];
  modeller: string[];
  kalibrasyonOrglari: string[];
  filtreleriTemizle: () => void;
  onMakineDataRefresh?: () => void;
}

const MakineRaporlaView: React.FC<Props> = ({
  makineData,
  loading,
  error,
  getKalibrasyonDurumu,
  exceleCikart,
  aramaMetni,
  setAramaMetni,
  secilenMarka,
  setSecilenMarka,
  secilenModel,
  setSecilenModel,
  secilenKalibrasyonOrg,
  setSecilenKalibrasyonOrg,
  secilenDurumlar,
  setSecilenDurumlar,
  markalar,
  modeller,
  kalibrasyonOrglari,
  filtreleriTemizle,
  onMakineDataRefresh
}) => {

  const [kalibrasyonModalAcik, setKalibrasyonModalAcik] = useState(false);
  const [secilenMakine, setSecilenMakine] = useState<MakineData | null>(null);

  const handleKalibreEtClick = (makine: MakineData) => {
    setSecilenMakine(makine);
    setKalibrasyonModalAcik(true);
  };

  const handleKalibrasyonTamamlandi = () => {
    // Ana sayfadaki verileri yenile
    onMakineDataRefresh?.();
    
    // Modal'ı kapat
    setKalibrasyonModalAcik(false);
    setSecilenMakine(null);
  };

  // Excel'e aktar - sadece props'tan gelen fonksiyonu çağır
  const exportToExcel = () => {
    exceleCikart?.();
  };

  return (
    <div style={{ 
      padding: '32px', 
      fontFamily: 'inherit', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' 
    }}>
      {/* Başlık */}
      <div style={{ 
        marginBottom: '32px', 
        textAlign: 'left', 
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
          Makine Raporlama
        </h1>
        <p style={{ 
          color: '#64748b', 
          fontSize: '16px', 
          margin: 0 
        }}>
          Makine kullanım raporları ve performans takibi
        </p>
      </div>

      {/* Filtreleme Paneli */}
      {!loading && (
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          marginBottom: '24px',
          overflow: 'hidden'
        }}>
          {/* Panel Başlığı */}
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e2e8f0',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#0f172a',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 18H6V6H10V4H6C4.9 4 4 4.9 4 6V18C4 19.1 4.9 20 6 20H10V18ZM19 3.5L17.5 2L14 5.5L17.5 9L19 7.5L16.5 5H23V3H16.5L19 0.5V3.5ZM10 8H8V6H10V8ZM14 6V8H12V6H14ZM10 10H8V12H10V10ZM14 12V10H12V12H14ZM10 14H8V16H10V14ZM14 16V14H12V16H14Z"/>
              </svg>
              Filtreleme & Arama
            </h3>
          </div>

          {/* Filtreler */}
          <div style={{ padding: '24px' }}>
            {/* Üst satır - Arama ve Durum */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '20px',
              marginBottom: '20px'
            }}>
              {/* Arama */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 2a8 8 0 106.32 12.906l4.387 4.387-1.414 1.414-4.387-4.387A8 8 0 1010 2z"/>
                  </svg>
                  Genel Arama
                </label>
                <input
                  type="text"
                  value={aramaMetni}
                  onChange={(e) => setAramaMetni(e.target.value)}
                  placeholder="Makine adı, seri no, marka, model ara..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
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
              </div>

              {/* Kalibrasyon Durumu */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l4 8H8l4-8zm0 20l-4-8h8l-4 8z"/>
                  </svg>
                  Kalibrasyon Durumu
                </label>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}>
                  {[
                    { 
                      key: 'gecti', 
                      label: 'Geçenler', 
                      color: '#dc2626', 
                      bg: '#fee2e2',
                      icon: (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 6L13 7H9L7 6L1 7V9L7 8V18H9V12H15V18H17V8L21 9Z"/>
                          <path d="M12 7C10.9 7 10 7.9 10 9S10.9 11 12 11 14 10.1 14 9 13.1 7 12 7ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12 17C8.69 17 6 14.31 6 11S8.69 5 12 5 18 7.69 18 11 15.31 17 12 17Z"/>
                        </svg>
                      )
                    },
                    { 
                      key: 'yaklasıyor', 
                      label: 'Yaklaşanlar', 
                      color: '#d97706', 
                      bg: '#fef3c7',
                      icon: (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 7C9.8 7 8 8.8 8 11C8 13.2 9.8 15 12 15C14.2 15 16 13.2 16 11C16 8.8 14.2 7 12 7Z"/>
                          <path d="M12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2C17.5 2 22 6.5 22 12C22 17.5 17.5 22 12 22ZM12 20C16.4 20 20 16.4 20 12C20 7.6 16.4 4 12 4C7.6 4 4 7.6 4 12C4 16.4 7.6 20 12 20Z"/>
                        </svg>
                      )
                    },
                    { 
                      key: 'normal', 
                      label: 'Normallar', 
                      color: '#059669', 
                      bg: '#dcfce7',
                      icon: (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM9 20L7 22L2 17L3.5 15.5L7 19L20.5 5.5L22 7L9 20Z"/>
                        </svg>
                      )
                    }
                  ].map((durum) => (
                    <button
                      key={durum.key}
                      onClick={() => {
                        if (secilenDurumlar.includes(durum.key)) {
                          setSecilenDurumlar(secilenDurumlar.filter(d => d !== durum.key));
                        } else {
                          setSecilenDurumlar([...secilenDurumlar, durum.key]);
                        }
                      }}
                      style={{
                        padding: '6px 12px',
                        border: `2px solid ${secilenDurumlar.includes(durum.key) ? durum.color : '#e5e7eb'}`,
                        borderRadius: '6px',
                        background: secilenDurumlar.includes(durum.key) ? durum.bg : '#ffffff',
                        color: secilenDurumlar.includes(durum.key) ? durum.color : '#6b7280',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {durum.icon}
                      {durum.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Alt satır - Marka, Model, Kalibrasyon Org */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '20px',
              marginBottom: '20px'
            }}>
              {/* Marka Seçimi */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 4h16v2H4zm0 14h16v2H4zM4 9h16v6H4z"/>
                  </svg>
                  Marka
                </label>
                <select
                  value={secilenMarka}
                  onChange={(e) => setSecilenMarka(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Tüm Markalar</option>
                  {markalar.map((marka) => (
                    <option key={marka} value={marka}>
                      {marka}
                    </option>
                  ))}
                </select>
              </div>

              {/* Model Seçimi */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l9 4.5-9 4.5-9-4.5zM3 13l9 4.5 9-4.5"/>
                  </svg>
                  Model
                </label>
                <select
                  value={secilenModel}
                  onChange={(e) => setSecilenModel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Tüm Modeller</option>
                  {modeller.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>

              {/* Kalibrasyon Kuruluşu */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 3h20v2H2zm2 4h16v2H4zm0 4h16v10H4z"/>
                  </svg>
                  Kalibrasyon Kuruluşu
                </label>
                <select
                  value={secilenKalibrasyonOrg}
                  onChange={(e) => setSecilenKalibrasyonOrg(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Tüm Kuruluşlar</option>
                  {kalibrasyonOrglari.map((org) => (
                    <option key={org} value={org}>
                      {org}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Aksiyon Butonları */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}>
              <button
                onClick={filtreleriTemizle}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  background: 'transparent',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#6b7280',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#dc2626';
                  e.currentTarget.style.color = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.color = '#6b7280';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.36 2.72L20.78 4.14L15.06 9.85C16.13 11.39 16.28 13.24 15.38 14.44L9.06 8.12C10.26 7.22 12.11 7.37 13.65 8.44L19.36 2.72ZM5.93 17.57C3.92 15.56 2.69 13.16 2.35 10.92L7.23 8.83C8.74 10.13 11.12 10.69 13.09 9.59L19.42 15.92C17.21 18.13 14.34 19.42 11.35 19.92C9.26 20.25 6.95 19.83 5.14 18.64C4.64 18.11 4.18 17.29 3.8 16.5C3.85 17.07 4.32 17.69 5.93 17.57Z"/>
                </svg>
                Filtreleri Temizle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {loading && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
          background: '#ffffff',
          borderRadius: '12px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #dc2626',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '16px'
          }}></div>
          <p style={{ fontSize: '16px', color: '#64748b', margin: 0 }}>
            Makine verileri yükleniyor...
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#991b1b', margin: '0 0 4px 0' }}>
              Hata Oluştu
            </p>
            <p style={{ fontSize: '13px', color: '#991b1b', margin: 0 }}>
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Makine Listesi */}
      {!loading && makineData.length > 0 && (
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden'
        }}>
          {/* Tablo Başlığı */}
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e2e8f0',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
          }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#0f172a',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 22h16V10l-4 2V6l-4 2V2H4v20zM2 22h20v2H2v-2z"/>
            </svg>
            Makine Listesi ({makineData.length} makine)
          </h3>
          </div>

          {/* Tablo */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{
                  background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
                  color: '#ffffff'
                }}>
                  <th style={{
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontWeight: '600',
                    borderRight: '1px solid #991b1b'
                  }}>
                    Makine Bilgileri
                  </th>
                  <th style={{
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontWeight: '600',
                    borderRight: '1px solid #991b1b'
                  }}>
                    Marka & Model
                  </th>
                  <th style={{
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontWeight: '600',
                    borderRight: '1px solid #991b1b'
                  }}>
                    Seri No & Ölçüm Aralığı
                  </th>
                  <th style={{
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontWeight: '600',
                    borderRight: '1px solid #991b1b'
                  }}>
                    Kalibrasyon Kuruluşu
                  </th>
                  <th style={{
                    padding: '16px 12px',
                    textAlign: 'center',
                    fontWeight: '600',
                    borderRight: '1px solid #991b1b'
                  }}>
                    Son Kalibrasyon
                  </th>
                  <th style={{
                    padding: '16px 12px',
                    textAlign: 'center',
                    fontWeight: '600',
                    borderRight: '1px solid #991b1b'
                  }}>
                    Sonraki Kalibrasyon
                  </th>
                  <th style={{
                    padding: '16px 12px',
                    textAlign: 'center',
                    fontWeight: '600',
                    borderRight: '1px solid #991b1b'
                  }}>
                    Durum
                  </th>
                  <th style={{
                    padding: '16px 12px',
                    textAlign: 'center',
                    fontWeight: '600'
                  }}>
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {makineData.map((makine, index) => (
                  <tr key={makine.id} style={{
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8fafc';
                  }}>
                    {/* Makine Bilgileri */}
                    <td style={{
                      padding: '16px 12px',
                      borderRight: '1px solid #f1f5f9'
                    }}>
                      <div>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#0f172a'
                        }}>
                          {makine.equipment_name}
                        </div>
                      </div>
                    </td>

                    {/* Marka & Model */}
                    <td style={{
                      padding: '16px 12px',
                      borderRight: '1px solid #f1f5f9'
                    }}>
                      <div>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#0f172a',
                          marginBottom: '2px'
                        }}>
                          {makine.brand || 'Belirtilmemiş'}
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: '#64748b'
                        }}>
                          Model: {makine.model || 'Belirtilmemiş'}
                        </div>
                      </div>
                    </td>

                    {/* Seri No & Ölçüm Aralığı */}
                    <td style={{
                      padding: '16px 12px',
                      borderRight: '1px solid #f1f5f9'
                    }}>
                      <div>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#0f172a',
                          marginBottom: '4px'
                        }}>
                          Seri No: {makine.serial_no}
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: '#64748b'
                        }}>
                          Ölçüm: {makine.measurement_range || 'Belirtilmemiş'}
                        </div>
                      </div>
                    </td>

                    {/* Kalibrasyon Kuruluşu */}
                    <td style={{
                      padding: '16px 12px',
                      borderRight: '1px solid #f1f5f9'
                    }}>
                        <div>
                        {/* Kuruluş adı */}
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#0f172a',
                          marginBottom: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          {makine.calibration_org_name || 'Belirtilmemiş'}
                        </div>

                        {/* Yetkili kişi */}
                        {makine.calibration_contact_name && (
                          <div style={{
                            fontSize: '12px',
                            color: '#64748b',
                            marginBottom: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 12c2.67 0 8 1.34 8 4v2H4v-2c0-2.66 5.33-4 8-4zm0-2a4 4 0 110-8 4 4 0 010 8z"/>
                            </svg>
                            {makine.calibration_contact_name}
                          </div>
                        )}

                        {/* Telefon */}
                        {makine.calibration_phone && (
                          <div style={{
                            fontSize: '11px',
                            color: '#64748b',
                            marginBottom: '1px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1v3.5a1 1 0 01-1 1C10.29 22 2 13.71 2 3.5a1 1 0 011-1H6.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z"/>
                            </svg>
                            {makine.calibration_phone}
                          </div>
                        )}

                        {/* Mail */}
                        {makine.calibration_email && (
                          <div style={{
                            fontSize: '11px',
                            color: '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20 4H4a2 2 0 00-2 2v12c0 1.1.9 2 2 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                            </svg>
                            {makine.calibration_email}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Son Kalibrasyon */}
                    <td style={{
                      padding: '16px 12px',
                      textAlign: 'center',
                      borderRight: '1px solid #f1f5f9'
                    }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#0f172a'
                      }}>
                        {makine.last_calibration_date ? 
                          new Date(makine.last_calibration_date).toLocaleDateString('tr-TR') : 
                          'Belirtilmemiş'
                        }
                      </div>
                    </td>
                    
                    {/* Sonraki Kalibrasyon */}
                    <td style={{
                      padding: '16px 12px',
                      textAlign: 'center',
                      borderRight: '1px solid #f1f5f9'
                    }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#0f172a'
                      }}>
                        {getKalibrasyonDurumu && makine.last_calibration_date ? 
                          new Date(getKalibrasyonDurumu(makine.last_calibration_date).sonrakiTarih).toLocaleDateString('tr-TR') : 
                          'Belirtilmemiş'
                        }
                      </div>
                    </td>

                    {/* Durum */}
                    <td style={{
                      padding: '16px 12px',
                      textAlign: 'center',
                      borderRight: '1px solid #f1f5f9'
                    }}>
                      {getKalibrasyonDurumu && makine.last_calibration_date ? (() => {
                        const durumInfo = getKalibrasyonDurumu(makine.last_calibration_date);
                        let bgColor = '#dcfce7'; // Yeşil (normal)
                        let textColor = '#166534';
                        
                        if (durumInfo.durum === 'yaklasıyor') {
                          bgColor = '#fef3c7'; // Sarı
                          textColor = '#a16207';
                        } else if (durumInfo.durum === 'gecti') {
                          bgColor = '#fee2e2'; // Kırmızı
                          textColor = '#dc2626';
                        }
                        
                        return (
                          <div style={{
                            display: 'inline-block',
                            padding: '6px 12px',
                            backgroundColor: bgColor,
                            color: textColor,
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {durumInfo.durumText}
                          </div>
                        );
                      })() : (
                        <div style={{
                          display: 'inline-block',
                          padding: '6px 12px',
                          backgroundColor: '#f1f5f9',
                          color: '#64748b',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          Belirtilmemiş
                        </div>
                      )}
                    </td>

                    {/* İşlemler */}
                    <td style={{
                      padding: '16px 12px',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minWidth: '140px'
                      }}>
                        {/* Yeni Kalibrasyon Butonu */}
                        <button
                          onClick={() => handleKalibreEtClick(makine)}
                          style={{
                            padding: '8px 16px',
                            background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM14 21L7 12H10V7H14V12H17L14 21Z"/>
                          </svg>
                          <span>Kalibre Et</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
                            </div>
                  {/* Excel Butonu */}
                  {makineData.length > 0 && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'flex-end', // sağa yasla
                      marginTop: '20px',
                      paddingTop: '20px',
                            marginRight: "24px", // sağdan boşluk
                        marginBottom: "16px", // alttan boşluk
                      borderTop: '1px solid #e2e8f0'
                    }}>
                      <button
                        onClick={exportToExcel}
                        disabled={loading || makineData.length === 0}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '12px 20px',
                          background: loading || makineData.length === 0
                            ? '#94a3b8'
                            : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#ffffff',
                          cursor: loading || makineData.length === 0 ? 'not-allowed' : 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                          <path d="M12,11L16,15H13.5V19H10.5V15H8L12,11Z"/>
                        </svg>
                        Excel'e Çıkart ({makineData.length} makine)
                      </button>
                    </div>
)}

          
        </div>
      )}

      {/* Veri Yok */}
      {!loading && makineData.length === 0 && !error && (
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          padding: '60px',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#0f172a',
            marginBottom: '8px'
          }}>
            Makine verisi bulunamadı
          </h3>
          <p style={{
            fontSize: '16px',
            color: '#64748b',
            margin: 0,
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Henüz sistemde kayıtlı makine bulunmuyor. Yeni makine eklemek için ilgili sayfayı ziyaret edin.
          </p>
        </div>
      )}

      {/* Kalibrasyon Modal'ı */}
      <KalibrasyonModal
        isOpen={kalibrasyonModalAcik}
        onClose={() => {
          setKalibrasyonModalAcik(false);
          setSecilenMakine(null);
        }}
        makine={secilenMakine}
        onKalibrasyonTamamlandi={handleKalibrasyonTamamlandi}
      />

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MakineRaporlaView;
