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
        <div key={i} style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          border: '1px solid #ddd', 
          borderRadius: '5px',
          backgroundColor: '#f9f9f9'
        }}>
          <h4 style={{ marginBottom: '15px', color: '#213547' }}>Deney {i + 1}</h4>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Deney Türü: *
            </label>
            <select 
              value={deneyler[i]?.deneyTuru || ''}
              onChange={(e) => deneyGuncelle(i, 'deneyTuru', e.target.value)}
              style={{ 
                width: '100%', 
                padding: '8px', 
                borderRadius: '4px', 
                border: '1px solid #ccc' 
              }}
            >
              <option value="">Seçiniz...</option>
              {deneyTurleri.map((tur) => (
                <option key={tur.id} value={tur.ad}>{tur.ad}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Sorumlu Personel: *
            </label>
            <select 
              value={deneyler[i]?.sorumluPersonel || ''}
              onChange={(e) => deneyGuncelle(i, 'sorumluPersonel', e.target.value)}
              style={{ 
                width: '100%', 
                padding: '8px', 
                borderRadius: '4px', 
                border: '1px solid #ccc' 
              }}
            >
              <option value="">Seçiniz...</option>
              {personeller.map((personel) => (
                <option key={personel.id} value={personel.tamAd}>{personel.tamAd}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
              <input 
                type="checkbox" 
                checked={deneyler[i]?.akredite || false}
                onChange={(e) => deneyGuncelle(i, 'akredite', e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Akredite
            </label>
          </div>
        </div>
      );
    }
    return gruplar;
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      boxSizing: 'border-box'
    }}>
      {/* Üst Paneller */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginBottom: '20px',
        height: '500px'
      }}>
        {/* Sol Üst Panel */}
        <div style={{ 
          flex: '1', 
          border: '2px solid #213547', 
          borderRadius: '8px', 
          padding: '20px',
          backgroundColor: '#ffffff',
          height: '100%'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#213547' }}>Genel Bilgiler</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Firma Adı: *
            </label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <select 
                value={firmaAdi}
                onChange={(e) => setFirmaAdi(e.target.value)}
                style={{ 
                  flex: '1', 
                  padding: '8px', 
                  borderRadius: '4px', 
                  border: '1px solid #ccc' 
                }}
              >
                <option value="">Firma seçiniz...</option>
                {firmalar.map((firma) => (
                  <option key={firma.id} value={firma.ad}>{firma.ad}</option>
                ))}
              </select>
              <button style={{ 
                width: '40px', 
                height: '36px', 
                borderRadius: '4px', 
                border: '1px solid #ccc',
                backgroundColor: '#f0f0f0',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                +
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Başvuru No: *
            </label>
            <input 
              type="text" 
              value={basvuruNo}
              onChange={(e) => setBasvuruNo(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '8px', 
                borderRadius: '4px', 
                border: '1px solid #ccc' 
              }}
              placeholder="Başvuru numarasını giriniz"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Başvuru Tarihi: *
            </label>
            <input 
              type="date" 
              value={basvuruTarihi}
              onChange={(e) => setBasvuruTarihi(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '8px', 
                borderRadius: '4px', 
                border: '1px solid #ccc' 
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Belgelendirme Türü: *
            </label>
            <div style={{ display: 'flex', gap: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input 
                  type="radio" 
                  name="belgelendirme" 
                  value="özel"
                  checked={belgelendirmeTuru === 'özel'}
                  onChange={(e) => setBelgelendirmeTuru(e.target.value as 'özel' | 'belgelendirme')}
                  style={{ marginRight: '5px' }}
                />
                Özel
              </label>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input 
                  type="radio" 
                  name="belgelendirme" 
                  value="belgelendirme"
                  checked={belgelendirmeTuru === 'belgelendirme'}
                  onChange={(e) => setBelgelendirmeTuru(e.target.value as 'özel' | 'belgelendirme')}
                  style={{ marginRight: '5px' }}
                />
                Belgelendirme
              </label>
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Deney Sayısı: *
            </label>
            <input 
              type="number" 
              min="1" 
              max="20"
              value={deneySayisi}
              onChange={(e) => setDeneySeayisi(parseInt(e.target.value) || 1)}
              style={{ 
                width: '100%', 
                padding: '8px', 
                borderRadius: '4px', 
                border: '1px solid #ccc' 
              }}
            />
          </div>
        </div>

        {/* Sağ Üst Panel */}
        <div style={{ 
          flex: '1', 
          border: '2px solid #213547', 
          borderRadius: '8px', 
          padding: '20px',
          backgroundColor: '#ffffff',
          height: '100%',
          overflowY: 'auto'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#213547' }}>Deney Detayları</h3>
          {renderDeneyGrupları()}
        </div>
      </div>

      {/* Kaydet Butonu */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button 
          onClick={kaydet}
          style={{ 
            padding: '12px 30px', 
            fontSize: '16px', 
            fontWeight: 'bold',
            backgroundColor: '#213547', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Kaydet
        </button>
      </div>

      {/* Alt Panel - Grid */}
      <div style={{ 
        border: '2px solid #213547', 
        borderRadius: '8px', 
        padding: '20px',
        backgroundColor: '#ffffff',
        height: 'auto',
        minHeight: '250px',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#213547' }}>
          Son Kayıtlar
        </h3>
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '4px', 
          height: '220px',
          backgroundColor: '#f9f9f9',
          overflowY: 'auto',
          padding: '10px'
        }}>
          {kayitlariListesi.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#e9e9e9' }}>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Firma</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Başvuru No</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Tarih</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Deney Sayısı</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Tür</th>
                </tr>
              </thead>
              <tbody>
                {kayitlariListesi.slice(-5).reverse().map((kayit) => (
                  <tr key={kayit.id}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{kayit.firmaAdi}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{kayit.basvuruNo}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {new Date(kayit.basvuruTarihi).toLocaleDateString('tr-TR')}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{kayit.deneySayisi}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{kayit.belgelendirmeTuru}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              color: '#666'
            }}>
              Henüz kayıt bulunmamaktadır.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeneyEkleView;