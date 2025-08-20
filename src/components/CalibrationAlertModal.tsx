import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CalibrationAlertModal.css';

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
    <div className="alert-modal-overlay">
      <div className="alert-modal">
        <div className="alert-modal-header">
          <div className="alert-header-content">
            <div className="alert-icon">
              <span className="warning-icon">⚠️</span>
            </div>
            <div className="alert-title">
              <h2>Kalibrasyon Uyarıları</h2>
              <p>Dikkat gerektiren makine kalibrasyon durumları</p>
            </div>
          </div>
          <button className="alert-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="alert-modal-body">
          {loading ? (
            <div className="alert-loading">
              <div className="loading-spinner"></div>
              <p>Kalibrasyon verileri kontrol ediliyor...</p>
            </div>
          ) : !alertData?.hasAlerts ? (
            <div className="no-alerts">
              <div className="success-icon">✅</div>
              <h3>Tüm makineler uygun durumda</h3>
              <p>Şu anda dikkat gerektiren kalibrasyon durumu bulunmuyor.</p>
            </div>
          ) : (
            <>
              {/* Özet Bilgiler */}
              <div className="alert-summary">
                <div className="summary-card critical">
                  <div className="summary-icon">🔴</div>
                  <div className="summary-content">
                    <h3>{alertData.totalExpired}</h3>
                    <p>Süresi Geçen</p>
                  </div>
                </div>
                <div className="summary-card warning">
                  <div className="summary-icon">🟡</div>
                  <div className="summary-content">
                    <h3>{alertData.totalExpiringSoon}</h3>
                    <p>30 Gün İçinde</p>
                  </div>
                </div>
              </div>

              {/* Kritik Uyarılar */}
              {getCriticalAlerts().length > 0 && (
                <div className="alert-section critical-section">
                  <div className="section-header">
                    <span className="section-icon">🔴</span>
                    <h3>Acil Müdahale Gereken Makineler</h3>
                    <span className="section-count">{getCriticalAlerts().length}</span>
                  </div>
                  <div className="alert-list">
                    {getCriticalAlerts().map((alert) => (
                      <div key={alert.id} className="alert-item critical">
                        <div className="alert-item-header">
                          <h4>{alert.equipment_name}</h4>
                          <span className="alert-status critical">
                            {alert.days_overdue} gün gecikme
                          </span>
                        </div>
                        <div className="alert-item-details">
                          <div className="detail-row">
                            <span className="detail-label">Seri No:</span>
                            <span>{alert.serial_no}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Marka/Model:</span>
                            <span>{alert.brand} / {alert.model}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Son Kalibrasyon:</span>
                            <span>{formatDate(alert.last_calibration_date)}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Kalibrasyon Kuruluşu:</span>
                            <span>{alert.calibration_org_name}</span>
                          </div>
                          {alert.calibration_contact_name && (
                            <div className="detail-row">
                              <span className="detail-label">İletişim:</span>
                              <span>{alert.calibration_contact_name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Uyarı Bildirimleri */}
              {getWarningAlerts().length > 0 && (
                <div className="alert-section warning-section">
                  <div className="section-header">
                    <span className="section-icon">🟡</span>
                    <h3>30 Gün İçinde Süresi Dolacak Makineler</h3>
                    <span className="section-count">{getWarningAlerts().length}</span>
                  </div>
                  <div className="alert-list">
                    {getWarningAlerts().map((alert) => (
                      <div key={alert.id} className="alert-item warning">
                        <div className="alert-item-header">
                          <h4>{alert.equipment_name}</h4>
                          <span className="alert-status warning">
                            {alert.days_remaining} gün kaldı
                          </span>
                        </div>
                        <div className="alert-item-details">
                          <div className="detail-row">
                            <span className="detail-label">Seri No:</span>
                            <span>{alert.serial_no}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Marka/Model:</span>
                            <span>{alert.brand} / {alert.model}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Son Kalibrasyon:</span>
                            <span>{formatDate(alert.last_calibration_date)}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Kalibrasyon Kuruluşu:</span>
                            <span>{alert.calibration_org_name}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="alert-modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Tamam
          </button>
          {alertData?.hasAlerts && (
            <button className="btn-primary" onClick={() => {
              // Makine raporlama sayfasına yönlendir
              navigate('/makine-raporla');
              onClose();
            }}>
              Detaylı Rapor
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalibrationAlertModal;
