import { useState, useEffect, useCallback } from 'react';
import * as ExcelJS from 'exceljs';
import MakineRaporlaView from './MakineRaporlaView.tsx';

// Makine veri tipi - veritabanı şemasına göre
interface MakineData {
  id: number;
  serial_no: string;
  equipment_name: string;
  brand: string;
  model: string;
  measurement_range: string;
  last_calibration_date: string;
  calibration_org_name: string; // JOIN ile kalibrasyon kuruluş adı
  calibration_contact_name?: string;
  calibration_email?: string;
  calibration_phone?: string;
}

const MakineRaporla: React.FC = () => {
  const [makineData, setMakineData] = useState<MakineData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Arama ve filtreleme state'leri
  const [aramaMetni, setAramaMetni] = useState<string>('');
  const [secilenMarka, setSecilenMarka] = useState<string>('');
  const [secilenModel, setSecilenModel] = useState<string>('');
  const [secilenKalibrasyonOrg, setSecilenKalibrasyonOrg] = useState<string>('');
  const [secilenDurumlar, setSecilenDurumlar] = useState<string[]>([]);
  const [filtrelenmisKayitlar, setFiltrelenmisKayitlar] = useState<MakineData[]>([]);

  // Veritabanından makine verilerini yükle
  useEffect(() => {
    const fetchMachineData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/machine-reports/data');
        if (response.ok) {
          const data = await response.json();
          console.log('Gerçek veriler alındı:', data);
          setMakineData(Array.isArray(data) ? data : []);
          // İlk başta sadece makineData'yı set et, filtreleme otomatik çalışacak
        } else {
          console.error('API hatası:', response.statusText);
          setError(`API hatası: ${response.statusText}`);
          setMakineData([]); // Hata durumunda boş liste
        }
      } catch (error) {
        console.error('Veri çekme hatası:', error);
        setError('Veri çekme hatası oluştu');
        setMakineData([]); // Hata durumunda boş liste
      } finally {
        setLoading(false);
      }
    };

   
    fetchMachineData();
  }, []);

  // Sonraki kalibrasyon tarihini ve durumunu hesapla
  const getKalibrasyonDurumu = useCallback((lastCalibrationDate: string) => {
    // Güvenlik kontrolü
    if (!lastCalibrationDate) {
      return {
        sonrakiTarih: new Date().toISOString().split('T')[0],
        durum: 'normal',
        durumText: 'Tarih belirtilmemiş'
      };
    }

    const lastDate = new Date(lastCalibrationDate);
    
    // Tarih geçerliliği kontrolü
    if (isNaN(lastDate.getTime())) {
      return {
        sonrakiTarih: new Date().toISOString().split('T')[0],
        durum: 'normal',
        durumText: 'Geçersiz tarih'
      };
    }

    const nextDate = new Date(lastDate);
    nextDate.setFullYear(lastDate.getFullYear() + 1); // +1 yıl
    
    const today = new Date();
    const diffTime = nextDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let durum = 'normal';
    let durumText = 'Normal';
    
    if (diffDays < 0) {
      durum = 'gecti';
      durumText = `${Math.abs(diffDays)} gün geçti`;
    } else if (diffDays <= 30) {
      durum = 'yaklasıyor';
      durumText = `${diffDays} gün kaldı`;
    } else {
      durum = 'normal';
      durumText = `${diffDays} gün kaldı`;
    }
    
    return {
      sonrakiTarih: nextDate.toISOString().split('T')[0],
      durum,
      durumText
    };
  }, []);

  // Benzersiz marka, model ve kalibrasyon org listelerini hesapla
  const markalar = makineData && makineData.length > 0 
    ? [...new Set(makineData.map(m => m.brand).filter(Boolean))].sort()
    : [];
  const modeller = makineData && makineData.length > 0 
    ? [...new Set(makineData.map(m => m.model).filter(Boolean))].sort()
    : [];
  const kalibrasyonOrglari = makineData && makineData.length > 0 
    ? [...new Set(makineData.map(m => m.calibration_org_name).filter(Boolean))].sort()
    : [];

  // Tüm filtreleri temizle
  const filtreleriTemizle = () => {
    setAramaMetni('');
    setSecilenMarka('');
    setSecilenModel('');
    setSecilenKalibrasyonOrg('');
    setSecilenDurumlar([]);
  };

  // Makine kalibrasyon tarihini güncelle
  const makineKalibrasyonGuncelle = async (makineId: number, yeniTarih: string) => {
    try {
      const response = await fetch(`/api/machines/${makineId}/calibration`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          calibrationDate: yeniTarih
        }),
      });

      if (response.ok) {
        // Başarılı güncelleme sonrası local state'i güncelle
        setMakineData(prevData => 
          prevData.map(makine => 
            makine.id === makineId 
              ? { ...makine, last_calibration_date: yeniTarih }
              : makine
          )
        );
        alert('Kalibrasyon tarihi başarıyla güncellendi!');
      } else {
        const errorData = await response.json();
        alert(`Güncelleme hatası: ${errorData.message || 'Bilinmeyen hata'}`);
      }
    } catch (error) {
      console.error('Kalibrasyon güncelleme hatası:', error);
      alert('Kalibrasyon tarihi güncellenirken bir hata oluştu!');
    }
  };

  // Excel çıktısı alma fonksiyonu
  const exceleCikart = async () => {
    try {
      console.log('Excel export başlıyor...');
      
      // Yeni workbook oluştur
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Makine Raporları');

      // Başlık satırını tanımla
      const headers = [
        'No',
        'Makine Adı',
        'Marka', 
        'Model',
        'Seri No',
        'Ölçüm Aralığı',
        'Son Kalibrasyon',
        'Sonraki Kalibrasyon',
        'Kalibrasyon Durumu',
        'Kalibrasyon Kuruluşu',
        'İletişim Kişisi',
        'Telefon',
        'E-posta'
      ];

      // Başlık satırını ekle
      worksheet.addRow(headers);

      // Başlık satırına stil ver
      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFF' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'DC2626' } // Kırmızı tema
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      // Veri satırlarını ekle
      filtrelenmisKayitlar.forEach((makine, index) => {
        const kalibrasyonDurumu = getKalibrasyonDurumu(makine.last_calibration_date);
        
        const rowData = [
          index + 1,
          makine.equipment_name,
          makine.brand || '-',
          makine.model || '-',
          makine.serial_no,
          makine.measurement_range || '-',
          new Date(makine.last_calibration_date).toLocaleDateString('tr-TR'),
          new Date(kalibrasyonDurumu.sonrakiTarih).toLocaleDateString('tr-TR'),
          kalibrasyonDurumu.durumText,
          makine.calibration_org_name || '-',
          makine.calibration_contact_name || '-',
          makine.calibration_phone || '-',
          makine.calibration_email || '-'
        ];
        
        const row = worksheet.addRow(rowData);
        
        // Satır stilini ayarla
        row.eachCell((cell, colNumber) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
          
          // Hizalama
          if (colNumber === 1 || colNumber === 7 || colNumber === 8 || colNumber === 9) {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
          }
          
          // Durum renklandırması
          if (colNumber === 9) { // Kalibrasyon durumu kolonu
            let bgColor = 'DCFCE7'; // Yeşil (normal)
            if (kalibrasyonDurumu.durum === 'yaklasıyor') {
              bgColor = 'FEF3C7'; // Sarı
            } else if (kalibrasyonDurumu.durum === 'gecti') {
              bgColor = 'FEE2E2'; // Kırmızı
            }
            
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: bgColor }
            };
          }
        });
      });

      // Sütun genişliklerini ayarla
      const columnWidths = [8, 30, 15, 15, 15, 20, 15, 15, 20, 25, 20, 15, 25];
      columnWidths.forEach((width, index) => {
        worksheet.getColumn(index + 1).width = width;
      });

      // Dosya adını oluştur
      const today = new Date();
      const dosyaAdi = `Makine_Raporlari_${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}.xlsx`;
      
      // Excel dosyasını indir
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = dosyaAdi;
      link.click();
      window.URL.revokeObjectURL(url);
      
      console.log('Excel export tamamlandı!');
    } catch (error) {
      console.error('Excel export hatası:', error);
      alert('Excel dosyası oluşturulurken bir hata oluştu!');
    }
  };

  // Birleşik filtreleme fonksiyonu
  const filtreleriUygula = useCallback(() => {
    try {
      // Eğer makine verisi henüz yüklenmediyse çık
      if (!makineData || makineData.length === 0) {
        setFiltrelenmisKayitlar([]);
        return;
      }

      let sonuc = makineData;

    // Arama filtresi
    if (aramaMetni.trim()) {
      const aramaTerimi = aramaMetni.toLowerCase().trim();
      sonuc = sonuc.filter(makine => 
        makine.equipment_name.toLowerCase().includes(aramaTerimi) ||
        makine.serial_no.toLowerCase().includes(aramaTerimi) ||
        (makine.brand && makine.brand.toLowerCase().includes(aramaTerimi)) ||
        (makine.model && makine.model.toLowerCase().includes(aramaTerimi)) ||
        (makine.calibration_org_name && makine.calibration_org_name.toLowerCase().includes(aramaTerimi))
      );
    }

    // Marka filtresi
    if (secilenMarka) {
      sonuc = sonuc.filter(makine => makine.brand === secilenMarka);
    }

    // Model filtresi
    if (secilenModel) {
      sonuc = sonuc.filter(makine => makine.model === secilenModel);
    }

    // Kalibrasyon org filtresi
    if (secilenKalibrasyonOrg) {
      sonuc = sonuc.filter(makine => makine.calibration_org_name === secilenKalibrasyonOrg);
    }

    // Durum filtresi (kalibrasyon durumu)
    if (secilenDurumlar.length > 0) {
      sonuc = sonuc.filter(makine => {
        const kalibrasyonDurumu = getKalibrasyonDurumu(makine.last_calibration_date);
        return secilenDurumlar.includes(kalibrasyonDurumu.durum);
      });
    }

    // Kalibrasyon durumuna göre sırala: geçenler -> yaklaşanlar -> normallar
    sonuc = sonuc.sort((a, b) => {
      // Güvenlik kontrolleri
      if (!a.last_calibration_date || !b.last_calibration_date) {
        return 0; // Tarih yoksa sıralama yapma
      }

      const durumA = getKalibrasyonDurumu(a.last_calibration_date);
      const durumB = getKalibrasyonDurumu(b.last_calibration_date);
      
      // Durum önceliği: gecti (0) -> yaklasıyor (1) -> normal (2)
      const oncelikA = durumA.durum === 'gecti' ? 0 : durumA.durum === 'yaklasıyor' ? 1 : 2;
      const oncelikB = durumB.durum === 'gecti' ? 0 : durumB.durum === 'yaklasıyor' ? 1 : 2;
      
      if (oncelikA !== oncelikB) {
        return oncelikA - oncelikB; // Öncelik sırası: 0 (gecti) -> 1 (yaklasıyor) -> 2 (normal)
      }
      
      // Aynı durumdaysa, kritiklik derecesine göre sırala
      const sonrakiA = new Date(durumA.sonrakiTarih);
      const sonrakiB = new Date(durumB.sonrakiTarih);
      
      // Tarih geçerliliği kontrolü
      if (isNaN(sonrakiA.getTime()) || isNaN(sonrakiB.getTime())) {
        return 0;
      }
      
      if (oncelikA === 0) {
        // Geçenler: En çok geçmiş olanlar en üstte (en eski sonraki tarih)
        return sonrakiA.getTime() - sonrakiB.getTime();
      } else if (oncelikA === 1) {
        // Yaklaşanlar: En yakın süresi dolanlar en üstte
        return sonrakiA.getTime() - sonrakiB.getTime();
      } else {
        // Normallar: Sonraki kalibrasyonu en yakın olanlar en üstte
        return sonrakiA.getTime() - sonrakiB.getTime();
      }
    });

    setFiltrelenmisKayitlar(sonuc);
    } catch (error) {
      console.error('Filtreleme sırasında hata:', error);
      setFiltrelenmisKayitlar([]);
    }
  }, [aramaMetni, secilenMarka, secilenModel, secilenKalibrasyonOrg, secilenDurumlar, makineData, getKalibrasyonDurumu]);

  // Filtreler değiştiğinde otomatik uygula
  useEffect(() => {
    filtreleriUygula();
  }, [filtreleriUygula]);

  return (
    <>
      <MakineRaporlaView 
        makineData={filtrelenmisKayitlar}
        loading={loading}
        error={error}
        getKalibrasyonDurumu={getKalibrasyonDurumu}
        exceleCikart={exceleCikart}
        aramaMetni={aramaMetni}
        setAramaMetni={setAramaMetni}
        secilenMarka={secilenMarka}
        setSecilenMarka={setSecilenMarka}
        secilenModel={secilenModel}
        setSecilenModel={setSecilenModel}
        secilenKalibrasyonOrg={secilenKalibrasyonOrg}
        setSecilenKalibrasyonOrg={setSecilenKalibrasyonOrg}
        secilenDurumlar={secilenDurumlar}
        setSecilenDurumlar={setSecilenDurumlar}
        markalar={markalar}
        modeller={modeller}
        kalibrasyonOrglari={kalibrasyonOrglari}
        filtreleriTemizle={filtreleriTemizle}
        makineKalibrasyonGuncelle={makineKalibrasyonGuncelle}
      />
    </>
  );
};

export default MakineRaporla;
