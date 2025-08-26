import express from 'express';
import * as cron from 'node-cron';
import * as dotenv from 'dotenv';
import { ReportGenerator } from './report';
import { EmailService } from './mailer';
import { ReportCleanup } from './cleanup';

// Çevre değişkenlerini yükle (.env dosyasından)
dotenv.config();

const app = express();
app.use(express.json());

// Uygulama Ayarları - .env dosyasından alınır
const config = {
  port: parseInt(process.env.PORT || '3001'),           // Server portu
  gmailUser: process.env.GMAIL_USER || '',              // Gmail kullanıcı adı
  gmailAppPassword: process.env.GMAIL_APP_PASSWORD || '', // Gmail uygulama şifresi
  reportRecipient: process.env.REPORT_RECIPIENT || '',   // Rapor gönderilecek email adresi
  cronExpression: process.env.CRON_EXPRESSION || '0 9 * * 1', // Varsayılan: Pazartesi 09:00
  cronTz: process.env.CRON_TZ || 'Europe/Istanbul',     // Zaman dilimi
  reportDir: process.env.REPORT_DIR || './reports',     // Rapor dosyalarının kaydedileceği klasör
  tseBackendUrl: process.env.TSE_BACKEND_URL || 'http://localhost:3000' // Ana TSE backend URL'si
};

// Gerekli çevre değişkenlerinin kontrol edilmesi
const requiredEnvVars = [
  { key: 'GMAIL_USER', value: config.gmailUser },
  { key: 'GMAIL_APP_PASSWORD', value: config.gmailAppPassword },
  { key: 'REPORT_RECIPIENT', value: config.reportRecipient }
];

const missingVars = requiredEnvVars.filter(envVar => !envVar.value);
if (missingVars.length > 0) {
  console.error('Eksik çevre değişkenleri bulundu:');
  missingVars.forEach(envVar => console.error(`- ${envVar.key}`));
  console.error('Lütfen .env dosyanızı kontrol edin');
  process.exit(1);
}

// Servislerin başlatılması
const reportGenerator = new ReportGenerator(config.tseBackendUrl, config.reportDir);
const emailService = new EmailService({
  gmailUser: config.gmailUser,
  gmailAppPassword: config.gmailAppPassword
});
const reportCleanup = new ReportCleanup(config.reportDir, 30); // 30 gün saklama süresi

// Ana fonksiyon: Haftalık rapor üretimi ve gönderimi
async function generateAndSendWeeklyReport(): Promise<void> {
  try {
    console.log('=== Haftalık rapor üretimi ve gönderimi başlıyor ===');
    console.log(`Zaman damgası: ${new Date().toLocaleString('tr-TR')}`);
    
    // Raporu üret
    console.log('Adım 1: Excel raporu oluşturuluyor...');
    const reportPath = await reportGenerator.generateWeeklyReport();
    
    // Email gönder
    console.log('Adım 2: Email gönderiliyor...');
    const dateRange = reportGenerator.getWeekDateRange();
    const subject = `Haftalık Rapor — ${dateRange}`;
    
    const success = await emailService.sendReport(
      config.reportRecipient,
      reportPath,
      subject,
      2 // Maksimum 2 kez tekrar deneme
    );
    
    if (success) {
      console.log('✅ Haftalık rapor başarıyla oluşturuldu ve gönderildi!');
    } else {
      console.error('❌ Haftalık rapor emaili gönderilemedi');
    }
    
  } catch (error) {
    console.error('Haftalık rapor işleminde hata:', error);
    
    // Hata bildirimi email'i göndermeyi dene
    try {
      await emailService.sendTestEmail(config.reportRecipient);
    } catch (emailError) {
      console.error('Hata bildirimi emaili gönderilemedi:', emailError);
    }
  }
}

// API Endpoint'leri

// Sistem sağlık durumu kontrolü
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'TSE Otomatik Raporlama Sistemi',
    timestamp: new Date().toISOString(),
    config: {
      reportDir: config.reportDir,
      cronExpression: config.cronExpression,
      cronTz: config.cronTz,
      tseBackendUrl: config.tseBackendUrl,
      reportRecipient: config.reportRecipient.replace(/(.{3}).*@/, '$1***@') // Email'i gizle
    }
  });
});

// Manuel rapor tetikleme (test için)
app.post('/send-now', async (req, res) => {
  try {
    console.log('API üzerinden manuel tetikleme istendi');
    
    res.status(202).json({
      message: 'Rapor üretimi başlatıldı',
      timestamp: new Date().toISOString()
    });
    
    // Raporu oluştur ve gönder (bekleme yok)
    generateAndSendWeeklyReport().catch(error => {
      console.error('Manuel rapor üretimi başarısız:', error);
    });
    
  } catch (error) {
    console.error('Manuel tetikleme hatası:', error);
    res.status(500).json({
      error: 'Rapor üretimi başlatılamadı',
      message: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
});

// Rapor dosyaları bilgileri
app.get('/reports/info', async (req, res) => {
  try {
    const info = await reportCleanup.getReportInfo();
    res.json({
      ...info,
      reportDir: config.reportDir,
      lastCleanup: 'Takip edilmiyor' // Geliştirilebilir
    });
  } catch (error) {
    res.status(500).json({
      error: 'Rapor bilgileri alınamadı',
      message: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
});

// Manuel temizlik işlemi
app.post('/reports/cleanup', async (req, res) => {
  try {
    console.log('API üzerinden manuel temizlik istendi');
    await reportCleanup.cleanupOldReports();
    
    res.json({
      message: 'Temizlik tamamlandı',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Manuel temizlik hatası:', error);
    res.status(500).json({
      error: 'Temizlik başarısız',
      message: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
});

// Test email gönderimi
app.post('/test-email', async (req, res) => {
  try {
    console.log('API üzerinden test email istendi');
    
    // Önce email bağlantısını kontrol et
    const connectionOK = await emailService.verifyConnection();
    if (!connectionOK) {
      return res.status(500).json({
        error: 'Email bağlantı doğrulaması başarısız',
        message: 'Gmail kimlik bilgilerini ve uygulama şifresini kontrol edin'
      });
    }
    
    await emailService.sendTestEmail(config.reportRecipient);
    
    return res.json({
      message: 'Test email başarıyla gönderildi',
      recipient: config.reportRecipient.replace(/(.{3}).*@/, '$1***@'),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test email hatası:', error);
    return res.status(500).json({
      error: 'Test email başarısız',
      message: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
});

// 404 hata yakalayıcı
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint bulunamadı',
    availableEndpoints: [
      'GET /health           - Sistem durumu',
      'POST /send-now        - Manuel rapor gönder',
      'GET /reports/info     - Rapor bilgileri',
      'POST /reports/cleanup - Manuel temizlik',
      'POST /test-email      - Test email gönder'
    ]
  });
});

// Genel hata yakalayıcı
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('İşlenmeyen hata:', error);
  res.status(500).json({
    error: 'Sunucu iç hatası',
    message: error.message || 'Bilinmeyen hata'
  });
});

// Cron işlerini programla
console.log(`Cron işi ayarlanıyor: ${config.cronExpression} (${config.cronTz})`);

// Haftalık rapor cron işi
const reportJob = cron.schedule(config.cronExpression, () => {
  console.log('Cron işi tetiklendi: Haftalık rapor üretimi');
  generateAndSendWeeklyReport().catch(error => {
    console.error('Zamanlanmış rapor üretimi başarısız:', error);
  });
}, {
  scheduled: false,
  timezone: config.cronTz
});

// Haftalık temizlik cron işi (her Pazar saat 02:00)
const cleanupJob = cron.schedule('0 2 * * 0', () => {
  console.log('Cron işi tetiklendi: Haftalık temizlik');
  reportCleanup.cleanupOldReports().catch(error => {
    console.error('Zamanlanmış temizlik başarısız:', error);
  });
}, {
  scheduled: false,
  timezone: config.cronTz
});

// Sunucuyu başlat
app.listen(config.port, () => {
  console.log(`🚀 TSE Otomatik Raporlama Sunucusu ${config.port} portunda başlatıldı`);
  console.log(`📧 Raporlar şu adrese gönderilecek: ${config.reportRecipient}`);
  console.log(`⏰ Cron zamanlaması: ${config.cronExpression} (${config.cronTz})`);
  console.log(`📁 Rapor klasörü: ${config.reportDir}`);
  console.log(`🔗 TSE Backend URL: ${config.tseBackendUrl}`);
  console.log('');
  console.log('Kullanılabilir endpoint\'ler:');
  console.log('  GET  /health           - Sistem durumu');
  console.log('  POST /send-now         - Manuel rapor tetikleme');
  console.log('  GET  /reports/info     - Rapor dosya bilgileri');
  console.log('  POST /reports/cleanup  - Manuel temizlik');
  console.log('  POST /test-email       - Test email gönder');
  console.log('');
  
  // Başlangıçta email bağlantısını doğrula
  emailService.verifyConnection().then(isOK => {
    if (isOK) {
      console.log('✅ Email bağlantısı doğrulandı');
    } else {
      console.log('❌ Email bağlantısı başarısız - Gmail kimlik bilgilerini kontrol edin');
    }
    
    // Sunucu hazır olduktan sonra cron işlerini başlat
    console.log('Cron işleri başlatılıyor...');
    reportJob.start();
    cleanupJob.start();
    console.log('✅ Cron işleri başlatıldı');
    
  }).catch(error => {
    console.error('Email doğrulama hatası:', error);
  });
});

// Nazikçe kapatma
process.on('SIGTERM', () => {
  console.log('SIGTERM alındı, nazikçe kapatılıyor...');
  reportJob.stop();
  cleanupJob.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT alındı, nazikçe kapatılıyor...');
  reportJob.stop();
  cleanupJob.stop();
  process.exit(0);
});
