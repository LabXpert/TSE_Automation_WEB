import React from 'react';

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
  filtreleriTemizle
}) => {

  // Excel'e aktar - sadece ana export fonksiyonunu kullan
  const exportToExcel = () => {
    if (exceleCikart) {
      exceleCikart();
    } else {
      alert('Excel export fonksiyonu bulunamadı');
    }
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
              <span style={{ fontSize: '20px' }}>🔍</span>
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
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  🔍 Genel Arama
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
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  ⚡ Kalibrasyon Durumu
                </label>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}>
                  {[
                    { key: 'gecti', label: 'Geçenler', color: '#dc2626', bg: '#fee2e2' },
                    { key: 'yaklasıyor', label: 'Yaklaşanlar', color: '#d97706', bg: '#fef3c7' },
                    { key: 'normal', label: 'Normallar', color: '#059669', bg: '#dcfce7' }
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
                        transition: 'all 0.2s ease'
                      }}
                    >
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
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  🏭 Marka
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
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  ⚙️ Model
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
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  🏢 Kalibrasyon Kuruluşu
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
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{
                fontSize: '13px',
                color: '#6b7280',
                fontStyle: 'italic'
              }}>
                {makineData.length} makine gösteriliyor
              </div>
              
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
                🧹 Filtreleri Temizle
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
          <span style={{ fontSize: '24px' }}>⚠️</span>
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
              <span style={{ fontSize: '24px' }}>🏭</span>
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
                    fontWeight: '600'
                  }}>
                    Durum
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
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#0f172a',
                          marginBottom: '2px'
                        }}>
                          {makine.calibration_org_name || 'Belirtilmemiş'}
                        </div>
                        {makine.calibration_contact_name && (
                          <div style={{
                            fontSize: '12px',
                            color: '#64748b',
                            marginBottom: '2px'
                          }}>
                            📞 {makine.calibration_contact_name}
                          </div>
                        )}
                        {makine.calibration_phone && (
                          <div style={{
                            fontSize: '11px',
                            color: '#64748b',
                            marginBottom: '1px'
                          }}>
                            📱 {makine.calibration_phone}
                          </div>
                        )}
                        {makine.calibration_email && (
                          <div style={{
                            fontSize: '11px',
                            color: '#64748b'
                          }}>
                            ✉️ {makine.calibration_email}
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
                      textAlign: 'center'
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Excel Çıktısı Butonu */}
          {makineData.length > 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '20px',
              paddingTop: '20px',
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
                  background: loading || makineData.length === 0 ? '#94a3b8' : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ffffff',
                  cursor: loading || makineData.length === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
                }}
                onMouseEnter={(e) => {
                  if (!loading && makineData.length > 0) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(5, 150, 105, 0.35)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, #047857 0%, #065f46 100%)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && makineData.length > 0) {
                    e.currentTarget.style.transform = 'translateY(0px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.25)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
                  }
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
          <div style={{
            fontSize: '80px',
            marginBottom: '20px'
          }}>
            ⚙️
          </div>
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
