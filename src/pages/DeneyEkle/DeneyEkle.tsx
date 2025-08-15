import { useState, useEffect } from 'react';
import DeneyEkleView from './DeneyEkleView.tsx';
// import kaldırıldı, firma listesi API'den gelecek
// import kaldırıldı, personel listesi API'den gelecek
// import kaldırıldı, deney türleri API'den gelecek
import type { Deney, DeneyKaydi } from '../../models/Deney.tsx';
import type { Firma } from '../../models/Firma.tsx';
import type { Personel } from '../../models/Personel.tsx';
import type { DeneyTuru } from '../../models/DeneyTurleri.tsx';

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

  const kayitDuzenle = async (id: string) => {
    try {
      const response = await fetch(`/api/applications/all`);
      const allApps = await response.json();
      const app = allApps.find((a: any) => a.id === id);
      if (!app) {
        alert('Kayıt bulunamadı!');
        return;
      }
      setFirmaAdi(app.companies?.name || '');
      setBasvuruNo(app.application_no);
      // Başvuru tarihini ISO formatından yyyy-MM-dd formatına çevirerek doldur
      setBasvuruTarihi(app.application_date ? new Date(app.application_date).toISOString().slice(0, 10) : '');
      setBelgelendirmeTuru(app.certification_type);
      setDeneySeayisi(app.test_count);
      setDeneyler((app.tests || []).map((test: any) => ({
        id: test.id,
        deneyTuru: test.experiment_types?.name || '',
        sorumluPersonel: test.personnel ? `${test.personnel.first_name} ${test.personnel.last_name}` : '',
        akredite: !!test.is_accredited,
        unit_price: test.unit_price
      })));
    setDuzenlemeModu(true);
    setDuzenlenecekKayitId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      alert('Kayıt bulunamadı!');
      console.error(error);
    }
  };

  const kayitSilmeOnayi = async (id: string) => {
    const kayit = kayitlariListesi.find(k => k.id === id);
    if (!kayit) {
      alert('Kayıt bulunamadı!');
      return;
    }
    const onayMesaji = `Kaydı silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz!`;
    if (confirm(onayMesaji)) {
      try {
        const response = await fetch(`/api/applications/${id}`, { method: 'DELETE' });
        if (!response.ok) {
          alert('Kayıt silinirken hata oluştu!');
          return;
        }
        alert('Kayıt başarıyla silindi!');
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
      kaydet={duzenlemeModu ? async () => {
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
        const selectedCompany = firmalar.find(f => f.name === firmaAdi);
        if (!selectedCompany) {
          alert('Seçilen firma bulunamadı!');
          return;
        }
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
          const response = await fetch(`/api/applications/${duzenlenecekKayitId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (!response.ok) {
            const err = await response.json();
            alert('Başvuru güncellenirken hata oluştu: ' + (err.error || 'Bilinmeyen hata'));
            return;
          }
          alert('Başvuru başarıyla güncellendi!');
          formTemizle();
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
          alert('Başvuru güncellenirken hata oluştu!');
          console.error(error);
        }
      } : kaydet}
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