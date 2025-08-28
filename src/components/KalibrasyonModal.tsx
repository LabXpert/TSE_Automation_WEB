import React, { useState, useEffect } from 'react';
import type { MachineCalibration } from '../models/MachineCalibration';
import type { KalibrasyonKurulusu } from '../models/Makine';
import * as machineCalibrationService from '../services/machineCalibration.service';

interface MakineData {
  id: number;
  serial_no: string;
  equipment_name: string;
  brand?: string;
  model?: string;
  measurement_range?: string;
  last_calibration_date?: string;
  calibration_org_name?: string;
  calibration_contact_name?: string;
  calibration_email?: string;
  calibration_phone?: string;
}

interface KalibrasyonModalProps {
  isOpen: boolean;
  onClose: () => void;
  machineId: number;
  onCompleted: () => void;
}

const KalibrasyonModal: React.FC<KalibrasyonModalProps> = ({
  isOpen,
  onClose,
  machineId,
  onCompleted
}) => {
  const [formData, setFormData] = useState<{
    calibration_org_id: number;
    calibrated_by: string;
    notes: string;
    calibration_date: string;
  }>({
    calibration_org_id: 0,
    calibrated_by: '',
    notes: '',
    calibration_date: new Date().toISOString().split('T')[0]
  });
  
  const [makine, setMakine] = useState<MakineData | null>(null);
  const [kalibrasyonKuruluslari, setKalibrasyonKuruluslari] = useState<KalibrasyonKurulusu[]>([]);
  const [kalibrasyonGecmisi, setKalibrasyonGecmisi] = useState<MachineCalibration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gecmisLoading, setGecmisLoading] = useState(false);

  // Makine bilgilerini yükle
  useEffect(() => {
    if (isOpen && machineId) {
      loadMachineData(machineId);
      loadKalibrasyonKuruluslari();
      loadKalibrasyonGecmisi(machineId);
    }
  }, [isOpen, machineId]);

  const loadMachineData = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/machines/${id}`);
      if (response.ok) {
        const data = await response.json();
        setMakine(data?.data ?? data);
      }
    } catch (error) {
      console.error('Makine verileri yüklenemedi:', error);
    }
  };

  const loadKalibrasyonKuruluslari = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/calibration-orgs');
      if (response.ok) {
        const data = await response.json();
        console.log('Kalibrasyon kuruluşları:', data);
        setKalibrasyonKuruluslari(data.data || data || []);
      } else {
        console.error('Kalibrasyon kuruluşları API hatası:', response.statusText);
      }
    } catch (error) {
      console.error('Kalibrasyon kuruluşları yüklenemedi:', error);
    }
  };

  const loadKalibrasyonGecmisi = async (machineId: number) => {
    try {
      setGecmisLoading(true);
      const gecmis = await machineCalibrationService.getMachineCalibrationsByMachine(machineId);
      setKalibrasyonGecmisi(gecmis);
    } catch (error) {
      console.error('Kalibrasyon geçmişi yüklenemedi:', error);
    } finally {
      setGecmisLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!makine) return;
    
    if (!formData.calibration_org_id || formData.calibration_org_id === 0) {
      setError('Kalibrasyon kuruluşu seçiniz');
      return;
    }

    if (!formData.calibration_date) {
      setError('Kalibrasyon tarihi gereklidir');
      return;
    }

    if (!formData.calibrated_by || formData.calibrated_by.trim() === '') {
      setError('Kalibre eden kişi gereklidir');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await machineCalibrationService.calibrateMachine(machineId, {
        calibration_org_id: formData.calibration_org_id,
        calibrated_by: formData.calibrated_by || '',
        notes: formData.notes || undefined,
        calibration_date: new Date(formData.calibration_date)
      });

      // Başarılı kalibrasyon sonrası
      onCompleted();
      onClose();
      
      // Formu sıfırla
      setFormData({
        calibration_org_id: 0,
        calibrated_by: '',
        notes: '',
        calibration_date: new Date().toISOString().split('T')[0]
      });

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Kalibrasyon kaydedilemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      calibration_org_id: 0,
      calibrated_by: '',
      notes: '',
      calibration_date: new Date().toISOString().split('T')[0]
    });
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        width: '100%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#ffffff',
                margin: '0 0 4px 0'
              }}>
                Makine Kalibrasyonu
              </h2>
              {makine && (
                <p style={{
                  fontSize: '14px',
                  color: '#fecaca',
                  margin: 0
                }}>
                  {makine.equipment_name} - {makine.serial_no}
                </p>
              )}
            </div>
            <button
              onClick={handleClose}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
                color: '#ffffff',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '24px'
        }}>
          {/* Makine Bilgileri Özeti */}
          {makine && (
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#0f172a',
                margin: '0 0 12px 0'
              }}>
                Makine Bilgileri
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                fontSize: '14px'
              }}>
                <div>
                  <span style={{ color: '#64748b', fontWeight: '500' }}>Makine Adı:</span>
                  <div style={{ color: '#0f172a', fontWeight: '600' }}>{makine.equipment_name}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontWeight: '500' }}>Seri No:</span>
                  <div style={{ color: '#0f172a', fontWeight: '600' }}>{makine.serial_no}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontWeight: '500' }}>Marka:</span>
                  <div style={{ color: '#0f172a', fontWeight: '600' }}>{makine.brand || 'Belirtilmemiş'}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontWeight: '500' }}>Model:</span>
                  <div style={{ color: '#0f172a', fontWeight: '600' }}>{makine.model || 'Belirtilmemiş'}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontWeight: '500' }}>Son Kalibrasyon:</span>
                  <div style={{ color: '#0f172a', fontWeight: '600' }}>
                    {makine.last_calibration_date ? new Date(makine.last_calibration_date).toLocaleDateString('tr-TR') : '-'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Kalibrasyon Formu */}
          <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#0f172a',
              margin: '0 0 16px 0'
            }}>
              Yeni Kalibrasyon Kaydı
            </h3>

            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '16px',
                color: '#991b1b',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '16px'
            }}>
              {/* Kalibrasyon Kuruluşu */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Kalibrasyon Kuruluşu *
                </label>
                <select
                  value={formData.calibration_org_id}
                  onChange={(e) => setFormData({
                    ...formData,
                    calibration_org_id: parseInt(e.target.value)
                  })}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#dc2626';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                  }}
                >
                  <option value={0}>Kuruluş seçiniz</option>
                  {kalibrasyonKuruluslari.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.org_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Kalibrasyon Tarihi */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Kalibrasyon Tarihi *
                </label>
                <input
                  type="date"
                  value={formData.calibration_date}
                  onChange={(e) => setFormData({
                    ...formData,
                    calibration_date: e.target.value
                  })}
                  max={new Date().toISOString().split('T')[0]}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#dc2626';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                  }}
                />
              </div>
            </div>

            {/* Kalibre Eden Kişi */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Kalibre Eden Kişi *
              </label>
              <input
                type="text"
                value={formData.calibrated_by}
                onChange={(e) => setFormData({
                  ...formData,
                  calibrated_by: e.target.value
                })}
                placeholder="Kalibrasyon yapan kişinin adı"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#dc2626';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                }}
              />
            </div>

            {/* Notlar */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Notlar
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({
                  ...formData,
                  notes: e.target.value
                })}
                placeholder="Kalibrasyon ile ilgili ek notlar (opsiyonel)"
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  minHeight: '80px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#dc2626';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                }}
              />
            </div>

            {/* Submit Button */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  padding: '12px 24px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#6b7280',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#dc2626';
                  e.currentTarget.style.color = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.color = '#6b7280';
                }}
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ffffff',
                  backgroundColor: loading ? '#94a3b8' : '#dc2626',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = '#991b1b';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = '#dc2626';
                  }
                }}
              >
                {loading && (
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid transparent',
                    borderTop: '2px solid #ffffff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                )}
                {loading ? 'Kaydediliyor...' : 'Kalibrasyon Kaydet'}
              </button>
            </div>
          </form>

          {/* Kalibrasyon Geçmişi */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#0f172a',
              margin: '0 0 16px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM14 21L7 12H10V7H14V12H17L14 21Z"/>
              </svg>
              Kalibrasyon Geçmişi
            </h3>

            {gecmisLoading ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                color: '#64748b'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  border: '2px solid #e5e7eb',
                  borderTop: '2px solid #dc2626',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '12px'
                }}></div>
                Geçmiş yükleniyor...
              </div>
            ) : kalibrasyonGecmisi.length > 0 ? (
              <div style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '14px'
                }}>
                  <thead>
                    <tr style={{
                      backgroundColor: '#f8fafc'
                    }}>
                      <th style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151',
                        borderBottom: '1px solid #e5e7eb'
                      }}>
                        Tarih
                      </th>
                      <th style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151',
                        borderBottom: '1px solid #e5e7eb'
                      }}>
                        Kuruluş
                      </th>
                      <th style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151',
                        borderBottom: '1px solid #e5e7eb'
                      }}>
                        Kalibre Eden
                      </th>
                      <th style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151',
                        borderBottom: '1px solid #e5e7eb'
                      }}>
                        Notlar
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {kalibrasyonGecmisi.map((kalibrasyon, index) => (
                      <tr key={kalibrasyon.id} style={{
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc'
                      }}>
                        <td style={{
                          padding: '12px',
                          borderBottom: '1px solid #f1f5f9',
                          color: '#0f172a'
                        }}>
                          {new Date(kalibrasyon.calibration_date).toLocaleDateString('tr-TR')}
                        </td>
                        <td style={{
                          padding: '12px',
                          borderBottom: '1px solid #f1f5f9',
                          color: '#0f172a'
                        }}>
                          {kalibrasyon.calibration_org_name || 'Belirtilmemiş'}
                        </td>
                        <td style={{
                          padding: '12px',
                          borderBottom: '1px solid #f1f5f9',
                          color: '#64748b'
                        }}>
                          {kalibrasyon.calibrated_by || 'Belirtilmemiş'}
                        </td>
                        <td style={{
                          padding: '12px',
                          borderBottom: '1px solid #f1f5f9',
                          color: '#64748b',
                          maxWidth: '200px',
                          wordWrap: 'break-word'
                        }}>
                          {kalibrasyon.notes || 'Not yok'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '24px',
                textAlign: 'center',
                color: '#64748b'
              }}>
                Bu makine için henüz kalibrasyon kaydı bulunmamaktadır.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default KalibrasyonModal;


