import { useState, useEffect } from 'react';
import DeneyEkleView from './DeneyEkleView.tsx';
// import kaldırıldı, firma listesi API'den gelecek
// import kaldırıldı, personel listesi API'den gelecek
// import kaldırıldı, deney türleri API'den gelecek
import type { Deney, DeneyKaydi } from '../../models/Deney.tsx';
import type { Firma } from '../../models/Firma.tsx';
import type { Personel } from '../../models/Personel.tsx';
import type { DeneyTuru } from '../../models/DeneyTurleri.tsx';
import { kayitSil, tumKayitlariGetir, kayitBul } from '../../data/DeneyListesi.tsx';

function DeneyEkle() {
  const [deneySayisi, setDeneySeayisi] = useState(1);
  const [belgelendirmeTuru, setBelgelendirmeTuru] = useState<'özel' | 'belgelendirme'>('özel');
  const [firmaAdi, setFirmaAdi] = useState('');
  const [basvuruNo, setBasvuruNo] = useState('');
  const [basvuruTarihi, setBasvuruTarihi] = useState('');
  const [deneyler, setDeneyler] = useState<Deney[]>([]);
  const [kayitlariListesi, setKayitlariListesi] = useState<DeneyKaydi[]>([]);
  // Deney türleri, personel ve firma listesi API'den gelecek
  const [deneyTurleri, setDeneyTurleri] = useState<DeneyTuru[]>([]);
  const [personeller, setPersoneller] = useState<Personel[]>([]);
  const [firmalar, setFirmalar] = useState<Firma[]>([]);

  // Düzenleme modu state'leri
  const [duzenlemeModu, setDuzenlemeModu] = useState(false);
  const [duzenlenecekKayitId, setDuzenlenecekKayitId] = useState<string | null>(null);

  // Sayfa yüklendiğinde kayıtları ve deney türlerini getir
  useEffect(() => {
    // Son 5 başvuru kaydını API'den çek
    fetch('/api/applications/recent')
      .then((res) => res.json())
      .then((data) => {
        // API'den gelen veriyi arayüzde beklenen formata dönüştür
  const mapped = data.map((app: any) => ({
          id: app.id,
          firmaAdi: app.companies?.name || '',
          basvuruNo: app.application_no,
          basvuruTarihi: app.application_date,
          belgelendirmeTuru: app.certification_type,
          deneySayisi: app.test_count,
          deneyler: app.tests || []
        }));
        setKayitlariListesi(mapped);
      })
      .catch((err) => {
        console.error('Recent applications fetch error:', err);
        setKayitlariListesi([]);
      });

    // Deney türlerini API'den çek
    fetch('/api/experiment-types')
      .then((res) => res.json())
      .then((data) => setDeneyTurleri(data))
      .catch((err) => {
        console.error('Deney türleri alınamadı:', err);
        setDeneyTurleri([]);
      });

    // Personel listesini API'den çek
    fetch('/api/personnel')
      .then((res) => res.json())
      .then((data) => setPersoneller(data))
      .catch((err) => {
        console.error('Personel listesi alınamadı:', err);
        setPersoneller([]);
      });

    // Firma listesini API'den çek
    fetch('/api/companies')
      .then((res) => res.json())
      .then((data) => setFirmalar(data))
      .catch((err) => {
        console.error('Firma listesi alınamadı:', err);
        setFirmalar([]);
      });
  }, []);

  // Deney sayısı değiştiğinde deney listesini güncelle
  useEffect(() => {
    const yeniDeneyler: Deney[] = [];
    for (let i = 0; i < deneySayisi; i++) {
      // Eğer düzenleme modundaysak ve mevcut deneyler varsa onları koru
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
    // Basic validation
    if (!firmaAdi || !basvuruNo || !basvuruTarihi) {
      alert('Lütfen tüm zorunlu alanları doldurun!');
      return;
    }
    for (let i = 0; i < deneyler.length; i++) {
      if (!deneyler[i].deneyTuru || !deneyler[i].sorumluPersonel) {
      alert(`Lütfen ${i + 1}. deney için tüm alanları doldurun!`);
        return;
      }
    }

    // Find selected company id
    const selectedCompany = firmalar.find(f => f.name === firmaAdi);
    if (!selectedCompany) {
      alert('Seçilen firma bulunamadı!');
      return;
    }

    // Prepare tests array for API
    const testsPayload = deneyler.map((d) => {
      const experimentType = deneyTurleri.find(t => t.name === d.deneyTuru);
      const personnel = personeller.find(p => `${p.first_name} ${p.last_name}` === d.sorumluPersonel);
      return {
        experiment_type_id: experimentType?.id,
        responsible_personnel_id: personnel?.id,
        unit_price: experimentType?.base_price || 0,
        is_accredited: d.akredite || false
      };
    });

    const payload = {
      company_id: selectedCompany.id,
      application_no: basvuruNo,
      application_date: basvuruTarihi,
      certification_type: belgelendirmeTuru,
      tests: testsPayload
    };

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const err = await response.json();
        alert('Başvuru kaydedilirken hata oluştu: ' + (err.error || 'Bilinmeyen hata'));
        return;
      }
        alert('Başvuru ve deneyler başarıyla kaydedildi!');
      formTemizle();
      // Yeni eklenen kaydı hemen listeye ekle
      fetch('/api/applications/recent')
        .then(res => res.json())
        .then(data => {
          const mapped = data.map((app: any) => ({
            id: app.id,
            firmaAdi: app.companies?.name || '',
            basvuruNo: app.application_no,
            basvuruTarihi: app.application_date,
            belgelendirmeTuru: app.certification_type,
            deneySayisi: app.test_count,
            deneyler: app.tests || []
          }));
          setKayitlariListesi(mapped);
        });
    } catch (error) {
      alert('Başvuru kaydedilirken hata oluştu!');
      console.error(error);
    }
  };

  const kayitDuzenle = (id: string) => {
    const kayit = kayitBul(id);
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

  const kayitSilmeOnayi = (id: string) => {
    const kayit = kayitBul(id);
    if (!kayit) {
      alert('Kayıt bulunamadı!');
      return;
    }

    const onayMesaji = `"${kayit.firmaAdi}" firmasının "${kayit.basvuruNo}" numaralı kaydını silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz!`;
    
    if (confirm(onayMesaji)) {
      try {
        kayitSil(id);
        setKayitlariListesi(tumKayitlariGetir());
        alert('Kayıt başarıyla silindi!');
        
        // Eğer silinen kayıt düzenlenmekteyse formu temizle
        if (duzenlemeModu && duzenlenecekKayitId === id) {
          formTemizle();
        }
      } catch (error) {
       alert('Kayıt silinirken hata oluştu!');
        console.error(error);
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

      // Sabit veriler
  firmalar={firmalar}
  personeller={personeller}
  deneyTurleri={deneyTurleri}
    />
  );
}

export default DeneyEkle;