import { useState, useEffect } from 'react';
import PersonelEkleView from './PersonelEkleView.tsx';

const PersonelEkle: React.FC = () => {
  // Form state'leri
  const [formData, setFormData] = useState({
    ad: '',
    soyad: '',
    unvan: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [personelListesi, setPersonelListesi] = useState<any[]>([]);

  // Düzenleme modu state'leri
  const [duzenlemeModu, setDuzenlemeModu] = useState(false);
  const [duzenlenecekPersonelId, setDuzenlenecekPersonelId] = useState<number | null>(null);

  // Personel listesini API'den çek
  useEffect(() => {
    fetch('/api/personnel')
      .then(res => res.json())
      .then(data => setPersonelListesi(data))
      .catch(() => setPersonelListesi([]));
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
      soyad: '',
      unvan: ''
    });
    setErrors({});
    setDuzenlemeModu(false);
    setDuzenlenecekPersonelId(null);
  };

  const duzenlemeyiIptalEt = () => {
    if (confirm('Düzenleme işlemini iptal etmek istediğinizden emin misiniz? Yapılan değişiklikler kaybedilecek.')) {
      formTemizle();
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    if (!formData.ad.trim()) {
      newErrors.ad = 'Ad zorunludur';
    }
    if (!formData.soyad.trim()) {
      newErrors.soyad = 'Soyad zorunludur';
    }
    if (!formData.unvan.trim()) {
      newErrors.unvan = 'Ünvan zorunludur';
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
      // Add or update personnel in DB
      const method = duzenlemeModu && duzenlenecekPersonelId ? 'PUT' : 'POST';
      const url = duzenlemeModu && duzenlenecekPersonelId
        ? `/api/personnel/${duzenlenecekPersonelId}`
        : '/api/personnel';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.ad.trim(),
          last_name: formData.soyad.trim(),
          title: formData.unvan.trim()
        })
      });
      if (!response.ok) {
        const err = await response.json();
        alert((method === 'POST' ? 'Personel eklenirken hata oluştu: ' : 'Personel güncellenirken hata oluştu: ') + (err.error || 'Bilinmeyen hata'));
        return;
      }
      const resultPersonel = await response.json();
      if (method === 'POST') {
        setPersonelListesi(prev => [...prev, resultPersonel]);
        alert(`${resultPersonel.first_name} ${resultPersonel.last_name} başarıyla eklendi!`);
      } else {
        setPersonelListesi(prev => prev.map(p => p.id === resultPersonel.id ? resultPersonel : p));
        alert(`${resultPersonel.first_name} ${resultPersonel.last_name} başarıyla güncellendi!`);
      }
      formTemizle();
    } catch (error) {
      alert('Personel kaydedilirken hata oluştu!');
      console.error(error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    kaydet();
  };

  const personelDuzenle = (id: number) => {
    const personel = personelListesi.find(p => p.id === id);
    if (!personel) {
      alert('Personel bulunamadı!');
      return;
    }
    setFormData({
      ad: personel.first_name,
      soyad: personel.last_name,
      unvan: personel.title
    });
    setDuzenlemeModu(true);
    setDuzenlenecekPersonelId(id);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const personelSilmeOnayi = async (id: number) => {
    const personel = personelListesi.find(p => p.id === id);
    if (!personel) {
      alert('Personel bulunamadı!');
      return;
    }
    const confirmMsg = `Bu "${personel.first_name} ${personel.last_name}" silinsin mi?\n\nBu işlem geri alınamaz!`;
    if (confirm(confirmMsg)) {
      try {
        const response = await fetch(`/api/personnel/${id}`, { method: 'DELETE' });
        if (!response.ok) {
          const err = await response.json();
          alert('Personel silinirken hata oluştu: ' + (err.error || 'Bilinmeyen hata'));
          return;
        }
        setPersonelListesi(prev => prev.filter(p => p.id !== id));
        alert(`${personel.first_name} ${personel.last_name} başarıyla silindi!`);
        formTemizle();
      } catch (error) {
        alert('Personel silinirken hata oluştu!');
        console.error(error);
      }
    }
  };

  return (
    <PersonelEkleView
      formData={formData}
      errors={errors}
      personelListesi={personelListesi}
      duzenlemeModu={duzenlemeModu}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      personelDuzenle={personelDuzenle}
      personelSilmeOnayi={personelSilmeOnayi}
      duzenlemeyiIptalEt={duzenlemeyiIptalEt}
    />
  );
};

export default PersonelEkle;