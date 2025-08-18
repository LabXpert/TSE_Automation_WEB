import { useState, useEffect } from 'react';
import KullaniciEkleView from './KullaniciEkleView.tsx';

const KullaniciEkle: React.FC = () => {
  // Form state'leri
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user',
    unvan: '',
    phone: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [kullaniciListesi, setKullaniciListesi] = useState<any[]>([]);

  // Düzenleme modu state'leri
  const [duzenlemeModu, setDuzenlemeModu] = useState(false);
  const [duzenlenecekKullaniciId, setDuzenlenecekKullaniciId] = useState<number | null>(null);

  // Kullanıcı listesini API'den çek
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setKullaniciListesi(data))
      .catch(() => setKullaniciListesi([]));
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
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      role: 'user',
      unvan: '',
      phone: ''
    });
    setErrors({});
    setDuzenlemeModu(false);
    setDuzenlenecekKullaniciId(null);
  };

  const duzenlemeyiIptalEt = () => {
    if (confirm('Düzenleme işlemini iptal etmek istediğinizden emin misiniz? Yapılan değişiklikler kaybedilecek.')) {
      formTemizle();
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Kullanıcı adı zorunludur';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Kullanıcı adı en az 3 karakter olmalıdır';
    }
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Ad zorunludur';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Soyad zorunludur';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email adresi zorunludur';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir email adresi giriniz';
    }
    
    if (!duzenlemeModu && !formData.password.trim()) {
      newErrors.password = 'Şifre zorunludur';
    } else if (formData.password.trim() && formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır';
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
      // Add or update user in DB
      const method = duzenlemeModu && duzenlenecekKullaniciId ? 'PUT' : 'POST';
      const url = duzenlemeModu && duzenlenecekKullaniciId
        ? `/api/users/${duzenlenecekKullaniciId}`
        : '/api/users';
        
      const body: any = {
        username: formData.username.trim(),
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        unvan: formData.unvan.trim(),
        phone: formData.phone.trim()
      };
      
      // Only include password if it's provided
      if (formData.password.trim()) {
        body.password = formData.password.trim();
      }
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        const err = await response.json();
        alert((method === 'POST' ? 'Kullanıcı eklenirken hata oluştu: ' : 'Kullanıcı güncellenirken hata oluştu: ') + (err.error || 'Bilinmeyen hata'));
        return;
      }
      
      const resultKullanici = await response.json();
      if (method === 'POST') {
        setKullaniciListesi(prev => [...prev, resultKullanici]);
        alert(`${resultKullanici.username} başarıyla eklendi!`);
      } else {
        setKullaniciListesi(prev => prev.map(k => k.id === resultKullanici.id ? resultKullanici : k));
        alert(`${resultKullanici.username} başarıyla güncellendi!`);
      }
      formTemizle();
    } catch (error) {
      alert('Kullanıcı kaydedilirken hata oluştu!');
      console.error(error);
    }
  };

  const kullaniciDuzenle = (id: number) => {
    const kullanici = kullaniciListesi.find(k => k.id === id);
    if (!kullanici) {
      alert('Kullanıcı bulunamadı!');
      return;
    }
    setFormData({
      username: kullanici.username,
      first_name: kullanici.first_name || '',
      last_name: kullanici.last_name || '',
      email: kullanici.email || '',
      password: '', // Don't populate password for security
      role: kullanici.role || 'user',
      unvan: kullanici.unvan || '',
      phone: kullanici.phone || ''
    });
    setDuzenlemeModu(true);
    setDuzenlenecekKullaniciId(id);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const kullaniciSilmeOnayi = async (id: number) => {
    const kullanici = kullaniciListesi.find(k => k.id === id);
    if (!kullanici) {
      alert('Kullanıcı bulunamadı!');
      return;
    }
    const confirmMsg = `"${kullanici.username}" kullanıcısı silinsin mi?\n\nBu işlem geri alınamaz!`;
    if (confirm(confirmMsg)) {
      try {
        const response = await fetch(`/api/users/${id}`, { method: 'DELETE' });
        if (!response.ok) {
          const err = await response.json();
          alert('Kullanıcı silinirken hata oluştu: ' + (err.error || 'Bilinmeyen hata'));
          return;
        }
        setKullaniciListesi(prev => prev.filter(k => k.id !== id));
        alert(`${kullanici.username} başarıyla silindi!`);
        formTemizle();
      } catch (error) {
        alert('Kullanıcı silinirken hata oluştu!');
        console.error(error);
      }
    }
  };

  return (
    <KullaniciEkleView
      formData={formData}
      errors={errors}
      kullaniciListesi={kullaniciListesi}
      duzenlemeModu={duzenlemeModu}
      handleInputChange={handleInputChange}
      kaydet={kaydet}
      kullaniciDuzenle={kullaniciDuzenle}
      kullaniciSilmeOnayi={kullaniciSilmeOnayi}
      duzenlemeyiIptalEt={duzenlemeyiIptalEt}
    />
  );
};

export default KullaniciEkle;
