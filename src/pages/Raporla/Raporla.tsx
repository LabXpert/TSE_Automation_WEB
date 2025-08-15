import { useState, useEffect } from 'react';
import RaporlaView from './RaporlaView.tsx';
import { api } from '../../../backend/services/apiService';
import type { Company, Personnel, ExperimentType, Application } from '../../../backend/services/apiService';

interface Deney {
  id: string;
  deneyTuru: string;
  sorumluPersonel: string;
  akredite: boolean;
}

interface DeneyKaydi {
  id: string;
  firmaAdi: string;
  basvuruNo: string;
  basvuruTarihi: string;
  belgelendirmeTuru: 'özel' | 'belgelendirme';
  deneySayisi: number;
  deneyler: Deney[];
  olusturulma?: string;
}

function Raporla() {
  const [kayitlariListesi, setKayitlariListesi] = useState<DeneyKaydi[]>([]);
  const [loading, setLoading] = useState(false);

  // Applications'ı frontend formatına çevir - parametre olarak referans veriler alan versiyon
  const convertApplicationsToFrontendWithData = (
    applications: Application[], 
    firmaListesi: Company[], 
    personnelListesi: Personnel[], 
    deneyTuruListesi: ExperimentType[]
  ): DeneyKaydi[] => {
    const frontendKayitlar: DeneyKaydi[] = [];
    
    for (const app of applications) {
      // Company bilgisini getir
      const firma = firmaListesi.find(f => f.id === app.company_id);
      const firmaAdi = firma ? firma.name : 'Bilinmeyen Firma';

      // Tests varsa frontend formatına çevir
      const deneyler: Deney[] = app.tests ? app.tests.map(test => {
        // Experiment type ve personnel bilgilerini bul (ID'leri string'e çevir)
        const deneyTuru = deneyTuruListesi.find(dt => String(dt.id) === String(test.experiment_type_id));
        const deneyTuruAdi = deneyTuru ? deneyTuru.name : 'Bilinmeyen Deney';
        
        const personel = personnelListesi.find(p => String(p.id) === String(test.responsible_personnel_id));
        const personelAdi = personel ? `${personel.name} ${personel.surname}` : 'Bilinmeyen Personel';

        return {
          id: test.id,
          deneyTuru: deneyTuruAdi,
          sorumluPersonel: personelAdi,
          akredite: test.is_accredited || false // Veritabanından gelen değeri kullan
        };
      }) : [];

      frontendKayitlar.push({
        id: app.id,
        firmaAdi: firmaAdi,
        basvuruNo: app.application_no,
        basvuruTarihi: app.application_date,
        belgelendirmeTuru: app.certification_type as 'özel' | 'belgelendirme',
        deneySayisi: app.test_count,
        deneyler: deneyler,
        olusturulma: app.created_at
      });
    }

    return frontendKayitlar;
  };

  // Tüm verileri API'dan getir
  const verilerYukle = async () => {
    try {
      setLoading(true);
      
      // Önce referans verilerini getir
      const [firmaResult, personnelResult, deneyTuruResult] = await Promise.all([
        api.companies.getAll(),
        api.personnel.getAllRaw(),
        api.experimentTypes.getAllRaw()
      ]);

      // Referans verilerini state'e kaydet
      let firmaListesi: Company[] = [];
      let personnelListesi: Personnel[] = [];
      let deneyTuruListesi: ExperimentType[] = [];

      if (firmaResult.success && firmaResult.data) {
        firmaListesi = firmaResult.data;
      }
      
      if (personnelResult.success && personnelResult.data) {
        personnelListesi = personnelResult.data;
      }
      
      if (deneyTuruResult.success && deneyTuruResult.data) {
        deneyTuruListesi = deneyTuruResult.data;
      }

      // Şimdi applications'ı getir ve işle
      const applicationResult = await api.applications.getAllRaw();
      if (applicationResult.success && applicationResult.data) {
        const frontendKayitlar = convertApplicationsToFrontendWithData(
          applicationResult.data, 
          firmaListesi, 
          personnelListesi, 
          deneyTuruListesi
        );
        setKayitlariListesi(frontendKayitlar);
      }
      
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
      alert('Raporlar yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  // Sayfa yüklendiğinde verileri getir
  useEffect(() => {
    verilerYukle();
  }, []);

  return (
    <RaporlaView 
      kayitlariListesi={kayitlariListesi}
      loading={loading}
      verilerYukle={verilerYukle}
    />
  );
}

export default Raporla;