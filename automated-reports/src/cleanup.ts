import * as fs from 'fs';
import * as path from 'path';

// Rapor temizlik sınıfı
export class ReportCleanup {
  private reportDir: string;   // Raporlar klasörü
  private maxAgedays: number;  // Maksimum yaş (gün)

  constructor(reportDir: string, maxAgeDays: number = 30) {
    this.reportDir = reportDir;
    this.maxAgedays = maxAgeDays;
  }

  /**
   * Eski rapor dosyalarını temizle (maxAgeDays'den eski)
   */
  async cleanupOldReports(): Promise<void> {
    try {
      console.log(`${this.maxAgedays} günden eski raporları temizleme başlıyor...`);
      
      if (!fs.existsSync(this.reportDir)) {
        console.log(`Reports directory does not exist: ${this.reportDir}`);
        return;
      }

      const files = fs.readdirSync(this.reportDir);
      const excelFiles = files.filter(file => 
        file.toLowerCase().endsWith('.xlsx') && 
        file.startsWith('report_')
      );

      if (excelFiles.length === 0) {
        console.log('No report files found to clean up');
        return;
      }

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.maxAgedays);
      
      let deletedCount = 0;
      let totalSize = 0;

      for (const file of excelFiles) {
        const filePath = path.join(this.reportDir, file);
        
        try {
          const stats = fs.statSync(filePath);
          
          if (stats.mtime < cutoffDate) {
            const fileSizeKB = Math.round(stats.size / 1024);
            totalSize += fileSizeKB;
            
            fs.unlinkSync(filePath);
            deletedCount++;
            
            console.log(`Deleted old report: ${file} (${fileSizeKB} KB, modified: ${stats.mtime.toLocaleDateString('tr-TR')})`);
          }
        } catch (error) {
          console.error(`Error processing file ${file}:`, error);
        }
      }

      if (deletedCount > 0) {
        console.log(`Cleanup completed: ${deletedCount} files deleted, ${totalSize} KB freed`);
      } else {
        console.log('No old files found to delete');
      }

      // Log remaining files
      const remainingFiles = fs.readdirSync(this.reportDir)
        .filter(file => file.toLowerCase().endsWith('.xlsx') && file.startsWith('report_'));
      
      console.log(`Remaining report files: ${remainingFiles.length}`);
      
    } catch (error) {
      console.error('Error during cleanup:', error);
      throw error;
    }
  }

  /**
   * Get information about current report files
   */
  async getReportInfo(): Promise<{
    totalFiles: number;
    totalSizeKB: number;
    oldestFile?: string;
    newestFile?: string;
  }> {
    try {
      if (!fs.existsSync(this.reportDir)) {
        return {
          totalFiles: 0,
          totalSizeKB: 0
        };
      }

      const files = fs.readdirSync(this.reportDir);
      const excelFiles = files.filter(file => 
        file.toLowerCase().endsWith('.xlsx') && 
        file.startsWith('report_')
      );

      if (excelFiles.length === 0) {
        return {
          totalFiles: 0,
          totalSizeKB: 0
        };
      }

      let totalSize = 0;
      let oldestDate = new Date();
      let newestDate = new Date(0);
      let oldestFile = '';
      let newestFile = '';

      for (const file of excelFiles) {
        const filePath = path.join(this.reportDir, file);
        const stats = fs.statSync(filePath);
        
        totalSize += stats.size;
        
        if (stats.mtime < oldestDate) {
          oldestDate = stats.mtime;
          oldestFile = file;
        }
        
        if (stats.mtime > newestDate) {
          newestDate = stats.mtime;
          newestFile = file;
        }
      }

      return {
        totalFiles: excelFiles.length,
        totalSizeKB: Math.round(totalSize / 1024),
        oldestFile: oldestFile,
        newestFile: newestFile
      };
      
    } catch (error) {
      console.error('Error getting report info:', error);
      throw error;
    }
  }

  /**
   * Force cleanup all reports (for testing)
   */
  async cleanupAllReports(): Promise<void> {
    try {
      console.log('Force cleanup: deleting ALL report files...');
      
      if (!fs.existsSync(this.reportDir)) {
        console.log(`Reports directory does not exist: ${this.reportDir}`);
        return;
      }

      const files = fs.readdirSync(this.reportDir);
      const excelFiles = files.filter(file => 
        file.toLowerCase().endsWith('.xlsx') && 
        file.startsWith('report_')
      );

      let deletedCount = 0;
      
      for (const file of excelFiles) {
        const filePath = path.join(this.reportDir, file);
        
        try {
          fs.unlinkSync(filePath);
          deletedCount++;
          console.log(`Deleted: ${file}`);
        } catch (error) {
          console.error(`Error deleting file ${file}:`, error);
        }
      }

      console.log(`Force cleanup completed: ${deletedCount} files deleted`);
      
    } catch (error) {
      console.error('Error during force cleanup:', error);
      throw error;
    }
  }
}
