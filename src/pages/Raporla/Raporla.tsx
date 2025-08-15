import { useState, useEffect } from 'react';
import RaporlaView from './RaporlaView.tsx';
import type { DeneyKaydi } from '../../models/Deney.tsx';

function Raporla() {
  const [kayitlariListesi, setKayitlariListesi] = useState<DeneyKaydi[]>([]);

  // Sayfa yüklendiğinde veritabanından kayıtları getir
  useEffect(() => {
      fetch('/api/applications/all')
        .then((res) => res.json())
        .then((data) => {
          // API'den gelen veriyi DeneyKaydi arayüzüne uygun şekilde dönüştür
          const mapped = data.map((app : any) => ({
            id: app.id,
            firmaAdi: app.companies?.name || '',
            basvuruNo: app.application_no,
            basvuruTarihi: app.application_date,
            belgelendirmeTuru: app.certification_type === 'belgelendirme' ? 'belgelendirme' : 'özel',
            deneySayisi: app.test_count,
            kayitTarihi: app.created_at,
            deneyler: (app.tests || []).map((test: any) => ({
              id: test.id,
              deneyTuru: test.experiment_types?.name || '',
              sorumluPersonel: test.personnel ? `${test.personnel.first_name} ${test.personnel.last_name}` : '',
              akredite: !!test.is_accredited,
              unit_price: test.unit_price
            }))
          }));
          setKayitlariListesi(mapped);
        })
        .catch((err) => {
          console.error('Kayıtlar çekilirken hata:', err);
          setKayitlariListesi([]);
        });
  }, []);

  return (
    <RaporlaView kayitlariListesi={kayitlariListesi} />
  );
}

export default Raporla;