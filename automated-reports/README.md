# TSE Automation - Otomatik Haftalık Rapor Sistemi

Bu sistem, TSE Automation uygulamasının mevcut backend'ini kullanarak haftalık makine kalibrasyon raporlarını otomatik olarak oluşturup email ile gönderen minimal bir backend uygulamasıdır.

> **NOT**: Tüm kod dosyaları Türkçe yorumlarla açıklanmıştır. Anlamadığınız kısımlar için yorumları okuyabilirsiniz.

## Özellikler

- **Haftalık Otomatik Rapor**: Her Pazartesi 09:00'da otomatik rapor üretimi
- **Excel Raporu**: Makine kalibrasyon verilerini içeren detaylı Excel dosyası
- **Email Gönderimi**: Gmail App Password kullanarak güvenli email gönderimi
- **Retry Mekanizması**: Başarısız gönderimde 5dk ve 10dk sonra tekrar deneme
- **Otomatik Temizlik**: 30 günden eski raporları haftalık temizleme
- **Manuel Tetikleme**: Test amaçlı manuel rapor gönderimi
- **Health Check**: Sistem durumu kontrolü

## Kurulum

### 1. Bağımlılıkların Yüklenmesi

```bash
cd automated-reports
npm install
```

### 2. Çevre Değişkenlerinin Ayarlanması

```bash
# .env dosyasını oluşturun
cp env.example .env
```

`.env` dosyasını düzenleyin:

```env
# Server Configuration
PORT=3001

# Gmail Configuration for Email Reports
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-digit-app-password

# Report Recipient
REPORT_RECIPIENT=recipient@company.com

# Cron Configuration
CRON_EXPRESSION=0 9 * * 1
CRON_TZ=Europe/Istanbul

# Report Directory
REPORT_DIR=./reports

# Main TSE Backend URL
TSE_BACKEND_URL=http://localhost:3000
```

### 3. Gmail App Password Oluşturma

Gmail App Password oluşturmak için:

1. Google hesabınızda **2-Step Verification** aktif olmalı
2. Google Account Settings → Security → 2-Step Verification
3. **App passwords** bölümüne gidin
4. **Select app** → Other (Custom name) → "TSE Reports" yazın
5. **Generate** butonuna tıklayın
6. Oluşan 16 haneli şifreyi `GMAIL_APP_PASSWORD` olarak kullanın

**Not**: Bu şifre sadece bir kez gösterilir, kaydetmeyi unutmayın!

## Çalıştırma

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

### Health Check
```http
GET /health
```
Sistem durumunu kontrol eder.

### Manuel Rapor Gönderimi
```http
POST /send-now
```
Cron zamanını beklemeden manuel olarak rapor oluşturup gönderir.

Örnek:
```bash
curl -X POST http://localhost:3001/send-now
```

### Rapor Bilgileri
```http
GET /reports/info
```
Mevcut rapor dosyaları hakkında bilgi verir.

### Manuel Temizlik
```http
POST /reports/cleanup
```
30 günden eski rapor dosyalarını siler.

### Test Email
```http
POST /test-email
```
Email yapılandırmasını test etmek için test email gönderir.

## Test Adımları

### 1. Sistem Sağlık Kontrolü
```bash
curl http://localhost:3001/health
```
Yanıt: `200 OK` ile sistem bilgileri

### 2. Email Bağlantı Testi
```bash
curl -X POST http://localhost:3001/test-email
```
Test emaili gönderilmeli.

### 3. Manuel Rapor Testi
```bash
curl -X POST http://localhost:3001/send-now
```

Bu komut:
- TSE Backend'den makine verilerini çeker (`/api/machine-reports/data`)
- Excel raporu oluşturur (`./reports/report_YYYY-MM-DD_weekNN.xlsx`)
- Email eki olarak gönderir

### 4. Dosya Kontrolü
```bash
ls -la reports/
```
Oluşturulan Excel dosyalarını görmelisiniz.

## Rapor İçeriği

Excel raporu şu bilgileri içerir:

- **Makine Bilgileri**: Ad, marka, model, seri no
- **Kalibrasyon Durumu**: Son kalibrasyon tarihi, sonraki kalibrasyon tarihi
- **Durum Kodlaması**: 
  - 🟩 Yeşil: Normal (30+ gün kaldı)
  - 🟨 Sarı: Yaklaşıyor (0-30 gün kaldı)  
  - 🟥 Kırmızı: Geçmiş (süresi dolmuş)
- **İletişim Bilgileri**: Kalibrasyon kuruluşu, telefon, email

## Email Özellikleri

### Konu
```
Haftalık Rapor — 26.08.2024 - 01.09.2024
```

### İçerik
- Tarih aralığı ve oluşturulma zamanı
- Dosya bilgileri (ad, boyut)
- Rapor içeriği özeti
- Türkçe HTML formatında

### Retry Mantığı
- **1. Deneme**: Hemen gönderim
- **2. Deneme**: 5 dakika sonra (başarısızsa)
- **3. Deneme**: 10 dakika sonra (başarısızsa)

Her deneme loglanır ve hata durumunda detaylı hata mesajı verilir.

## Cron Zamanlaması

- **Haftalık Rapor**: Pazartesi 09:00 (Europe/Istanbul)
- **Temizlik**: Pazar 02:00 (Europe/Istanbul)

Cron ifadesi özelleştirilebilir:
```env
# Her gün saat 10:00
CRON_EXPRESSION=0 10 * * *

# Pazartesi ve Cuma 09:30
CRON_EXPRESSION=30 9 * * 1,5
```

## Dosya Yapısı

```
automated-reports/
├── src/
│   ├── server.ts      # Ana Express server + cron jobs (Türkçe yorumlu)
│   ├── report.ts      # Rapor üretimi ve Excel oluşturma (Türkçe yorumlu)
│   ├── mailer.ts      # Email gönderimi ve retry mantığı (Türkçe yorumlu)
│   └── cleanup.ts     # Eski dosya temizleme (Türkçe yorumlu)
├── reports/           # Oluşturulan Excel dosyaları
├── package.json       # Bağımlılıklar ve scriptler
├── tsconfig.json      # TypeScript yapılandırması
├── env.example        # Örnek çevre değişkenleri
└── README.md          # Bu dosya
```

### Kod Açıklamaları

- **server.ts**: Ana sunucu dosyası, tüm endpoint'ler ve cron işleri burada tanımlı
- **report.ts**: Excel raporu oluşturma, TSE backend'den veri çekme işlemleri
- **mailer.ts**: Gmail ile email gönderme, retry mekanizması
- **cleanup.ts**: Eski rapor dosyalarını temizleme işlemleri

## Dosya Adlandırma

Rapor dosyaları şu formatta adlandırılır:
```
report_2024-08-26_week35.xlsx
```

- `YYYY-MM-DD`: Rapor oluşturulma tarihi
- `weekNN`: ISO hafta numarası

## Güvenlik Notları

- Gmail App Password kullanılır (2FA gerekli)
- Email şifreleri çevre değişkenlerinde saklanır
- Admin arayüzü yoktur (minimal tasarım)
- HTTPS kullanımı önerilir (production için)

## Sorun Giderme

### "TSE Backend is not accessible" Hatası
- Ana TSE backend'in çalıştığından emin olun (`http://localhost:3000`)
- `TSE_BACKEND_URL` değişkenini kontrol edin

### "Email connection verification failed" Hatası
- Gmail App Password'ün doğru olduğundan emin olun
- 2-Step Verification'ın aktif olduğunu kontrol edin
- GMAIL_USER ve GMAIL_APP_PASSWORD değişkenlerini kontrol edin

### "No machine data found" Uyarısı
- TSE Backend'de makine verisi olduğundan emin olun
- `/api/machine-reports/data` endpoint'inin çalıştığını test edin

## Loglama

Tüm önemli işlemler console'a loglanır:
- Rapor üretimi adımları
- Email gönderim denemeleri
- Cron job tetiklemeleri
- Hata mesajları

Production ortamında logları dosyaya yönlendirme önerilir:
```bash
npm start > logs/app.log 2>&1
```

## Lisans

ISC License - TSE Automation Team
