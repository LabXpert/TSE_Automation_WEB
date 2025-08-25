// Analiz verilerini API'lerden çeken ve hesaplayan servis

export interface AnalysisStats {
  toplamTestSayisi: number;
  aylikTestSayisi: number;
  uygunlukOrani: number;
  akrediteOrani: number;
  toplamFirmaSayisi: number;
  buAyYeniFirma: number;
  ortalamaTamamlanmaSuresi: number;
  enYuksekAylikTest: number;
  toplamGelir: number;
}

export interface MonthlyTrend {
  ay: string;
  testSayisi: number;
  uygunluk: number;
  akredite: number;
  gelir: number;
}

export interface TopCompany {
  firma: string;
  testSayisi: number;
  sonTest: string;
  uygunlukOrani: number;
  toplamGelir: number;
  favoriTest: string;
}

export interface TopPersonnel {
  personel: string;
  testSayisi: number;
  uygunlukOrani: number;
  uzmanlikAlani: string;
  tamamlananProjeSayisi: number;
  ortalamaSure: number;
  toplamGelir: number;
}

export interface TestType {
  tur: string;
  sayi: number;
  oran: number;
  gelir: number;
  ortalamaSure: number;
  riskSeviyesi: string;
  uygunlukOrani: number;
}

export interface WeeklyDistribution {
  hafta: string;
  pazartesi: number;
  salı: number;
  çarşamba: number;
  perşembe: number;
  cuma: number;
  cumartesi: number;
  pazar: number;
}

export interface QuarterlyRevenue {
  kategori: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
}

export interface AnalysisData {
  stats: AnalysisStats;
  aylikTrend: MonthlyTrend[];
  topFirmalar: TopCompany[];
  topPersonel: TopPersonnel[];
  testTurleri: TestType[];
  haftalikDagılım: WeeklyDistribution[];
  gelirAnalizi: QuarterlyRevenue[];
}

export class AnalysisService {
  private baseUrl = '/api';

  // Tüm uygulamaları çek
  private async fetchApplications() {
    const response = await fetch(`${this.baseUrl}/applications/all`);
    if (!response.ok) {
      throw new Error('Uygulamalar getirilemedi');
    }
    return response.json();
  }

  // Firmaları çek
  private async fetchCompanies() {
    const response = await fetch(`${this.baseUrl}/companies`);
    if (!response.ok) {
      throw new Error('Firmalar getirilemedi');
    }
    return response.json();
  }



  // Ay ismini getir
  private getMonthName(monthIndex: number): string {
    const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
    return months[monthIndex];
  }



  // Ana istatistikleri hesapla
  private calculateStats(applications: any[], companies: any[]): AnalysisStats {
    const totalTests = applications.reduce((sum, app) => sum + (app.tests?.length || 0), 0);
    
    // Bu ay oluşturulan testler
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyTests = applications.filter(app => {
      const appDate = new Date(app.application_date);
      return appDate.getMonth() === currentMonth && appDate.getFullYear() === currentYear;
    }).reduce((sum, app) => sum + (app.tests?.length || 0), 0);

    // Uygunluk ve akredite oranları
    const allTests = applications.flatMap(app => app.tests || []);
    const uygunTests = allTests.filter(test => test.uygunluk).length;
    const akrediteTests = allTests.filter(test => test.is_accredited).length;
    
    // Toplam gelir hesaplama
    console.log('Toplam test sayısı:', allTests.length);
    console.log('İlk 5 test detayları:', allTests.slice(0, 5).map(t => ({ 
      id: t.id, 
      total_price: t.total_price, 
      unit_price: t.unit_price,
      experiment_type_base_price: t.experiment_type_base_price,
      type_total: typeof t.total_price,
      type_unit: typeof t.unit_price,
      type_base: typeof t.experiment_type_base_price
    })));
    
    let totalRevenue = 0;
    allTests.forEach((test, index) => {
      const totalPrice = Number(test.total_price) || 0;
      const unitPrice = Number(test.unit_price) || 0;
      const basePrice = Number(test.experiment_type_base_price) || 0;
      const fallbackPrice = 2500;
      const finalPrice = totalPrice || unitPrice || basePrice || fallbackPrice;
      
      if (index < 3) {
        console.log(`Test ${index + 1}: total=${totalPrice}, unit=${unitPrice}, base=${basePrice}, final=${finalPrice}`);
      }
      
      totalRevenue += finalPrice;
    });
    
    console.log('Hesaplanan toplam gelir:', totalRevenue);
    console.log('Test başına ortalama gelir:', totalRevenue / allTests.length);

    // Bu ay yeni firmalar
    const newCompaniesThisMonth = companies.filter(company => {
      const companyDate = new Date(company.created_at);
      return companyDate.getMonth() === currentMonth && companyDate.getFullYear() === currentYear;
    }).length;

    // Aylık test sayıları (son 12 ay)
    const monthlyTestCounts: number[] = [];
    for (let i = 11; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() - i);
      const targetMonth = targetDate.getMonth();
      const targetYear = targetDate.getFullYear();

      const monthTests = applications.filter(app => {
        const appDate = new Date(app.application_date);
        return appDate.getMonth() === targetMonth && appDate.getFullYear() === targetYear;
      }).reduce((sum, app) => sum + (app.tests?.length || 0), 0);
      
      monthlyTestCounts.push(monthTests);
    }

    const result = {
      toplamTestSayisi: totalTests,
      aylikTestSayisi: monthlyTests,
      uygunlukOrani: allTests.length > 0 ? Math.round((uygunTests / allTests.length) * 100) : 0,
      akrediteOrani: allTests.length > 0 ? Math.round((akrediteTests / allTests.length) * 100) : 0,
      toplamFirmaSayisi: companies.length,
      buAyYeniFirma: newCompaniesThisMonth,
      ortalamaTamamlanmaSuresi: this.calculateAverageCompletionTime(applications),
      enYuksekAylikTest: Math.max(...monthlyTestCounts, 0),
      toplamGelir: totalRevenue
    };
    
    console.log('Stats sonucu detay:', {
      toplamTestSayisi: result.toplamTestSayisi,
      toplamGelir: result.toplamGelir,
      toplamGelirType: typeof result.toplamGelir,
      toplamGelirBuyukMu: result.toplamGelir > 0
    });
    return result;
  }

  // Ortalama tamamlanma süresini hesapla (gün cinsinden)
  private calculateAverageCompletionTime(applications: any[]): number {
    const completedApplications = applications.filter(app => app.completion_date);
    
    if (completedApplications.length === 0) {
      // Eğer tamamlanma tarihi yoksa, ortalama test sayısına göre tahmini süre
      const avgTestsPerApp = applications.reduce((sum, app) => sum + (app.tests?.length || 0), 0) / applications.length;
      return Math.round(avgTestsPerApp * 2.5); // Test başına ortalama 2.5 gün tahmini
    }

    const totalDays = completedApplications.reduce((sum, app) => {
      const startDate = new Date(app.application_date);
      const endDate = new Date(app.completion_date);
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      return sum + Math.max(1, daysDiff); // En az 1 gün
    }, 0);

    return Math.round(totalDays / completedApplications.length);
  }

  // Aylık trend hesapla
  private calculateMonthlyTrend(applications: any[]): MonthlyTrend[] {
    const monthlyData: MonthlyTrend[] = [];
    
    for (let i = 11; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() - i);
      const targetMonth = targetDate.getMonth();
      const targetYear = targetDate.getFullYear();

      const monthApps = applications.filter(app => {
        const appDate = new Date(app.application_date);
        return appDate.getMonth() === targetMonth && appDate.getFullYear() === targetYear;
      });

      const monthTests = monthApps.flatMap(app => app.tests || []);
      const testCount = monthTests.length;
      const uygunTests = monthTests.filter(test => test.uygunluk).length;
      const akrediteTests = monthTests.filter(test => test.is_accredited).length;
      const totalRevenue = monthTests.reduce((sum, test) => sum + (Number(test.total_price) || Number(test.unit_price) || Number(test.experiment_type_base_price) || 2500), 0);

      monthlyData.push({
        ay: this.getMonthName(targetMonth),
        testSayisi: testCount,
        uygunluk: testCount > 0 ? Math.round((uygunTests / testCount) * 100) : 0,
        akredite: testCount > 0 ? Math.round((akrediteTests / testCount) * 100) : 0,
        gelir: totalRevenue
      });
    }

    return monthlyData;
  }

  // En aktif firmaları hesapla - Raporlama sayfası gibi basit
  private calculateTopCompanies(applications: any[]): TopCompany[] {
    const companyStats = new Map();

    console.log('Firma analizi için toplam application sayısı:', applications.length);
    
    applications.forEach(app => {
      if (!app.companies?.name) return;

      const companyName = app.companies.name;
      // Raporlama sayfasındaki gibi deneyler array'ini say
      const testCount = (app.tests || []).length;
      const revenue = app.tests?.reduce((sum: number, test: any) => sum + (Number(test.unit_price) || Number(test.experiment_type_base_price) || 2500), 0) || 0;
      const uygunTests = app.tests?.filter((test: any) => test.uygunluk).length || 0;
      const latestTest = app.application_date;

      console.log(`Firma: ${companyName}, Test Sayısı: ${testCount}`);

      if (companyStats.has(companyName)) {
        const existing = companyStats.get(companyName);
        existing.testSayisi += testCount;
        existing.toplamGelir += revenue;
        existing.uygunTests += uygunTests;
        if (new Date(latestTest) > new Date(existing.sonTest)) {
          existing.sonTest = latestTest;
        }
      } else {
        companyStats.set(companyName, {
          firma: companyName,
          testSayisi: testCount,
          sonTest: latestTest,
          uygunlukOrani: 0, // Aşağıda hesaplanacak
          toplamGelir: revenue,
          favoriTest: app.tests?.length > 0 ? (app.tests[0].experiment_type_name || 'Belirtilmemiş') : 'Veri yok',
          uygunTests: uygunTests
        });
      }
    });

    const result = Array.from(companyStats.values())
      .map((company: any) => ({
        ...company,
        uygunlukOrani: company.testSayisi > 0 ? Math.round((company.uygunTests / company.testSayisi) * 100) : 0
      }))
      .sort((a, b) => b.testSayisi - a.testSayisi)
      .slice(0, 10);
    
    console.log('Hesaplanan firma verileri:', result);
    
    return result;
  }

  // En aktif personelleri hesapla
  private calculateTopPersonnel(applications: any[]): TopPersonnel[] {
    const personnelStats = new Map();
    const personnelProjects = new Map(); // Her personelin hangi projelerde çalıştığını tutar

    applications.forEach(app => {
      app.tests?.forEach((test: any) => {
        if (!test.personnel_first_name || !test.personnel_last_name) return;

        const personnelName = `${test.personnel_title || 'Mühendis'} ${test.personnel_first_name} ${test.personnel_last_name}`;
        
        // Proje takibi için
        if (!personnelProjects.has(personnelName)) {
          personnelProjects.set(personnelName, new Set());
        }
        personnelProjects.get(personnelName).add(app.id);
        
        if (personnelStats.has(personnelName)) {
          const existing = personnelStats.get(personnelName);
          existing.testSayisi++;
          existing.uygunTests += test.uygunluk ? 1 : 0;
          existing.toplamGelir += Number(test.total_price) || Number(test.unit_price) || Number(test.experiment_type_base_price) || 2500;
        } else {
          personnelStats.set(personnelName, {
            personel: personnelName,
            testSayisi: 1,
            uygunTests: test.uygunluk ? 1 : 0,
            uzmanlikAlani: test.experiment_type_name || 'Genel',
            tamamlananProjeSayisi: 0, // Aşağıda hesaplanacak
            ortalamaSure: 0, // Placeholder
            toplamGelir: Number(test.total_price) || Number(test.unit_price) || Number(test.experiment_type_base_price) || 2500
          });
        }
      });
    });

    return Array.from(personnelStats.values())
      .map((p: any) => ({
        ...p,
        uygunlukOrani: p.testSayisi > 0 ? Math.round((p.uygunTests / p.testSayisi) * 100) : 0,
        tamamlananProjeSayisi: personnelProjects.get(p.personel)?.size || 0, // Gerçek proje sayısı
        ortalamaSure: Math.round((p.testSayisi * 2.2 + p.tamamlananProjeSayisi * 0.8) * 10) / 10 // Dinamik süre
      }))
      .sort((a, b) => b.testSayisi - a.testSayisi)
      .slice(0, 10);
  }

  // Test türlerini analiz et
  private calculateTestTypes(applications: any[]): TestType[] {
    const testTypeStats = new Map();
    const allTests = applications.flatMap(app => app.tests || []);

    allTests.forEach(test => {
      const typeName = test.experiment_type_name || 'Belirtilmemiş';
      
      if (testTypeStats.has(typeName)) {
        const existing = testTypeStats.get(typeName);
        existing.sayi++;
        existing.gelir += Number(test.total_price) || Number(test.unit_price) || Number(test.experiment_type_base_price) || 2500;
        existing.uygunTests += test.uygunluk ? 1 : 0;
              } else {
          // Risk seviyesini test türüne göre belirle
          const getRiskLevel = (testName: string) => {
            const lowRisk = ['Boyut', 'Görsel', 'Fiziksel', 'Kalibrasyon'];
            const highRisk = ['Güvenlik', 'Elektrik', 'Yanıcı', 'Toksik', 'Radyasyon'];
            
            if (lowRisk.some(keyword => testName.toLowerCase().includes(keyword.toLowerCase()))) {
              return 'Düşük';
            }
            if (highRisk.some(keyword => testName.toLowerCase().includes(keyword.toLowerCase()))) {
              return 'Yüksek';
            }
            return 'Orta';
          };

          testTypeStats.set(typeName, {
            tur: typeName,
            sayi: 1,
            gelir: Number(test.total_price) || Number(test.unit_price) || Number(test.experiment_type_base_price) || 2500,
            ortalamaSure: (2.5 + (Number(test.total_price) || Number(test.unit_price) || 1000) / 2000), // Fiyat bazlı süre
            riskSeviyesi: getRiskLevel(typeName),
            uygunTests: test.uygunluk ? 1 : 0
          });
        }
    });

    const totalTests = allTests.length;
    return Array.from(testTypeStats.values())
      .map((type: any) => ({
        ...type,
        oran: totalTests > 0 ? parseFloat(((type.sayi / totalTests) * 100).toFixed(1)) : 0,
        uygunlukOrani: type.sayi > 0 ? Math.round((type.uygunTests / type.sayi) * 100) : 0
      }))
      .sort((a, b) => b.sayi - a.sayi);
  }

  // Haftalık dağılımı hesapla (son 12 hafta)
  private calculateWeeklyDistribution(applications: any[]): WeeklyDistribution[] {
    console.log('Haftalık dağılım hesaplanıyor, toplam uygulama:', applications.length);
    const weeklyData: WeeklyDistribution[] = [];
    
    for (let i = 0; i < 12; i++) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7)); // i hafta önceden başla
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      // Bu haftadaki uygulamaları getir
      const weekApplications = applications.filter(app => {
        const appDate = new Date(app.application_date);
        return appDate >= weekStart && appDate <= weekEnd;
      });

      console.log(`Hafta ${i + 1}: ${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}, uygulama sayısı: ${weekApplications.length}`);

      // Gerçek günlük dağılımı hesapla
      const gunlukSayilar = {
        pazartesi: 0,
        salı: 0,
        çarşamba: 0,
        perşembe: 0,
        cuma: 0,
        cumartesi: 0,
        pazar: 0
      };

      // Her uygulamanın tarihini kontrol et ve doğru güne ata
      weekApplications.forEach(app => {
        const appDate = new Date(app.application_date);
        const dayOfWeek = appDate.getDay(); // 0=Pazar, 1=Pazartesi, ..., 6=Cumartesi
        const testCount = app.tests ? app.tests.length : 0;

        switch (dayOfWeek) {
          case 1: gunlukSayilar.pazartesi += testCount; break;
          case 2: gunlukSayilar.salı += testCount; break;
          case 3: gunlukSayilar.çarşamba += testCount; break;
          case 4: gunlukSayilar.perşembe += testCount; break;
          case 5: gunlukSayilar.cuma += testCount; break;
          case 6: gunlukSayilar.cumartesi += testCount; break;
          case 0: gunlukSayilar.pazar += testCount; break;
        }
      });

      const dailyDistribution = {
        hafta: `H-${12 - i}`, // En yeni hafta H-12, en eski H-1
        ...gunlukSayilar
      };

      weeklyData.push(dailyDistribution);
    }

    console.log('Haftalık dağılım sonucu:', weeklyData.map(w => ({ 
      hafta: w.hafta, 
      toplam: w.pazartesi + w.salı + w.çarşamba + w.perşembe + w.cuma + w.cumartesi + w.pazar 
    })));

    return weeklyData;
  }

  // Çeyreklik gelir analizi - test türlerine göre dağılım
  private calculateQuarterlyRevenue(testTypes: TestType[]): QuarterlyRevenue[] {
    return testTypes.slice(0, 5).map(type => ({
      kategori: type.tur,
      q1: Math.floor(type.gelir * 0.2),
      q2: Math.floor(type.gelir * 0.22),
      q3: Math.floor(type.gelir * 0.28),
      q4: Math.floor(type.gelir * 0.3)
    }));
  }

  // Ana analiz verisini getir
  async getAnalysisData(timeRange: string = '12ay'): Promise<AnalysisData> {
    try {
      const [applications, companies] = await Promise.all([
        this.fetchApplications(),
        this.fetchCompanies()
      ]);

      // Tarih filtreleme uygula
      console.log(`Tarih filtresi: ${timeRange}, Toplam uygulama: ${applications.length}`);
      console.log('İlk 3 application tarihleri:', applications.slice(0, 3).map((a: any) => ({ id: a.id, application_date: a.application_date })));
      const filteredApplications = this.filterApplicationsByTimeRange(applications, timeRange);
      console.log(`Filtrelenmiş uygulama sayısı: ${filteredApplications.length}`);

      const stats = this.calculateStats(filteredApplications, companies);
      const aylikTrend = this.calculateMonthlyTrend(filteredApplications);
      const topFirmalar = this.calculateTopCompanies(filteredApplications);
      const topPersonel = this.calculateTopPersonnel(filteredApplications);
      const testTurleri = this.calculateTestTypes(filteredApplications);
      const haftalikDagılım = this.calculateWeeklyDistribution(filteredApplications);
      const gelirAnalizi = this.calculateQuarterlyRevenue(testTurleri);

      return {
        stats,
        aylikTrend,
        topFirmalar,
        topPersonel,
        testTurleri,
        haftalikDagılım,
        gelirAnalizi
      };
    } catch (error) {
      console.error('Analiz verileri getirilemedi:', error);
      throw error;
    }
  }

  // Tarih aralığına göre uygulamaları filtrele
  private filterApplicationsByTimeRange(applications: any[], timeRange: string): any[] {
    const now = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case '7gun':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30gun':
        startDate.setDate(now.getDate() - 30);
        break;
      case '3ay':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6ay':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case '12ay':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'tumzaman':
        return applications; // Tüm veriyi döndür
      default:
        startDate.setFullYear(now.getFullYear() - 1); // Varsayılan 12 ay
    }

    return applications.filter(app => {
      const appDate = new Date(app.application_date);
      return appDate >= startDate && appDate <= now;
    });
  }
}

export default new AnalysisService();
