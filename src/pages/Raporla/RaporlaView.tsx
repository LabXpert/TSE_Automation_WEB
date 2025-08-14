interface Deney {
  id: string;
  deneyTuru: string;
  sorumluPersonel: string;
  akredite: boolean;
}

interface DeneyKaydi {
  id: string;
  firmaAdi: string;
  basvuruNo: string;
  basvuruTarihi: string;
  belgelendirmeTuru: 'özel' | 'belgelendirme';
  deneySayisi: number;
  deneyler: Deney[];
  olusturulma?: string;
}

interface RaporlaViewProps {
  kayitlariListesi: DeneyKaydi[];
  loading: boolean;
  verilerYukle: () => Promise<void>;
}

function RaporlaView({ kayitlariListesi, loading, verilerYukle }: RaporlaViewProps) {
  
  // Excel formatında export fonksiyonu
  const exportToCSV = () => {
    if (kayitlariListesi.length === 0) {
      alert('Export edilecek veri bulunamadı!');
      return;
    }

    // CSV başlıkları
    const headers = [
      'SIRA',
      'FİRMA ADI', 
      'BAŞVURU NO',
      'BAŞVURU TARİHİ',
      'TÜR',
      'DENEY TÜRÜ',
      'SORUMLU PERSONEL',
      'AKREDİTE DURUMU',
      'DURUM'
    ];

    // CSV verileri
    const csvData = [];
    csvData.push(headers.join(','));

    kayitlariListesi.forEach((kayit, kayitIndex) => {
      kayit.deneyler.forEach((deney, deneyIndex) => {
        const row = [
          `"${kayitIndex + 1}.${deneyIndex + 1}"`,
          `"${kayit.firmaAdi}"`,
          `"${kayit.basvuruNo}"`,
          `"${new Date(kayit.basvuruTarihi).toLocaleDateString('tr-TR')}"`,
          `"${kayit.belgelendirmeTuru === 'belgelendirme' ? 'BELG.' : 'ÖZEL'}"`,
          `"${deney.deneyTuru}"`,
          `"${deney.sorumluPersonel}"`,
          `"${deney.akredite ? 'AKREDİTE' : 'DEĞİL'}"`,
          `"TAMAM"`
        ];
        csvData.push(row.join(','));
      });
    });

    // CSV dosyasını indir
    const csvContent = csvData.join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `TSE_Deney_Raporlari_${new Date().toLocaleDateString('tr-TR').replace(/\./g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ 
      padding: '32px', 
      fontFamily: 'inherit',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
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
          Kayıtlı tüm deney verilerini görüntüleyin ve dışa aktarın
        </p>
        
        {/* Loading Indicator */}
        {loading && (
          <div style={{
            marginTop: '16px',
            padding: '12px 16px',
            backgroundColor: '#dbeafe',
            border: '1px solid #3b82f6',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#1d4ed8',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⏳</span>
            <span>Veriler yükleniyor...</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{
        marginBottom: '24px',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={verilerYukle}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: loading ? '#9ca3af' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.2)';
            }
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8.342C20 8.07556 19.8946 7.81876 19.7071 7.62132L16.3787 4.29289C16.1813 4.10536 15.9244 4 15.657 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 9H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 13H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 17H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {loading ? 'Yenileniyor...' : 'Verileri Yenile'}
        </button>

        <button
          onClick={exportToCSV}
          disabled={loading || kayitlariListesi.length === 0}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: (loading || kayitlariListesi.length === 0) ? '#9ca3af' : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: (loading || kayitlariListesi.length === 0) ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)'
          }}
          onMouseEnter={(e) => {
            if (!loading && kayitlariListesi.length > 0) {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && kayitlariListesi.length > 0) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(220, 38, 38, 0.2)';
            }
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          CSV İndir ({kayitlariListesi.reduce((total, kayit) => total + kayit.deneyler.length, 0)} kayıt)
        </button>
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
            ({kayitlariListesi.length} başvuru, {kayitlariListesi.reduce((total, kayit) => total + kayit.deneyler.length, 0)} deney)
          </span>
        </h2>
        
        {loading ? (
          <div style={{
            padding: '60px',
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
              ⏳
            </div>
            <div style={{ fontSize: '20px', marginBottom: '8px', color: '#374151' }}>
              Veriler yükleniyor...
            </div>
            <div style={{ fontSize: '14px' }}>
              Lütfen bekleyin
            </div>
          </div>
        ) : kayitlariListesi.length === 0 ? (
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
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              overflowX: 'auto',
              maxHeight: '70vh',
              overflowY: 'auto',
              scrollbarWidth: 'thin',
              scrollbarColor: '#cbd5e1 #f1f5f9'
            }}
            className="table-scrollbar">
              <style>{`
                .table-scrollbar::-webkit-scrollbar {
                  width: 8px;
                  height: 8px;
                }
                .table-scrollbar::-webkit-scrollbar-track {
                  background: #f1f5f9;
                  border-radius: 4px;
                }
                .table-scrollbar::-webkit-scrollbar-thumb {
                  background: #cbd5e1;
                  border-radius: 4px;
                }
                .table-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: #94a3b8;
                }
              `}</style>
              
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '13px',
                tableLayout: 'fixed',
                minWidth: '1000px'
              }}>
                {/* Sabit Başlık */}
                <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
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
          </div>
        )}
      </div>
    </div>
  );
}

export default RaporlaView;