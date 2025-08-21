import { useState, useEffect } from 'react';
import AnalizView from './AnalizView';
import type { DeneyKaydi } from '../../models/Deney';

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

const Analiz: React.FC = () => {
  const [, setKayitlariListesi] = useState<DeneyKaydi[]>([]);
  const [, setLoading] = useState<boolean>(true);

  // Veri çekme
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/applications/all');
        const data = await response.json();
        
        // API'den gelen veriyi DeneyKaydi arayüzüne uygun şekilde dönüştür
        const mapped = data.map((app: ApiApplication) => ({
          id: app.id,
          firmaAdi: app.companies?.name || '',
          basvuruNo: app.application_no,
          basvuruTarihi: app.application_date,
          belgelendirmeTuru: app.certification_type === 'belgelendirme' ? 'belgelendirme' as const : 'özel' as const,
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
        
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return <AnalizView />;
};

export default Analiz;