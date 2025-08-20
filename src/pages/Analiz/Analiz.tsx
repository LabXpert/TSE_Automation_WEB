import { useState, useEffect } from 'react';
import AnalizView from './AnalizView';
import type { DeneyKaydi } from '../../models/Deney';

// API response tip tanımları
interface ApiApplication {
  id: number;
  companies?: { name: string };
  application_no: string;
  application_date: string;
  certification_type: string;
  test_count: number;
  created_at: string;
  tests?: ApiTest[];
}

interface ApiTest {
  id: number;
  experiment_type_name?: string;
  personnel_first_name?: string;
  personnel_last_name?: string;
  is_accredited: boolean;
  uygunluk: boolean;
  unit_price?: number;
}

// Dashboard istatistik tipleri
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

const Analiz: React.FC = () => {
  const [kayitlariListesi, setKayitlariListesi] = useState<DeneyKaydi[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    toplamTestSayisi: 0,
    aylikTestSayisi: 0,
    uygunlukOrani: 0,
    akrediteOrani: 0,
    toplamFirmaSayisi: 0,
    buAyYeniFirma: 0
  });

  const [aylikiTrendData, setAylikiTrendData] = useState<ChartData>({
    labels: [],
    datasets: []
  });

  const [uygunlukChartData, setUygunlukChartData] = useState<ChartData>({
    labels: ['Uygun', 'Uygun Değil'],
    datasets: [{
      label: 'Uygunluk Durumu',
      data: [0, 0],
      backgroundColor: ['#28a745', '#dc3545']
    }]
  });

  const [akrediteChartData, setAkrediteChartData] = useState<ChartData>({
    labels: ['Akredite', 'Akredite Değil'],
    datasets: [{
      label: 'Akredite Durumu', 
      data: [0, 0],
      backgroundColor: ['#007bff', '#6c757d']
    }]
  });

  const [deneyTuruData, setDeneyTuruData] = useState<ChartData>({
    labels: [],
    datasets: []
  });

  const [firmaAnalizListesi, setFirmaAnalizListesi] = useState<FirmaAnaliz[]>([]);
  const [personelAnalizListesi, setPersonelAnalizListesi] = useState<PersonelAnaliz[]>([]);

  const [selectedTimeRange, setSelectedTimeRange] = useState<'hafta' | 'ay' | 'yil'>('ay');
  const [loading, setLoading] = useState<boolean>(true);

  // Veri çekme
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/applications/all');
        const data = await response.json();
        
        // API'den gelen veriyi DeneyKaydi arayüzüne uygun şekilde dönüştür
        const mapped = data.map((app: ApiApplication) => ({
          id: app.id,
          firmaAdi: app.companies?.name || '',
          basvuruNo: app.application_no,
          basvuruTarihi: app.application_date,
          belgelendirmeTuru: app.certification_type === 'belgelendirme' ? 'belgelendirme' : 'özel',
          deneySayisi: app.test_count,
          kayitTarihi: app.created_at,
          deneyler: (app.tests || []).map((test: ApiTest) => ({
            id: test.id,
            deneyTuru: test.experiment_type_name || '',
            sorumluPersonel: test.personnel_first_name && test.personnel_last_name ? 
              `${test.personnel_first_name} ${test.personnel_last_name}` : '',
            akredite: !!test.is_accredited,
            uygunluk: !!test.uygunluk,
            unit_price: test.unit_price
          }))
        }));

        setKayitlariListesi(mapped);
        
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // İstatistikleri hesapla
  useEffect(() => {
    if (kayitlariListesi.length === 0) return;

    const bugun = new Date();
    const buAyBaslangic = new Date(bugun.getFullYear(), bugun.getMonth(), 1);
    
    // Toplam test sayısı
    const tumTestler = kayitlariListesi.flatMap(kayit => kayit.deneyler);
    const toplamTestSayisi = tumTestler.length;

    // Bu ayki testler
    const buAykiTestler = kayitlariListesi.filter(kayit => 
      new Date(kayit.basvuruTarihi) >= buAyBaslangic
    );
    const aylikTestSayisi = buAykiTestler.flatMap(kayit => kayit.deneyler).length;

    // Uygunluk oranı
    const uygunTestler = tumTestler.filter(test => test.uygunluk);
    const uygunlukOrani = toplamTestSayisi > 0 ? Math.round((uygunTestler.length / toplamTestSayisi) * 100) : 0;

    // Akredite oranı
    const akrediteTestler = tumTestler.filter(test => test.akredite);
    const akrediteOrani = toplamTestSayisi > 0 ? Math.round((akrediteTestler.length / toplamTestSayisi) * 100) : 0;

    // Benzersiz firmalar
    const benzersizFirmalar = new Set(kayitlariListesi.map(kayit => kayit.firmaAdi));
    const toplamFirmaSayisi = benzersizFirmalar.size;

    // Bu ay yeni firmalar
    const buAyYeniFirmalar = new Set(buAykiTestler.map(kayit => kayit.firmaAdi));
    const buAyYeniFirma = buAyYeniFirmalar.size;

    setDashboardStats({
      toplamTestSayisi,
      aylikTestSayisi,
      uygunlukOrani,
      akrediteOrani,
      toplamFirmaSayisi,
      buAyYeniFirma
    });

    // Chart verilerini hazırla
    hazirlaAylikiTrend();
    hazirlaUygunlukChart();
    hazirlaAkrediteChart();
    hazirlaDeneyTuruChart();
    hazirlaFirmaAnaliz();
    hazirlaPersonelAnaliz();

  }, [kayitlariListesi, selectedTimeRange]);

  const hazirlaAylikiTrend = () => {
    const son6Ay = [];
    const bugun = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const tarih = new Date(bugun.getFullYear(), bugun.getMonth() - i, 1);
      son6Ay.push(tarih);
    }

    const aylikVeriler = son6Ay.map(ay => {
      const ayBaslangic = new Date(ay.getFullYear(), ay.getMonth(), 1);
      const ayBitis = new Date(ay.getFullYear(), ay.getMonth() + 1, 0);
      
      const aylikKayitlar = kayitlariListesi.filter(kayit => {
        const kayitTarihi = new Date(kayit.basvuruTarihi);
        return kayitTarihi >= ayBaslangic && kayitTarihi <= ayBitis;
      });
      
      return aylikKayitlar.flatMap(kayit => kayit.deneyler).length;
    });

    const ayIsimleri = son6Ay.map(tarih => 
      tarih.toLocaleDateString('tr-TR', { month: 'short', year: '2-digit' })
    );

    setAylikiTrendData({
      labels: ayIsimleri,
      datasets: [{
        label: 'Aylık Test Sayısı',
        data: aylikVeriler,
        borderColor: '#dc2626',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        fill: true
      }]
    });
  };

  const hazirlaUygunlukChart = () => {
    const tumTestler = kayitlariListesi.flatMap(kayit => kayit.deneyler);
    const uygunSayisi = tumTestler.filter(test => test.uygunluk).length;
    const uygunDegilSayisi = tumTestler.length - uygunSayisi;

    setUygunlukChartData({
      labels: ['Uygun', 'Uygun Değil'],
      datasets: [{
        label: 'Uygunluk Durumu',
        data: [uygunSayisi, uygunDegilSayisi],
        backgroundColor: ['#28a745', '#dc3545']
      }]
    });
  };

  const hazirlaAkrediteChart = () => {
    const tumTestler = kayitlariListesi.flatMap(kayit => kayit.deneyler);
    const akrediteSayisi = tumTestler.filter(test => test.akredite).length;
    const akrediteDegilSayisi = tumTestler.length - akrediteSayisi;

    setAkrediteChartData({
      labels: ['Akredite', 'Akredite Değil'],
      datasets: [{
        label: 'Akredite Durumu',
        data: [akrediteSayisi, akrediteDegilSayisi],
        backgroundColor: ['#007bff', '#6c757d']
      }]
    });
  };

  const hazirlaDeneyTuruChart = () => {
    const deneyTuruSayilari: { [key: string]: number } = {};
    
    kayitlariListesi.forEach(kayit => {
      kayit.deneyler.forEach(deney => {
        if (deney.deneyTuru) {
          deneyTuruSayilari[deney.deneyTuru] = (deneyTuruSayilari[deney.deneyTuru] || 0) + 1;
        }
      });
    });

    // En çok yapılan 10 deney türü
    const siraliDeneyTurleri = Object.entries(deneyTuruSayilari)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    const renkler = [
      '#dc2626', '#059669', '#2563eb', '#d97706', '#7c3aed',
      '#db2777', '#0891b2', '#65a30d', '#dc2626', '#6366f1'
    ];

    setDeneyTuruData({
      labels: siraliDeneyTurleri.map(([tur]) => tur),
      datasets: [{
        label: 'Test Sayısı',
        data: siraliDeneyTurleri.map(([, sayi]) => sayi),
        backgroundColor: renkler
      }]
    });
  };

  const hazirlaFirmaAnaliz = () => {
    const firmaVerileri: { [key: string]: { testSayisi: number; sonTarih: string } } = {};

    kayitlariListesi.forEach(kayit => {
      if (kayit.firmaAdi) {
        if (!firmaVerileri[kayit.firmaAdi]) {
          firmaVerileri[kayit.firmaAdi] = { testSayisi: 0, sonTarih: kayit.basvuruTarihi };
        }
        firmaVerileri[kayit.firmaAdi].testSayisi += kayit.deneyler.length;
        
        if (new Date(kayit.basvuruTarihi) > new Date(firmaVerileri[kayit.firmaAdi].sonTarih)) {
          firmaVerileri[kayit.firmaAdi].sonTarih = kayit.basvuruTarihi;
        }
      }
    });

    const firmaListesi = Object.entries(firmaVerileri)
      .map(([firma, veri]) => ({
        firmaAdi: firma,
        testSayisi: veri.testSayisi,
        sonTestTarihi: veri.sonTarih
      }))
      .sort((a, b) => b.testSayisi - a.testSayisi)
      .slice(0, 10);

    setFirmaAnalizListesi(firmaListesi);
  };

  const hazirlaPersonelAnaliz = () => {
    const personelVerileri: { [key: string]: { testSayisi: number; uygunSayisi: number } } = {};

    kayitlariListesi.forEach(kayit => {
      kayit.deneyler.forEach(deney => {
        if (deney.sorumluPersonel) {
          if (!personelVerileri[deney.sorumluPersonel]) {
            personelVerileri[deney.sorumluPersonel] = { testSayisi: 0, uygunSayisi: 0 };
          }
          personelVerileri[deney.sorumluPersonel].testSayisi++;
          if (deney.uygunluk) {
            personelVerileri[deney.sorumluPersonel].uygunSayisi++;
          }
        }
      });
    });

    const personelListesi = Object.entries(personelVerileri)
      .map(([personel, veri]) => ({
        personelAdi: personel,
        testSayisi: veri.testSayisi,
        uygunlukOrani: veri.testSayisi > 0 ? Math.round((veri.uygunSayisi / veri.testSayisi) * 100) : 0
      }))
      .sort((a, b) => b.testSayisi - a.testSayisi)
      .slice(0, 10);

    setPersonelAnalizListesi(personelListesi);
  };

  const changeTimeRange = (range: 'hafta' | 'ay' | 'yil') => {
    setSelectedTimeRange(range);
  };

  return (
    <AnalizView
      dashboardStats={dashboardStats}
      aylikiTrendData={aylikiTrendData}
      uygunlukChartData={uygunlukChartData}
      akrediteChartData={akrediteChartData}
      deneyTuruData={deneyTuruData}
      firmaAnalizListesi={firmaAnalizListesi}
      personelAnalizListesi={personelAnalizListesi}
      selectedTimeRange={selectedTimeRange}
      changeTimeRange={changeTimeRange}
      loading={loading}
    />
  );
};

export default Analiz;