import nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

// Email yapılandırması için arayüz
export interface EmailConfig {
  gmailUser: string;         // Gmail kullanıcı adı
  gmailAppPassword: string;  // Gmail uygulama şifresi
}

export class EmailService {
  private transporter: nodemailer.Transporter;  // Email gönderici
  private gmailUser: string;                     // Gmail kullanıcı adı

  constructor(config: EmailConfig) {
    this.gmailUser = config.gmailUser;
    
    // Nodemailer transporter oluştur
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.gmailUser,
        pass: config.gmailAppPassword
      }
    });
  }

  /**
   * Verify email connection
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email connection verified successfully');
      return true;
    } catch (error) {
      console.error('Email connection verification failed:', error);
      return false;
    }
  }

  /**
   * Sleep function for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Send email with multiple attachments and retry logic
   */
  async sendMultipleReports(
    recipient: string, 
    filepaths: string[], 
    subject: string,
    maxRetries: number = 2
  ): Promise<boolean> {
    
    // Verify all files exist
    for (const filepath of filepaths) {
      if (!fs.existsSync(filepath)) {
        throw new Error(`Report file not found: ${filepath}`);
      }
    }

    const attachments = filepaths.map(filepath => {
      const filename = path.basename(filepath);
      const stats = fs.statSync(filepath);
      const fileSizeKB = Math.round(stats.size / 1024);
      return { filename, filepath, fileSizeKB };
    });

    const totalSizeKB = attachments.reduce((sum, att) => sum + att.fileSizeKB, 0);

    // Email content
    const currentDate = new Date().toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #DC2626;">TSE Automation - Haftalık Raporlar</h2>
        
        <p>Merhaba,</p>
        
        <p>TSE Automation sistemi haftalık raporları ektedir.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <strong>Rapor Detayları:</strong><br/>
          📅 Tarih: <strong>${currentDate}</strong><br/>
          📄 Dosya Sayısı: ${attachments.length}<br/>
          📊 Toplam Boyut: ${totalSizeKB} KB<br/>
          🕐 Oluşturulma Zamanı: ${currentDate}
        </div>
        
        <p>Bu raporlar aşağıdaki bilgileri içerir:</p>
        <ul>
          <li><strong>Makine Kalibrasyon Raporu:</strong> Tüm makine kalibrasyon durumları, süresinin yaklaştığı veya geçen kalibrasyonlar, kalibrasyon kuruluşu iletişim bilgileri</li>
          <li><strong>Deney Raporu:</strong> <strong>Son 7 günlük</strong> deney kayıtları, firma bilgileri, deney türleri, personel bilgileri ve ücret detayları</li>
        </ul>
        
        <p>Herhangi bir sorunuz varsa lütfen sistem yöneticinize başvurun.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e9ecef;"/>
        <p style="color: #6c757d; font-size: 12px;">
          Bu e-posta TSE Automation sistemi tarafından otomatik olarak gönderilmiştir.<br/>
          TSE Automation - Kalibrasyon ve Deney Yönetim Sistemi
        </p>
      </div>
    `;

    const mailOptions = {
      from: this.gmailUser,
      to: recipient,
      subject: subject,
      html: htmlContent,
      attachments: attachments.map(att => ({
        filename: att.filename,
        path: att.filepath
      }))
    };

    // Retry logic
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        console.log(`Sending email with ${attachments.length} attachments, attempt ${attempt}/${maxRetries + 1} to ${recipient}`);
        
        const info = await this.transporter.sendMail(mailOptions);
        console.log(`Email sent successfully on attempt ${attempt}:`, info.messageId);
        console.log(`Email delivered to: ${recipient}`);
        console.log(`Attachments: ${attachments.map(att => `${att.filename} (${att.fileSizeKB} KB)`).join(', ')}`);
        
        return true;
        
      } catch (error) {
        lastError = error as Error;
        console.error(`Email send attempt ${attempt} failed:`, error);
        
        if (attempt <= maxRetries) {
          // Calculate delay: 5 minutes for first retry, 10 minutes for second
          const delayMinutes = attempt === 1 ? 5 : 10;
          const delayMs = delayMinutes * 60 * 1000;
          
          console.log(`Retrying in ${delayMinutes} minutes...`);
          await this.sleep(delayMs);
        }
      }
    }
    
    // All attempts failed
    console.error(`Failed to send email after ${maxRetries + 1} attempts. Last error:`, lastError);
    throw lastError || new Error('Unknown email sending error');
  }

  /**
   * Send email with single attachment and retry logic (for backward compatibility)
   */
  async sendReport(
    recipient: string, 
    filepath: string, 
    subject: string,
    maxRetries: number = 2
  ): Promise<boolean> {
    
    // Verify file exists
    if (!fs.existsSync(filepath)) {
      throw new Error(`Report file not found: ${filepath}`);
    }

    const filename = path.basename(filepath);
    const stats = fs.statSync(filepath);
    const fileSizeKB = Math.round(stats.size / 1024);

    // Email content
    const dateRange = this.extractDateRangeFromFilename(filename);
    const currentDate = new Date().toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #DC2626;">TSE Automation - Haftalık Makine Raporu</h2>
        
        <p>Merhaba,</p>
        
        <p>TSE Automation sistemi haftalık makine kalibrasyonu raporu ektedir.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <strong>Rapor Detayları:</strong><br/>
          📅 Tarih Aralığı: <strong>${dateRange}</strong><br/>
          📄 Dosya Adı: ${filename}<br/>
          📊 Dosya Boyutu: ${fileSizeKB} KB<br/>
          🕐 Oluşturulma Zamanı: ${currentDate}
        </div>
        
        <p>Bu rapor aşağıdaki bilgileri içerir:</p>
        <ul>
          <li>Tüm makine kalibrasyon durumları</li>
          <li>Süresinin yaklaştığı veya geçen kalibrasyonlar</li>
          <li>Kalibrasyon kuruluşu iletişim bilgileri</li>
          <li>Makine teknik özellikleri</li>
        </ul>
        
        <p>Herhangi bir sorunuz varsa lütfen sistem yöneticinize başvurun.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e9ecef;"/>
        <p style="color: #6c757d; font-size: 12px;">
          Bu e-posta TSE Automation sistemi tarafından otomatik olarak gönderilmiştir.<br/>
          TSE Automation - Kalibrasyon Yönetim Sistemi
        </p>
      </div>
    `;

    const mailOptions = {
      from: this.gmailUser,
      to: recipient,
      subject: subject,
      html: htmlContent,
      attachments: [{
        filename: filename,
        path: filepath
      }]
    };

    // Retry logic
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        console.log(`Sending email attempt ${attempt}/${maxRetries + 1} to ${recipient}`);
        
        const info = await this.transporter.sendMail(mailOptions);
        console.log(`Email sent successfully on attempt ${attempt}:`, info.messageId);
        console.log(`Email delivered to: ${recipient}`);
        console.log(`Attachment: ${filename} (${fileSizeKB} KB)`);
        
        return true;
        
      } catch (error) {
        lastError = error as Error;
        console.error(`Email send attempt ${attempt} failed:`, error);
        
        if (attempt <= maxRetries) {
          // Calculate delay: 5 minutes for first retry, 10 minutes for second
          const delayMinutes = attempt === 1 ? 5 : 10;
          const delayMs = delayMinutes * 60 * 1000;
          
          console.log(`Retrying in ${delayMinutes} minutes...`);
          await this.sleep(delayMs);
        }
      }
    }
    
    // All attempts failed
    console.error(`Failed to send email after ${maxRetries + 1} attempts. Last error:`, lastError);
    throw lastError || new Error('Unknown email sending error');
  }

  /**
   * Extract date range from filename for email content
   */
  private extractDateRangeFromFilename(filename: string): string {
    // Extract date from filename like "report_2024-08-26_week35.xlsx"
    const match = filename.match(/report_(\d{4}-\d{2}-\d{2})_week(\d+)/);
    
    if (match) {
      const [, dateStr, weekNumber] = match;
      const date = new Date(dateStr);
      const formattedDate = date.toLocaleDateString('tr-TR');
      return `${formattedDate} (Hafta ${weekNumber})`;
    }
    
    // Fallback
    const today = new Date();
    const monday = new Date(today);
    const currentDay = today.getDay();
    monday.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1));
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    return `${monday.toLocaleDateString('tr-TR')} - ${sunday.toLocaleDateString('tr-TR')}`;
  }

  /**
   * Send test email (for manual testing)
   */
  async sendTestEmail(recipient: string): Promise<boolean> {
    const mailOptions = {
      from: this.gmailUser,
      to: recipient,
      subject: 'TSE Automation - Test Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #DC2626;">TSE Automation - Test Email</h2>
          <p>Bu email sisteminizin düzgün çalıştığını test etmek için gönderilmiştir.</p>
          <p>📧 Gönderim zamanı: ${new Date().toLocaleString('tr-TR')}</p>
          <p>✅ Email yapılandırması başarılı!</p>
        </div>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Test email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('Test email failed:', error);
      throw error;
    }
  }
}
