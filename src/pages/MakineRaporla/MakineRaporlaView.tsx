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
  secilenMarka: string;
  setSecilenMarka: (marka: string) => void;
  secilenModel: string;
  setSecilenModel: (model: string) => void;
  secilenKalibrasyonOrg: string;
  setSecilenKalibrasyonOrg: (org: string) => void;
  secilenBakimOrg: string;
  setSecilenBakimOrg: (org: string) => void;
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
  secilenMarka,
  setSecilenMarka,
  secilenModel,
  setSecilenModel,
  secilenKalibrasyonOrg,
  setSecilenKalibrasyonOrg,
  secilenBakimOrg,
  setSecilenBakimOrg,
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

      {/* Filtreler - eski stile yakın */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 16px 64px 16px', marginBottom: '16px', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 1fr', gap: '12px', alignItems: 'end' }}>
          {/* Genel arama */}
          <div style={{ position: 'relative' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10 2a8 8 0 105.29 14.29l4.2 4.2 1.41-1.42-4.2-4.2A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4z"/></svg>
              Genel Arama
            </label>
            <input
              type="text"
              value={aramaMetni}
              onChange={(e) => setAramaMetni(e.target.value)}
              placeholder="Makine adı, seri no, marka, model ara..."
              style={{ width: '100%', padding: '12px 14px 12px 36px', border: '2px solid #e5e7eb', borderRadius: 8, fontSize: 14, outline: 'none' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#dc2626'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; }}
            />
            <div style={{ position: 'absolute', left: 10, top: 30, color: '#9ca3af' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
          </div>
          {/* Marka */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h18v2H3V3zm2 4h14v2H5V7zm-2 4h18v2H3v-2zm2 4h14v2H5v-2z"/></svg>
              Marka
            </label>
            <select value={secilenMarka} onChange={(e) => setSecilenMarka(e.target.value)} style={{ width: '100%', padding: 10, border: '2px solid #e5e7eb', borderRadius: 8, fontSize: 14 }}>
              <option value="">Tümü</option>
              {markalar.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          {/* Model */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v12H4z"/><path d="M2 8h2v8H2zM20 8h2v8h-2z"/></svg>
              Model
            </label>
            <select value={secilenModel} onChange={(e) => setSecilenModel(e.target.value)} style={{ width: '100%', padding: 10, border: '2px solid #e5e7eb', borderRadius: 8, fontSize: 14 }}>
              <option value="">Tümü</option>
              {modeller.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          {/* Kalibrasyon Kuruluşu */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 12l9-9 9 9v9H3v-9zm9-5l-7 7v5h14v-5l-7-7z"/></svg>
              Kalibrasyon Kuruluşu
            </label>
            <select value={secilenKalibrasyonOrg} onChange={(e) => setSecilenKalibrasyonOrg(e.target.value)} style={{ width: '100%', padding: 10, border: '2px solid #e5e7eb', borderRadius: 8, fontSize: 14 }}>
              <option value="">Tümü</option>
              {kalibrasyonOrglari.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          {/* Bakım Kuruluşu */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l4 4-8 8-4-4 8-8zm-6 10l-2 6 6-2-4-4z"/></svg>
              Bakım Kuruluşu
            </label>
            <select value={secilenBakimOrg} onChange={(e) => setSecilenBakimOrg(e.target.value)} style={{ width: '100%', padding: 10, border: '2px solid #e5e7eb', borderRadius: 8, fontSize: 14 }}>
              <option value="">Tümü</option>
              {bakimOrglari.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          {/* Reset butonunu alt satır sağa aldık */}
        </div>
        {/* Kalibrasyon Durumu rozetleri + sağda reset */}
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'start' }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Kalibrasyon Durumu</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { key: 'gecti', label: 'Geçenler', fg: '#dc2626', bg: '#fee2e2' },
              { key: 'yaklaşıyor', label: 'Yaklaşıyor', fg: '#a16207', bg: '#fef3c7' },
              { key: 'normal', label: 'Normal', fg: '#166534', bg: '#dcfce7' },
            ].map((opt) => {
              const key = opt.key as unknown as string;
              const active = secilenDurumlar.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    const next = active ? secilenDurumlar.filter((x) => x !== key) : [...secilenDurumlar, key];
                    setSecilenDurumlar(next);
                  }}
                  style={{ padding: '6px 12px', borderRadius: 9999, border: `2px solid ${active ? opt.fg : 'transparent'}`, background: opt.bg, color: opt.fg, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                >
                  {opt.label}
                </button>
              );
            })}
            </div>
          </div>
          <div style={{ position: 'absolute', right: 16, bottom: 16 }}>
            <button onClick={filtreleriTemizle} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#f9fafb', fontWeight: 600, color: '#374151' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 5h18v2H3zM6 7h12l-5 6v6h-2v-6L6 7z"/></svg>
              Filtreleri Temizle
            </button>
          </div>
        </div>
        {/* Bakım Kuruluşu + Reset (sağ altta) */}
        <div style={{ display: 'none' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l4 4-8 8-4-4 8-8zm-6 10l-2 6 6-2-4-4z"/></svg>
              Bakım Kuruluşu
            </label>
            <select value={secilenBakimOrg} onChange={(e) => setSecilenBakimOrg(e.target.value)} style={{ width: '100%', padding: 10, border: '2px solid #e5e7eb', borderRadius: 8, fontSize: 14 }}>
              <option value="">Tümü</option>
              {bakimOrglari.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          
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

