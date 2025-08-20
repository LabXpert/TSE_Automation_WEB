import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Props interface
interface DashboardStats {
  toplamTestSayisi: number;
  aylikTestSayisi: number;
  uygunlukOrani: number;
  akrediteOrani: number;
  toplamFirmaSayisi: number;
  buAyYeniFirma: number;
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string | string[];
    fill?: boolean;
  }>;
}

interface FirmaAnaliz {
  firmaAdi: string;
  testSayisi: number;
  sonTestTarihi: string;
}

interface PersonelAnaliz {
  personelAdi: string;
  testSayisi: number;
  uygunlukOrani: number;
}

interface AnalizViewProps {
  dashboardStats: DashboardStats;
  aylikiTrendData: ChartData;
  uygunlukChartData: ChartData;
  akrediteChartData: ChartData;
  deneyTuruData: ChartData;
  firmaAnalizListesi: FirmaAnaliz[];
  personelAnalizListesi: PersonelAnaliz[];
  selectedTimeRange: 'hafta' | 'ay' | 'yil';
  changeTimeRange: (range: 'hafta' | 'ay' | 'yil') => void;
  loading: boolean;
}

const AnalizView: React.FC<AnalizViewProps> = ({
  dashboardStats,
  aylikiTrendData,
  uygunlukChartData,
  akrediteChartData,
  deneyTuruData,
  firmaAnalizListesi,
  personelAnalizListesi,
  selectedTimeRange,
  changeTimeRange,
  loading
}) => {
  // Recharts için veri dönüştürme fonksiyonları
  const convertToLineData = (data: ChartData) => {
    return data.labels.map((label, index) => ({
      name: label,
      value: data.datasets[0]?.data[index] || 0
    }));
  };

  const convertToPieData = (data: ChartData) => {
    return data.labels.map((label, index) => ({
      name: label,
      value: data.datasets[0]?.data[index] || 0
    }));
  };

  const convertToBarData = (data: ChartData) => {
    return data.labels.map((label, index) => ({
      name: label.length > 20 ? label.substring(0, 20) + '...' : label,
      value: data.datasets[0]?.data[index] || 0
    }));
  };

  // Renk tanımlamaları
  const PIE_COLORS = ['#28a745', '#dc3545'];
  const AKREDITE_COLORS = ['#007bff', '#6c757d'];

  if (loading) {
    return (
      <div style={{
        padding: '32px',
        fontFamily: 'inherit',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #dc2626',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <div style={{ fontSize: '18px', fontWeight: '600' }}>Analiz verileri yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '32px', 
      fontFamily: 'inherit', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' 
    }}>
      {/* Page Header */}
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
          margin: '0 0 8px 0', 
          letterSpacing: '-0.025em' 
        }}>
          Analiz Dashboard
        </h1>
        <p style={{ color: '#64748b', fontSize: '16px', margin: 0 }}>
          Test ve performans istatistiklerini görüntüleyin
        </p>
      </div>

      {/* Time Range Selector */}
      <div style={{
        background: '#ffffff',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
            Zaman Aralığı:
          </span>
          {['hafta', 'ay', 'yil'].map((range) => (
            <button
              key={range}
              onClick={() => changeTimeRange(range as 'hafta' | 'ay' | 'yil')}
              style={{
                padding: '8px 16px',
                background: selectedTimeRange === range ? '#dc2626' : '#ffffff',
                color: selectedTimeRange === range ? '#ffffff' : '#374151',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {range === 'hafta' ? 'Son Hafta' : range === 'ay' ? 'Son Ay' : 'Son Yıl'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: '#ffffff',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#64748b',
            margin: '0 0 16px 0',
            textTransform: 'uppercase'
          }}>
            Toplam Test Sayısı
          </h3>
          <div style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#0f172a',
            marginBottom: '8px'
          }}>
            {dashboardStats.toplamTestSayisi.toLocaleString('tr-TR')}
          </div>
          <div style={{
            fontSize: '12px',
            color: '#059669',
            fontWeight: '500'
          }}>
            Bu ay: +{dashboardStats.aylikTestSayisi}
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#64748b',
            margin: '0 0 16px 0',
            textTransform: 'uppercase'
          }}>
            Uygunluk Oranı
          </h3>
          <div style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#0f172a',
            marginBottom: '8px'
          }}>
            %{dashboardStats.uygunlukOrani}
          </div>
          <div style={{
            fontSize: '12px',
            color: dashboardStats.uygunlukOrani >= 80 ? '#059669' : '#dc2626',
            fontWeight: '500'
          }}>
            {dashboardStats.uygunlukOrani >= 80 ? 'Hedef üzerinde' : 'Hedef altında'}
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#64748b',
            margin: '0 0 16px 0',
            textTransform: 'uppercase'
          }}>
            Akredite Oranı
          </h3>
          <div style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#0f172a',
            marginBottom: '8px'
          }}>
            %{dashboardStats.akrediteOrani}
          </div>
          <div style={{
            fontSize: '12px',
            color: '#2563eb',
            fontWeight: '500'
          }}>
            Kalite standardında
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#64748b',
            margin: '0 0 16px 0',
            textTransform: 'uppercase'
          }}>
            Toplam Firma Sayısı
          </h3>
          <div style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#0f172a',
            marginBottom: '8px'
          }}>
            {dashboardStats.toplamFirmaSayisi}
          </div>
          <div style={{
            fontSize: '12px',
            color: '#d97706',
            fontWeight: '500'
          }}>
            Bu ay: +{dashboardStats.buAyYeniFirma} yeni
          </div>
        </div>
      </div>

      {/* Ana Trend Chart */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginBottom: '32px'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#0f172a',
          margin: '0 0 16px 0'
        }}>
          Test Performansı - Son 6 Aylık Trend
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={convertToLineData(aylikiTrendData)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#dc2626" 
              strokeWidth={3}
              dot={{ fill: '#dc2626', strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Charts Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#0f172a',
            margin: '0 0 16px 0'
          }}>
            Uygunluk Dağılımı
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={convertToPieData(uygunlukChartData)}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} %${percent ? (percent * 100).toFixed(0) : '0'}`}
              >
                {convertToPieData(uygunlukChartData).map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#0f172a',
            margin: '0 0 16px 0'
          }}>
            Akredite Dağılımı
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={convertToPieData(akrediteChartData)}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} %${percent ? (percent * 100).toFixed(0) : '0'}`}
              >
                {convertToPieData(akrediteChartData).map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={AKREDITE_COLORS[index % AKREDITE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginBottom: '32px'
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#0f172a',
          margin: '0 0 16px 0'
        }}>
          En Çok Yapılan Deney Türleri (Top 10)
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={convertToBarData(deneyTuruData)} margin={{ bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 11, fill: '#64748b' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip />
            <Bar dataKey="value" fill="#dc2626" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tables */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#0f172a',
            margin: '0 0 20px 0'
          }}>
            En Aktif Firmalar
          </h3>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Firma</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Test Sayısı</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Son Test</th>
                </tr>
              </thead>
              <tbody>
                {firmaAnalizListesi.slice(0, 8).map((firma, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '500', color: '#0f172a' }}>
                      {firma.firmaAdi}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', color: '#374151' }}>
                      {firma.testSayisi}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
                      {new Date(firma.sonTestTarihi).toLocaleDateString('tr-TR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#0f172a',
            margin: '0 0 20px 0'
          }}>
            Personel Performansı
          </h3>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Personel</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Test Sayısı</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Uygunluk %</th>
                </tr>
              </thead>
              <tbody>
                {personelAnalizListesi.slice(0, 8).map((personel, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '500', color: '#0f172a' }}>
                      {personel.personelAdi}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', color: '#374151' }}>
                      {personel.testSayisi}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: personel.uygunlukOrani >= 80 ? '#dcfce7' : personel.uygunlukOrani >= 60 ? '#fef3c7' : '#fee2e2',
                        color: personel.uygunlukOrani >= 80 ? '#166534' : personel.uygunlukOrani >= 60 ? '#92400e' : '#dc2626'
                      }}>
                        %{personel.uygunlukOrani}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AnalizView;