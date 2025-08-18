import { useState, useEffect } from 'react';
import RaporlaView from './RaporlaView.tsx';
import type { DeneyKaydi } from '../../models/Deney.tsx';

const Raporla: React.FC = () => {
  const [kayitlariListesi, setKayitlariListesi] = useState<DeneyKaydi[]>([]);
  const [aramaMetni, setAramaMetni] = useState<string>('');
  const [filtrelenmisKayitlar, setFiltrelenmisKayitlar] = useState<DeneyKaydi[]>([]);

  // Sayfa yüklendiğinde veritabanından kayıtları getir
  useEffect(() => {
    fetch('/api/applications/all')
      .then((res) => res.json())
      .then((data) => {
        // API'den gelen veriyi DeneyKaydi arayüzüne uygun şekilde dönüştür
        const mapped = data.map((app: any) => ({
          id: app.id,
          firmaAdi: app.companies?.name || '',
          basvuruNo: app.application_no,
          basvuruTarihi: app.application_date,
          belgelendirmeTuru: app.certification_type === 'belgelendirme' ? 'belgelendirme' : 'özel',
          deneySayisi: app.test_count,
          kayitTarihi: app.created_at,
          deneyler: (app.tests || []).map((test: any) => ({
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

  // Arama fonksiyonu
  const aramaYap = (metin: string) => {
    setAramaMetni(metin);
    
    if (!metin.trim()) {
      setFiltrelenmisKayitlar(kayitlariListesi);
      return;
    }

    const aramaTerimi = metin.toLowerCase().trim();
    const filtrelenmis: DeneyKaydi[] = [];

    kayitlariListesi.forEach(kayit => {
      // Firma adı veya başvuru numarası eşleşirse tüm testleri göster
      if (kayit.firmaAdi.toLowerCase().includes(aramaTerimi) || 
          kayit.basvuruNo.toLowerCase().includes(aramaTerimi)) {
        filtrelenmis.push(kayit);
        return;
      }

      // Test bazında filtrele - sadece eşleşen testleri göster
      const eslesen_deneyler = kayit.deneyler.filter(deney => 
        deney.deneyTuru.toLowerCase().includes(aramaTerimi) ||
        deney.sorumluPersonel.toLowerCase().includes(aramaTerimi)
      );

      // Eğer eşleşen test varsa, yeni bir kayıt oluştur (sadece eşleşen testlerle)
      if (eslesen_deneyler.length > 0) {
        filtrelenmis.push({
          ...kayit,
          deneyler: eslesen_deneyler,
          deneySayisi: eslesen_deneyler.length
        });
      }
    });

    setFiltrelenmisKayitlar(filtrelenmis);
  };

  // Aramayı temizle
  const aramayiTemizle = () => {
    setAramaMetni('');
    setFiltrelenmisKayitlar(kayitlariListesi);
  };

  return (
    <RaporlaView 
      kayitlariListesi={filtrelenmisKayitlar}
      tumKayitSayisi={kayitlariListesi.length}
      aramaMetni={aramaMetni}
      aramaYap={aramaYap}
      aramayiTemizle={aramayiTemizle}
    />
  );
};

export default Raporla;