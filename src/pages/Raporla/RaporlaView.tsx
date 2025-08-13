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
          Deney Raporları
        </h1>
        <p style={{ 
          color: '#64748b',
          fontSize: '16px',
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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
            <path d="M3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5ZM5 5H19V19H5V5ZM7 7V9H17V7H7ZM7 11V13H17V11H7ZM7 15V17H14V15H7Z"/>
          </svg>
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
            <div style={{ 
              fontSize: '48px', 
              marginBottom: '16px', 
              color: '#94a3b8',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM12 17C13.1 17 14 16.1 14 15C14 13.9 13.1 13 12 13C10.9 13 10 13.9 10 15C10 16.1 10.9 17 12 17ZM12 7C10.9 7 10 7.9 10 9C10 10.1 10.9 11 12 11C13.1 11 14 10.1 14 9C14 7.9 13.1 7 12 7Z"/>
              </svg>
            </div>
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
                  background: '#7f1d1d',
                  color: 'white'
                }}>
                  <th style={{ 
                    padding: '12px 8px', 
                    textAlign: 'center', 
                    fontWeight: '600', 
                    borderRight: '1px solid #991b1b',
                    width: '5%'
                  }}>
                    SIRA
                  </th>
                  <th style={{ 
                    padding: '12px 8px', 
                    textAlign: 'left', 
                    fontWeight: '600', 
                    borderRight: '1px solid #991b1b',
                    width: '18%'
                  }}>
                    FİRMA ADI
                  </th>
                  <th style={{ 
                    padding: '12px 8px', 
                    textAlign: 'left', 
                    fontWeight: '600', 
                    borderRight: '1px solid #991b1b',
                    width: '10%'
                  }}>
                    BAŞVURU NO
                  </th>
                  <th style={{ 
                    padding: '12px 8px', 
                    textAlign: 'left', 
                    fontWeight: '600', 
                    borderRight: '1px solid #991b1b',
                    width: '10%'
                  }}>
                    BAŞVURU TARİHİ
                  </th>
                  <th style={{ 
                    padding: '12px 8px', 
                    textAlign: 'center', 
                    fontWeight: '600', 
                    borderRight: '1px solid #991b1b',
                    width: '8%'
                  }}>
                    TÜR
                  </th>
                  <th style={{ 
                    padding: '12px 8px', 
                    textAlign: 'left', 
                    fontWeight: '600', 
                    borderRight: '1px solid #991b1b',
                    width: '18%'
                  }}>
                    DENEY TÜRÜ
                  </th>
                  <th style={{ 
                    padding: '12px 8px', 
                    textAlign: 'left', 
                    fontWeight: '600', 
                    borderRight: '1px solid #991b1b',
                    width: '15%'
                  }}>
                    SORUMLU PERSONEL
                  </th>
                  <th style={{ 
                    padding: '12px 8px', 
                    textAlign: 'center', 
                    fontWeight: '600', 
                    borderRight: '1px solid #991b1b',
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
                          background: kayit.belgelendirmeTuru === 'belgelendirme' ? '#fed7aa' : '#fef7cd',
                          color: kayit.belgelendirmeTuru === 'belgelendirme' ? '#c2410c' : '#a16207',
                          border: `1px solid ${kayit.belgelendirmeTuru === 'belgelendirme' ? '#f97316' : '#ca8a04'}`
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
                          background: '#dbeafe',
                          color: '#1d4ed8',
                          border: '1px solid #3b82f6'
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