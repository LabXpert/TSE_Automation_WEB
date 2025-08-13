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
              background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
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
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
              <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM5 5H19V7H5V5ZM5 19V9H19V19H5ZM7 11H17V13H7V11ZM7 15H14V17H7V15Z"/>
            </svg>
            Temel Bilgiler
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
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
                  <path d="M9 2V4H7C5.9 4 5 4.9 5 6V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V6C19 4.9 18.1 4 17 4H15V2H9ZM17 6V18H7V6H17ZM12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15Z"/>
                </svg>
                Deney Sayısı
              </label>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginTop: '8px' 
              }}>
                <input 
                  type="number" 
                  min="1" 
                  max="10" 
                  value={deneySayisi}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 1 && value <= 10) {
                      setDeneySeayisi(value);
                    }
                  }}
                  style={{ 
                    flex: 1,
                    textAlign: 'center',
                    fontSize: '16px',
                    fontWeight: '600',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (deneySayisi < 10) {
                        setDeneySeayisi(deneySayisi + 1);
                      }
                    }}
                    style={{
                      padding: '4px 8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      minWidth: '32px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#b91c1c';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#dc2626';
                    }}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (deneySayisi > 1) {
                        setDeneySeayisi(deneySayisi - 1);
                      }
                    }}
                    style={{
                      padding: '4px 8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      minWidth: '32px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#b91c1c';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#dc2626';
                    }}
                  >
                    ▼
                  </button>
                </div>
              </div>
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
              <path d="M9 2V4H7C5.9 4 5 4.9 5 6V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V6C19 4.9 18.1 4 17 4H15V2H9ZM17 6V18H7V6H17ZM12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15Z"/>
            </svg>
            Deney Detayları
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
            {duzenlemeModu ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
                  <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z"/>
                </svg>
                Güncelle
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
                  <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z"/>
                </svg>
                Kaydet
              </>
            )}
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"/>
              </svg>
              İptal Et
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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
            <path d="M3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5ZM5 5H19V19H5V5ZM7 7V9H17V7H7ZM7 11V13H17V11H7ZM7 15V17H14V15H7Z"/>
          </svg>
          Kayıtlar Listesi
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
            <div style={{ 
              fontSize: '48px', 
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="#94a3b8">
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM11 15L8.5 12.5L7 14L11 18L17 12L15.5 10.5L11 15Z"/>
              </svg>
            </div>
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
  );
}

export default DeneyEkleView;