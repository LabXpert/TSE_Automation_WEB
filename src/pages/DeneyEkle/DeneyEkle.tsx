import { useState, useEffect } from 'react';
import DeneyEkleView from './DeneyEkleView';
import { FIRMALAR } from '../../models/Firma.tsx';
import { PERSONELLER } from '../../models/Personel.tsx';
import { DENEY_TURLERI } from '../../models/DeneyTurleri.tsx';
import type { Deney, DeneyKaydi } from '../../models/Deney.tsx';
import { kayitEkle, tumKayitlariGetir } from '../../data/DeneyListesi.tsx';

function DeneyEkle() {
  const [deneySayisi, setDeneySeayisi] = useState(1);
  const [belgelendirmeTuru, setBelgelendirmeTuru] = useState<'özel' | 'belgelendirme'>('özel');
  const [firmaAdi, setFirmaAdi] = useState('');
  const [basvuruNo, setBasvuruNo] = useState('');
  const [basvuruTarihi, setBasvuruTarihi] = useState('');
  const [deneyler, setDeneyler] = useState<Deney[]>([]);
  const [kayitlariListesi, setKayitlariListesi] = useState<DeneyKaydi[]>([]);

  // Sayfa yüklendiğinde kayıtları getir
  useEffect(() => {
    setKayitlariListesi(tumKayitlariGetir());
  }, []);

  // Deney sayısı değiştiğinde deney listesini güncelle
  useEffect(() => {
    const yeniDeneyler: Deney[] = [];
    for (let i = 0; i < deneySayisi; i++) {
      yeniDeneyler.push({
        id: `deney_${i}`,
        deneyTuru: '',
        sorumluPersonel: '',
        akredite: false
      });
    }
    setDeneyler(yeniDeneyler);
  }, [deneySayisi]);

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

    const yeniKayit = {
      firmaAdi,
      basvuruNo,
      basvuruTarihi,
      belgelendirmeTuru,
      deneySayisi,
      deneyler
    };

    try {
      kayitEkle(yeniKayit);
      setKayitlariListesi(tumKayitlariGetir());
      formTemizle();
      alert('Kayıt başarıyla eklendi!');
    } catch (error) {
      alert('Kayıt eklenirken hata oluştu!');
      console.error(error);
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
      
      // Setterlar
      setDeneySeayisi={setDeneySeayisi}
      setBelgelendirmeTuru={setBelgelendirmeTuru}
      setFirmaAdi={setFirmaAdi}
      setBasvuruNo={setBasvuruNo}
      setBasvuruTarihi={setBasvuruTarihi}
      
      // Fonksiyonlar
      deneyGuncelle={deneyGuncelle}
      kaydet={kaydet}
      
      // Sabit veriler
      firmalar={FIRMALAR}
      personeller={PERSONELLER}
      deneyTurleri={DENEY_TURLERI}
    />
  );
}

export default DeneyEkle;