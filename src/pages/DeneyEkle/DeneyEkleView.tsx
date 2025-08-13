// src/pages/DeneyEkle/DeneyEkleView.tsx
import type { Firma } from '../../models/Firma.tsx';
import type { Personel } from '../../models/Personel.tsx';
import type { DeneyTuru } from '../../models/DeneyTurleri.tsx';
import type { Deney, DeneyKaydi } from '../../models/Deney.tsx';

interface DeneyEkleViewProps {
  // State'ler
  deneySayisi: number;
  belgelendirmeTuru: 'özel' | 'belgelendirme';
  firmaAdi: string;
  basvuruNo: string;
  basvuruTarihi: string;
  deneyler: Deney[];
  kayitlariListesi: DeneyKaydi[];
  
  // Setterlar
  setDeneySeayisi: (value: number) => void;
  setBelgelendirmeTuru: (value: 'özel' | 'belgelendirme') => void;
  setFirmaAdi: (value: string) => void;
  setBasvuruNo: (value: string) => void;
  setBasvuruTarihi: (value: string) => void;
  
  // Fonksiyonlar
  deneyGuncelle: (index: number, field: keyof Deney, value: string | boolean) => void;
  kaydet: () => void;
  
  // Sabit veriler
  firmalar: Firma[];
  personeller: Personel[];
  deneyTurleri: DeneyTuru[];
}

function DeneyEkleView({
  deneySayisi,
  belgelendirmeTuru,
  firmaAdi,
  basvuruNo,
  basvuruTarihi,
  deneyler,
  kayitlariListesi,
  setDeneySeayisi,
  setBelgelendirmeTuru,
  setFirmaAdi,
  setBasvuruNo,
  setBasvuruTarihi,
  deneyGuncelle,
  kaydet,
  firmalar,
  personeller,
  deneyTurleri
}: DeneyEkleViewProps) {

  const renderDeneyGrupları = () => {
    const gruplar = [];
    for (let i = 0; i < deneySayisi; i++) {
      gruplar.push(
        <div key={i} className="card" style={{ 
          marginBottom: '16px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid #e2e8f0',
          transition: 'all 0.2s ease'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            marginBottom: '20px',
            paddingBottom: '12px',
            borderBottom: '1px solid #f1f5f9'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {i + 1}
            </div>
            <h4 style={{ 
              margin: 0, 
              color: '#0f172a',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              Deney {i + 1}
            </h4>
          </div>
          
          <div style={{ 
            display: 'grid',
            gap: '16px'
          }}>
            <div>
              <label>Deney Türü *</label>
              <select 
                value={deneyler[i]?.deneyTuru || ''}
                onChange={(e) => deneyGuncelle(i, 'deneyTuru', e.target.value)}
              >
                <option value="">Deney türü seçiniz...</option>
                {deneyTurleri.map((tur) => (
                  <option key={tur.id} value={tur.ad}>{tur.ad}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Sorumlu Personel *</label>
              <select 
                value={deneyler[i]?.sorumluPersonel || ''}
                onChange={(e) => deneyGuncelle(i, 'sorumluPersonel', e.target.value)}
              >
                <option value="">Personel seçiniz...</option>
                {personeller.map((personel) => (
                  <option key={personel.id} value={personel.tamAd}>{personel.tamAd}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                <input 
                  type="checkbox" 
                  checked={deneyler[i]?.akredite || false}
                  onChange={(e) => deneyGuncelle(i, 'akredite', e.target.checked)}
                  style={{ 
                    width: '16px',
                    height: '16px',
                    margin: 0
                  }}
                />
                <span>Akredite</span>
                <div style={{
                  fontSize: '12px',
                  color: '#64748b',
                  fontWeight: '400'
                }}>
                  (Bu deney akredite mi?)
                </div>
              </label>
            </div>
          </div>
        </div>
      );
    }
    return gruplar;
  };

  return (
    <div style={{ 
      padding: '32px', 
      fontFamily: 'inherit',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
    }}>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '28px',
          fontWeight: '700',
          color: '#0f172a',
          marginBottom: '8px',
          letterSpacing: '-0.025em'
        }}>
          Yeni Deney Kaydı
        </h1>
        <p style={{ 
          color: '#64748b',
          fontSize: '16px',
          margin: 0
        }}>
          Deney bilgilerini ekleyin ve kaydedin
        </p>
      </div>

      {/* Üst Paneller + Kaydet Butonu */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px', 
        marginBottom: '32px'
      }}>
        {/* Sol Panel - Genel Bilgiler */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '1px solid #f1f5f9'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              📋
            </div>
            <h3 style={{ 
              margin: 0, 
              color: '#0f172a',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Genel Bilgiler
            </h3>
          </div>
          
          <div style={{ display: 'grid', gap: '20px' }}>
            <div>
              <label>Firma Adı *</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'stretch' }}>
                <select 
                  value={firmaAdi}
                  onChange={(e) => setFirmaAdi(e.target.value)}
                  style={{ flex: 1 }}
                >
                  <option value="">Firma seçiniz...</option>
                  {firmalar.map((firma) => (
                    <option key={firma.id} value={firma.ad}>{firma.ad}</option>
                  ))}
                </select>
                <button 
                  className="secondary"
                  style={{ 
                    width: '44px',
                    padding: '0',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Yeni firma ekle"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label>Başvuru No *</label>
              <input 
                type="text" 
                value={basvuruNo}
                onChange={(e) => setBasvuruNo(e.target.value)}
                placeholder="Başvuru numarasını giriniz"
              />
            </div>

            <div>
              <label>Başvuru Tarihi *</label>
              <input 
                type="date" 
                value={basvuruTarihi}
                onChange={(e) => setBasvuruTarihi(e.target.value)}
              />
            </div>

            <div>
              <label style={{ marginBottom: '12px' }}>Belgelendirme Türü *</label>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px'
              }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  border: `2px solid ${belgelendirmeTuru === 'özel' ? '#2563eb' : '#e2e8f0'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: belgelendirmeTuru === 'özel' ? '#dbeafe' : '#ffffff'
                }}>
                  <input 
                    type="radio" 
                    name="belgelendirme" 
                    value="özel"
                    checked={belgelendirmeTuru === 'özel'}
                    onChange={(e) => setBelgelendirmeTuru(e.target.value as 'özel' | 'belgelendirme')}
                    style={{ margin: 0 }}
                  />
                  <span style={{ 
                    fontWeight: '500',
                    color: belgelendirmeTuru === 'özel' ? '#2563eb' : '#475569'
                  }}>
                    Özel
                  </span>
                </label>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  border: `2px solid ${belgelendirmeTuru === 'belgelendirme' ? '#2563eb' : '#e2e8f0'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: belgelendirmeTuru === 'belgelendirme' ? '#dbeafe' : '#ffffff'
                }}>
                  <input 
                    type="radio" 
                    name="belgelendirme" 
                    value="belgelendirme"
                    checked={belgelendirmeTuru === 'belgelendirme'}
                    onChange={(e) => setBelgelendirmeTuru(e.target.value as 'özel' | 'belgelendirme')}
                    style={{ margin: 0 }}
                  />
                  <span style={{ 
                    fontWeight: '500',
                    color: belgelendirmeTuru === 'belgelendirme' ? '#2563eb' : '#475569'
                  }}>
                    Belgelendirme
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label>Deney Sayısı *</label>
              <input 
                type="number" 
                min="1" 
                max="20"
                value={deneySayisi}
                onChange={(e) => setDeneySeayisi(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
        </div>

        {/* Sağ Taraf - Panel + Kaydet Butonu */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          {/* Sağ Panel - Deney Detayları */}
          <div className="card" style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid #e2e8f0',
            height: '550px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '1px solid #f1f5f9'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}>
                🧪
              </div>
              <h3 style={{ 
                margin: 0, 
                color: '#0f172a',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                Deney Detayları
              </h3>
            </div>
            
            <div style={{ 
              flex: 1,
              overflowY: 'auto',
              paddingRight: '4px'
            }}>
              {renderDeneyGrupları()}
            </div>
          </div>

          {/* Kaydet Butonu */}
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end'
          }}>
            <button 
              onClick={kaydet}
              style={{ 
                padding: '16px 32px', 
                fontSize: '16px', 
                fontWeight: '600',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                border: 'none',
                borderRadius: '12px',
                minWidth: '160px'
              }}
            >
              💾 Kaydet
            </button>
          </div>
        </div>
      </div>

      {/* Alt Panel - Kayıtlar */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid #f1f5f9'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            📈
          </div>
          <h3 style={{ 
            margin: 0, 
            color: '#0f172a',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            Son Kayıtlar
          </h3>
          {kayitlariListesi.length > 0 && (
            <div style={{
              backgroundColor: '#dbeafe',
              color: '#2563eb',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {kayitlariListesi.length} kayıt
            </div>
          )}
        </div>
        
        <div style={{ 
          border: '1px solid #e2e8f0', 
          borderRadius: '12px', 
          minHeight: '240px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          overflowY: 'auto',
          overflowX: 'auto'
        }}>
          {kayitlariListesi.length > 0 ? (
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ 
                  background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
                  borderBottom: '2px solid #94a3b8'
                }}>
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#334155',
                    fontSize: '13px',
                    letterSpacing: '0.025em'
                  }}>Firma</th>
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#334155',
                    fontSize: '13px',
                    letterSpacing: '0.025em'
                  }}>Başvuru No</th>
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#334155',
                    fontSize: '13px',
                    letterSpacing: '0.025em'
                  }}>Tarih</th>
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#334155',
                    fontSize: '13px',
                    letterSpacing: '0.025em'
                  }}>Deney Sayısı</th>
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#334155',
                    fontSize: '13px',
                    letterSpacing: '0.025em'
                  }}>Tür</th>
                </tr>
              </thead>
              <tbody>
                {kayitlariListesi.slice(-5).reverse().map((kayit, index) => (
                  <tr 
                    key={kayit.id}
                    style={{ 
                      borderBottom: '1px solid #e2e8f0',
                      transition: 'all 0.2s ease',
                      backgroundColor: index % 2 === 0 ? 'rgba(248, 250, 252, 0.5)' : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f1f5f9';
                      e.currentTarget.style.transform = 'scale(1.01)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'rgba(248, 250, 252, 0.5)' : 'transparent';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <td style={{ 
                      padding: '16px',
                      color: '#0f172a',
                      fontWeight: '500'
                    }}>{kayit.firmaAdi}</td>
                    <td style={{ 
                      padding: '16px',
                      color: '#475569',
                      fontFamily: 'monospace',
                      fontSize: '13px'
                    }}>{kayit.basvuruNo}</td>
                    <td style={{ 
                      padding: '16px',
                      color: '#64748b'
                    }}>
                      {new Date(kayit.basvuruTarihi).toLocaleDateString('tr-TR')}
                    </td>
                    <td style={{ 
                      padding: '16px',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        backgroundColor: '#dbeafe',
                        color: '#2563eb',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'inline-block'
                      }}>
                        {kayit.deneySayisi}
                      </div>
                    </td>
                    <td style={{ 
                      padding: '16px'
                    }}>
                      <div style={{
                        backgroundColor: kayit.belgelendirmeTuru === 'özel' ? '#fef3c7' : '#d1fae5',
                        color: kayit.belgelendirmeTuru === 'özel' ? '#d97706' : '#059669',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        display: 'inline-block'
                      }}>
                        {kayit.belgelendirmeTuru}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '240px',
              color: '#64748b',
              gap: '12px'
            }}>
              <div style={{ fontSize: '48px', opacity: 0.5 }}>📋</div>
              <div style={{ 
                fontSize: '16px',
                fontWeight: '500'
              }}>
                Henüz kayıt bulunmamaktadır
              </div>
              <div style={{ 
                fontSize: '14px',
                color: '#94a3b8'
              }}>
                İlk deney kaydınızı oluşturun
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeneyEkleView;