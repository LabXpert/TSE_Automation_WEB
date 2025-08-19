import { useState, useEffect, useCallback } from 'react';
import * as ExcelJS from 'exceljs';
import RaporlaView from './RaporlaView.tsx';
import ExcelImport from './ExcelImport.tsx';
import type { DeneyKaydi } from '../../models/Deney.tsx';

// API response tip tanımları
interface ApiApplication {
  id: number;
  companies?: { name: string };
  application_no: string;
  application_date: string;
  certification_type: string;
  test_count: number;
  created_at: string;
  tests?: ApiTest[];
}

interface ApiTest {
  id: number;
  experiment_type_name?: string;
  personnel_first_name?: string;
  personnel_last_name?: string;
  is_accredited: boolean;
  uygunluk: boolean;
  unit_price?: number;
}

const Raporla: React.FC = () => {
  const [kayitlariListesi, setKayitlariListesi] = useState<DeneyKaydi[]>([]);
  const [aramaMetni, setAramaMetni] = useState<string>('');
  const [filtrelenmisKayitlar, setFiltrelenmisKayitlar] = useState<DeneyKaydi[]>([]);
  
  // Tarih filtreleme state'leri
  const [baslangicTarihi, setBaslangicTarihi] = useState<string>('');
  const [bitisTarihi, setBitisTarihi] = useState<string>('');
  const [tarihPaneliAcik, setTarihPaneliAcik] = useState<boolean>(false);

  // Personel filtreleme state'leri
  const [secilenPersoneller, setSecilenPersoneller] = useState<string[]>([]);
  const [personelPaneliAcik, setPersonelPaneliAcik] = useState<boolean>(false);
  const [tumPersoneller, setTumPersoneller] = useState<string[]>([]);

  // Deney türü filtreleme state'leri
  const [secilenDeneyTurleri, setSecilenDeneyTurleri] = useState<string[]>([]);
  const [deneyTuruPaneliAcik, setDeneyTuruPaneliAcik] = useState<boolean>(false);
  const [tumDeneyTurleri, setTumDeneyTurleri] = useState<string[]>([]);

  // Durum filtreleme state'leri (Uygunluk + Akredite)
  const [secilenDurumlar, setSecilenDurumlar] = useState<string[]>([]);
  const [durumPaneliAcik, setDurumPaneliAcik] = useState<boolean>(false);

  // Pagination state'leri
  const [sayfaBasiKayit, setSayfaBasiKayit] = useState<number>(25);
  const [aktifSayfa, setAktifSayfa] = useState<number>(1);

  // Excel import state'leri
  const [excelImportAcik, setExcelImportAcik] = useState<boolean>(false);

  // Sayfa yüklendiğinde veritabanından kayıtları getir
  useEffect(() => {
    fetch('/api/applications/all')
      .then((res) => res.json())
      .then((data) => {
        // API'den gelen veriyi DeneyKaydi arayüzüne uygun şekilde dönüştür
        const mapped = data.map((app: ApiApplication) => ({
          id: app.id,
          firmaAdi: app.companies?.name || '',
          basvuruNo: app.application_no,
          basvuruTarihi: app.application_date,
          belgelendirmeTuru: app.certification_type === 'belgelendirme' ? 'belgelendirme' : 'özel',
          deneySayisi: app.test_count,
          kayitTarihi: app.created_at,
          deneyler: (app.tests || []).map((test: ApiTest) => ({
            id: test.id,
            deneyTuru: test.experiment_type_name || '',
            sorumluPersonel: test.personnel_first_name && test.personnel_last_name ? 
              `${test.personnel_first_name} ${test.personnel_last_name}` : '',
            akredite: !!test.is_accredited,
            uygunluk: !!test.uygunluk,
            unit_price: test.unit_price
          }))
        }));
        setKayitlariListesi(mapped);
        setFiltrelenmisKayitlar(mapped); // İlk başta tüm kayıtları göster
        
        // Benzersiz personel ve deney türlerini topla
        const personelSet = new Set<string>();
        const deneyTuruSet = new Set<string>();
        
        mapped.forEach((kayit: DeneyKaydi) => {
          kayit.deneyler.forEach((deney) => {
            if (deney.sorumluPersonel) {
              personelSet.add(deney.sorumluPersonel);
            }
            if (deney.deneyTuru) {
              deneyTuruSet.add(deney.deneyTuru);
            }
          });
        });
        
        setTumPersoneller(Array.from(personelSet).sort());
        setTumDeneyTurleri(Array.from(deneyTuruSet).sort());
      })
      .catch((err) => {
        console.error('Kayıtlar çekilirken hata:', err);
        setKayitlariListesi([]);
        setFiltrelenmisKayitlar([]);
      });
  }, []);

  // Arama fonksiyonu (sadece arama metnini günceller, filtreler otomatik uygulanır)
  const aramaYap = (metin: string) => {
    setAramaMetni(metin);
  };

  // Aramayı temizle
  const aramayiTemizle = () => {
    setAramaMetni('');
  };

  // Hızlı tarih seçimleri
  const hizliTarihSec = (gun: number) => {
    const bugun = new Date();
    const gecmisTarih = new Date();
    gecmisTarih.setDate(bugun.getDate() - gun);
    
    setBaslangicTarihi(gecmisTarih.toISOString().split('T')[0]);
    setBitisTarihi(bugun.toISOString().split('T')[0]);
    setTarihPaneliAcik(false);
  };

  // Tarih filtrelerini temizle
  const tarihFiltreleriniTemizle = () => {
    setBaslangicTarihi('');
    setBitisTarihi('');
    setTarihPaneliAcik(false);
  };

  // Personel filtreleme fonksiyonları
  const personelSec = (personel: string) => {
    setSecilenPersoneller(prev => 
      prev.includes(personel) 
        ? prev.filter(p => p !== personel)
        : [...prev, personel]
    );
  };

  const tumPersonelleriSec = () => {
    setSecilenPersoneller(tumPersoneller);
  };

  const personelFiltreleriniTemizle = () => {
    setSecilenPersoneller([]);
    setPersonelPaneliAcik(false);
  };

  // Deney türü filtreleme fonksiyonları
  const deneyTuruSec = (deneyTuru: string) => {
    setSecilenDeneyTurleri(prev => 
      prev.includes(deneyTuru) 
        ? prev.filter(d => d !== deneyTuru)
        : [...prev, deneyTuru]
    );
  };

  const tumDeneyTurleriniSec = () => {
    setSecilenDeneyTurleri(tumDeneyTurleri);
  };

  const deneyTuruFiltreleriniTemizle = () => {
    setSecilenDeneyTurleri([]);
    setDeneyTuruPaneliAcik(false);
  };

  // Durum filtreleme fonksiyonları (Uygunluk + Akredite birleşik)
  const durumSec = (durum: string) => {
    setSecilenDurumlar(prev => 
      prev.includes(durum) 
        ? prev.filter(d => d !== durum)
        : [...prev, durum]
    );
  };

  const tumDurumlarıSec = () => {
    setSecilenDurumlar(['Uygun', 'Uygun Değil', 'Akredite', 'Akredite Değil']);
  };

  const durumFiltreleriniTemizle = () => {
    setSecilenDurumlar([]);
    setDurumPaneliAcik(false);
  };

  // Excel çıktısı alma fonksiyonu
  const exceleCikart = async () => {
    try {
      console.log('Excel export başlıyor...');
      
      // Yeni workbook oluştur
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Deney Raporları');

      // Başlık satırını tanımla
      const headers = [
        'No',
        'Firma Adı', 
        'Başvuru No',
        'Başvuru Tarihi',
        'Belgelendirme Türü',
        'Deney Türü',
        'Sorumlu Personel',
        'Akredite',
        'Uygunluk',
        'Ücret (TL)'
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
      filtrelenmisKayitlar.forEach((kayit, kayitIndex) => {
        kayit.deneyler.forEach((deney, deneyIndex) => {
          const rowData = [
            `${kayitIndex + 1}.${deneyIndex + 1}`,
            kayit.firmaAdi,
            kayit.basvuruNo,
            new Date(kayit.basvuruTarihi).toLocaleDateString('tr-TR'),
            kayit.belgelendirmeTuru === 'belgelendirme' ? 'BELGELENDIRME' : 'ÖZEL',
            deney.deneyTuru,
            deney.sorumluPersonel,
            deney.akredite ? 'EVET' : 'HAYIR',
            deney.uygunluk ? 'UYGUN' : 'UYGUN DEĞİL',
            deney.unit_price ? `₺${deney.unit_price.toLocaleString('tr-TR')}` : '-'
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
            if (colNumber === 1 || colNumber === 8 || colNumber === 9) {
              cell.alignment = { horizontal: 'center', vertical: 'middle' };
            }
            
            // Durum renklandırması
            if (colNumber === 8) { // Akredite kolonu
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: deney.akredite ? 'DCFCE7' : 'FEE2E2' } // Yeşil/Kırmızı
              };
            }
            
            if (colNumber === 9) { // Uygunluk kolonu
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: deney.uygunluk ? 'DCFCE7' : 'FEE2E2' } // Yeşil/Kırmızı
              };
            }
          });
        });
      });

      // Sütun genişliklerini ayarla
      const columnWidths = [8, 25, 15, 12, 18, 30, 20, 10, 12, 15];
      columnWidths.forEach((width, index) => {
        worksheet.getColumn(index + 1).width = width;
      });

      // Dosya adını oluştur
      const today = new Date();
      const dosyaAdi = `Deney_Raporlari_${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}.xlsx`;
      
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

  // Excel import fonksiyonu
  const handleExcelImport = (data: any[]) => {
    console.log('Excel verisi içe aktarıldı:', data);
    // Burada Excel verisini işleyebilirsiniz
    // Örneğin API'ye gönderebilir veya mevcut verilere ekleyebilirsiniz
    alert(`${data.length} satır veri başarıyla içe aktarıldı!`);
  };

  // Birleşik filtreleme fonksiyonu (arama + tarih + personel + deney türü + durum)
  const filtreleriUygula = useCallback(() => {
    let sonuc = kayitlariListesi;

    // Önce tarih filtresi uygula
    if (baslangicTarihi || bitisTarihi) {
      sonuc = sonuc.filter(kayit => {
        const basvuruTarihi = new Date(kayit.basvuruTarihi);
        const baslangic = baslangicTarihi ? new Date(baslangicTarihi) : null;
        const bitis = bitisTarihi ? new Date(bitisTarihi) : null;

        if (baslangic && basvuruTarihi < baslangic) return false;
        if (bitis && basvuruTarihi > bitis) return false;
        
        return true;
      });
    }

    // Personel filtresi uygula
    if (secilenPersoneller.length > 0) {
      sonuc = sonuc.map(kayit => ({
        ...kayit,
        deneyler: kayit.deneyler.filter(deney => 
          secilenPersoneller.includes(deney.sorumluPersonel)
        )
      })).filter(kayit => kayit.deneyler.length > 0);
    }

    // Deney türü filtresi uygula
    if (secilenDeneyTurleri.length > 0) {
      sonuc = sonuc.map(kayit => ({
        ...kayit,
        deneyler: kayit.deneyler.filter(deney => 
          secilenDeneyTurleri.includes(deney.deneyTuru)
        )
      })).filter(kayit => kayit.deneyler.length > 0);
    }

    // Durum filtresi uygula (Uygunluk + Akredite birleşik)
    if (secilenDurumlar.length > 0) {
      sonuc = sonuc.map(kayit => ({
        ...kayit,
        deneyler: kayit.deneyler.filter(deney => {
          const uygunlukDurumu = deney.uygunluk ? 'Uygun' : 'Uygun Değil';
          const akrediteDurumu = deney.akredite ? 'Akredite' : 'Akredite Değil';
          return secilenDurumlar.includes(uygunlukDurumu) || secilenDurumlar.includes(akrediteDurumu);
        })
      })).filter(kayit => kayit.deneyler.length > 0);
    }

    // Sonra arama filtresi uygula
    if (aramaMetni.trim()) {
      const aramaTerimi = aramaMetni.toLowerCase().trim();
      const aramaFiltreliSonuc: DeneyKaydi[] = [];

      sonuc.forEach(kayit => {
        // Firma adı veya başvuru numarası eşleşirse tüm testleri göster
        if (kayit.firmaAdi.toLowerCase().includes(aramaTerimi) || 
            kayit.basvuruNo.toLowerCase().includes(aramaTerimi)) {
          aramaFiltreliSonuc.push(kayit);
          return;
        }

        // Test bazında filtrele - sadece eşleşen testleri göster
        const eslesen_deneyler = kayit.deneyler.filter(deney => 
          deney.deneyTuru.toLowerCase().includes(aramaTerimi) ||
          deney.sorumluPersonel.toLowerCase().includes(aramaTerimi)
        );

        // Eğer eşleşen test varsa, yeni bir kayıt oluştur (sadece eşleşen testlerle)
        if (eslesen_deneyler.length > 0) {
          aramaFiltreliSonuc.push({
            ...kayit,
            deneyler: eslesen_deneyler,
            deneySayisi: eslesen_deneyler.length
          });
        }
      });

      sonuc = aramaFiltreliSonuc;
    }

    setFiltrelenmisKayitlar(sonuc);
    // Filtre değiştiğinde ilk sayfaya dön
    setAktifSayfa(1);
  }, [aramaMetni, baslangicTarihi, bitisTarihi, kayitlariListesi, secilenPersoneller, secilenDeneyTurleri, secilenDurumlar]);

  // Pagination hesaplamaları
  const tumTestSayisi = filtrelenmisKayitlar.reduce((toplam, kayit) => toplam + kayit.deneyler.length, 0);
  const toplamSayfaSayisi = Math.ceil(tumTestSayisi / sayfaBasiKayit);
  
  // Mevcut sayfadaki test kayıtlarını hesapla
  const sayfaliKayitlar = () => {
    const baslangicIndeksi = (aktifSayfa - 1) * sayfaBasiKayit;
    const bitisIndeksi = baslangicIndeksi + sayfaBasiKayit;
    
    let testSayaci = 0;
    const sonuc: DeneyKaydi[] = [];
    
    for (const kayit of filtrelenmisKayitlar) {
      const yeniKayit: DeneyKaydi = {
        ...kayit,
        deneyler: []
      };
      
      for (const deney of kayit.deneyler) {
        if (testSayaci >= baslangicIndeksi && testSayaci < bitisIndeksi) {
          yeniKayit.deneyler.push(deney);
        }
        testSayaci++;
        
        if (testSayaci >= bitisIndeksi) break;
      }
      
      if (yeniKayit.deneyler.length > 0) {
        yeniKayit.deneySayisi = yeniKayit.deneyler.length;
        sonuc.push(yeniKayit);
      }
      
      if (testSayaci >= bitisIndeksi) break;
    }
    
    return sonuc;
  };

  // Sayfa değiştirme fonksiyonları
  const sayfayaDegistir = (yeniSayfa: number) => {
    if (yeniSayfa >= 1 && yeniSayfa <= toplamSayfaSayisi) {
      setAktifSayfa(yeniSayfa);
    }
  };

  const oncekiSayfa = () => {
    if (aktifSayfa > 1) {
      setAktifSayfa(aktifSayfa - 1);
    }
  };

  const sonrakiSayfa = () => {
    if (aktifSayfa < toplamSayfaSayisi) {
      setAktifSayfa(aktifSayfa + 1);
    }
  };

  // Filtreler değiştiğinde otomatik uygula
  useEffect(() => {
    filtreleriUygula();
  }, [filtreleriUygula]);

  return (
    <>
      <RaporlaView 
        kayitlariListesi={sayfaliKayitlar()}
        tumKayitSayisi={kayitlariListesi.length}
        aramaMetni={aramaMetni}
        aramaYap={aramaYap}
        aramayiTemizle={aramayiTemizle}
        // Tarih filtreleme props
        baslangicTarihi={baslangicTarihi}
        bitisTarihi={bitisTarihi}
        tarihPaneliAcik={tarihPaneliAcik}
        setBaslangicTarihi={setBaslangicTarihi}
        setBitisTarihi={setBitisTarihi}
        setTarihPaneliAcik={setTarihPaneliAcik}
        hizliTarihSec={hizliTarihSec}
        tarihFiltreleriniTemizle={tarihFiltreleriniTemizle}
        // Personel filtreleme props
        secilenPersoneller={secilenPersoneller}
        personelPaneliAcik={personelPaneliAcik}
        tumPersoneller={tumPersoneller}
        setPersonelPaneliAcik={setPersonelPaneliAcik}
        personelSec={personelSec}
        tumPersonelleriSec={tumPersonelleriSec}
        personelFiltreleriniTemizle={personelFiltreleriniTemizle}
        // Deney türü filtreleme props
        secilenDeneyTurleri={secilenDeneyTurleri}
        deneyTuruPaneliAcik={deneyTuruPaneliAcik}
        tumDeneyTurleri={tumDeneyTurleri}
        setDeneyTuruPaneliAcik={setDeneyTuruPaneliAcik}
        deneyTuruSec={deneyTuruSec}
        tumDeneyTurleriniSec={tumDeneyTurleriniSec}
        deneyTuruFiltreleriniTemizle={deneyTuruFiltreleriniTemizle}
        // Durum filtreleme props (Uygunluk + Akredite birleşik)
        secilenDurumlar={secilenDurumlar}
        durumPaneliAcik={durumPaneliAcik}
        setDurumPaneliAcik={setDurumPaneliAcik}
        durumSec={durumSec}
        tumDurumlarıSec={tumDurumlarıSec}
        durumFiltreleriniTemizle={durumFiltreleriniTemizle}
        // Excel çıktısı props
        exceleCikart={exceleCikart}
        setExcelImportAcik={setExcelImportAcik}
        // Pagination props
        aktifSayfa={aktifSayfa}
        toplamSayfaSayisi={toplamSayfaSayisi}
        tumTestSayisi={tumTestSayisi}
        sayfaBasiKayit={sayfaBasiKayit}
        sayfayaDegistir={sayfayaDegistir}
        oncekiSayfa={oncekiSayfa}
        sonrakiSayfa={sonrakiSayfa}
        setSayfaBasiKayit={setSayfaBasiKayit}
      />
      
      <ExcelImport
        isOpen={excelImportAcik}
        onClose={() => setExcelImportAcik(false)}
        onImport={handleExcelImport}
      />
    </>
  );
};

export default Raporla;