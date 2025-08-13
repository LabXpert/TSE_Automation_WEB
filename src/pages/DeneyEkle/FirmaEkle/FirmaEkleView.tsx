import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FIRMALAR } from '../../../models/Firma';

const FirmaEkleView: React.FC = () => {
  const navigate = useNavigate();
  
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

  const handleCancel = () => {
    navigate('/deney-ekle');
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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

    // Başarı mesajı göster ve geri dön
    alert(`${yeniFirma.ad} başarıyla eklendi!`);
    navigate('/deney-ekle');
  };

  return (
    <div style={{ 
      padding: '32px', 
      fontFamily: 'inherit',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
    }}>
      {/* Sayfa Başlığı */}
      <div style={{ 
        marginBottom: '32px', 
        textAlign: 'left',
        borderBottom: '2px solid #dc2626',
        paddingBottom: '16px'
      }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          color: '#0f172a', 
          margin: '0 0 8px 0' 
        }}>
          Yeni Firma Ekle
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#64748b', 
          margin: '0' 
        }}>
          Sisteme yeni firma bilgilerini ekleyin
        </p>
      </div>

      {/* Form Kartı */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <form onSubmit={handleSubmit}>
        {/* Firma Adı */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'block',
            marginBottom: '8px', 
            fontWeight: '600', 
            color: '#374151',
            fontSize: '14px'
          }}>
            Firma Adı *
          </label>
          <input 
            type="text" 
            placeholder="Örn: ABC Makina San. Tic. Ltd. Şti."
            value={formData.ad}
            onChange={(e) => handleInputChange('ad', e.target.value)}
            style={{ 
              width: '100%', 
              padding: '12px',
              border: `2px solid ${errors.ad ? '#dc2626' : '#e5e7eb'}`,
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: '#ffffff',
              color: '#374151',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#dc2626';
              e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.ad ? '#dc2626' : '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
          />
          {errors.ad && (
            <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
              {errors.ad}
            </p>
          )}
        </div>

        {/* Vergi No */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'block',
            marginBottom: '8px', 
            fontWeight: '600', 
            color: '#374151',
            fontSize: '14px'
          }}>
            Vergi Numarası *
          </label>
          <input 
            type="text" 
            placeholder="10 haneli vergi numarası"
            value={formData.vergiNo}
            onChange={(e) => handleInputChange('vergiNo', e.target.value)}
            maxLength={10}
            style={{ 
              width: '100%', 
              padding: '12px',
              border: `2px solid ${errors.vergiNo ? '#dc2626' : '#e5e7eb'}`,
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: '#ffffff',
              color: '#374151',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#dc2626';
              e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.vergiNo ? '#dc2626' : '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
          />
          {errors.vergiNo && (
            <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
              {errors.vergiNo}
            </p>
          )}
        </div>

        {/* Yetkili İsmi */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'block',
            marginBottom: '8px', 
            fontWeight: '600', 
            color: '#374151',
            fontSize: '14px'
          }}>
            Yetkili Kişi *
          </label>
          <input 
            type="text" 
            placeholder="Yetkili kişinin adı soyadı"
            value={formData.yetkili}
            onChange={(e) => handleInputChange('yetkili', e.target.value)}
            style={{ 
              width: '100%', 
              padding: '12px',
              border: `2px solid ${errors.yetkili ? '#dc2626' : '#e5e7eb'}`,
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: '#ffffff',
              color: '#374151',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#dc2626';
              e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.yetkili ? '#dc2626' : '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
          />
          {errors.yetkili && (
            <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
              {errors.yetkili}
            </p>
          )}
        </div>

        {/* Telefon */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'block',
            marginBottom: '8px', 
            fontWeight: '600', 
            color: '#374151',
            fontSize: '14px'
          }}>
            Telefon *
          </label>
          <input 
            type="tel" 
            placeholder="0212 123 45 67"
            value={formData.telefon}
            onChange={(e) => handleInputChange('telefon', e.target.value)}
            style={{ 
              width: '100%', 
              padding: '12px',
              border: `2px solid ${errors.telefon ? '#dc2626' : '#e5e7eb'}`,
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: '#ffffff',
              color: '#374151',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#dc2626';
              e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.telefon ? '#dc2626' : '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
          />
          {errors.telefon && (
            <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
              {errors.telefon}
            </p>
          )}
        </div>

        {/* Email */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{
            fontWeight: '600',
            color: '#374151',
            fontSize: '14px'
          }}>
            Email Adresi *
          </label>
          <input 
            type="email"
            placeholder="info@firma.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            style={{ 
              width: '100%', 
              padding: '12px',
              border: errors.email ? '2px solid #dc2626' : '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: '#ffffff',
              color: '#374151',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#dc2626';
              e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.email ? '#dc2626' : '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
          />
          {errors.email && (
            <span style={{ color: '#dc2626', fontSize: '12px', fontWeight: '500' }}>
              {errors.email}
            </span>
          )}
        </div>

        {/* Adres */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ 
            display: 'block',
            marginBottom: '8px', 
            fontWeight: '600', 
            color: '#374151',
            fontSize: '14px'
          }}>
            Adres
          </label>
          <textarea 
            placeholder="Firma adresi"
            rows={4}
            value={formData.adres}
            onChange={(e) => handleInputChange('adres', e.target.value)}
            style={{ 
              width: '100%', 
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: '#ffffff',
              color: '#374151',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#dc2626';
              e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Butonlar */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '16px',
          borderTop: '1px solid #e2e8f0',
          paddingTop: '24px'
        }}>
          <button
            type="button"
            onClick={handleCancel}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: '#f8fafc',
              color: '#374151',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f1f5f9';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            İptal
          </button>

          <button
            type="submit"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(220, 38, 38, 0.2)';
            }}
          >
            Firma Ekle
          </button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default FirmaEkleView;
