// src/pages/DeneyEkle/DeneyEkleView.tsx
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
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
  searchTerm: string;
  
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
  onSearch: () => void;
  onSearchTermChange: (term: string) => void;
  
  // Sabit veriler
  firmalar: Firma[];
  personeller: Personel[];
  deneyTurleri: DeneyTuru[];
  
  // Hesaplanmış değerler
  toplamUcretTxt: string;
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
  searchTerm,
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
  onSearch,
  onSearchTermChange,
  firmalar,
  personeller,
  deneyTurleri,
  toplamUcretTxt
}: DeneyEkleViewProps) {
  const navigate = useNavigate();

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
              <Select
                value={deneyTurleri.find(t => t.name === deneyler[i]?.deneyTuru) ? { 
                  value: deneyler[i]?.deneyTuru, 
                  label: deneyler[i]?.deneyTuru 
                } : null}
                onChange={(selected) => deneyGuncelle(i, 'deneyTuru', selected ? selected.value : '')}
                options={deneyTurleri.map(tur => ({ value: tur.name, label: tur.name }))}
                placeholder="Deney türü yazın veya seçin..."
                isSearchable={true}
                isClearable={true}
                noOptionsMessage={() => "Deney türü bulunamadı"}
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    padding: '4px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: '#ffffff',
                    outline: 'none !important',
                    boxShadow: state.isFocused ? '0 0 0 3px rgba(220, 38, 38, 0.1)' : 'none',
                    borderColor: state.isFocused ? '#dc2626' : '#e5e7eb',
                    '&:hover': {
                      borderColor: state.isFocused ? '#dc2626' : '#e5e7eb'
                    }
                  }),
                  placeholder: (provided) => ({
                    ...provided,
                    color: '#9ca3af'
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    color: '#374151'
                  }),
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 9999,
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? '#dc2626' : state.isFocused ? '#fef2f2' : '#ffffff',
                    color: state.isSelected ? '#ffffff' : '#374151',
                    '&:hover': {
                      backgroundColor: state.isSelected ? '#dc2626' : '#fef2f2'
                    }
                  })
                }}
              />
            </div>

            <div>
              <label>Sorumlu Personel *</label>
              <Select
                value={personeller.find(p => (p.first_name + ' ' + p.last_name) === deneyler[i]?.sorumluPersonel) ? { 
                  value: deneyler[i]?.sorumluPersonel, 
                  label: deneyler[i]?.sorumluPersonel 
                } : null}
                onChange={(selected) => deneyGuncelle(i, 'sorumluPersonel', selected ? selected.value : '')}
                options={personeller.map(personel => ({ 
                  value: personel.first_name + ' ' + personel.last_name, 
                  label: personel.first_name + ' ' + personel.last_name 
                }))}
                placeholder="Personel adı yazın veya seçin..."
                isSearchable={true}
                isClearable={true}
                noOptionsMessage={() => "Personel bulunamadı"}
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    padding: '4px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: '#ffffff',
                    outline: 'none !important',
                    boxShadow: state.isFocused ? '0 0 0 3px rgba(220, 38, 38, 0.1)' : 'none',
                    borderColor: state.isFocused ? '#dc2626' : '#e5e7eb',
                    '&:hover': {
                      borderColor: state.isFocused ? '#dc2626' : '#e5e7eb'
                    }
                  }),
                  placeholder: (provided) => ({
                    ...provided,
                    color: '#9ca3af'
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    color: '#374151'
                  }),
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 9999,
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? '#dc2626' : state.isFocused ? '#fef2f2' : '#ffffff',
                    color: state.isSelected ? '#ffffff' : '#374151',
                    '&:hover': {
                      backgroundColor: state.isSelected ? '#dc2626' : '#fef2f2'
                    }
                  })
                }}
              />
            </div>

                        {/* Numune Sayısı */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#374151' }}>
                Numune Sayısı <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 400 }}>(adet)</span>
              </label>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                value={
                  // sayı ya da string olabilir; boşsa 1 göster
                  (deneyler[i]?.numuneSayisi as unknown as number) ??
                  (deneyler[i]?.numuneSayisi ? Number(deneyler[i]?.numuneSayisi) : 1)
                }
                onChange={(e) => {
                  const v = e.target.value === '' ? '' : String(Math.max(1, parseInt(e.target.value || '1', 10)));
                  // değeri string olarak gönderiyoruz (deneyGuncelle tipine uyumlu)
                  deneyGuncelle(i, 'numuneSayisi' as keyof Deney, v as unknown as string);
                }}
                onBlur={(e) => {
                  if (!e.target.value || Number(e.target.value) < 1) {
                    e.target.value = '1';
                    deneyGuncelle(i, 'numuneSayisi' as keyof Deney, '1' as unknown as string);
                  }
                }}
                placeholder="Örn: 3"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '10px 12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = '#dc2626';
                  (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                }}
                onBlurCapture={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = '#e5e7eb';
                  (e.target as HTMLInputElement).style.boxShadow = 'none';
                }}
              />
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

              {/* Uygunluk Checkbox */}
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                marginTop: '8px'
              }}>
                <input 
                  type="checkbox" 
                  checked={deneyler[i]?.uygunluk || false}
                  onChange={(e) => deneyGuncelle(i, 'uygunluk', e.target.checked)}
                  style={{ 
                    width: '16px',
                    height: '16px',
                    margin: 0
                  }}
                />
                <span>Uygunluk</span>
                <div style={{
                  fontSize: '12px',
                  color: '#64748b',
                  fontWeight: '400'
                }}>
                  (+750₺ ek ücret)
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
      <div style={{ 
        marginBottom: '32px',
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
        
        {/* Sol Panel - Temel Bilgiler */}
        <div style={{
        width: '600px',
        height: '600px',
        background: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0',
        position: 'sticky',
        top: '32px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Başlık - Kırmızı çizgi ile */}
        <div style={{ 
          marginBottom: '24px'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: '#0f172a', 
            margin: '0 0 8px 0' 
          }}>
            Temel Bilgiler
          </h2>
          <p style={{ 
            fontSize: '14px', 
            color: '#64748b', 
            margin: '0' 
          }}>
            Deney kaydı için gerekli temel bilgileri girin
          </p>
        </div>

          <div style={{ 
            display: 'grid', 
            gap: '16px',
            gridTemplateColumns: window.innerWidth > 768 && window.innerWidth <= 1024 ? 'repeat(2, 1fr)' : '1fr',
            flex: 1,
            alignContent: 'start'
          }}>
            {/* Firma Adı */}
<div style={{ 
  display: 'flex', 
  flexDirection: 'column', 
  marginBottom: '20px' 
}}>
  <label style={{ 
    marginBottom: '8px', 
    fontWeight: '600', 
    color: '#374151' 
  }}>
    Firma Adı:
  </label>
  <div style={{
    display: 'flex',
    gap: '12px',
    alignItems: 'stretch'
  }}>
    <Select
      value={firmalar.find(f => f.name === firmaAdi) ? { value: firmaAdi, label: firmaAdi } : null}
      onChange={(selected) => setFirmaAdi(selected ? selected.value : '')}
      options={firmalar.map(firma => ({ value: firma.name, label: firma.name }))}
      placeholder="Firma adı yazın veya seçin..."
      isSearchable={true}
      isClearable={true}
      noOptionsMessage={() => "Firma bulunamadı"}
      styles={{
        container: (provided) => ({
          ...provided,
          flex: 1
        }),
        control: (provided, state) => ({
          ...provided,
          padding: '4px',
          border: '2px solid #e5e7eb',
          borderRadius: '8px',
          fontSize: '14px',
          backgroundColor: '#ffffff',
          outline: 'none !important',
          boxShadow: state.isFocused ? '0 0 0 3px rgba(220, 38, 38, 0.1)' : 'none',
          borderColor: state.isFocused ? '#dc2626' : '#e5e7eb',
          '&:hover': {
            borderColor: state.isFocused ? '#dc2626' : '#e5e7eb'
          }
        }),
        placeholder: (provided) => ({
          ...provided,
          color: '#9ca3af'
        }),
        singleValue: (provided) => ({
          ...provided,
          color: '#374151'
        }),
        menu: (provided) => ({
          ...provided,
          zIndex: 9999,
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected ? '#dc2626' : state.isFocused ? '#fef2f2' : '#ffffff',
          color: state.isSelected ? '#ffffff' : '#374151',
          '&:hover': {
            backgroundColor: state.isSelected ? '#dc2626' : '#fef2f2'
          }
        })
      }}
    />
    
    <button
      type="button"
      onClick={() => navigate('/firma-ekle')}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '48px',
        height: '48px',
        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)',
        fontSize: '32px',
        fontWeight: '600',
        lineHeight: '1',
        paddingTop: '3px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(220, 38, 38, 0.2)';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(0.95)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px) scale(1)';
      }}
      title="Yeni Firma Ekle"
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

            {/* Deney Sayısı */}
            <div>
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
  <div
    style={{
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: '16px',
      paddingTop: '16px',
      flexShrink: 0,
      background: 'transparent',
      marginTop: '8px',
      flexWrap: 'wrap',
    }}
  >
    {duzenlemeModu && (
      <button
        onClick={duzenlemeyiIptalEt}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(107,114,128,0.3)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(107,114,128,0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(107,114,128,0.3)';
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        İptal
      </button>
    )}

    {/* Toplam Ücret rozeti (Kaydet'in hemen solu) */}
    <div
      title="Toplam Ücret (önizleme)"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 14px',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        background: 'white',
        fontSize: '14px',
        fontWeight: 700,
        color: '#0f172a',
        boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#16a34a">
        <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm1 17h-2v-2h2v2zm1.9-7.5c-.4 1.1-1.4 1.6-2.4 2-.8.3-1.2.6-1.2 1.1v.4H9v-.5c0-1.6 1.1-2.2 2.2-2.6.9-.3 1.6-.7 1.9-1.4.2-.5.1-1.1-.2-1.5-.3-.4-.9-.7-1.6-.7-.7 0-1.3.3-1.6.8-.2.3-.3.6-.3 1H7.5c0-1 .4-1.9 1.1-2.5.7-.6 1.7-1 2.8-1 1.3 0 2.4.5 3.1 1.3.7.8.9 2 .5 3z"/>
      </svg>
      <span>Toplam:</span>
      <span style={{ fontWeight: 800 }}>{toplamUcretTxt}</span>
    </div>

    <button
      onClick={kaydet}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(220,38,38,0.2)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(220,38,38,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(220,38,38,0.2)';
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M19 21H5C4.45 21 4 20.55 4 20V4C4 3.45 4.45 3 5 3H16L20 7V20C20 20.55 19.55 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 21V13H7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 3V8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {duzenlemeModu ? 'Güncelle' : 'Kaydet'}
    </button>
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

        {/* Search Box */}
        <div style={{
          marginBottom: '20px',
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            position: 'relative',
            width: '100%'
          }}>
            <input
              type="text"
              placeholder="Kayıt ara (firma adı, başvuru no, personel...)"
              value={searchTerm}
              onChange={(e) => {
                onSearchTermChange(e.target.value);
                onSearch();
              }}
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
            <svg
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
        </div>
        
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
                            backgroundColor: '#ef4444',
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
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 4H4C3.45 4 3 4.45 3 5V20C3 20.55 3.45 21 4 21H19C19.55 21 20 20.55 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18.5 2.5C18.89 2.11 19.39 1.89 19.93 1.89C20.47 1.89 20.97 2.11 21.36 2.5C21.75 2.89 21.97 3.39 21.97 3.93C21.97 4.47 21.75 4.97 21.36 5.36L12 14.83L8 16L9.17 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
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
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M19 6V20C19 20.55 18.55 21 18 21H6C5.45 21 5 20.55 5 20V6M8 6V4C8 3.45 8.45 3 9 3H15C15.55 3 16 3.45 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
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