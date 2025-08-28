import React, { useState } from 'react';
import KalibrasyonModal from '../../components/KalibrasyonModal';
import BakimModal from '../../components/BakimModal';

interface MakineData {
  id: number;
  serial_no: string;
  equipment_name: string;
  brand: string;
  model: string;
  measurement_range: string;
  last_calibration_date: string;
  calibration_interval: number;
  calibration_org_name: string;
  calibration_contact_name?: string;
  calibration_email?: string;
  calibration_phone?: string;
  last_maintenance_date?: string;
  maintenance_interval?: number;
  maintenance_org_name?: string;
  maintenance_contact_name?: string;
  maintenance_email?: string;
  maintenance_phone?: string;
}

interface Props {
  makineData: MakineData[];
  loading: boolean;
  error: string | null;
  getKalibrasyonDurumu?: (
    lastCalibrationDate: string,
    calibrationInterval?: number
  ) => { sonrakiTarih: string; durum: string; durumText: string };
  exceleCikart?: () => Promise<void>;
  aramaMetni: string;
  setAramaMetni: (metin: string) => void;
  secilenMarkalar: string[];
  setSecilenMarkalar: (markalar: string[]) => void;
  secilenModeller: string[];
  setSecilenModeller: (modeller: string[]) => void;
  secilenKalibrasyonOrglari: string[];
  setSecilenKalibrasyonOrglari: (orglar: string[]) => void;
  secilenBakimOrglari: string[];
  setSecilenBakimOrglari: (orglar: string[]) => void;
  secilenDurumlar: string[];
  setSecilenDurumlar: (durumlar: string[]) => void;
  markalar: string[];
  modeller: string[];
  kalibrasyonOrglari: string[];
  bakimOrglari: string[];
  filtreleriTemizle: () => void;
  onMakineDataRefresh?: () => void;
}

const cellHeaderStyle: React.CSSProperties = {
  padding: '16px 12px',
  textAlign: 'left',
  fontWeight: 600,
  borderRight: '1px solid #991b1b',
};

const cellCenterHeaderStyle: React.CSSProperties = {
  ...cellHeaderStyle,
  textAlign: 'center',
};

const MakineRaporlaView: React.FC<Props> = ({
  makineData,
  loading,
  error,
  getKalibrasyonDurumu,
  exceleCikart,
  aramaMetni,
  setAramaMetni,
  secilenMarkalar,
  setSecilenMarkalar,
  secilenModeller,
  setSecilenModeller,
  secilenKalibrasyonOrglari,
  setSecilenKalibrasyonOrglari,
  secilenBakimOrglari,
  setSecilenBakimOrglari,
  secilenDurumlar,
  setSecilenDurumlar,
  markalar,
  modeller,
  kalibrasyonOrglari,
  bakimOrglari,
  filtreleriTemizle,
  onMakineDataRefresh,
}) => {
  const [kalibrasyonModalAcik, setKalibrasyonModalAcik] = useState(false);
  const [bakimModalAcik, setBakimModalAcik] = useState(false);
  const [secilenMakine, setSecilenMakine] = useState<MakineData | null>(null);
  const [markaPanelAcik, setMarkaPanelAcik] = useState(false);
  const [modelPanelAcik, setModelPanelAcik] = useState(false);
  const [kalibrasyonPanelAcik, setKalibrasyonPanelAcik] = useState(false);
  const [bakimPanelAcik, setBakimPanelAcik] = useState(false);
  const [durumPanelAcik, setDurumPanelAcik] = useState(false);

  const handleKalibreEtClick = (makine: MakineData) => {
    setSecilenMakine(makine);
    setKalibrasyonModalAcik(true);
  };
  const handleBakimYapClick = (makine: MakineData) => {
    setSecilenMakine(makine);
    setBakimModalAcik(true);
  };
  const handleKalibrasyonTamamlandi = () => {
    onMakineDataRefresh?.();
    setKalibrasyonModalAcik(false);
    setSecilenMakine(null);
  };
  const handleBakimTamamlandi = () => {
    onMakineDataRefresh?.();
    setBakimModalAcik(false);
    setSecilenMakine(null);
  };

  const exportToExcel = () => {
    exceleCikart?.();
  };

  return (
    <div style={{ padding: '32px', fontFamily: 'inherit', minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
      {/* Başlık */}
      <div style={{ marginBottom: '24px', textAlign: 'left', borderBottom: '2px solid #dc2626', paddingBottom: '12px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0', letterSpacing: '-0.025em' }}>Makine Raporlama</h1>
        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Makine bilgileri, kalibrasyon ve bakım durumları</p>
      </div>

      {/* Arama ve filtreler */}
      <div style={{
        background: '#ffffff',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {/* Arama Kutusu */}
          <div style={{ flex: '1', minWidth: '300px', maxWidth: '500px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Makine adı, seri no, marka veya model ara..."
              value={aramaMetni}
              onChange={(e) => setAramaMetni(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 48px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: '#ffffff',
                color: '#374151',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#dc2626';
                e.target.style.boxShadow = '0 0 0 3px rgba(220,38,38,0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="#6b7280"
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            >
              <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5S5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14Z" />
            </svg>
            {aramaMetni && (
              <button
                onClick={() => setAramaMetni('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#6b7280">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>

          {/* Marka Filtresi */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setMarkaPanelAcik(!markaPanelAcik)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                background: secilenMarkalar.length > 0 ? '#fef3c7' : '#ffffff',
                border: `2px solid ${secilenMarkalar.length > 0 ? '#f59e0b' : '#e5e7eb'}`,
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: secilenMarkalar.length > 0 ? '#92400e' : '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h18v2H3V3zm2 4h14v2H5V7zm-2 4h18v2H3v-2zm2 4h14v2H5v-2z"/></svg>
              {secilenMarkalar.length > 0 ? `Marka (${secilenMarkalar.length})` : 'Marka Filtresi'}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ transform: markaPanelAcik ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
              >
                <path d="M7 10L12 15L17 10H7Z" />
              </svg>
            </button>
            {markaPanelAcik && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                zIndex: 1000,
                minWidth: '220px'
              }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>Marka Seçin</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                  <button
                    onClick={() => setSecilenMarkalar(markalar)}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      background: secilenMarkalar.length === markalar.length && markalar.length > 0 ? '#dc2626' : '#f8fafc',
                      color: secilenMarkalar.length === markalar.length && markalar.length > 0 ? '#ffffff' : '#374151',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    Tümü
                  </button>
                  {markalar.map((m) => (
                    <label key={m} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#374151' }}>
                      <input
                        type="checkbox"
                        checked={secilenMarkalar.includes(m)}
                        onChange={() => {
                          const next = secilenMarkalar.includes(m)
                            ? secilenMarkalar.filter((x) => x !== m)
                            : [...secilenMarkalar, m];
                          setSecilenMarkalar(next);
                        }}
                      />
                      {m}
                    </label>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button
                    onClick={() => setSecilenMarkalar([])}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      background: '#f8fafc',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Temizle
                  </button>
                  <button
                    onClick={() => setMarkaPanelAcik(false)}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      background: '#f8fafc',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Kapat
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Model Filtresi */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setModelPanelAcik(!modelPanelAcik)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                background: secilenModeller.length > 0 ? '#fef3c7' : '#ffffff',
                border: `2px solid ${secilenModeller.length > 0 ? '#f59e0b' : '#e5e7eb'}`,
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: secilenModeller.length > 0 ? '#92400e' : '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v12H4z"/><path d="M2 8h2v8H2zM20 8h2v8h-2z"/></svg>
              {secilenModeller.length > 0 ? `Model (${secilenModeller.length})` : 'Model Filtresi'}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ transform: modelPanelAcik ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
              >
                <path d="M7 10L12 15L17 10H7Z" />
              </svg>
            </button>
            {modelPanelAcik && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                zIndex: 1000,
                minWidth: '220px'
              }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>Model Seçin</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                  <button
                    onClick={() => setSecilenModeller(modeller)}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      background: secilenModeller.length === modeller.length && modeller.length > 0 ? '#dc2626' : '#f8fafc',
                      color: secilenModeller.length === modeller.length && modeller.length > 0 ? '#ffffff' : '#374151',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    Tümü
                  </button>
                  {modeller.map((m) => (
                    <label key={m} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#374151' }}>
                      <input
                        type="checkbox"
                        checked={secilenModeller.includes(m)}
                        onChange={() => {
                          const next = secilenModeller.includes(m)
                            ? secilenModeller.filter((x) => x !== m)
                            : [...secilenModeller, m];
                          setSecilenModeller(next);
                        }}
                      />
                      {m}
                    </label>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button
                    onClick={() => setSecilenModeller([])}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      background: '#f8fafc',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Temizle
                  </button>
                  <button
                    onClick={() => setModelPanelAcik(false)}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      background: '#f8fafc',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Kapat
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Kalibrasyon Kuruluşu Filtresi */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setKalibrasyonPanelAcik(!kalibrasyonPanelAcik)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                background: secilenKalibrasyonOrglari.length > 0 ? '#fef3c7' : '#ffffff',
                border: `2px solid ${secilenKalibrasyonOrglari.length > 0 ? '#f59e0b' : '#e5e7eb'}`,
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: secilenKalibrasyonOrglari.length > 0 ? '#92400e' : '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 12l9-9 9 9v9H3v-9zm9-5l-7 7v5h14v-5l-7-7z"/></svg>
{secilenKalibrasyonOrglari.length > 0 ? `Kalibrasyon (${secilenKalibrasyonOrglari.length})` : 'Kalibrasyon Kuruluşu'}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ transform: kalibrasyonPanelAcik ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
              >
                <path d="M7 10L12 15L17 10H7Z" />
              </svg>
            </button>
            {kalibrasyonPanelAcik && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                zIndex: 1000,
                minWidth: '240px'
              }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>Kuruluş Seçin</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                  <button
                    onClick={() => setSecilenKalibrasyonOrglari(kalibrasyonOrglari)}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      background: secilenKalibrasyonOrglari.length === kalibrasyonOrglari.length && kalibrasyonOrglari.length > 0 ? '#dc2626' : '#f8fafc',
                      color: secilenKalibrasyonOrglari.length === kalibrasyonOrglari.length && kalibrasyonOrglari.length > 0 ? '#ffffff' : '#374151',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    Tümü
                  </button>
                  {kalibrasyonOrglari.map((o) => (
                    <label key={o} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#374151' }}>
                      <input
                        type="checkbox"
                        checked={secilenKalibrasyonOrglari.includes(o)}
                        onChange={() => {
                          const next = secilenKalibrasyonOrglari.includes(o)
                            ? secilenKalibrasyonOrglari.filter((x) => x !== o)
                            : [...secilenKalibrasyonOrglari, o];
                          setSecilenKalibrasyonOrglari(next);
                        }}
                      />
                      {o}
                    </label>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button
                    onClick={() => setSecilenKalibrasyonOrglari([])}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      background: '#f8fafc',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Temizle
                  </button>
                  <button
                    onClick={() => setKalibrasyonPanelAcik(false)}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      background: '#f8fafc',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Kapat
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bakım Kuruluşu Filtresi */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setBakimPanelAcik(!bakimPanelAcik)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                background: secilenBakimOrglari.length > 0 ? '#fef3c7' : '#ffffff',
                border: `2px solid ${secilenBakimOrglari.length > 0 ? '#f59e0b' : '#e5e7eb'}`,
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: secilenBakimOrglari.length > 0 ? '#92400e' : '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v2H4zm0 7h16v2H4zm0 7h16v2H4z"/></svg>
             {secilenBakimOrglari.length > 0 ? `Bakım (${secilenBakimOrglari.length})` : 'Bakım Kuruluşu'}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ transform: bakimPanelAcik ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
              >
                <path d="M7 10L12 15L17 10H7Z" />
              </svg>
            </button>
            {bakimPanelAcik && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                zIndex: 1000,
                minWidth: '240px'
              }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>Kuruluş Seçin</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                  <button
                    onClick={() => setSecilenBakimOrglari(bakimOrglari)}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      background: secilenBakimOrglari.length === bakimOrglari.length && bakimOrglari.length > 0 ? '#dc2626' : '#f8fafc',
                      color: secilenBakimOrglari.length === bakimOrglari.length && bakimOrglari.length > 0 ? '#ffffff' : '#374151',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    Tümü
                  </button>
                  {bakimOrglari.map((o) => (
                    <label key={o} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#374151' }}>
                      <input
                        type="checkbox"
                        checked={secilenBakimOrglari.includes(o)}
                        onChange={() => {
                          const next = secilenBakimOrglari.includes(o)
                            ? secilenBakimOrglari.filter((x) => x !== o)
                            : [...secilenBakimOrglari, o];
                          setSecilenBakimOrglari(next);
                        }}
                      />
                      {o}
                    </label>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button
                    onClick={() => setSecilenBakimOrglari([])}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      background: '#f8fafc',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Temizle
                  </button>
                  <button
                    onClick={() => setBakimPanelAcik(false)}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      background: '#f8fafc',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Kapat
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Durum Filtresi */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDurumPanelAcik(!durumPanelAcik)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                background: secilenDurumlar.length > 0 ? '#dcfce7' : '#ffffff',
                border: `2px solid ${secilenDurumlar.length > 0 ? '#16a34a' : '#e5e7eb'}`,
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: secilenDurumlar.length > 0 ? '#166534' : '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v2H4zm0 7h16v2H4zm0 7h16v2H4z"/></svg>
              {secilenDurumlar.length > 0 ? `Durum (${secilenDurumlar.length})` : 'Durum Filtresi'}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ transform: durumPanelAcik ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
              >
                <path d="M7 10L12 15L17 10H7Z" />
              </svg>
            </button>
            {durumPanelAcik && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                zIndex: 1000,
                minWidth: '240px'
              }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>Kalibrasyon Durumu</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                  <button
                    onClick={() => setSecilenDurumlar(['gecti', 'yaklaşıyor', 'normal'])}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      background: secilenDurumlar.length === 3 ? '#dc2626' : '#f8fafc',
                      color: secilenDurumlar.length === 3 ? '#ffffff' : '#374151',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    Tümü
                  </button>
                  {[{ key: 'gecti', label: 'Geçenler' }, { key: 'yaklaşıyor', label: 'Yaklaşıyor' }, { key: 'normal', label: 'Normal' }].map(({ key, label }) => (
                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#374151' }}>
                      <input
                        type="checkbox"
                        checked={secilenDurumlar.includes(key)}
                        onChange={() => {
                          const next = secilenDurumlar.includes(key)
                            ? secilenDurumlar.filter((d) => d !== key)
                            : [...secilenDurumlar, key];
                          setSecilenDurumlar(next);
                        }}
                      />
                      {label}
                    </label>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button
                    onClick={() => setSecilenDurumlar([])}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      background: '#f8fafc',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Temizle
                  </button>
                  <button
                    onClick={() => setDurumPanelAcik(false)}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      background: '#f8fafc',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Kapat
                  </button>
                </div>
              </div>
            )}
          </div>
          

          {/* Filtreleri Temizle */}
          <button
            onClick={filtreleriTemizle}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontWeight: 600,
              color: '#374151',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 5h18v2H3zM6 7h12l-5 6v6h-2v-6L6 7z"/></svg>
            Filtreleri Temizle
          </button>
        </div>
      </div>




      {error && (
        <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px' }}>{error}</div>
      )}

      {!loading && makineData.length > 0 && (
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Makine Listesi ({makineData.length} makine)</h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)', color: '#ffffff' }}>
                  <th style={cellHeaderStyle}>Makine Bilgileri</th>
                  <th style={cellHeaderStyle}>Seri No & Ölçüm Aralığı</th>
                  <th style={cellHeaderStyle}>Marka & Model</th>
                  <th style={cellHeaderStyle}>Kalibrasyon Kuruluşu</th>
                  <th style={cellCenterHeaderStyle}>Bakım Kuruluşu</th>
                  <th style={cellCenterHeaderStyle}>Son Kalibrasyon</th>
                  <th style={cellCenterHeaderStyle}>Sonraki Kalibrasyon</th>
                  <th style={cellCenterHeaderStyle}>Son Bakım</th>
                  <th style={cellCenterHeaderStyle}>Durum</th>
                  <th style={cellCenterHeaderStyle}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {makineData.map((makine, index) => {
                  const durumInfo = getKalibrasyonDurumu ? getKalibrasyonDurumu(makine.last_calibration_date, makine.calibration_interval) : undefined;
                  return (
                    <tr key={makine.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                      {/* Makine Bilgileri */}
                      <td style={{ padding: '16px 12px', borderRight: '1px solid #f1f5f9' }}>
                        <div style={{ fontSize: 16, fontWeight: 600, color: '#0f172a' }}>{makine.equipment_name}</div>
                      </td>
                      {/* Seri No & Ölçüm Aralığı */}
                      <td style={{ padding: '16px 12px', borderRight: '1px solid #f1f5f9' }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>Seri No: {makine.serial_no}</div>
                        <div style={{ fontSize: 13, color: '#64748b' }}>Ölçüm: {makine.measurement_range || '-'}</div>
                      </td>
                      {/* Marka & Model */}
                      <td style={{ padding: '16px 12px', borderRight: '1px solid #f1f5f9' }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{makine.brand || '-'}</div>
                        <div style={{ fontSize: 13, color: '#64748b' }}>Model: {makine.model || '-'}</div>
                      </td>
                      {/* Kalibrasyon Kuruluşu */}
                      <td style={{ padding: '16px 12px', borderRight: '1px solid #f1f5f9' }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>{makine.calibration_org_name || '-'}</div>
                        {makine.calibration_contact_name && (
                          <div style={{ fontSize: 12, color: '#64748b' }}>{makine.calibration_contact_name}</div>
                        )}
                        {(makine.calibration_phone || makine.calibration_email) && (
                          <div style={{ fontSize: 11, color: '#64748b' }}>
                            {[makine.calibration_phone, makine.calibration_email].filter(Boolean).join(' â€¢ ')}
                          </div>
                        )}
                      </td>
                      {/* Bakım Kuruluşu */}
                      <td style={{ padding: '16px 12px', borderRight: '1px solid #f1f5f9' }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>
                          {makine.maintenance_org_name || '-'}
                        </div>
                        {makine.maintenance_contact_name && (
                          <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 8 1.3 8 4v2H4v-2c0-2.7 5.3-4 8-4zm0-2a4 4 0 110-8 4 4 0 010 8z"/></svg>
                            {makine.maintenance_contact_name}
                          </div>
                        )}
                        {(makine.maintenance_phone || makine.maintenance_email) && (
                          <div style={{ fontSize: 11, color: '#64748b', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            {makine.maintenance_phone && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.2c1.1.4 2.3.6 3.6.6a1 1 0 011 1V21a1 1 0 01-1 1C10.3 22 2 13.7 2 3.5a1 1 0 011-1H6.5a1 1 0 011 1c0 1.2.2 2.5.6 3.6a1 1 0 01-.3 1L6.6 10.8z"/></svg>
                                {makine.maintenance_phone}
                              </span>
                            )}
                            {makine.maintenance_email && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4a2 2 0 00-2 2v12c0 1.1.9 2 2 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                                {makine.maintenance_email}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      {/* Son Kalibrasyon */}
                      <td style={{ padding: '16px 12px', borderRight: '1px solid #f1f5f9', textAlign: 'center' }}>
                        {makine.last_calibration_date ? new Date(makine.last_calibration_date).toLocaleDateString('tr-TR') : '-'}
                      </td>
                      {/* Sonraki Kalibrasyon */}
                      <td style={{ padding: '16px 12px', borderRight: '1px solid #f1f5f9', textAlign: 'center' }}>
                        {durumInfo ? new Date(durumInfo.sonrakiTarih).toLocaleDateString('tr-TR') : '-'}
                      </td>
                      {/* Son Bakım */}
                      <td style={{ padding: '16px 12px', borderRight: '1px solid #f1f5f9', textAlign: 'center' }}>
                        {makine.last_maintenance_date ? new Date(makine.last_maintenance_date).toLocaleDateString('tr-TR') : '-'}
                      </td>
                      {/* Durum */}
                      <td style={{ padding: '16px 12px', borderRight: '1px solid #f1f5f9', textAlign: 'center' }}>
                        {durumInfo ? (
                          <div style={{ display: 'inline-block', padding: '6px 12px', backgroundColor: durumInfo.durum === 'gecti' ? '#fee2e2' : (durumInfo.durum === 'yaklasiyor' || durumInfo.durum === 'yaklaşıyor') ? '#fef3c7' : '#dcfce7', color: durumInfo.durum === 'gecti' ? '#dc2626' : (durumInfo.durum === 'yaklasiyor' || durumInfo.durum === 'yaklaşıyor') ? '#a16207' : '#166534', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>{durumInfo.durumText}</div>
                        ) : (
                          <div style={{ display: 'inline-block', padding: '6px 12px', backgroundColor: '#f1f5f9', color: '#64748b', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>-</div>
                        )}
                      </td>
                      {/* İşlemler */}
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                          <button onClick={() => handleKalibreEtClick(makine)} style={{ padding: '6px 10px', minWidth: 120, background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', color: 'white', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', display:'inline-flex', alignItems:'center', gap:6 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a3 3 0 013 3v2h2l3 5h-2l-1 9H7l-1-9H4l3-5h2V5a3 3 0 013-3z"/></svg>
                            Kalibre Et
                          </button>
                          <button onClick={() => handleBakimYapClick(makine)} style={{ padding: '6px 10px', minWidth: 120, background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: 'white', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', display:'inline-flex', alignItems:'center', gap:6 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10V7h3l2-2h4l2 2h3v3l-2 2v2l2 2v3h-3l-2 2h-4l-2-2H7v-3l-2-2v-2l2-2z"/></svg>
                            Bakım Yap
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Excel butonu alt sağda ve sayıyı gösterir */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 24px', borderTop: '1px solid #e2e8f0' }}>
            <button onClick={exportToExcel} disabled={loading || makineData.length === 0} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: (loading || makineData.length === 0) ? '#94a3b8' : 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: loading || makineData.length === 0 ? 'not-allowed' : 'pointer' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                  <path d="M12,11L16,15H13.5V19H10.5V15H8L12,11Z"/>
                </svg>
              {`Excel'e Çıkart (${makineData.length} makine)`}
            </button>
          </div>
        </div>
      )}

      {!loading && makineData.length === 0 && !error && (
        <div style={{ backgroundColor: '#f1f5f9', border: '1px dashed #cbd5e1', color: '#475569', padding: '24px', borderRadius: 8, textAlign: 'center' }}>Kayıt bulunamadı.</div>
      )}

      {/* Modallar */}
      {kalibrasyonModalAcik && secilenMakine && (
        <KalibrasyonModal isOpen={kalibrasyonModalAcik} onClose={() => setKalibrasyonModalAcik(false)} machineId={secilenMakine.id} onCompleted={handleKalibrasyonTamamlandi} />
      )}
      {bakimModalAcik && secilenMakine && (
        <BakimModal isOpen={bakimModalAcik} onClose={() => setBakimModalAcik(false)} machineId={secilenMakine.id} onCompleted={handleBakimTamamlandi} />
      )}
    </div>
  );
};

export default MakineRaporlaView;

