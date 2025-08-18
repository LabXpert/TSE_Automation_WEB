import { useState, useEffect } from 'react';
import FirmaEkleView from './FirmaEkleView';

interface ApiCompany {
  id: number;
  name: string;
  vat_number: string;
  contact_person: string;
  phone: string;
  address: string;
  email: string;
  created_at: string;
}

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
  const [firmaListesi, setFirmaListesi] = useState<ApiCompany[]>([]);

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
              // Add or update company in DB
              const method = duzenlemeModu && duzenlenecekFirmaId ? 'PUT' : 'POST';
              const url = duzenlemeModu && duzenlenecekFirmaId
                ? `/api/companies/${duzenlenecekFirmaId}`
                : '/api/companies';
              const response = await fetch(url, {
                method,
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
                alert((method === 'POST' ? 'Firma eklenirken hata oluştu: ' : 'Firma güncellenirken hata oluştu: ') + (err.error || 'Bilinmeyen hata'));
                return;
              }
              const resultFirma = await response.json();
              if (method === 'POST') {
                setFirmaListesi(prev => [...prev, resultFirma]);
                alert(`${resultFirma.name} başarıyla eklendi!`);
              } else {
                setFirmaListesi(prev => prev.map(f => f.id === resultFirma.id ? resultFirma : f));
                alert(`${resultFirma.name} başarıyla güncellendi!`);
              }
              formTemizle();
            } catch (error) {
                alert('Firma kaydedilirken hata oluştu!');
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
              vergiNo: firma.vat_number || '',
              yetkili: firma.contact_person || '',
              telefon: firma.phone || '',
              adres: firma.address || '',
              email: firma.email || ''
            });
            setDuzenlemeModu(true);
            setDuzenlenecekFirmaId(id);
            setErrors({});
            window.scrollTo({ top: 0, behavior: 'smooth' });
          };

          const firmaSilmeOnayi = async (id: number) => {
            const firma = firmaListesi.find(f => f.id === id);
            if (!firma) {
              alert('Firma bulunamadı!');
              return;
            }
            const confirmMsg = `Bu "${firma.name}" silinsin mi?\n\nBu işlem geri alınamaz!`;
            if (confirm(confirmMsg)) {
              try {
                const response = await fetch(`/api/companies/${id}`, { method: 'DELETE' });
                if (!response.ok) {
                  const err = await response.json();
                    alert('Firma silinirken hata oluştu: ' + (err.error || 'Bilinmeyen hata'));
                  return;
                }
                setFirmaListesi(prev => prev.filter(f => f.id !== id));
                    alert(`${firma.name} başarıyla silindi!`);
                formTemizle();
              } catch (error) {
                alert('Firma silinirken hata oluştu!');
                console.error(error);
              }
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