import { useState, useEffect, useCallback, useMemo } from 'react';
import * as ExcelJS from 'exceljs';
import MakineRaporlaView from './MakineRaporlaView.tsx';

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

const MakineRaporla: React.FC = () => {
  const [makineData, setMakineData] = useState<MakineData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [aramaMetni, setAramaMetni] = useState('');
  const [secilenMarkalar, setSecilenMarkalar] = useState<string[]>([]);
  const [secilenModeller, setSecilenModeller] = useState<string[]>([]);
  const [secilenKalibrasyonOrglari, setSecilenKalibrasyonOrglari] = useState<string[]>([]);
  const [secilenBakimOrglari, setSecilenBakimOrglari] = useState<string[]>([]);
  const [secilenDurumlar, setSecilenDurumlar] = useState<string[]>([]);

  const fetchMachineData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/machine-reports/data');
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setMakineData(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Makine verileri alınamadı:', e);
      setError('Veri çekme hatası oluştu');
      setMakineData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMachineData();
  }, [fetchMachineData]);

  // Durum hesaplama
  const getKalibrasyonDurumu = useCallback((lastCalibrationDate: string, calibrationInterval: number = 1) => {
    if (!lastCalibrationDate) {
      const today = new Date().toISOString().split('T')[0];
      return { sonrakiTarih: today, durum: 'normal', durumText: 'Tarih belirtilmemiş' };
    }
    const last = new Date(lastCalibrationDate);
    if (isNaN(last.getTime())) {
      const today = new Date().toISOString().split('T')[0];
      return { sonrakiTarih: today, durum: 'normal', durumText: 'Geçersiz tarih' };
    }
    const interval = calibrationInterval > 0 ? calibrationInterval : 1;
    const next = new Date(last);
    next.setFullYear(last.getFullYear() + interval);
    const today = new Date();
    const diffDays = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { sonrakiTarih: next.toISOString(), durum: 'gecti', durumText: `${Math.abs(diffDays)} gün geçti` };
    if (diffDays <= 30) return { sonrakiTarih: next.toISOString(), durum: 'yaklaşıyor', durumText: `${diffDays} gün kaldı` };
    return { sonrakiTarih: next.toISOString(), durum: 'normal', durumText: `${diffDays} gün kaldı` };
  }, []);

  // Derived options
  const markalar = useMemo(() => {
    const set = new Set(makineData.map(m => m.brand).filter(Boolean));
    const arr = Array.from(set);
    if (makineData.some(m => !m.brand)) arr.unshift('Belirlenmemiş');
    return arr;
  }, [makineData]);
  const modeller = useMemo(() => {
    const set = new Set(makineData.map(m => m.model).filter(Boolean));
    const arr = Array.from(set);
    if (makineData.some(m => !m.model)) arr.unshift('Belirlenmemiş');
    return arr;
  }, [makineData]);
  const kalibrasyonOrglari = useMemo(() => {
    const set = new Set(makineData.map(m => m.calibration_org_name).filter(Boolean));
    const arr = Array.from(set);
    if (makineData.some(m => !m.calibration_org_name)) arr.unshift('Belirlenmemiş');
    return arr;
  }, [makineData]);
  const bakimOrglari = useMemo(() => {
    const set = new Set(
      makineData
        .map((m) => m.maintenance_org_name)
        .filter((name): name is string => Boolean(name))
    );
    const arr = Array.from(set);
    if (makineData.some((m) => !m.maintenance_org_name)) arr.unshift('Belirlenmemiş');
    return arr;
  }, [makineData]);

  const filtreleriTemizle = useCallback(() => {
    setAramaMetni('');
    setSecilenMarkalar([]);
    setSecilenModeller([]);
    setSecilenKalibrasyonOrglari([]);
    setSecilenBakimOrglari([]);
    setSecilenDurumlar([]);
  }, []);

  // Filtered list
  const filtrelenmisKayitlar = useMemo(() => {
    return makineData.filter(m => {
      const haystack = `${m.equipment_name} ${m.serial_no} ${m.brand} ${m.model}`.toLowerCase();
      if (aramaMetni && !haystack.includes(aramaMetni.toLowerCase())) return false;
      if (secilenMarkalar.length > 0) {
        const brandVal = m.brand || 'Belirlenmemiş';
        if (!secilenMarkalar.includes(brandVal)) return false;
      }
      if (secilenModeller.length > 0) {
        const modelVal = m.model || 'Belirlenmemiş';
        if (!secilenModeller.includes(modelVal)) return false;
      }
      if (secilenKalibrasyonOrglari.length > 0) {
        const orgVal = m.calibration_org_name || 'Belirlenmemiş';
        if (!secilenKalibrasyonOrglari.includes(orgVal)) return false;
      }
      if (secilenBakimOrglari.length > 0) {
        const orgVal = m.maintenance_org_name || 'Belirlenmemiş';
        if (!secilenBakimOrglari.includes(orgVal)) return false;
      }
      if (secilenDurumlar.length > 0) {
        const d = getKalibrasyonDurumu(m.last_calibration_date, m.calibration_interval).durum;
        if (!secilenDurumlar.includes(d)) return false;
      }
      return true;
    });
  }, [makineData, aramaMetni, secilenMarkalar, secilenModeller, secilenKalibrasyonOrglari, secilenBakimOrglari, secilenDurumlar, getKalibrasyonDurumu]);

  // Excel export (güncel başlık ve kolonlar ile)
  const exceleCikart = useCallback(async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Makine Raporları');

      const headers = [
        'No', 'Makine Adı', 'Seri No', 'Ölçüm Aralığı', 'Marka', 'Model',
        'Son Kalibrasyon', 'Sonraki Kalibrasyon', 'Kalibrasyon Durumu',
        'Kalibrasyon Kuruluşu', 'İletişim Kişisi', 'Telefon', 'E-posta',
        'Bakım Kuruluşu', 'Bakım İletişim', 'Bakım Telefon', 'Bakım E-posta'
      ];
      worksheet.addRow(headers);
      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DC2626' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });

      filtrelenmisKayitlar.forEach((m, index) => {
        const durum = getKalibrasyonDurumu(m.last_calibration_date, m.calibration_interval);
        const rowData = [
          index + 1,
          m.equipment_name,
          m.serial_no,
          m.measurement_range || '-',
          m.brand || '-',
          m.model || '-',
          m.last_calibration_date ? new Date(m.last_calibration_date).toLocaleDateString('tr-TR') : '-',
          new Date(durum.sonrakiTarih).toLocaleDateString('tr-TR'),
          durum.durumText,
          m.calibration_org_name || '-',
          m.calibration_contact_name || '-',
          m.calibration_phone || '-',
          m.calibration_email || '-',
          m.maintenance_org_name || '-',
          m.maintenance_contact_name || '-',
          m.maintenance_phone || '-',
          m.maintenance_email || '-',
        ];
        const row = worksheet.addRow(rowData);
        row.eachCell((cell, col) => {
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          if ([1, 7, 8, 9, 15, 16].includes(col)) {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
          }
          if (col === 9) {
            let bg = 'DCFCE7';
            if (durum.durum === 'yaklaşıyor') bg = 'FEF3C7';
            if (durum.durum === 'gecti') bg = 'FEE2E2';
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } } as any;
          }
        });
      });

      const widths = [8, 28, 18, 18, 14, 14, 16, 16, 18, 24, 20, 16, 22, 24, 20, 16, 22];
      widths.forEach((w, i) => (worksheet.getColumn(i + 1).width = w));

      const buf = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const today = new Date();
      a.download = `Makine_Raporlari_${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Excel export hatası:', e);
    }
  }, [filtrelenmisKayitlar, getKalibrasyonDurumu]);

  return (
    <MakineRaporlaView
      makineData={filtrelenmisKayitlar}
      loading={loading}
      error={error}
      getKalibrasyonDurumu={getKalibrasyonDurumu}
      exceleCikart={exceleCikart}
      aramaMetni={aramaMetni}
      setAramaMetni={setAramaMetni}
      secilenMarkalar={secilenMarkalar}
      setSecilenMarkalar={setSecilenMarkalar}
      secilenModeller={secilenModeller}
      setSecilenModeller={setSecilenModeller}
      secilenKalibrasyonOrglari={secilenKalibrasyonOrglari}
      setSecilenKalibrasyonOrglari={setSecilenKalibrasyonOrglari}
      secilenBakimOrglari={secilenBakimOrglari}
      setSecilenBakimOrglari={setSecilenBakimOrglari}
      secilenDurumlar={secilenDurumlar}
      setSecilenDurumlar={setSecilenDurumlar}
      markalar={markalar}
      modeller={modeller}
      kalibrasyonOrglari={kalibrasyonOrglari}
      bakimOrglari={bakimOrglari}
      filtreleriTemizle={filtreleriTemizle}
      onMakineDataRefresh={fetchMachineData}
    />
  );
};

export default MakineRaporla;
