import React, { useState, useEffect } from 'react';
import MakineEkleView from './MakineEkleView.tsx';
import type { Makine, MakineInput, KalibrasyonKurulusu } from '../../models/Makine';

const MakineEkle: React.FC = () => {
  // State'ler
  const [makineler, setMakineler] = useState<Makine[]>([]);
  const [kalibrasyonKuruluslari, setKalibrasyonKuruluslari] = useState<KalibrasyonKurulusu[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingMakine, setEditingMakine] = useState<Makine | null>(null);

  // Form state'leri
  const [formData, setFormData] = useState<MakineInput>({
    serial_no: '',
    equipment_name: '',
    brand: '',
    model: '',
    measurement_range: '',
    last_calibration_date: new Date(),
    calibration_org_id: 0,
    calibration_interval: 1
  });

  // Pagination state'leri
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  // Component mount'ta verileri yükle
  useEffect(() => {
    fetchMakineler();
    fetchKalibrasyonKuruluslari();
  }, []);

  // Makineleri getir
  const fetchMakineler = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/machines');
      const data = await response.json();
      
      if (data.success) {
        setMakineler(data.data);
      } else {
        setError('Makineler yüklenemedi');
      }
    } catch (error) {
      console.error('Makineler fetch hatası:', error);
      setError('Makineler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Kalibrasyon kuruluşlarını getir
  const fetchKalibrasyonKuruluslari = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/calibration-orgs');
      const data = await response.json();
      
      if (data.success) {
        setKalibrasyonKuruluslari(data.data);
      } else {
        setError('Kalibrasyon kuruluşları yüklenemedi');
      }
    } catch (error) {
      console.error('Kalibrasyon kuruluşları fetch hatası:', error);
      setError('Kalibrasyon kuruluşları yüklenirken hata oluştu');
    }
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const url = editingMakine 
        ? `http://localhost:3001/api/machines/${editingMakine.id}`
        : 'http://localhost:3001/api/machines';
      
      const method = editingMakine ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(editingMakine ? 'Makine güncellendi!' : 'Makine eklendi!');
        resetForm();
        fetchMakineler();
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
      serial_no: '',
      equipment_name: '',
      brand: '',
      model: '',
      measurement_range: '',
      last_calibration_date: new Date(),
      calibration_org_id: 0,
      calibration_interval: 1
    });
    setEditingMakine(null);
    setError('');
    setSuccess('');
  };

  // Makine düzenle
  const handleEdit = (makine: Makine) => {
    setFormData({
      serial_no: makine.serial_no,
      equipment_name: makine.equipment_name,
      brand: makine.brand || '',
      model: makine.model || '',
      measurement_range: makine.measurement_range || '',
      last_calibration_date: new Date(makine.last_calibration_date),
      calibration_org_id: makine.calibration_org_id,
      calibration_interval: makine.calibration_interval
    });
    setEditingMakine(makine);
  };

  // Makine sil
  const handleDelete = async (id: number) => {
    if (!confirm('Bu makineyi silmek istediğinizden emin misiniz?')) return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/machines/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Makine silindi!');
        fetchMakineler();
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
      fetchMakineler();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/machines/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      
      if (data.success) {
        setMakineler(data.data);
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
  const handleInputChange = (field: keyof MakineInput, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Pagination
  const totalPages = Math.ceil(makineler.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMakineler = makineler.slice(startIndex, endIndex);

  return (
    <MakineEkleView
      makineler={currentMakineler}
      kalibrasyonKuruluslari={kalibrasyonKuruluslari}
      formData={formData}
      loading={loading}
      error={error}
      success={success}
      editingMakine={editingMakine}
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

export default MakineEkle;
