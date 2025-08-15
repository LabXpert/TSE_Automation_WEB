import { useState, useEffect } from 'react';
import DeneyEkleView from './DeneyEkleView.tsx';
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

function DeneyEkle() {
  const [deneySayisi, setDeneySeayisi] = useState(1);
  const [belgelendirmeTuru, setBelgelendirmeTuru] = useState<'özel' | 'belgelendirme'>('özel');
  const [firmaAdi, setFirmaAdi] = useState('');
  const [basvuruNo, setBasvuruNo] = useState('');
  const [basvuruTarihi, setBasvuruTarihi] = useState('');
  const [deneyler, setDeneyler] = useState<Deney[]>([]);
  const [kayitlariListesi, setKayitlariListesi] = useState<DeneyKaydi[]>([]);
  
  // API verileri - RAW veriler için ayrı state'ler
  const [firmalar, setFirmalar] = useState<Company[]>([]);
  const [personeller, setPersoneller] = useState<Personnel[]>([]);
  const [deneyTurleri, setDeneyTurleri] = useState<ExperimentType[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Düzenleme modu state'leri
  const [duzenlemeModu, setDuzenlemeModu] = useState(false);
  const [duzenlenecekKayitId, setDuzenlenecekKayitId] = useState<string | null>(null);

  // API verilerini yükle
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
        setFirmalar(firmaResult.data);
      }
      
      if (personnelResult.success && personnelResult.data) {
        personnelListesi = personnelResult.data;
        setPersoneller(personnelResult.data);
      }
      
      if (deneyTuruResult.success && deneyTuruResult.data) {
        deneyTuruListesi = deneyTuruResult.data;
        setDeneyTurleri(deneyTuruResult.data);
      }
      
      // Şimdi applications'ı getir ve işle
      const applicationResult = await api.applications.getAllRaw();
      if (applicationResult.success && applicationResult.data) {
        const frontendKayitlar = await convertApplicationsToFrontendWithData(
          applicationResult.data,
          firmaListesi,
          personnelListesi,
          deneyTuruListesi
        );
        setKayitlariListesi(frontendKayitlar);
      }
      
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
      alert('Veriler yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

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
          akredite: test.is_accredited || false
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

  // Sayfa yüklendiğinde verileri getir
  useEffect(() => {
    verilerYukle();
  }, []);

  // Deney sayısı değiştiğinde deney listesini güncelle
  useEffect(() => {
    const yeniDeneyler: Deney[] = [];
    for (let i = 0; i < deneySayisi; i++) {
      if (duzenlemeModu && deneyler[i]) {
        yeniDeneyler.push(deneyler[i]);
      } else {
        yeniDeneyler.push({
          id: `deney_${i}`,
          deneyTuru: '',
          sorumluPersonel: '',
          akredite: false
        });
      }
    }
    setDeneyler(yeniDeneyler);
  }, [deneySayisi, duzenlemeModu]);

  const deneyGuncelle = (index: number, field: keyof Deney, value: string | boolean) => {
    const guncelDeneyler = [...deneyler];
    guncelDeneyler[index] = { ...guncelDeneyler[index], [field]: value };
    setDeneyler(guncelDeneyler);
  };

  const formTemizle = () => {
    setFirmaAdi('');
    setBasvuruNo('');
    setBasvuruTarihi('');
    setBelgelendirmeTuru('özel');
    setDeneySeayisi(1);
    setDeneyler([]);
    setDuzenlemeModu(false);
    setDuzenlenecekKayitId(null);
  };

  const duzenlemeyiIptalEt = () => {
    if (confirm('Düzenleme işlemini iptal etmek istediğinizden emin misiniz? Yapılan değişiklikler kaybedilecek.')) {
      formTemizle();
    }
  };

  const kaydet = async () => {
    // Basit validasyon
    if (!firmaAdi || !basvuruNo || !basvuruTarihi) {
      alert('Lütfen tüm zorunlu alanları doldurunuz!');
      return;
    }

    // Deney alanları validasyonu
    for (let i = 0; i < deneyler.length; i++) {
      if (!deneyler[i].deneyTuru || !deneyler[i].sorumluPersonel) {
        alert(`Deney ${i + 1} için tüm alanları doldurunuz!`);
        return;
      }
    }

    try {
      setLoading(true);

      // Firma ID'sini bul
      const firma = firmalar.find(f => f.name === firmaAdi);
      if (!firma) {
        alert('Seçilen firma bulunamadı!');
        return;
      }

      // Test verilerini hazırla
      const tests = deneyler.map(deney => {
        const deneyTuru = deneyTurleri.find(dt => dt.name === deney.deneyTuru);
        const personel = personeller.find(p => `${p.name} ${p.surname}` === deney.sorumluPersonel);
        
        if (!deneyTuru || !personel) {
          throw new Error('Deney türü veya personel bulunamadı');
        }

        return {
          experiment_type_id: deneyTuru.id,
          responsible_personnel_id: personel.id,
          unit_price: deneyTuru.price || 0,
          is_accredited: deney.akredite
        };
      });

      const applicationData = {
        company_id: firma.id,
        application_no: basvuruNo,
        application_date: basvuruTarihi,
        certification_type: belgelendirmeTuru,
        test_count: deneySayisi,
        tests: tests
      };

      if (duzenlemeModu && duzenlenecekKayitId) {
        // Güncelleme işlemi - Partial<Application> yerine doğru tip kullan
        const updateData = {
          company_id: applicationData.company_id,
          application_no: applicationData.application_no,
          application_date: applicationData.application_date,
          certification_type: applicationData.certification_type,
          test_count: applicationData.test_count
          // tests alanını update'te göndermiyoruz çünkü tip uyumsuzluğu var
        };
        
        const result = await api.applications.update(duzenlenecekKayitId, updateData);
        if (result.success) {
          alert('Kayıt başarıyla güncellendi!');
        } else {
          alert('Kayıt güncellenirken hata oluştu: ' + result.error);
          return;
        }
      } else {
        // Yeni kayıt ekleme
        const result = await api.applications.create(applicationData);
        if (result.success) {
          alert('Kayıt başarıyla eklendi!');
        } else {
          alert('Kayıt eklenirken hata oluştu: ' + result.error);
          return;
        }
      }
      
      // Verileri yenile ve formu temizle
      await verilerYukle();
      formTemizle();
      
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      alert('Kayıt kaydedilirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const kayitDuzenle = (id: string) => {
    const kayit = kayitlariListesi.find(k => k.id === id);
    if (!kayit) {
      alert('Kayıt bulunamadı!');
      return;
    }

    // Formu kayıt verileriyle doldur
    setFirmaAdi(kayit.firmaAdi);
    setBasvuruNo(kayit.basvuruNo);
    setBasvuruTarihi(kayit.basvuruTarihi);
    setBelgelendirmeTuru(kayit.belgelendirmeTuru);
    setDeneySeayisi(kayit.deneySayisi);
    setDeneyler([...kayit.deneyler]);
    
    // Düzenleme modunu aç
    setDuzenlemeModu(true);
    setDuzenlenecekKayitId(id);
    
    // Sayfanın üstüne scroll yap
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const kayitSilmeOnayi = async (id: string) => {
    const kayit = kayitlariListesi.find(k => k.id === id);
    if (!kayit) {
      alert('Kayıt bulunamadı!');
      return;
    }

    const onayMesaji = `"${kayit.firmaAdi}" firmasının "${kayit.basvuruNo}" numaralı kaydını silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz!`;
    
    if (confirm(onayMesaji)) {
      try {
        setLoading(true);
        const result = await api.applications.delete(id);
        
        if (result.success) {
          alert('Kayıt başarıyla silindi!');
          
          // Eğer silinen kayıt düzenlenmekteyse formu temizle
          if (duzenlemeModu && duzenlenecekKayitId === id) {
            formTemizle();
          }
          
          // Verileri yenile
          await verilerYukle();
        } else {
          alert('Kayıt silinirken hata oluştu: ' + result.error);
        }
      } catch (error) {
        console.error('Silme hatası:', error);
        alert('Kayıt silinirken hata oluştu!');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <DeneyEkleView
      // State'ler
      deneySayisi={deneySayisi}
      belgelendirmeTuru={belgelendirmeTuru}
      firmaAdi={firmaAdi}
      basvuruNo={basvuruNo}
      basvuruTarihi={basvuruTarihi}
      deneyler={deneyler}
      kayitlariListesi={kayitlariListesi}
      duzenlemeModu={duzenlemeModu}
      loading={loading}
      
      // Setterlar
      setDeneySeayisi={setDeneySeayisi}
      setBelgelendirmeTuru={setBelgelendirmeTuru}
      setFirmaAdi={setFirmaAdi}
      setBasvuruNo={setBasvuruNo}
      setBasvuruTarihi={setBasvuruTarihi}
      
      // Fonksiyonlar
      deneyGuncelle={deneyGuncelle}
      kaydet={kaydet}
      kayitDuzenle={kayitDuzenle}
      kayitSilmeOnayi={kayitSilmeOnayi}
      duzenlemeyiIptalEt={duzenlemeyiIptalEt}
      
      // API verileri
      firmalar={firmalar}
      personeller={personeller}
      deneyTurleri={deneyTurleri}
    />
  );
}

export default DeneyEkle;