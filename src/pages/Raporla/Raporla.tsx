import { useState, useEffect, useCallback } from 'react';
import RaporlaView from './RaporlaView.tsx';
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

  // Birleşik filtreleme fonksiyonu (arama + tarih)
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
  }, [aramaMetni, baslangicTarihi, bitisTarihi, kayitlariListesi]);

  // Filtreler değiştiğinde otomatik uygula
  useEffect(() => {
    filtreleriUygula();
  }, [filtreleriUygula]);

  return (
    <RaporlaView 
      kayitlariListesi={filtrelenmisKayitlar}
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
    />
  );
};

export default Raporla;