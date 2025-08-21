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

// Mock data - gerçek uygulamada API'den gelecek
const mockData = {
  // Dashboard istatistikleri
  stats: {
    toplamTestSayisi: 1248,
    aylikTestSayisi: 156,
    uygunlukOrani: 87,
    akrediteOrani: 73,
    toplamFirmaSayisi: 89,
    buAyYeniFirma: 12,
    ortalamaTamamlanmaSuresi: 4.2,
    enYuksekAylikTest: 189
  },

  // Aylık trend verileri (12 ay)
  aylikTrend: [
    { ay: 'Oca', testSayisi: 98, uygunluk: 85, akredite: 71, gelir: 125000 },
    { ay: 'Şub', testSayisi: 112, uygunluk: 89, akredite: 75, gelir: 142000 },
    { ay: 'Mar', testSayisi: 134, uygunluk: 86, akredite: 72, gelir: 167000 },
    { ay: 'Nis', testSayisi: 121, uygunluk: 91, akredite: 78, gelir: 154000 },
    { ay: 'May', testSayisi: 145, uygunluk: 88, akredite: 74, gelir: 184000 },
    { ay: 'Haz', testSayisi: 167, uygunluk: 84, akredite: 69, gelir: 201000 },
    { ay: 'Tem', testSayisi: 189, uygunluk: 87, akredite: 76, gelir: 234000 },
    { ay: 'Ağu', testSayisi: 176, uygunluk: 90, akredite: 81, gelir: 219000 },
    { ay: 'Eyl', testSayisi: 143, uygunluk: 85, akredite: 73, gelir: 178000 },
    { ay: 'Eki', testSayisi: 128, uygunluk: 88, akredite: 77, gelir: 162000 },
    { ay: 'Kas', testSayisi: 139, uygunluk: 86, akredite: 75, gelir: 171000 },
    { ay: 'Ara', testSayisi: 156, uygunluk: 87, akredite: 73, gelir: 195000 }
  ],

  // En aktif firmalar
  topFirmalar: [
    { firma: 'ASELSAN A.Ş.', testSayisi: 89, sonTest: '2024-12-15', uygunlukOrani: 92, toplamGelir: 234000, favoriTest: 'EMC Testi' },
    { firma: 'TAI Havacılık', testSayisi: 76, sonTest: '2024-12-12', uygunlukOrani: 89, toplamGelir: 198000, favoriTest: 'Çevresel Test' },
    { firma: 'HAVELSAN A.Ş.', testSayisi: 64, sonTest: '2024-12-10', uygunlukOrani: 94, toplamGelir: 167000, favoriTest: 'Güvenlik Testi' },
    { firma: 'STM Savunma', testSayisi: 58, sonTest: '2024-12-08', uygunlukOrani: 87, toplamGelir: 152000, favoriTest: 'EMC Testi' },
    { firma: 'ROKETSAN A.Ş.', testSayisi: 52, sonTest: '2024-12-07', uygunlukOrani: 91, toplamGelir: 134000, favoriTest: 'Titreşim Testi' },
    { firma: 'MKE Genel Müdürlüğü', testSayisi: 47, sonTest: '2024-12-05', uygunlukOrani: 85, toplamGelir: 121000, favoriTest: 'Isı Testi' },
    { firma: 'TUSAŞ Motor', testSayisi: 43, sonTest: '2024-12-03', uygunlukOrani: 88, toplamGelir: 112000, favoriTest: 'Güvenlik Testi' },
    { firma: 'Baykar Makina', testSayisi: 39, sonTest: '2024-12-01', uygunlukOrani: 93, toplamGelir: 98000, favoriTest: 'Çevresel Test' }
  ],

  // Personel performansı
  topPersonel: [
    { personel: 'Dr. Mehmet YILMAZ', testSayisi: 187, uygunlukOrani: 94, uzmanlikAlani: 'EMC/EMI', tamamlananProjeSayisi: 45, ortalamaSure: 3.2 },
    { personel: 'Mühendis Ayşe KAYA', testSayisi: 156, uygunlukOrani: 91, uzmanlikAlani: 'Çevresel', tamamlananProjeSayisi: 38, ortalamaSure: 3.8 },
    { personel: 'Dr. Fatma DEMİR', testSayisi: 143, uygunlukOrani: 96, uzmanlikAlani: 'Güvenlik', tamamlananProjeSayisi: 34, ortalamaSure: 2.9 },
    { personel: 'Mühendis Ali ÇELİK', testSayisi: 134, uygunlukOrani: 89, uzmanlikAlani: 'Titreşim', tamamlananProjeSayisi: 41, ortalamaSure: 4.1 },
    { personel: 'Dr. Zeynep ÖZTÜRK', testSayisi: 128, uygunlukOrani: 93, uzmanlikAlani: 'Isı/Nem', tamamlananProjeSayisi: 32, ortalamaSure: 3.5 },
    { personel: 'Mühendis Burak ARSLAN', testSayisi: 119, uygunlukOrani: 87, uzmanlikAlani: 'EMC/EMI', tamamlananProjeSayisi: 29, ortalamaSure: 4.3 },
    { personel: 'Dr. Elif ŞAHIN', testSayisi: 112, uygunlukOrani: 95, uzmanlikAlani: 'Güvenlik', tamamlananProjeSayisi: 27, ortalamaSure: 3.1 },
    { personel: 'Mühendis Cem YILDIZ', testSayisi: 98, uygunlukOrani: 88, uzmanlikAlani: 'Çevresel', tamamlananProjeSayisi: 25, ortalamaSure: 3.9 }
  ],

  // Test türü dağılımı
  testTurleri: [
    { tur: 'EMC/EMI Testleri', sayi: 267, oran: 21.4, gelir: 456000, ortalamaSure: 3.2, riskSeviyesi: 'Düşük' },
    { tur: 'Çevresel Testler', sayi: 234, oran: 18.8, gelir: 398000, ortalamaSure: 4.1, riskSeviyesi: 'Orta' },
    { tur: 'Güvenlik Testleri', sayi: 198, oran: 15.9, gelir: 367000, ortalamaSure: 2.8, riskSeviyesi: 'Yüksek' },
    { tur: 'Titreşim Testleri', sayi: 156, oran: 12.5, gelir: 289000, ortalamaSure: 3.7, riskSeviyesi: 'Orta' },
    { tur: 'Isı/Nem Testleri', sayi: 143, oran: 11.5, gelir: 234000, ortalamaSure: 3.4, riskSeviyesi: 'Düşük' },
    { tur: 'Şok Testleri', sayi: 98, oran: 7.9, gelir: 187000, ortalamaSure: 2.1, riskSeviyesi: 'Yüksek' },
    { tur: 'Elektrik Güvenlik', sayi: 87, oran: 7.0, gelir: 156000, ortalamaSure: 2.9, riskSeviyesi: 'Orta' },
    { tur: 'Diğer Testler', sayi: 65, oran: 5.0, gelir: 123000, ortalamaSure: 3.5, riskSeviyesi: 'Düşük' }
  ],

  // Haftalık dağılım (son 12 hafta)
  haftalikDagılım: [
    { hafta: 'H-12', pazartesi: 12, salı: 15, çarşamba: 18, perşembe: 14, cuma: 16, cumartesi: 5, pazar: 2 },
    { hafta: 'H-11', pazartesi: 14, salı: 16, çarşamba: 19, perşembe: 17, cuma: 18, cumartesi: 6, pazar: 1 },
    { hafta: 'H-10', pazartesi: 16, salı: 18, çarşamba: 21, perşembe: 15, cuma: 17, cumartesi: 4, pazar: 3 },
    { hafta: 'H-9', pazartesi: 13, salı: 17, çarşamba: 20, perşembe: 16, cuma: 19, cumartesi: 7, pazar: 2 },
    { hafta: 'H-8', pazartesi: 15, salı: 19, çarşamba: 22, perşembe: 18, cuma: 20, cumartesi: 5, pazar: 1 },
    { hafta: 'H-7', pazartesi: 17, salı: 20, çarşamba: 23, perşembe: 19, cuma: 21, cumartesi: 6, pazar: 2 },
    { hafta: 'H-6', pazartesi: 18, salı: 21, çarşamba: 24, perşembe: 20, cuma: 22, cumartesi: 8, pazar: 3 },
    { hafta: 'H-5', pazartesi: 16, salı: 19, çarşamba: 22, perşembe: 18, cuma: 20, cumartesi: 5, pazar: 1 },
    { hafta: 'H-4', pazartesi: 19, salı: 22, çarşamba: 25, perşembe: 21, cuma: 23, cumartesi: 7, pazar: 2 },
    { hafta: 'H-3', pazartesi: 21, salı: 24, çarşamba: 27, perşembe: 23, cuma: 25, cumartesi: 9, pazar: 4 },
    { hafta: 'H-2', pazartesi: 20, salı: 23, çarşamba: 26, perşembe: 22, cuma: 24, cumartesi: 8, pazar: 3 },
    { hafta: 'H-1', pazartesi: 22, salı: 25, çarşamba: 28, perşembe: 24, cuma: 26, cumartesi: 10, pazar: 5 }
  ],

  // Gelir analizi
  gelirAnalizi: [
    { kategori: 'EMC/EMI', q1: 98000, q2: 112000, q3: 134000, q4: 156000 },
    { kategori: 'Çevresel', q1: 87000, q2: 98000, q3: 123000, q4: 142000 },
    { kategori: 'Güvenlik', q1: 76000, q2: 89000, q3: 112000, q4: 127000 },
    { kategori: 'Titreşim', q1: 65000, q2: 78000, q3: 94000, q4: 108000 },
    { kategori: 'Isı/Nem', q1: 54000, q2: 67000, q3: 81000, q4: 95000 }
  ]
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

const AnalizView = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRangeType>('12ay');

  const [loading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('genel');



  // Zaman aralığı değiştirme
  const handleTimeRangeChange = (range: TimeRangeType) => {
    setSelectedTimeRange(range);
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
              Gelişmiş Analiz Dashboard
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
                value: mockData.stats.toplamTestSayisi.toLocaleString('tr-TR'),
                change: `+${mockData.stats.aylikTestSayisi} bu ay`,
                icon: Target,
                color: COLORS.primary,
                trend: '+12%'
              },

              {
                title: 'Akredite Oranı',
                value: `%${mockData.stats.akrediteOrani}`,
                change: 'Kalite standardında',
                icon: Star,
                color: COLORS.secondary,
                trend: '+5%'
              },
              {
                title: 'Aktif Firma Sayısı',
                value: mockData.stats.toplamFirmaSayisi.toString(),
                change: `+${mockData.stats.buAyYeniFirma} yeni firma`,
                icon: Building2,
                color: COLORS.warning,
                trend: '+8%'
              },

              {
                title: 'Aylık Performans',
                value: mockData.stats.enYuksekAylikTest.toString(),
                change: 'En yüksek aylık test',
                icon: TrendingUp,
                color: COLORS.purple,
                trend: '+25%'
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
                <ComposedChart data={mockData.aylikTrend}>
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
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockData.testTurleri.slice(0, 6)}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="sayi"
                    label={(entry) => `${entry.tur.split(' ')[0]} ${entry.oran}%`}
                    labelLine={false}
                  >
                    {mockData.testTurleri.slice(0, 6).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [value, name]}
                    labelFormatter={(label) => `Test Türü: ${label}`}
                  />
                </PieChart>
              </ResponsiveContainer>
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
              { title: 'En Aktif Firma', value: mockData.topFirmalar[0].firma, subtitle: `${mockData.topFirmalar[0].testSayisi} test` },
              { title: 'En Aktif Firma Test Sayısı', value: mockData.topFirmalar[0].testSayisi, subtitle: mockData.topFirmalar[0].firma },
              { title: 'Toplam Gelir', value: `${(mockData.topFirmalar.reduce((acc, f) => acc + f.toplamGelir, 0) / 1000).toFixed(0)}K ₺`, subtitle: 'Tüm firmalardan' },
              { title: 'Ortalama Test/Firma', value: Math.round(mockData.topFirmalar.reduce((acc, f) => acc + f.testSayisi, 0) / mockData.topFirmalar.length), subtitle: 'Aylık ortalama' }
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
                  {mockData.topFirmalar.map((firma, index) => (
                    <tr key={index} style={{
                      background: '#ffffff',
                      transition: 'all 0.2s ease',
                      borderBottom: index === mockData.topFirmalar.length - 1 ? 'none' : '1px solid #f1f5f9'
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
                          %{Math.floor(Math.random() * 30) + 70}
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
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockData.topFirmalar.slice(0, 6)} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis 
                    type="category" 
                    dataKey="firma"
                    tick={{ fontSize: 9, fill: '#64748b' }}
                    width={120}
                    tickFormatter={(value) => value.length > 15 ? value.substring(0, 12) + '...' : value}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="testSayisi" 
                    fill={COLORS.primary}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
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
                Akredite Oranları
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockData.topFirmalar.slice(0, 6).map(firma => ({...firma, akrediteOrani: Math.floor(Math.random() * 30) + 70}))}>
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
                    dataKey="akrediteOrani" 
                    fill={COLORS.success}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
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
              { title: 'En Aktif Personel', value: mockData.topPersonel[0].personel.split(' ').slice(-2).join(' '), subtitle: '' },
              { title: 'En Aktif Personel Test Sayısı', value: mockData.topPersonel[0].testSayisi, subtitle: 'Test Sayısı' },
              { title: 'Toplam Gelir', value: `${(mockData.topPersonel[0].testSayisi * 2500 / 1000).toFixed(0)}K ₺`, subtitle: 'En aktif personel' },
              { title: 'Performans Artışı', value: '%+15', subtitle: 'Bu aya göre artış' }
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
                  {mockData.topPersonel.map((personel, index) => (
                    <tr key={index} style={{
                      background: '#ffffff',
                      transition: 'all 0.2s ease',
                      borderBottom: index === mockData.topPersonel.length - 1 ? 'none' : '1px solid #f1f5f9'
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
                          %{Math.floor(Math.random() * 25) + 75}
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
                          {personel.personel.includes('Dr.') ? 'Doktor' : 'Mühendis'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center', fontWeight: '600', color: COLORS.success }}>
                        {(personel.testSayisi * 2500 / 1000).toFixed(0)}K ₺
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
                <RadarChart data={mockData.topPersonel.slice(0, 6).map(p => ({
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
                <LineChart data={mockData.topPersonel.slice(0, 4)}>
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
              { title: 'En Popüler Test', value: mockData.testTurleri[0].tur.split(' ')[0], subtitle: 'En Hızlı Test: Şok Testleri' },
              { title: 'En Yüksek Gelir', value: `${(Math.max(...mockData.testTurleri.map(t => t.gelir)) / 1000).toFixed(0)}K ₺`, subtitle: mockData.testTurleri[0].tur },
              { title: 'Deney Türü Sayısı', value: mockData.testTurleri.length, subtitle: 'Toplam türü sayısı' }
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
                    {['Sıra', 'Test Türü', 'Test Sayısı', 'Oran %', 'Toplam Gelir', 'Akredite %', 'Uygunluk %'].map((header, index) => (
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
                  {mockData.testTurleri.map((test, index) => (
                    <tr key={index} style={{
                      background: '#ffffff',
                      transition: 'all 0.2s ease',
                      borderBottom: index === mockData.testTurleri.length - 1 ? 'none' : '1px solid #f1f5f9'
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
                      <td style={{ padding: '16px 12px', textAlign: 'center', fontWeight: '600', color: COLORS.secondary }}>
                        %{Math.floor(Math.random() * 30) + 70}
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center', fontWeight: '600', color: COLORS.success }}>
                        %{Math.floor(Math.random() * 25) + 75}
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
                Deney Türü Dağılımı (TreeMap)
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <Treemap 
                  data={mockData.testTurleri.map((test, index) => ({
                    name: test.tur.split(' ')[0],
                    size: test.sayi,
                    fill: CHART_COLORS[index]
                  }))}
                  dataKey="size"
                  aspectRatio={4/3}
                  stroke="#fff"
                />
              </ResponsiveContainer>
            </div>

            {/* Gelir Analizi */}
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
                Çeyreklik Gelir Trendi
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={mockData.gelirAnalizi}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="kategori" 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
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
                Deney Sayısı Deney Türü Analizi Grafiği
              </h4>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={mockData.testTurleri}>
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
            {[
              { title: 'En Yoğun Gün', value: 'Çarşamba', subtitle: 'Ortalama 24 test' },
              { title: 'En Sakin Gün', value: 'Pazar', subtitle: 'Ortalama 3 test' },
              { title: 'Pik Saatler', value: '09:00-11:00', subtitle: 'En yoğun zaman' },
              { title: 'Haftalık Ortalama', value: '133 test', subtitle: 'Son 12 hafta' }
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
              <AreaChart data={mockData.haftalikDagılım}>
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
                {[18, 20, 24, 19, 21, 7, 3].map((sayi, index) => {
                  const intensity = sayi / 24; // Normalize to 0-1
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
                <LineChart data={mockData.haftalikDagılım.map(hafta => ({
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
              {mockData.stats.toplamTestSayisi.toLocaleString('tr-TR')}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Toplam Test Sayısı</div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
              2.1M ₺
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Toplam Gelir</div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
              {mockData.stats.toplamFirmaSayisi}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Toplam Firma Sayısı</div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
              24
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