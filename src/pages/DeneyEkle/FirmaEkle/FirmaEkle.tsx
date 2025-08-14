import { useState, useEffect } from 'react';
import FirmaEkleView from './FirmaEkleView';
import { api } from '../../../services/apiService';

interface Firma {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  contact_name?: string;
  tax_no?: string;
}

const FirmaEkle: React.FC = () => {
  // Form state'leri
  const [formData, setFormData] = useState({
    name: '',
    tax_no: '',
    contact_name: '',
    phone: '',
    address: '',
    email: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [firmaListesi, setFirmaListesi] = useState<Firma[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Düzenleme modu state'leri
  const [duzenlemeModu, setDuzenlemeModu] = useState(false);
  const [duzenlenecekFirmaId, setDuzenlenecekFirmaId] = useState<string | null>(null);

  // Firma listesini API'dan getir
  const firmalariYukle = async () => {
    try {
      setLoading(true);
      const result = await api.companies.getAll();
      
      if (result.success && result.data) {
        setFirmaListesi(result.data);
      } else {
        console.error('Firmalar yüklenemedi:', result.error);
        alert('Firmalar yüklenirken hata oluştu!');
      }
    } catch (error) {
      console.error('Firma yükleme hatası:', error);
      alert('Firmalar yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  // Sayfa yüklendiğinde firmaları getir
  useEffect(() => {
    firmalariYukle();
  }, []);

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
      name: '',
      tax_no: '',
      contact_name: '',
      phone: '',
      address: '',
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

    if (!formData.name.trim()) {
      newErrors.name = 'Firma adı zorunludur';
    }

    if (!formData.tax_no.trim()) {
      newErrors.tax_no = 'Vergi numarası zorunludur';
    } else if (formData.tax_no.length !== 10) {
      newErrors.tax_no = 'Vergi numarası 10 haneli olmalıdır';
    }

    if (!formData.contact_name.trim()) {
      newErrors.contact_name = 'Yetkili kişi zorunludur';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon numarası zorunludur';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email adresi zorunludur';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir email adresi giriniz';
    }

    return newErrors;
  };

  const kaydet = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      
      if (duzenlemeModu && duzenlenecekFirmaId) {
        // TODO: Güncelleme API'si eklenecek
        alert('Güncelleme özelliği henüz eklenmedi!');
      } else {
        // Yeni firma ekle
        const result = await api.companies.create({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          address: formData.address.trim() || undefined,
          contact_name: formData.contact_name.trim(),
          tax_no: formData.tax_no.trim(),
        });

        if (result.success) {
          alert(`${formData.name} başarıyla eklendi!`);
          formTemizle();
          // Firma listesini yenile
          await firmalariYukle();
        } else {
          alert('Firma eklenirken hata oluştu: ' + result.error);
        }
      }
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      alert('Firma kaydedilirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const firmaDuzenle = (id: string) => {
    const firma = firmaListesi.find(f => f.id === id);
    if (!firma) {
      alert('Firma bulunamadı!');
      return;
    }

    // Formu firma verileriyle doldur
    setFormData({
      name: firma.name,
      tax_no: firma.tax_no || '',
      contact_name: firma.contact_name || '',
      phone: firma.phone || '',
      address: firma.address || '',
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
    const firma = firmaListesi.find(f => f.id === id);
    if (!firma) {
      alert('Firma bulunamadı!');
      return;
    }

    const onayMesaji = `"${firma.name}" firmasını silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz!`;
    
    if (confirm(onayMesaji)) {
      alert('Silme özelliği henüz eklenmedi!');
      // TODO: Silme API'si eklenecek
    }
  };

  return (
    <FirmaEkleView
      // State'ler
      formData={formData}
      errors={errors}
      firmaListesi={firmaListesi}
      duzenlemeModu={duzenlemeModu}
      loading={loading}
      
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