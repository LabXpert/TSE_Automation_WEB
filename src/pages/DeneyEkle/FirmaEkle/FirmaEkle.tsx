import { useState, useEffect } from 'react';
import FirmaEkleView from './FirmaEkleView';

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
  const [firmaListesi, setFirmaListesi] = useState<any[]>([]);

  // Düzenleme modu state'leri
  const [duzenlemeModu, setDuzenlemeModu] = useState(false);
  const [duzenlenecekFirmaId, setDuzenlenecekFirmaId] = useState<number | null>(null);

  // Firma listesini API'den çek
  useEffect(() => {
    fetch('/api/companies')
      .then(res => res.json())
      .then(data => setFirmaListesi(data))
      .catch(() => setFirmaListesi([]));
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

          const kaydet = async () => {
            const newErrors = validateForm();
            if (Object.keys(newErrors).length > 0) {
              setErrors(newErrors);
              return;
            }

            try {
              if (duzenlemeModu && duzenlenecekFirmaId) {
                // Güncelleme işlemi (isteğe bağlı, şimdilik sadece ekleme var)
                alert('Firma güncelleme özelliği henüz aktif değil.');
              } else {
                // Yeni firma ekle
                const response = await fetch('/api/companies', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: formData.ad.trim(),
                    tax_no: formData.vergiNo.trim(),
                    contact_name: formData.yetkili.trim(),
                    address: formData.adres.trim(),
                    phone: formData.telefon.trim(),
                    email: formData.email.trim()
                  })
                });
                if (!response.ok) {
                  const err = await response.json();
                  alert('Firma eklenirken hata oluştu: ' + (err.error || 'Bilinmeyen hata'));
                  return;
                }
                const yeniFirma = await response.json();
                setFirmaListesi(prev => [...prev, yeniFirma]);
                alert(`${yeniFirma.name} başarıyla eklendi!`);
              }
              formTemizle();
            } catch (error) {
              alert('Firma eklenirken hata oluştu!');
              console.error(error);
            }
          };

          const firmaDuzenle = (id: number) => {
            const firma = firmaListesi.find(f => f.id === id);
            if (!firma) {
              alert('Firma bulunamadı!');
              return;
            }
            setFormData({
              ad: firma.name,
              vergiNo: firma.tax_no || '',
              yetkili: firma.contact_name || '',
              telefon: firma.phone || '',
              adres: firma.address || '',
              email: firma.email || ''
            });
            setDuzenlemeModu(true);
            setDuzenlenecekFirmaId(id);
            setErrors({});
            window.scrollTo({ top: 0, behavior: 'smooth' });
          };

          const firmaSilmeOnayi = (id: number) => {
            const firma = firmaListesi.find(f => f.id === id);
            if (!firma) {
              alert('Firma bulunamadı!');
              return;
            }
            const onayMesaji = `"${firma.name}" firmasını silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz!`;
            if (confirm(onayMesaji)) {
              // Silme özelliği henüz aktif değil
              alert('Firma silme özelliği henüz aktif değil.');
            }
          };

          return (
            <FirmaEkleView
              formData={formData}
              errors={errors}
              firmaListesi={firmaListesi}
              duzenlemeModu={duzenlemeModu}
              handleInputChange={handleInputChange}
              kaydet={kaydet}
              firmaDuzenle={firmaDuzenle}
              firmaSilmeOnayi={firmaSilmeOnayi}
              duzenlemeyiIptalEt={duzenlemeyiIptalEt}
            />
          );
        };

        export default FirmaEkle;