import type { DeneyKaydi } from '../../models/Deney.tsx';

interface RaporlaViewProps {
  kayitlariListesi: DeneyKaydi[];
}

function RaporlaView({ kayitlariListesi }: RaporlaViewProps) {
  return (
    <div style={{ 
      padding: '32px', 
      fontFamily: 'inherit',
      minHeight: '100vh',
      background: '#ffffff'
    }}>
      {/* Page Header */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '32px',
          fontWeight: '700',
          color: '#0f172a',
          marginBottom: '8px',
          letterSpacing: '-0.025em'
        }}>
          Deney Raporları
        </h1>
        <p style={{ 
          color: '#64748b',
          fontSize: '18px',
          margin: 0
        }}>
          Kayıtlı tüm deney verilerini görüntüleyin
        </p>
      </div>

      {/* Kayıtlar Listesi - Excel Tarzı Tablo */}
      <div className="card">
        <h2 style={{ 
          fontSize: '24px',
          fontWeight: '600',
          color: '#0f172a',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          Tüm Kayıtlar
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
            padding: '60px',
            textAlign: 'center',
            color: '#64748b',
            fontSize: '16px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', color: '#94a3b8' }}>○</div>
            <div style={{ fontSize: '20px', marginBottom: '8px', color: '#374151' }}>
              Henüz kayıt bulunmuyor
            </div>
            <div style={{ fontSize: '14px' }}>
              Yeni deney kayıtları eklemek için "Deney Ekle" sayfasını ziyaret edin
            </div>
          </div>
        ) : (
          <div style={{
            border: '1px solid #e2e8f0',
            borderRadius: '8px'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '13px',
              tableLayout: 'fixed'
            }}>
              {/* Sabit Başlık */}
              <thead>
                <tr style={{
                  background: '#374151',
                  color: 'white'
                }}>
                  <th style={{ 
                    padding: '12px 8px', 
                    textAlign: 'center', 
                    fontWeight: '600', 
                    borderRight: '1px solid #4b5563',
                    width: '5%'
                  }}>
                    SIRA
                  </th>
                  <th style={{ 
                    padding: '12px 8px', 
                    textAlign: 'left', 
                    fontWeight: '600', 
                    borderRight: '1px solid #4b5563',
                    width: '18%'
                  }}>
                    FİRMA ADI
                  </th>
                  <th style={{ 
                    padding: '12px 8px', 
                    textAlign: 'left', 
                    fontWeight: '600', 
                    borderRight: '1px solid #4b5563',
                    width: '10%'
                  }}>
                    BAŞVURU NO
                  </th>
                  <th style={{ 
                    padding: '12px 8px', 
                    textAlign: 'left', 
                    fontWeight: '600', 
                    borderRight: '1px solid #4b5563',
                    width: '10%'
                  }}>
                    BAŞVURU TARİHİ
                  </th>
                  <th style={{ 
                    padding: '12px 8px', 
                    textAlign: 'center', 
                    fontWeight: '600', 
                    borderRight: '1px solid #4b5563',
                    width: '8%'
                  }}>
                    TÜR
                  </th>
                  <th style={{ 
                    padding: '12px 8px', 
                    textAlign: 'left', 
                    fontWeight: '600', 
                    borderRight: '1px solid #4b5563',
                    width: '18%'
                  }}>
                    DENEY TÜRÜ
                  </th>
                  <th style={{ 
                    padding: '12px 8px', 
                    textAlign: 'left', 
                    fontWeight: '600', 
                    borderRight: '1px solid #4b5563',
                    width: '15%'
                  }}>
                    SORUMLU PERSONEL
                  </th>
                  <th style={{ 
                    padding: '12px 8px', 
                    textAlign: 'center', 
                    fontWeight: '600', 
                    borderRight: '1px solid #4b5563',
                    width: '10%'
                  }}>
                    AKREDİTE DURUMU
                  </th>
                  <th style={{ 
                    padding: '12px 8px', 
                    textAlign: 'center', 
                    fontWeight: '600',
                    width: '6%'
                  }}>
                    DURUM
                  </th>
                </tr>
              </thead>
              
              {/* Tüm Veriler */}
              <tbody>
                {kayitlariListesi.map((kayit, kayitIndex) => (
                  kayit.deneyler.map((deney, deneyIndex) => (
                    <tr key={`${kayit.id}-${deney.id}`} style={{
                      borderBottom: '1px solid #f1f5f9',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}>
                      
                      {/* SIRA */}
                      <td style={{
                        padding: '10px 8px',
                        textAlign: 'center',
                        borderRight: '1px solid #f1f5f9',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '12px'
                      }}>
                        {kayitIndex + 1}.{deneyIndex + 1}
                      </td>
                      
                      {/* FİRMA ADI */}
                      <td style={{
                        padding: '10px 8px',
                        borderRight: '1px solid #f1f5f9',
                        fontWeight: '600',
                        color: '#0f172a',
                        fontSize: '12px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {kayit.firmaAdi}
                      </td>
                      
                      {/* BAŞVURU NO */}
                      <td style={{
                        padding: '10px 8px',
                        borderRight: '1px solid #f1f5f9',
                        color: '#374151',
                        fontSize: '12px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {kayit.basvuruNo}
                      </td>
                      
                      {/* BAŞVURU TARİHİ */}
                      <td style={{
                        padding: '10px 8px',
                        borderRight: '1px solid #f1f5f9',
                        color: '#374151',
                        fontSize: '12px'
                      }}>
                        {new Date(kayit.basvuruTarihi).toLocaleDateString('tr-TR')}
                      </td>
                      
                      {/* TÜR */}
                      <td style={{
                        padding: '10px 8px',
                        borderRight: '1px solid #f1f5f9',
                        textAlign: 'center'
                      }}>
                        <span style={{
                          padding: '3px 6px',
                          borderRadius: '3px',
                          fontSize: '10px',
                          fontWeight: '600',
                          background: kayit.belgelendirmeTuru === 'belgelendirme' ? '#e0f2fe' : '#fef7cd',
                          color: kayit.belgelendirmeTuru === 'belgelendirme' ? '#0369a1' : '#a16207',
                          border: `1px solid ${kayit.belgelendirmeTuru === 'belgelendirme' ? '#0284c7' : '#ca8a04'}`
                        }}>
                          {kayit.belgelendirmeTuru === 'belgelendirme' ? 'BELG.' : 'ÖZEL'}
                        </span>
                      </td>
                      
                      {/* DENEY TÜRÜ */}
                      <td style={{
                        padding: '10px 8px',
                        borderRight: '1px solid #f1f5f9',
                        fontWeight: '600',
                        color: '#0f172a',
                        fontSize: '12px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {deney.deneyTuru}
                      </td>
                      
                      {/* SORUMLU PERSONEL */}
                      <td style={{
                        padding: '10px 8px',
                        borderRight: '1px solid #f1f5f9',
                        color: '#374151',
                        fontSize: '12px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {deney.sorumluPersonel}
                      </td>
                      
                      {/* AKREDİTE DURUMU */}
                      <td style={{
                        padding: '10px 8px',
                        borderRight: '1px solid #f1f5f9',
                        textAlign: 'center'
                      }}>
                        <span style={{
                          padding: '3px 6px',
                          borderRadius: '3px',
                          fontSize: '10px',
                          fontWeight: '600',
                          background: deney.akredite ? '#dcfce7' : '#fee2e2',
                          color: deney.akredite ? '#166534' : '#dc2626',
                          border: `1px solid ${deney.akredite ? '#16a34a' : '#ef4444'}`
                        }}>
                          {deney.akredite ? 'AKREDİTE' : 'DEĞİL'}
                        </span>
                      </td>
                      
                      {/* DURUM */}
                      <td style={{
                        padding: '10px 8px',
                        textAlign: 'center'
                      }}>
                        <span style={{
                          padding: '3px 6px',
                          borderRadius: '3px',
                          fontSize: '10px',
                          fontWeight: '600',
                          background: '#e0f2fe',
                          color: '#0369a1',
                          border: '1px solid #0284c7'
                        }}>
                          TAMAM
                        </span>
                      </td>
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
}

export default RaporlaView;