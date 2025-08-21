import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface CalibrationAlert {
  id: number;
  serial_no: string;
  equipment_name: string;
  brand?: string;
  model?: string;
  last_calibration_date: string;
  next_calibration_date: string;
  calibration_org_name?: string;
  calibration_contact_name?: string;
  calibration_email?: string;
  calibration_phone?: string;
  days_overdue?: number;
  days_remaining?: number;
  status: 'expired' | 'expiring_soon';
  priority: 'critical' | 'warning';
}

interface AlertSummary {
  totalExpired: number;
  totalExpiringSoon: number;
  alerts: CalibrationAlert[];
  hasAlerts: boolean;
}

interface CalibrationAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  alertData: AlertSummary | null;
  loading: boolean;
}

const CalibrationAlertModal: React.FC<CalibrationAlertModalProps> = ({
  isOpen,
  onClose,
  alertData,
  loading
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const getCriticalAlerts = () => {
    return alertData?.alerts.filter(alert => alert.priority === 'critical') || [];
  };

  const getWarningAlerts = () => {
    return alertData?.alerts.filter(alert => alert.priority === 'warning') || [];
  };

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
      zIndex: 10000,
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Header */}
        <div style={{
          background: '#dc2626',
          color: 'white',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '24px' }}>⚠️</span>
            <div>
              <h2 style={{
                margin: 0,
                fontSize: '20px',
                color: 'white',
                fontWeight: '600'
              }}>
                Kalibrasyon Uyarıları
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '5px',
              borderRadius: '4px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{
          padding: '20px',
          flex: 1,
          overflowY: 'auto'
        }}>
          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '40px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #f3f4f6',
                borderTop: '4px solid #dc2626',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px'
              }}></div>
              <p style={{ color: '#64748b' }}>
                Kontrol ediliyor...
              </p>
            </div>
          ) : !alertData?.hasAlerts ? (
            <div style={{
              textAlign: 'center',
              padding: '40px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
              <h3 style={{ 
                color: '#059669', 
                margin: '0 0 8px 0',
                fontSize: '18px'
              }}>
                Tüm makineler uygun durumda
              </h3>
              <p style={{ color: '#64748b', margin: 0 }}>
                Dikkat gerektiren kalibrasyon durumu yok.
              </p>
            </div>
          ) : (
            <>
              {/* Özet */}
              <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '24px'
              }}>
                <div style={{
                  flex: 1,
                  background: '#fef2f2',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #fca5a5',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#dc2626' }}>
                    {alertData.totalExpired}
                  </div>
                  <div style={{ fontSize: '14px', color: '#991b1b' }}>
                    Süresi Geçen
                  </div>
                </div>
                
                <div style={{
                  flex: 1,
                  background: '#fffbeb',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #fed7aa',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>
                    {alertData.totalExpiringSoon}
                  </div>
                  <div style={{ fontSize: '14px', color: '#92400e' }}>
                    30 Gün İçinde
                  </div>
                </div>
              </div>

              {/* Kritik Uyarılar */}
              {getCriticalAlerts().length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{
                    color: '#dc2626',
                    fontSize: '16px',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    🔴 Kalibrasyon Tarihi Geçenler ({getCriticalAlerts().length})
                  </h3>
                  
                  {getCriticalAlerts().map((alert) => (
                    <div key={alert.id} style={{
                      background: '#fef2f2',
                      border: '1px solid #fca5a5',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <h4 style={{
                          margin: 0,
                          fontSize: '16px',
                          color: '#0f172a'
                        }}>
                          {alert.equipment_name}
                        </h4>
                        <span style={{
                          background: '#dc2626',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}>
                          {alert.days_overdue} gün gecikme
                        </span>
                      </div>
                      
                      <div style={{
                        fontSize: '14px',
                        color: '#64748b',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px'
                      }}>
                        <div>Seri: {alert.serial_no}</div>
                        <div>Marka: {alert.brand}</div>
                        <div>Son Kalibrasyon: {formatDate(alert.last_calibration_date)}</div>
                        <div>Kuruluş: {alert.calibration_org_name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Uyarı Bildirimleri */}
              {getWarningAlerts().length > 0 && (
                <div>
                  <h3 style={{
                    color: '#f59e0b',
                    fontSize: '16px',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    🟡 Kalibrasyon Tarihi Yaklaşanlar ({getWarningAlerts().length})
                  </h3>
                  
                  {getWarningAlerts().map((alert) => (
                    <div key={alert.id} style={{
                      background: '#fffbeb',
                      border: '1px solid #fed7aa',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <h4 style={{
                          margin: 0,
                          fontSize: '16px',
                          color: '#0f172a'
                        }}>
                          {alert.equipment_name}
                        </h4>
                        <span style={{
                          background: '#f59e0b',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}>
                          {alert.days_remaining} gün kaldı
                        </span>
                      </div>
                      
                      <div style={{
                        fontSize: '14px',
                        color: '#64748b',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px'
                      }}>
                        <div>Seri: {alert.serial_no}</div>
                        <div>Marka: {alert.brand}</div>
                        <div>Son Kalibrasyon: {formatDate(alert.last_calibration_date)}</div>
                        <div>Kuruluş: {alert.calibration_org_name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              background: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Tamam
          </button>
          {alertData?.hasAlerts && (
            <button
              onClick={() => {
                navigate('/makine-raporla');
                onClose();
              }}
              style={{
                padding: '8px 16px',
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Detaylı Rapor
            </button>
          )}
        </div>

        {/* CSS Animation */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default CalibrationAlertModal;
