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
  duzenlemeModu: boolean;
  
  // Setterlar
  setDeneySeayisi: (value: number) => void;
  setBelgelendirmeTuru: (value: 'özel' | 'belgelendirme') => void;
  setFirmaAdi: (value: string) => void;
  setBasvuruNo: (value: string) => void;
  setBasvuruTarihi: (value: string) => void;
  
  // Fonksiyonlar
  deneyGuncelle: (index: number, field: keyof Deney, value: string | boolean) => void;
  kaydet: () => void;
  kayitDuzenle: (id: string) => void;
  kayitSilmeOnayi: (id: string) => void;
  duzenlemeyiIptalEt: () => void;
  
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
  duzenlemeModu,
  setDeneySeayisi,
  setBelgelendirmeTuru,
  setFirmaAdi,
  setBasvuruNo,
  setBasvuruTarihi,
  deneyGuncelle,
  kaydet,
  kayitDuzenle,
  kayitSilmeOnayi,
  duzenlemeyiIptalEt,
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
          transition: 'all 0.2s ease',
          width: '100%',
          boxSizing: 'border-box'
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
                style={{ width: '100%', boxSizing: 'border-box' }}
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
                style={{ width: '100%', boxSizing: 'border-box' }}
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
          {duzenlemeModu ? 'Deney Kaydını Düzenle' : 'Yeni Deney Kaydı'}
        </h1>
        <p style={{ 
          color: '#64748b',
          fontSize: '16px',
          margin: 0
        }}>
          {duzenlemeModu ? 'Mevcut deney bilgilerini güncelleyin' : 'Deney bilgilerini ekleyin ve kaydedin'}
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
            <span><strong>Düzenleme Modu:</strong> Mevcut kayıt düzenleniyor. Değişiklikleri kaydetmeyi unutmayın!</span>
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
        
        {/* Sol Panel - Temel Bilgiler + Deney Sayısı */}
        <div className="card" style={{ 
          position: window.innerWidth > 1024 ? 'sticky' : 'static', 
          top: '20px',
          height: '600px', // Sağ panel ile aynı yükseklik
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ 
            fontSize: '18px',
            fontWeight: '600',
            color: '#0f172a',
            marginBottom: '20px',
            paddingBottom: '12px',
            borderBottom: '2px solid #f1f5f9',
            flexShrink: 0
          }}>
            📋 Temel Bilgiler
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gap: '16px',
            gridTemplateColumns: window.innerWidth > 768 && window.innerWidth <= 1024 ? 'repeat(2, 1fr)' : '1fr',
            flex: 1,
            alignContent: 'start'
          }}>
            <div>
              <label>Firma Adı *</label>
              <select 
                value={firmaAdi}
                onChange={(e) => setFirmaAdi(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box' }}
              >
                <option value="">Firma seçiniz...</option>
                {firmalar.map((firma) => (
                  <option key={firma.id} value={firma.ad}>{firma.ad}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Başvuru No *</label>
              <input 
                type="text" 
                value={basvuruNo}
                onChange={(e) => setBasvuruNo(e.target.value)}
                placeholder="Başvuru numarası giriniz..."
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label>Başvuru Tarihi *</label>
              <input 
                type="date" 
                value={basvuruTarihi}
                onChange={(e) => setBasvuruTarihi(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label>Belgelendirme Türü</label>
              <select 
                value={belgelendirmeTuru}
                onChange={(e) => setBelgelendirmeTuru(e.target.value as 'özel' | 'belgelendirme')}
                style={{ width: '100%', boxSizing: 'border-box' }}
              >
                <option value="özel">Özel</option>
                <option value="belgelendirme">Belgelendirme</option>
              </select>
            </div>

            {/* Deney Sayısı - Temel Bilgiler içinde */}
            <div style={{ 
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid #f1f5f9'
            }}>
              <label>🧪 Deney Sayısı</label>
              <select 
                value={deneySayisi}
                onChange={(e) => setDeneySeayisi(parseInt(e.target.value))}
                style={{ width: '100%', boxSizing: 'border-box' }}
              >
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <option key={num} value={num}>{num} Deney</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sağ Panel - Deney Detayları (Scroll) */}
        <div style={{
          height: '600px', // Sabit yükseklik
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingRight: '8px',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          background: 'white',
          minWidth: '0', // Flexbox overflow fix
          display: 'flex',
          flexDirection: 'column',
          // Custom scrollbar styles
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
            🔬 Deney Detayları
            <span style={{ 
              fontSize: '14px',
              color: '#64748b',
              fontWeight: '400'
            }}>
              ({deneySayisi} deney)
            </span>
          </h2>
          
          <div style={{ 
            padding: '16px',
            flex: 1,
            overflowY: 'auto'
          }}>
            {renderDeneyGrupları()}
          </div>
        </div>
      </div>

      {/* Alt Kısım - Kaydet Butonu */}
      <div style={{ marginBottom: '32px' }}>
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <button 
            onClick={kaydet}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              backgroundColor: 'transparent',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {duzenlemeModu ? '💾 Güncelle' : '💾 Kaydet'}
          </button>
          
          {duzenlemeModu && (
            <button 
              onClick={duzenlemeyiIptalEt}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
              }}
            >
              ❌ İptal Et
            </button>
          )}
        </div>
      </div>

      {/* Kayıtlar Listesi */}
      <div className="card">
        <h2 style={{ 
          fontSize: '22px',
          fontWeight: '600',
          color: '#0f172a',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          📊 Kayıtlar Listesi
          <span style={{ 
            fontSize: '14px',
            color: '#64748b',
            fontWeight: '400'
          }}>
            ({kayitlariListesi.length} kayıt)
          </span>
        </h2>
        
        {kayitlariListesi.length === 0 ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: '#64748b',
            fontSize: '16px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
            <div>Henüz kayıt bulunmuyor</div>
            <div style={{ fontSize: '14px', marginTop: '8px' }}>
              İlk kaydınızı eklemek için yukarıdaki formu doldurun
            </div>
          </div>
        ) : (
          <div style={{ 
            display: 'grid',
            gap: '12px'
          }}>
            {kayitlariListesi.map((kayit) => (
              <div key={kayit.id} style={{
                padding: '20px',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                transition: 'all 0.2s ease'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '16px',
                  alignItems: 'start'
                }}>
                  <div>
                    <h4 style={{ 
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#0f172a',
                      marginBottom: '8px'
                    }}>
                      {kayit.firmaAdi}
                    </h4>
                    <div style={{ 
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '8px',
                      fontSize: '14px',
                      color: '#64748b'
                    }}>
                      <div><strong>Başvuru No:</strong> {kayit.basvuruNo}</div>
                      <div><strong>Tarih:</strong> {new Date(kayit.basvuruTarihi).toLocaleDateString('tr-TR')}</div>
                      <div><strong>Tür:</strong> {kayit.belgelendirmeTuru}</div>
                      <div><strong>Deney Sayısı:</strong> {kayit.deneySayisi}</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => kayitDuzenle(kayit.id)}
                      style={{
                        padding: '8px 12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#2563eb';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#3b82f6';
                      }}
                    >
                      ✏️ Düzenle
                    </button>
                    <button 
                      onClick={() => kayitSilmeOnayi(kayit.id)}
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
                      🗑️ Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DeneyEkleView;