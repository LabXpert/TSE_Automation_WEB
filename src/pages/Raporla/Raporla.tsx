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
  
  // API verilerini cache'lemek için
  const [firmalar, setFirmalar] = useState<Company[]>([]);
  const [personeller, setPersoneller] = useState<Personnel[]>([]);
  const [deneyTurleri, setDeneyTurleri] = useState<ExperimentType[]>([]);

  // Applications'ı frontend formatına çevir
  const convertApplicationsToFrontend = (applications: Application[]): DeneyKaydi[] => {
    const frontendKayitlar: DeneyKaydi[] = [];
    
    for (const app of applications) {
      // Company bilgisini getir
      const firma = firmalar.find(f => f.id === app.company_id);
      const firmaAdi = firma ? firma.name : 'Bilinmeyen Firma';

      // Tests varsa frontend formatına çevir
      const deneyler: Deney[] = app.tests ? app.tests.map(test => {
        // Experiment type ve personnel bilgilerini bul
        const deneyTuru = deneyTurleri.find(dt => dt.id === test.experiment_type_id);
        const deneyTuruAdi = deneyTuru ? deneyTuru.name : 'Bilinmeyen Deney';
        
        const personel = personeller.find(p => p.id === test.responsible_personnel_id);
        const personelAdi = personel ? `${personel.name} ${personel.surname}` : 'Bilinmeyen Personel';

        return {
          id: test.id,
          deneyTuru: deneyTuruAdi,
          sorumluPersonel: personelAdi,
          akredite: false // Varsayılan değer, gerekirse test tablosuna eklenebilir
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
      
      // Paralel olarak tüm verileri getir
      const [firmaResult, personnelResult, deneyTuruResult, applicationResult] = await Promise.all([
        api.companies.getAll(),
        api.personnel.getAllRaw(),
        api.experimentTypes.getAllRaw(),
        api.applications.getAllRaw()
      ]);

      // Önce referans verilerini set et
      if (firmaResult.success && firmaResult.data) {
        setFirmalar(firmaResult.data);
      }
      
      if (personnelResult.success && personnelResult.data) {
        setPersoneller(personnelResult.data);
      }
      
      if (deneyTuruResult.success && deneyTuruResult.data) {
        setDeneyTurleri(deneyTuruResult.data);
      }

      // Sonra applications'ı işle (referans veriler hazır olduğunda)
      if (applicationResult.success && applicationResult.data) {
        // Biraz bekle ki state'ler güncellensin
        setTimeout(() => {
          const frontendKayitlar = convertApplicationsToFrontend(applicationResult.data!);
          setKayitlariListesi(frontendKayitlar);
        }, 100);
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

  // Referans veriler değiştiğinde applications'ı yeniden işle
  useEffect(() => {
    if (firmalar.length > 0 && personeller.length > 0 && deneyTurleri.length > 0) {
      const applicationlariYukle = async () => {
        try {
          const result = await api.applications.getAllRaw();
          if (result.success && result.data) {
            const frontendKayitlar = convertApplicationsToFrontend(result.data);
            setKayitlariListesi(frontendKayitlar);
          }
        } catch (error) {
          console.error('Applications yüklenirken hata:', error);
        }
      };
      applicationlariYukle();
    }
  }, [firmalar, personeller, deneyTurleri]);

  return (
    <RaporlaView 
      kayitlariListesi={kayitlariListesi}
      loading={loading}
      verilerYukle={verilerYukle}
    />
  );
}

export default Raporla;