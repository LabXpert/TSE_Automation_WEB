import { useState } from 'react';
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
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Treemap,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { Calendar, Users, TrendingUp, Building2, Clock, BarChart3, PieChart as PieChartIcon, Activity, Target, Star } from 'lucide-react';
import { type AnalysisData } from '../../services/analiz.service';

// Type definitions
type TimeRangeType = '7gun' | '30gun' | '3ay' | '6ay' | '12ay' | 'tumzaman';
type TabType = 'genel' | 'firmalar' | 'personel' | 'testler' | 'zaman';

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

interface AnalizViewProps {
  analysisData: AnalysisData | null;
  loading: boolean;
  error: string | null;
  selectedTimeRange: TimeRangeType;
  onTimeRangeChange: (range: TimeRangeType) => void;
}

const AnalizView = ({ analysisData, loading, error, selectedTimeRange, onTimeRangeChange }: AnalizViewProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('genel');

  // Gerçek veri yoksa varsayılan değerler
  const data = analysisData || {
    stats: {
      toplamTestSayisi: 0,
      aylikTestSayisi: 0,
      uygunlukOrani: 0,
      akrediteOrani: 0,
      toplamFirmaSayisi: 0,
      buAyYeniFirma: 0,
      ortalamaTamamlanmaSuresi: 0,
      enYuksekAylikTest: 0,
      toplamGelir: 0
    },
    aylikTrend: [],
    topFirmalar: [],
    topPersonel: [],
    testTurleri: [],
    haftalikDagılım: [],
    gelirAnalizi: []
  };

// Renk paleti
const COLORS = {
  primary: '#dc2626',
  secondary: '#2563eb', 
  success: '#059669',
  warning: '#d97706',
  info: '#0891b2',
  purple: '#7c3aed',
  pink: '#db2777',
  teal: '#0d9488',
  orange: '#ea580c',
  indigo: '#4f46e5'
};

const CHART_COLORS = [
  COLORS.primary, COLORS.secondary, COLORS.success, COLORS.warning, 
  COLORS.info, COLORS.purple, COLORS.pink, COLORS.teal, COLORS.orange, COLORS.indigo
];



  // Zaman aralığı değiştirme
  const handleTimeRangeChange = (range: TimeRangeType) => {
    onTimeRangeChange(range);
  };

  // Tab değiştirme
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  // Custom tooltip bileşeni
  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(255, 255, 255, 0.98)',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(10px)'
        }}>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', margin: '0 0 8px 0' }}>
            {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ 
              fontSize: '13px', 
              color: entry.color, 
              margin: '4px 0',
              fontWeight: '500'
            }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString('tr-TR') : entry.value}
              {entry.name.includes('Oran') ? '%' : ''}
              {entry.name.includes('Gelir') ? ' ₺' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Loading state
  if (loading) {
    return (
      <div style={{
        padding: '32px',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #dc2626',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <div style={{ fontSize: '18px', fontWeight: '600', color: '#64748b' }}>
            Analiz verileri yükleniyor...
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{
        padding: '32px',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          textAlign: 'center',
          background: '#ffffff',
          padding: '48px',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          maxWidth: '400px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: '#fee2e2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '24px'
          }}>
            ⚠️
          </div>
          <div style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            color: '#dc2626',
            marginBottom: '12px'
          }}>
            Veri Yükleme Hatası
          </div>
          <div style={{ 
            fontSize: '14px', 
            color: '#64748b',
            lineHeight: '1.5',
            marginBottom: '24px'
          }}>
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Sayfayı Yenile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '32px', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        marginBottom: '32px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        padding: '32px',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ 
              fontSize: '36px', 
              fontWeight: '800', 
              color: '#0f172a', 
              margin: '0 0 8px 0',
              background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.025em'
            }}>
              Analiz Dashboard
            </h1>
            <p style={{ color: '#64748b', fontSize: '18px', margin: 0, fontWeight: '500' }}>
              Kapsamlı test performansı ve iş zekası analitleri
            </p>
          </div>
          
          {/* Kontrol Paneli */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Zaman Aralığı Seçici */}
            <select
              value={selectedTimeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value as TimeRangeType)}
              style={{
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                backgroundColor: '#ffffff',
                color: '#374151',
                outline: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minWidth: '140px'
              }}
            >
              <option value="7gun">Son 7 Gün</option>
              <option value="30gun">Son 30 Gün</option>
              <option value="3ay">Son 3 Ay</option>
              <option value="6ay">Son 6 Ay</option>
              <option value="12ay">Son 12 Ay</option>
              <option value="tumzaman">Tüm Zamanlar</option>
            </select>


          </div>
        </div>
      </div>

      {/* Tab Navigasyonu */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '32px',
        background: '#ffffff',
        padding: '8px',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
      }}>
        {[
          { id: 'genel' as TabType, label: 'Genel Bakış', icon: BarChart3 },
          { id: 'firmalar' as TabType, label: 'Firma Analizi', icon: Building2 },
          { id: 'personel' as TabType, label: 'Personel Performansı', icon: Users },
          { id: 'testler' as TabType, label: 'Test Analizi', icon: Activity },
          { id: 'zaman' as TabType, label: 'Zaman Analizi', icon: Clock }
        ].map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: activeTab === tab.id ? 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : '#64748b',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                flex: 1,
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.color = '#374151';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#64748b';
                }
              }}
            >
              <IconComponent size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Genel Bakış Tab */}
      {activeTab === 'genel' && (
        <div>
          {/* Ana İstatistik Kartları */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            {[
              {
                title: 'Toplam Test Sayısı',
                value: data.stats.toplamTestSayisi.toLocaleString('tr-TR'),
                change: `+${data.stats.aylikTestSayisi} bu ay`,
                icon: Target,
                color: COLORS.primary,
                trend: data.stats.aylikTestSayisi > 0 ? `+${Math.round((data.stats.aylikTestSayisi / data.stats.toplamTestSayisi) * 100)}%` : '0%'
              },

              {
                title: 'Akredite Oranı',
                value: `%${data.stats.akrediteOrani}`,
                change: 'Kalite standardında',
                icon: Star,
                color: COLORS.secondary,
                trend: data.stats.akrediteOrani > 75 ? '+Yüksek' : data.stats.akrediteOrani > 50 ? 'Orta' : 'Düşük'
              },
              {
                title: 'Aktif Firma Sayısı',
                value: data.stats.toplamFirmaSayisi.toString(),
                change: `+${data.stats.buAyYeniFirma} yeni firma`,
                icon: Building2,
                color: COLORS.warning,
                trend: data.stats.buAyYeniFirma > 0 ? `+${data.stats.buAyYeniFirma}` : '0'
              },

              {
                title: 'Aylık Performans',
                value: data.stats.enYuksekAylikTest.toString(),
                change: 'En yüksek aylık test',
                icon: TrendingUp,
                color: COLORS.purple,
                trend: data.stats.enYuksekAylikTest > data.stats.aylikTestSayisi ? '+Pik' : 'Normal'
              }
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    padding: '28px',
                    borderRadius: '20px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${stat.color}20 0%, ${stat.color}10 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IconComponent size={24} style={{ color: stat.color }} />
                  </div>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '8px'
                    }}>
                      {stat.title}
                    </div>
                    <div style={{
                      fontSize: '32px',
                      fontWeight: '800',
                      color: '#0f172a',
                      lineHeight: '1.2',
                      marginBottom: '8px'
                    }}>
                      {stat.value}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{
                        fontSize: '13px',
                        color: '#64748b',
                        fontWeight: '500'
                      }}>
                        {stat.change}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        color: stat.trend.startsWith('+') ? COLORS.success : COLORS.primary,
                        background: stat.trend.startsWith('+') ? '#dcfce7' : '#fee2e2',
                        padding: '4px 8px',
                        borderRadius: '6px'
                      }}>
                        {stat.trend}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ana Trend Grafikleri */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '24px',
            marginBottom: '32px'
          }}>
            {/* Aylık Trend */}
            <div style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: '20px',
              padding: '32px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px'
              }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#0f172a',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <TrendingUp size={20} style={{ color: COLORS.primary }} />
                  12 Aylık Toplam Deney Sayısı Trendi
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={data.aylikTrend}>
                  <defs>
                    <linearGradient id="testGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="ay" 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis 
                    yAxisId="left"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickLine={{ stroke: '#e2e8f0' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="testSayisi"
                    stroke={COLORS.primary}
                    fillOpacity={1}
                    fill="url(#testGradient)"
                    strokeWidth={3}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Test Türü Dağılımı */}
            <div style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: '20px',
              padding: '32px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#0f172a',
                margin: '0 0 24px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <PieChartIcon size={18} style={{ color: COLORS.secondary }} />
                Deney Türü Dağılımı
              </h3>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
                {/* Pie Chart */}
                <div style={{ flex: '0 0 300px' }}>
                  <ResponsiveContainer width="100%" height={300}>
                    {data.testTurleri.length > 0 ? (
                      <PieChart>
                        <Pie
                          data={data.testTurleri.slice(0, 6)}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="sayi"
                          label={(entry) => `${entry.oran}%`}
                          labelLine={false}
                        >
                          {data.testTurleri.slice(0, 6).map((_: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name) => [value, 'Test Sayısı']}
                          labelFormatter={(label) => `Test Türü: ${label}`}
                          contentStyle={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                      </PieChart>
                    ) : (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: '#64748b',
                        fontSize: '14px',
                        textAlign: 'center'
                      }}>
                        <div>
                          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🥧</div>
                          <div style={{ fontWeight: '600', marginBottom: '8px' }}>Henüz test verisi yok</div>
                          <div>Test verileri girildikçe burada görünecek</div>
                        </div>
                      </div>
                    )}
                  </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div style={{ flex: '1', minWidth: '200px' }}>
                  {data.testTurleri.length > 0 ? (
                    <div>
                      <h5 style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#64748b',
                        marginBottom: '16px',
                        margin: '0 0 16px 0'
                      }}>
                        Test Türleri
                      </h5>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {data.testTurleri.slice(0, 6).map((test: any, index: number) => (
                          <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '8px 12px',
                            background: '#f8fafc',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0'
                          }}>
                            <div style={{
                              width: '16px',
                              height: '16px',
                              borderRadius: '4px',
                              background: CHART_COLORS[index],
                              flexShrink: 0
                            }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#0f172a',
                                wordBreak: 'break-word',
                                lineHeight: '1.2'
                              }}>
                                {test.tur}
                              </div>
                              <div style={{
                                fontSize: '12px',
                                color: '#64748b',
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: '2px'
                              }}>
                                <span>{test.sayi} test</span>
                                <span>{test.oran}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Firma Analizi Tab */}
      {activeTab === 'firmalar' && (
        <div>
          {/* Firma İstatistikleri */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}>
            {[
              { title: 'En Aktif Firma', value: data.topFirmalar[0]?.firma || 'Veri yok', subtitle: `${Math.floor(data.topFirmalar[0]?.testSayisi || 0)} test` },
              { title: 'En Aktif Firma Test Sayısı', value: Math.floor(data.topFirmalar[0]?.testSayisi || 0), subtitle: data.topFirmalar[0]?.firma || 'Veri yok' },
              { title: 'Toplam Gelir', value: `${(data.topFirmalar.reduce((acc: number, f: any) => acc + f.toplamGelir, 0) / 1000).toFixed(0)}K ₺`, subtitle: 'Tüm firmalardan' },
              { title: 'Ortalama Test/Firma', value: data.topFirmalar.length > 0 ? Math.round(data.topFirmalar.reduce((acc: number, f: any) => acc + f.testSayisi, 0) / data.topFirmalar.length) : 0, subtitle: 'Firma başına ortalama' }
            ].map((stat, index) => (
              <div key={index} style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                  {stat.title}
                </div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {stat.subtitle}
                </div>
              </div>
            ))}
          </div>

          {/* Firma Detay Tablosu */}
          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            marginBottom: '32px'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#0f172a',
              margin: '0 0 24px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Building2 size={20} style={{ color: COLORS.primary }} />
              En Aktif Firmalar - Detaylı Analiz
            </h3>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
                    {['Sıra', 'Firma Adı', 'Test Sayısı', 'Akredite Oranı', 'Toplam Gelir', 'Favori Test Türü', 'Son Test'].map((header, index) => (
                      <th key={index} style={{
                        padding: '16px 12px',
                        textAlign: 'left',
                        fontWeight: '700',
                        color: '#374151',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        ...(index === 0 && { borderTopLeftRadius: '12px' }),
                        ...(index === 6 && { borderTopRightRadius: '12px' })
                      }}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.topFirmalar.map((firma: any, index: number) => (
                    <tr key={index} style={{
                      background: '#ffffff',
                      transition: 'all 0.2s ease',
                      borderBottom: index === data.topFirmalar.length - 1 ? 'none' : '1px solid #f1f5f9'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.transform = 'scale(1.01)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}>
                      <td style={{ padding: '16px 12px', fontWeight: '700', color: COLORS.primary }}>
                        #{index + 1}
                      </td>
                      <td style={{ padding: '16px 12px', fontWeight: '700', color: '#0f172a' }}>
                        {firma.firma}
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                        <span style={{
                          background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                          color: '#1e40af',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: '700'
                        }}>
                          {firma.testSayisi}
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                        <span style={{
                          background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                          color: '#1e40af',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: '700'
                        }}>
                          %{firma.uygunlukOrani}
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px', fontWeight: '600', color: COLORS.success }}>
                        {(firma.toplamGelir / 1000).toFixed(0)}K ₺
                      </td>
                      <td style={{ padding: '16px 12px', color: '#64748b' }}>
                        {firma.favoriTest}
                      </td>
                      <td style={{ padding: '16px 12px', color: '#64748b', fontSize: '12px' }}>
                        {new Date(firma.sonTest).toLocaleDateString('tr-TR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Firma Performans Grafikleri */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px'
          }}>
            {/* Test Sayısı Grafiği */}
            <div style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: '20px',
              padding: '32px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#0f172a',
                margin: '0 0 20px 0'
              }}>
                Firma Test Sayıları
              </h4>
              <ResponsiveContainer width="100%" height={350}>
                {data.topFirmalar.length > 0 ? (
                  <BarChart 
                    data={data.topFirmalar.slice(0, 6)}
                    margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="firma"
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                      tickFormatter={(value) => value.length > 12 ? value.substring(0, 10) + '...' : value}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      label={{ value: 'Test Sayısı', angle: -90, position: 'insideLeft' }}
                      allowDecimals={false}
                    />
                    <Tooltip 
                      formatter={(value, name) => [value, 'Test Sayısı']}
                      labelFormatter={(label) => `Firma: ${label}`}
                      contentStyle={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="testSayisi" 
                      fill={COLORS.primary}
                      radius={[4, 4, 0, 0]}
                      strokeWidth={0}
                    />
                  </BarChart>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: '#64748b',
                    fontSize: '14px',
                    textAlign: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏢</div>
                      <div style={{ fontWeight: '600', marginBottom: '8px' }}>Henüz firma verisi yok</div>
                      <div>Firmalar eklendiğinde burada görünecek</div>
                    </div>
                  </div>
                )}
              </ResponsiveContainer>
            </div>

            {/* Uygunluk Oranları */}
            <div style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: '20px',
              padding: '32px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#0f172a',
                margin: '0 0 20px 0'
              }}>
                Uygunluk Oranları
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                {data.topFirmalar.length > 0 ? (
                  <BarChart data={data.topFirmalar.slice(0, 6)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="firma"
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="uygunlukOrani" 
                      fill={COLORS.success}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: '#64748b',
                    fontSize: '14px',
                    textAlign: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                      <div style={{ fontWeight: '600', marginBottom: '8px' }}>Henüz firma verisi yok</div>
                      <div>Firmalar eklendiğinde burada görünecek</div>
                    </div>
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Personel Performansı Tab */}
      {activeTab === 'personel' && (
        <div>
          {/* Personel İstatistikleri */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}>
            {[
              { title: 'En Aktif Personel', value: data.topPersonel[0]?.personel.split(' ').slice(-2).join(' ') || 'Veri yok', subtitle: '' },
              { title: 'En Aktif Personel Test Sayısı', value: data.topPersonel[0]?.testSayisi || 0, subtitle: 'Test Sayısı' },
              { title: 'Personel Başına Ort. Test', value: data.topPersonel.length > 0 ? Math.round(data.topPersonel.reduce((acc: number, p: any) => acc + p.testSayisi, 0) / data.topPersonel.length) : 0, subtitle: 'Personel başına ortalama' },
              { title: 'Toplam Personel', value: data.topPersonel.length, subtitle: 'Aktif personel sayısı' }
            ].map((stat, index) => (
              <div key={index} style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                  {stat.title}
                </div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {stat.subtitle}
                </div>
              </div>
            ))}
          </div>

          {/* Personel Performans Tablosu */}
          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            marginBottom: '32px'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#0f172a',
              margin: '0 0 24px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Users size={20} style={{ color: COLORS.primary }} />
              Personel Performans Analizi
            </h3>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
                    {['Sıra', 'Personel Adı', 'Test Sayısı', 'Akredite %', 'Unvan', 'Gelir'].map((header, index) => (
                      <th key={index} style={{
                        padding: '16px 12px',
                        textAlign: 'left',
                        fontWeight: '700',
                        color: '#374151',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        ...(index === 0 && { borderTopLeftRadius: '12px' }),
                        ...(index === 5 && { borderTopRightRadius: '12px' })
                      }}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.topPersonel.map((personel: any, index: number) => (
                    <tr key={index} style={{
                      background: '#ffffff',
                      transition: 'all 0.2s ease',
                      borderBottom: index === data.topPersonel.length - 1 ? 'none' : '1px solid #f1f5f9'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.transform = 'scale(1.01)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}>
                      <td style={{ padding: '16px 12px', fontWeight: '700', color: COLORS.primary }}>
                        #{index + 1}
                      </td>
                      <td style={{ padding: '16px 12px', fontWeight: '700', color: '#0f172a' }}>
                        {personel.personel}
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                        <span style={{
                          background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                          color: '#1e40af',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: '700'
                        }}>
                          {personel.testSayisi}
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                        <span style={{
                          background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                          color: '#1e40af',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: '700'
                        }}>
                          %{personel.uygunlukOrani}
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px' }}>
                        <span style={{
                          background: '#f1f5f9',
                          color: '#475569',
                          padding: '4px 8px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {personel.personel.includes('Dr.') ? 'Doktor' : personel.personel.includes('Prof.') ? 'Profesör' : personel.personel.includes('Ing.') ? 'Mühendis' : personel.testSayisi > 15 ? 'Uzman' : 'Teknisyen'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center', fontWeight: '600', color: COLORS.success }}>
                        {((personel.toplamGelir || 0) / 1000).toFixed(0)}K ₺
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Personel Grafikleri */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px'
          }}>
            {/* Test Dağılımı */}
            <div style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: '20px',
              padding: '32px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#0f172a',
                margin: '0 0 20px 0'
              }}>
                Personel Test Dağılımı
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={data.topPersonel.slice(0, 6).map((p: any) => ({
                  personel: p.personel.split(' ').slice(-1)[0],
                  testSayisi: p.testSayisi,
                  uygunluk: p.uygunlukOrani
                }))}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="personel" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis tick={{ fontSize: 10 }} />
                  <Radar
                    name="Test Sayısı"
                    dataKey="testSayisi"
                    stroke={COLORS.primary}
                    fill={COLORS.primary}
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Performans Karşılaştırması */}
            <div style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: '20px',
              padding: '32px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#0f172a',
                margin: '0 0 20px 0'
              }}>
                Personel Test Grafiği
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.topPersonel.slice(0, 4)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="personel"
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    label={{ value: 'Test Sayısı', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="testSayisi" 
                    stroke={COLORS.primary}
                    strokeWidth={3}
                    dot={{ fill: COLORS.primary, strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Test Analizi Tab */}
      {activeTab === 'testler' && (
        <div>
          {/* Test İstatistikleri */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}>
            {[
              { title: 'En Popüler Test', value: data.testTurleri[0]?.tur || 'Veri yok', subtitle: `${data.testTurleri[0]?.sayi || 0} test yapıldı` },
              { title: 'En Yüksek Gelir', value: data.testTurleri.length > 0 ? `${(Math.max(...data.testTurleri.map((t: any) => t.gelir)) / 1000).toFixed(0)}K ₺` : '0K ₺', subtitle: data.testTurleri.length > 0 ? data.testTurleri.reduce((max, current) => current.gelir > max.gelir ? current : max, data.testTurleri[0]).tur : 'Veri yok' },
              { title: 'Deney Türü Sayısı', value: data.testTurleri.length, subtitle: 'Toplam türü sayısı' }
            ].map((stat, index) => (
              <div key={index} style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                  {stat.title}
                </div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {stat.subtitle}
                </div>
              </div>
            ))}
          </div>

          {/* Test Türü Detay Analizi */}
          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            marginBottom: '32px'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#0f172a',
              margin: '0 0 24px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Activity size={20} style={{ color: COLORS.primary }} />
              Test Türü Detaylı Analizi
            </h3>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
                    {['Sıra', 'Deney Türü', 'Test Sayısı', 'Oran %', 'Toplam Gelir', 'Uygunluk %'].map((header, index) => (
                      <th key={index} style={{
                        padding: '16px 12px',
                        textAlign: 'left',
                        fontWeight: '700',
                        color: '#374151',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        ...(index === 0 && { borderTopLeftRadius: '12px' }),
                        ...(index === 5 && { borderTopRightRadius: '12px' })
                      }}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.testTurleri.map((test: any, index: number) => (
                    <tr key={index} style={{
                      background: '#ffffff',
                      transition: 'all 0.2s ease',
                      borderBottom: index === data.testTurleri.length - 1 ? 'none' : '1px solid #f1f5f9'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.transform = 'scale(1.01)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}>
                      <td style={{ padding: '16px 12px', fontWeight: '700', color: COLORS.primary }}>
                        #{index + 1}
                      </td>
                      <td style={{ padding: '16px 12px', fontWeight: '700', color: '#0f172a' }}>
                        {test.tur}
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                        <span style={{
                          background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                          color: '#1e40af',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: '700'
                        }}>
                          {test.sayi}
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center', fontWeight: '600', color: '#64748b' }}>
                        %{test.oran}
                      </td>
                      <td style={{ padding: '16px 12px', fontWeight: '600', color: COLORS.success }}>
                        {(test.gelir / 1000).toFixed(0)}K ₺
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center', fontWeight: '600', color: COLORS.success }}>
                        %{test.uygunlukOrani || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Test Grafikleri */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '32px'
          }}>
            {/* Test Türü TreeMap */}
            <div style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: '20px',
              padding: '32px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#0f172a',
                margin: '0 0 20px 0'
              }}>
                Test Türü Dağılım Haritası
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                padding: '16px 0'
              }}>
                {data.testTurleri.length > 0 ? (
                  data.testTurleri.slice(0, 8).map((test: any, index: number) => {
                    const maxSize = Math.max(...data.testTurleri.map((t: any) => t.sayi));
                    const relativeSize = test.sayi / maxSize;
                    const height = Math.max(80, 60 + (relativeSize * 120)); // 80px min, 180px max
                    
                    return (
                      <div
                        key={index}
                        style={{
                          background: `linear-gradient(135deg, ${CHART_COLORS[index % CHART_COLORS.length]} 0%, ${CHART_COLORS[index % CHART_COLORS.length]}CC 100%)`,
                          borderRadius: '16px',
                          padding: '16px',
                          color: '#ffffff',
                          height: `${height}px`,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          position: 'relative',
                          overflow: 'hidden',
                          border: '2px solid rgba(255, 255, 255, 0.2)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          transition: 'transform 0.2s ease',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                        }}
                      >
                        {/* Background Pattern */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          width: '60px',
                          height: '60px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '50%',
                          transform: 'translate(20px, -20px)'
                        }} />
                        
                        <div>
                          <div style={{
                            fontSize: '13px',
                            fontWeight: '700',
                            lineHeight: '1.3',
                            marginBottom: '8px',
                            wordBreak: 'break-word'
                          }}>
                            {test.tur}
                          </div>
                          <div style={{
                            fontSize: '11px',
                            opacity: 0.9
                          }}>
                            %{test.oran} oranında
                          </div>
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <div style={{
                            fontSize: '24px',
                            fontWeight: '900'
                          }}>
                            {test.sayi}
                          </div>
                          <div style={{
                            fontSize: '10px',
                            fontWeight: '600',
                            opacity: 0.8
                          }}>
                            TEST
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '200px',
                    color: '#64748b',
                    fontSize: '14px',
                    textAlign: 'center',
                    gridColumn: '1 / -1'
                  }}>
                    <div>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                      <div style={{ fontWeight: '600', marginBottom: '8px' }}>Henüz test verisi yok</div>
                      <div>Test verileri girildikçe burada görünecek</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Gelir Analizi */}
            <div style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: '20px',
              padding: '32px 32px 56px 32px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#0f172a',
                margin: '0 0 20px 0'
              }}>
                Çeyreklik Gelir Trendi
              </h4>
              <ResponsiveContainer width="100%" height={850}>
                <ComposedChart 
                  data={data.gelirAnalizi}
                  margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="kategori" 
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    angle={-45}
                    textAnchor="end"
                    height={120}
                    interval={0}
                    tickFormatter={(value) => value.length > 20 ? value.substring(0, 18) + '...' : value}
                  />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="q1" stackId="a" fill={COLORS.primary} />
                  <Bar dataKey="q2" stackId="a" fill={COLORS.secondary} />
                  <Bar dataKey="q3" stackId="a" fill={COLORS.success} />
                  <Bar dataKey="q4" stackId="a" fill={COLORS.warning} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Test Süre Analizi */}
          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
          }}>
                          <h4 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#0f172a',
                margin: '0 0 20px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Activity size={18} style={{ color: COLORS.info }} />
                Deney Türü Başına Test Sayısı Analizi
              </h4>
            <ResponsiveContainer width="100%" height={350}>
              {data.testTurleri.length > 0 ? (
                <BarChart data={data.testTurleri}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="tur"
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="sayi" 
                    fill={COLORS.info}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: '#64748b',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📈</div>
                    <div style={{ fontWeight: '600', marginBottom: '8px' }}>Henüz test verisi yok</div>
                    <div>Test verileri girildikçe burada görünecek</div>
                  </div>
                </div>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Zaman Analizi Tab */}
      {activeTab === 'zaman' && (
        <div>
          {/* Zaman İstatistikleri */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}>
            {(() => {
              // Haftalık dağılım verilerinden günleri analiz et
              const gunler = ['pazartesi', 'salı', 'çarşamba', 'perşembe', 'cuma', 'cumartesi', 'pazar'];
              const gunIstatistikleri = gunler.map(gun => {
                const toplam = data.haftalikDagılım.reduce((sum: number, hafta: any) => sum + (hafta[gun] || 0), 0);
                const aktifHaftaSayisi = data.haftalikDagılım.filter((hafta: any) => (hafta[gun] || 0) > 0).length;
                const ortalama = aktifHaftaSayisi > 2 ? Math.round(toplam / aktifHaftaSayisi) : toplam;
                return { gun: gun.charAt(0).toUpperCase() + gun.slice(1), toplam, ortalama };
              });
              
              const enYogunGun = gunIstatistikleri.reduce((max, gun) => gun.ortalama > max.ortalama ? gun : max);
              const enSakinGun = gunIstatistikleri.reduce((min, gun) => gun.ortalama < min.ortalama ? gun : min);
              const haftalikOrtalama = Math.round(data.stats.toplamTestSayisi / 52); // Yıllık testin haftalık ortalaması
              
              return [
                { title: 'En Yoğun Gün', value: enYogunGun.gun, subtitle: `Ortalama ${enYogunGun.ortalama} test` },
                { title: 'En Sakin Gün', value: enSakinGun.gun, subtitle: `Ortalama ${enSakinGun.ortalama} test` },
                { title: 'En Yoğun Saat', value: data.stats.toplamTestSayisi > 50 ? '09:00-11:00' : '10:00-12:00', subtitle: 'İş saatleri arası' },
                { title: 'Haftalık Ortalama', value: `${haftalikOrtalama} test`, subtitle: 'Yıllık bazda' }
              ];
            })().map((stat, index) => (
              <div key={index} style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                  {stat.title}
                </div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {stat.subtitle}
                </div>
              </div>
            ))}
          </div>

          {/* Haftalık Dağılım Analizi */}
          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            marginBottom: '32px'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#0f172a',
              margin: '0 0 24px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Calendar size={20} style={{ color: COLORS.primary }} />
              Son 12 Hafta - Günlük Test Dağılımı
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={data.haftalikDagılım}>
                <defs>
                  {['pazartesi', 'salı', 'çarşamba', 'perşembe', 'cuma', 'cumartesi', 'pazar'].map((gun, index) => (
                    <linearGradient key={gun} id={`gradient-${gun}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS[index]} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={CHART_COLORS[index]} stopOpacity={0.1}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="hafta" 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="pazartesi"
                  stackId="1"
                  stroke={CHART_COLORS[0]}
                  fill="url(#gradient-pazartesi)"
                />
                <Area
                  type="monotone"
                  dataKey="salı"
                  stackId="1"
                  stroke={CHART_COLORS[1]}
                  fill="url(#gradient-salı)"
                />
                <Area
                  type="monotone"
                  dataKey="çarşamba"
                  stackId="1"
                  stroke={CHART_COLORS[2]}
                  fill="url(#gradient-çarşamba)"
                />
                <Area
                  type="monotone"
                  dataKey="perşembe"
                  stackId="1"
                  stroke={CHART_COLORS[3]}
                  fill="url(#gradient-perşembe)"
                />
                <Area
                  type="monotone"
                  dataKey="cuma"
                  stackId="1"
                  stroke={CHART_COLORS[4]}
                  fill="url(#gradient-cuma)"
                />
                <Area
                  type="monotone"
                  dataKey="cumartesi"
                  stackId="1"
                  stroke={CHART_COLORS[5]}
                  fill="url(#gradient-cumartesi)"
                />
                <Area
                  type="monotone"
                  dataKey="pazar"
                  stackId="1"
                  stroke={CHART_COLORS[6]}
                  fill="url(#gradient-pazar)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Günlük Dağılım Heatmap Benzeri */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px'
          }}>
            {/* Günlük Ortalamalar */}
            <div style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: '20px',
              padding: '32px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#0f172a',
                margin: '0 0 20px 0'
              }}>
                Günlük Test Ortalamaları
              </h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(7, 1fr)', 
                gap: '8px',
                marginBottom: '16px'
              }}>
                {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((gun) => (
                  <div key={gun} style={{
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#64748b',
                    padding: '8px 4px'
                  }}>
                    {gun}
                  </div>
                ))}
              </div>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(7, 1fr)', 
                gap: '8px'
              }}>
                {(() => {
                  const gunler = ['pazartesi', 'salı', 'çarşamba', 'perşembe', 'cuma', 'cumartesi', 'pazar'];
                  return gunler.map(gun => {
                    const toplam = data.haftalikDagılım.reduce((sum: number, hafta: any) => sum + (hafta[gun] || 0), 0);
                    // Sadece test olan haftaları say (0 olmayan)
                    const aktifHaftaSayisi = data.haftalikDagılım.filter((hafta: any) => (hafta[gun] || 0) > 0).length;
                    // Eğer az veri varsa toplam değeri göster, çoksa ortalama
                    return aktifHaftaSayisi > 2 ? Math.round(toplam / aktifHaftaSayisi) : toplam;
                  });
                })().map((sayi, index) => {
                  const maxSayi = Math.max(...(() => {
                    const gunler = ['pazartesi', 'salı', 'çarşamba', 'perşembe', 'cuma', 'cumartesi', 'pazar'];
                    return gunler.map(gun => {
                      const toplam = data.haftalikDagılım.reduce((sum: number, hafta: any) => sum + (hafta[gun] || 0), 0);
                      const aktifHaftaSayisi = data.haftalikDagılım.filter((hafta: any) => (hafta[gun] || 0) > 0).length;
                      return aktifHaftaSayisi > 2 ? Math.round(toplam / aktifHaftaSayisi) : toplam;
                    });
                  })(), 1);
                  const intensity = sayi / maxSayi; // Normalize to 0-1
                  return (
                    <div key={index} style={{
                      background: `linear-gradient(135deg, ${COLORS.primary}${Math.round(intensity * 255).toString(16).padStart(2, '0')} 0%, ${COLORS.primary}${Math.round(intensity * 200).toString(16).padStart(2, '0')} 100%)`,
                      color: intensity > 0.5 ? '#ffffff' : '#374151',
                      padding: '16px 8px',
                      borderRadius: '12px',
                      textAlign: 'center',
                      fontSize: '16px',
                      fontWeight: '700',
                      border: intensity > 0.7 ? `2px solid ${COLORS.primary}` : '1px solid #e2e8f0'
                    }}>
                      {sayi}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Haftalık Trend */}
            <div style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: '20px',
              padding: '32px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#0f172a',
                margin: '0 0 20px 0'
              }}>
                Haftalık Toplam Trend
              </h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data.haftalikDagılım.map((hafta: any) => ({
                  hafta: hafta.hafta,
                  toplam: hafta.pazartesi + hafta.salı + hafta.çarşamba + hafta.perşembe + hafta.cuma + hafta.cumartesi + hafta.pazar
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="hafta" 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="toplam" 
                    stroke={COLORS.primary}
                    strokeWidth={4}
                    dot={{ fill: COLORS.primary, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 8, stroke: COLORS.primary, strokeWidth: 2, fill: '#ffffff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Footer İstatistikleri */}
      <div style={{
        marginTop: '48px',
        padding: '24px',
        background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
        borderRadius: '20px',
        color: '#ffffff',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
              {data.stats.toplamTestSayisi.toLocaleString('tr-TR')}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Toplam Test Sayısı</div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
              {(() => {
                const gelir = Number(data.stats.toplamGelir) || 0;
                const testSayisi = Number(data.stats.toplamTestSayisi) || 0;
                
                // Eğer gelir var ise onu kullan
                if (gelir > 0) {
                  return gelir.toLocaleString('tr-TR') + ' ₺';
                }
                
                // Gelir yoksa test sayısından hesapla
                if (testSayisi > 0) {
                  const tahminGelir = testSayisi * 3000; // 3000₺ per test
                  return tahminGelir.toLocaleString('tr-TR') + ' ₺';
                }
                
                // Hiçbir veri yoksa 0
                return '0 ₺';
              })()}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Toplam Gelir</div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
              {data.stats.toplamFirmaSayisi}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Toplam Firma Sayısı</div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
              {data.topPersonel.length}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Toplam Personel Sayısı</div>
          </div>
        </div>
      </div>

      {/* CSS Animasyonları */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        
        .recharts-tooltip-wrapper {
          z-index: 1000;
        }
      `}</style>
    </div>
  );
};

export default AnalizView;