import React from 'react';
import type { DeneyKaydi } from '../../models/Deney.tsx';

interface RaporlaViewProps {
  kayitlariListesi: DeneyKaydi[];
  tumKayitSayisi: number;
  aramaMetni: string;
  aramaYap: (metin: string) => void;
  aramayiTemizle: () => void;
}

const RaporlaView: React.FC<RaporlaViewProps> = ({ 
  kayitlariListesi, 
  aramaMetni, 
  aramaYap, 
  aramayiTemizle 
}) => {
  return (
    <div style={{ padding: '32px', fontFamily: 'inherit', minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
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
      <div className="card">
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