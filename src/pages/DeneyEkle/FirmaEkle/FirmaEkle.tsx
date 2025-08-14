import { useState } from 'react';
import FirmaEkleView from './FirmaEkleView';
import { FIRMALAR } from '../../../models/Firma';

const FirmaEkle: React.FC = () => {
  // Form state'leri
  const [formData, setFormData] = useState({
    ad: '',
    vergiNo: '',
    yetkili: '',
    telefon: '',
    adres: '',
    email: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [firmaListesi, setFirmaListesi] = useState(FIRMALAR);
  
  // Düzenleme modu state'leri
  const [duzenlemeModu, setDuzenlemeModu] = useState(false);
  const [duzenlenecekFirmaId, setDuzenlenecekFirmaId] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Hata varsa temizle
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const formTemizle = () => {
    setFormData({
      ad: '',
      vergiNo: '',
      yetkili: '',
      telefon: '',
      adres: '',
      email: ''
    });
    setErrors({});
    setDuzenlemeModu(false);
    setDuzenlenecekFirmaId(null);
  };

  const duzenlemeyiIptalEt = () => {
    if (confirm('Düzenleme işlemini iptal etmek istediğinizden emin misiniz? Yapılan değişiklikler kaybedilecek.')) {
      formTemizle();
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.ad.trim()) {
      newErrors.ad = 'Firma adı zorunludur';
    }

    if (!formData.vergiNo.trim()) {
      newErrors.vergiNo = 'Vergi numarası zorunludur';
    } else if (formData.vergiNo.length !== 10) {
      newErrors.vergiNo = 'Vergi numarası 10 haneli olmalıdır';
    }

    if (!formData.yetkili.trim()) {
      newErrors.yetkili = 'Yetkili kişi zorunludur';
    }

    if (!formData.telefon.trim()) {
      newErrors.telefon = 'Telefon numarası zorunludur';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email adresi zorunludur';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir email adresi giriniz';
    }

    return newErrors;
  };

  const kaydet = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (duzenlemeModu && duzenlenecekFirmaId) {
        // Güncelleme işlemi
        const index = FIRMALAR.findIndex(f => f.id === duzenlenecekFirmaId);
        if (index !== -1) {
          const guncelFirma = {
            id: duzenlenecekFirmaId,
            ad: formData.ad.trim(),
            email: formData.email.trim(),
            adres: formData.adres.trim() || undefined,
            telefon: formData.telefon.trim() || undefined
          };
          
          FIRMALAR[index] = guncelFirma;
          setFirmaListesi([...FIRMALAR]);
          alert('Firma başarıyla güncellendi!');
        }
      } else {
        // Yeni firma oluştur
        const yeniFirma = {
          id: (FIRMALAR.length + 1).toString(),
          ad: formData.ad.trim(),
          email: formData.email.trim(),
          adres: formData.adres.trim() || undefined,
          telefon: formData.telefon.trim() || undefined
        };

        // Firmalar listesine ekle
        FIRMALAR.push(yeniFirma);
        setFirmaListesi([...FIRMALAR]);

        alert(`${yeniFirma.ad} başarıyla eklendi!`);
      }
      
      formTemizle();
    } catch (error) {
      alert(duzenlemeModu ? 'Firma güncellenirken hata oluştu!' : 'Firma eklenirken hata oluştu!');
      console.error(error);
    }
  };

  const firmaDuzenle = (id: string) => {
    const firma = FIRMALAR.find(f => f.id === id);
    if (!firma) {
      alert('Firma bulunamadı!');
      return;
    }

    // Formu firma verileriyle doldur
    setFormData({
      ad: firma.ad,
      vergiNo: '',
      yetkili: '',
      telefon: firma.telefon || '',
      adres: firma.adres || '',
      email: firma.email
    });
    
    // Düzenleme modunu aç
    setDuzenlemeModu(true);
    setDuzenlenecekFirmaId(id);
    setErrors({});
    
    // Sayfanın üstüne scroll yap
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const firmaSilmeOnayi = (id: string) => {
    const firma = FIRMALAR.find(f => f.id === id);
    if (!firma) {
      alert('Firma bulunamadı!');
      return;
    }

    const onayMesaji = `"${firma.ad}" firmasını silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz!`;
    
    if (confirm(onayMesaji)) {
      try {
        const index = FIRMALAR.findIndex(f => f.id === id);
        if (index !== -1) {
          FIRMALAR.splice(index, 1);
          setFirmaListesi([...FIRMALAR]);
          alert('Firma başarıyla silindi!');
          
          // Eğer silinen firma düzenlenmekteyse formu temizle
          if (duzenlemeModu && duzenlenecekFirmaId === id) {
            formTemizle();
          }
        }
      } catch (error) {
        alert('Firma silinirken hata oluştu!');
        console.error(error);
      }
    }
  };

  return (
    <FirmaEkleView
      // State'ler
      formData={formData}
      errors={errors}
      firmaListesi={firmaListesi}
      duzenlemeModu={duzenlemeModu}
      
      // Fonksiyonlar
      handleInputChange={handleInputChange}
      kaydet={kaydet}
      firmaDuzenle={firmaDuzenle}
      firmaSilmeOnayi={firmaSilmeOnayi}
      duzenlemeyiIptalEt={duzenlemeyiIptalEt}
    />
  );
};

export default FirmaEkle;