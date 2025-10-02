import { useState, useEffect } from 'react';
import DeneyTuruEkleView from './DeneyTuruEkleView.tsx';

const DeneyTuruEkle: React.FC = () => {
  // Form state'leri
  const [formData, setFormData] = useState({
    name: '',
    base_price: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [deneyTurleriListesi, setDeneyTurleriListesi] = useState<{id: number; name: string; base_price: number; created_at: string}[]>([]);

  // Düzenleme modu state'leri
  const [duzenlemeModu, setDuzenlemeModu] = useState(false);
  const [duzenlenecekDeneyTuruId, setDuzenlenecekDeneyTuruId] = useState<number | null>(null);

  // Arama state'leri
  const [searchTerm, setSearchTerm] = useState('');

  // Deney türleri listesini API'den çek
  useEffect(() => {
    fetch('http://localhost:3001/api/experiment-types')
      .then(res => res.json())
      .then(data => setDeneyTurleriListesi(data))
      .catch(() => setDeneyTurleriListesi([]));
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
      name: '',
      base_price: ''
    });
    setErrors({});
    setDuzenlemeModu(false);
    setDuzenlenecekDeneyTuruId(null);
  };

  const duzenlemeyiIptalEt = () => {
    if (confirm('Düzenleme işlemini iptal etmek istediğinizden emin misiniz? Yapılan değişiklikler kaybedilecek.')) {
      formTemizle();
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Deney türü adı zorunludur';
    }
    
    if (!formData.base_price.trim()) {
      newErrors.base_price = 'Temel fiyat zorunludur';
    } else if (isNaN(Number(formData.base_price)) || Number(formData.base_price) < 0) {
      newErrors.base_price = 'Geçerli bir pozitif sayı giriniz';
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
      // Add or update experiment type in DB
      const method = duzenlemeModu && duzenlenecekDeneyTuruId ? 'PUT' : 'POST';
      const url = duzenlemeModu && duzenlenecekDeneyTuruId
        ? `http://localhost:3001/api/experiment-types/${duzenlenecekDeneyTuruId}`
        : 'http://localhost:3001/api/experiment-types';
        
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          base_price: Number(formData.base_price)
        })
      });
      
      if (!response.ok) {
        const err = await response.json();
        alert((method === 'POST' ? 'Deney türü eklenirken hata oluştu: ' : 'Deney türü güncellenirken hata oluştu: ') + (err.error || 'Bilinmeyen hata'));
        return;
      }
      
      const resultDeneyTuru = await response.json();
      if (method === 'POST') {
        setDeneyTurleriListesi(prev => [...prev, resultDeneyTuru]);
        alert(`${resultDeneyTuru.name} başarıyla eklendi!`);
      } else {
        setDeneyTurleriListesi(prev => prev.map(d => d.id === resultDeneyTuru.id ? resultDeneyTuru : d));
        alert(`${resultDeneyTuru.name} başarıyla güncellendi!`);
      }
      formTemizle();
    } catch (error) {
      alert('Deney türü kaydedilirken hata oluştu!');
      console.error(error);
    }
  };

  const deneyTuruDuzenle = (id: number) => {
    const deneyTuru = deneyTurleriListesi.find(d => d.id === id);
    if (!deneyTuru) {
      alert('Deney türü bulunamadı!');
      return;
    }
    setFormData({
      name: deneyTuru.name,
      base_price: deneyTuru.base_price?.toString() || '0'
    });
    setDuzenlemeModu(true);
    setDuzenlenecekDeneyTuruId(id);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deneyTuruSilmeOnayi = async (id: number) => {
    const deneyTuru = deneyTurleriListesi.find(d => d.id === id);
    if (!deneyTuru) {
      alert('Deney türü bulunamadı!');
      return;
    }
    const confirmMsg = `"${deneyTuru.name}" deney türü silinsin mi?\n\nBu işlem geri alınamaz!`;
    if (confirm(confirmMsg)) {
      try {
        const response = await fetch(`http://localhost:3001/api/experiment-types/${id}`, { method: 'DELETE' });
        if (!response.ok) {
          const err = await response.json();
          alert('Deney türü silinirken hata oluştu: ' + (err.error || 'Bilinmeyen hata'));
          return;
        }
        setDeneyTurleriListesi(prev => prev.filter(d => d.id !== id));
        alert(`${deneyTuru.name} başarıyla silindi!`);
        formTemizle();
      } catch (error) {
        alert('Deney türü silinirken hata oluştu!');
        console.error(error);
      }
    }
  };

  // Arama fonksiyonları
  const handleSearch = () => {
    // Arama terimi boşsa tüm listeyi göster
    if (!searchTerm.trim()) {
      fetch('http://localhost:3001/api/experiment-types')
        .then(res => res.json())
        .then(data => setDeneyTurleriListesi(data))
        .catch(() => setDeneyTurleriListesi([]));
      return;
    }

    // Arama terimi varsa filtreleme yap
    fetch('http://localhost:3001/api/experiment-types')
      .then(res => res.json())
      .then(data => {
        const filteredData = data.filter((deneyTuru: any) => 
          deneyTuru.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          deneyTuru.base_price.toString().includes(searchTerm)
        );
        setDeneyTurleriListesi(filteredData);
      })
      .catch(() => setDeneyTurleriListesi([]));
  };

  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <DeneyTuruEkleView
      formData={formData}
      errors={errors}
      deneyTurleriListesi={deneyTurleriListesi}
      duzenlemeModu={duzenlemeModu}
      searchTerm={searchTerm}
      handleInputChange={handleInputChange}
      kaydet={kaydet}
      deneyTuruDuzenle={deneyTuruDuzenle}
      deneyTuruSilmeOnayi={deneyTuruSilmeOnayi}
      duzenlemeyiIptalEt={duzenlemeyiIptalEt}
      onSearch={handleSearch}
      onSearchTermChange={handleSearchTermChange}
    />
  );
};

export default DeneyTuruEkle;
