import { useState, useEffect } from 'react';
import DeneyEkleView from './DeneyEkleView.tsx';
import { FIRMALAR } from '../../models/Firma.tsx';
import { PERSONELLER } from '../../models/Personel.tsx';
import { DENEY_TURLERI } from '../../models/DeneyTurleri.tsx';
import type { Deney, DeneyKaydi } from '../../models/Deney.tsx';
import { kayitEkle, kayitGuncelle, kayitSil, tumKayitlariGetir, kayitBul } from '../../data/DeneyListesi.tsx';

function DeneyEkle() {
  const [deneySayisi, setDeneySeayisi] = useState(1);
  const [belgelendirmeTuru, setBelgelendirmeTuru] = useState<'özel' | 'belgelendirme'>('özel');
  const [firmaAdi, setFirmaAdi] = useState('');
  const [basvuruNo, setBasvuruNo] = useState('');
  const [basvuruTarihi, setBasvuruTarihi] = useState('');
  const [deneyler, setDeneyler] = useState<Deney[]>([]);
  const [kayitlariListesi, setKayitlariListesi] = useState<DeneyKaydi[]>([]);
  
  // Düzenleme modu state'leri
  const [duzenlemeModu, setDuzenlemeModu] = useState(false);
  const [duzenlenecekKayitId, setDuzenlenecekKayitId] = useState<string | null>(null);

  // Sayfa yüklendiğinde kayıtları getir
  useEffect(() => {
    setKayitlariListesi(tumKayitlariGetir());
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

  const kaydet = () => {
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

    const kayitVerisi = {
      firmaAdi,
      basvuruNo,
      basvuruTarihi,
      belgelendirmeTuru,
      deneySayisi,
      deneyler
    };

    try {
      if (duzenlemeModu && duzenlenecekKayitId) {
        // Güncelleme işlemi
        kayitGuncelle(duzenlenecekKayitId, kayitVerisi);
        alert('Kayıt başarıyla güncellendi!');
      } else {
        // Yeni kayıt ekleme
        kayitEkle(kayitVerisi);
        alert('Kayıt başarıyla eklendi!');
      }
      
      setKayitlariListesi(tumKayitlariGetir());
      formTemizle();
    } catch (error) {
      alert(duzenlemeModu ? 'Kayıt güncellenirken hata oluştu!' : 'Kayıt eklenirken hata oluştu!');
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
      firmalar={FIRMALAR}
      personeller={PERSONELLER}
      deneyTurleri={DENEY_TURLERI}
    />
  );
}

export default DeneyEkle;