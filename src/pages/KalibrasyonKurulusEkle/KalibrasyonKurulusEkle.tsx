import React, { useState, useEffect } from 'react';
import KalibrasyonKurulusEkleView from './KalibrasyonKurulusEkleView.tsx';
import type { KalibrasyonKurulusu } from '../../models/Makine';

interface KalibrasyonKurulusInput {
  org_name: string;
  contact_name?: string;
  phone?: string;
  email?: string;
}

const KalibrasyonKurulusEkle: React.FC = () => {
  // State'ler
  const [kuruluslar, setKuruluslar] = useState<KalibrasyonKurulusu[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingKuruluş, setEditingKuruluş] = useState<KalibrasyonKurulusu | null>(null);

  // Form state'leri
  const [formData, setFormData] = useState<KalibrasyonKurulusInput>({
    org_name: '',
    contact_name: '',
    phone: '',
    email: ''
  });

  // Pagination state'leri
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  // Component mount'ta verileri yükle
  useEffect(() => {
    fetchKuruluslar();
  }, []);

  // Kuruluşları getir
  const fetchKuruluslar = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/calibration-orgs');
      const data = await response.json();
      
      if (data.success) {
        setKuruluslar(data.data);
      } else {
        setError('Kuruluşlar yüklenemedi');
      }
    } catch (error) {
      console.error('Kuruluşlar fetch hatası:', error);
      setError('Kuruluşlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const url = editingKuruluş 
        ? `http://localhost:3001/api/calibration-orgs/${editingKuruluş.id}`
        : 'http://localhost:3001/api/calibration-orgs';
      
      const method = editingKuruluş ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(editingKuruluş ? 'Kuruluş güncellendi!' : 'Kuruluş eklendi!');
        resetForm();
        fetchKuruluslar();
      } else {
        setError(data.message || 'İşlem başarısız');
      }
    } catch (error) {
      console.error('Submit hatası:', error);
      setError('Kayıt sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Form sıfırla
  const resetForm = () => {
    setFormData({
      org_name: '',
      contact_name: '',
      phone: '',
      email: ''
    });
    setEditingKuruluş(null);
    setError('');
    setSuccess('');
  };

  // Kuruluş düzenle
  const handleEdit = (kuruluş: KalibrasyonKurulusu) => {
    setFormData({
      org_name: kuruluş.org_name,
      contact_name: kuruluş.contact_name || '',
      phone: kuruluş.phone || '',
      email: kuruluş.email || ''
    });
    setEditingKuruluş(kuruluş);
  };

  // Kuruluş sil
  const handleDelete = async (id: number) => {
    if (!confirm('Bu kuruluşu silmek istediğinizden emin misiniz?')) return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/calibration-orgs/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Kuruluş silindi!');
        fetchKuruluslar();
      } else {
        setError(data.message || 'Silme işlemi başarısız');
      }
    } catch (error) {
      console.error('Delete hatası:', error);
      setError('Silme işlemi sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Arama
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchKuruluslar();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/calibration-orgs/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      
      if (data.success) {
        setKuruluslar(data.data);
        setCurrentPage(1);
      } else {
        setError('Arama başarısız');
      }
    } catch (error) {
      console.error('Search hatası:', error);
      setError('Arama sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Form input değişiklikleri
  const handleInputChange = (field: keyof KalibrasyonKurulusInput, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Pagination
  const totalPages = Math.ceil(kuruluslar.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentKuruluslar = kuruluslar.slice(startIndex, endIndex);

  return (
    <KalibrasyonKurulusEkleView
      kuruluslar={currentKuruluslar}
      formData={formData}
      loading={loading}
      error={error}
      success={success}
      editingKuruluş={editingKuruluş}
      searchTerm={searchTerm}
      currentPage={currentPage}
      totalPages={totalPages}
      onSubmit={handleSubmit}
      onInputChange={handleInputChange}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onSearch={handleSearch}
      onSearchTermChange={setSearchTerm}
      onPageChange={setCurrentPage}
      onReset={resetForm}
    />
  );
};

export default KalibrasyonKurulusEkle;
