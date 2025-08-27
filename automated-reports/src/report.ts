import axios from 'axios';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';

// Makine verisi için tip tanımı
interface MachineData {
  id: number;                        // Makine ID
  serial_no: string;                 // Seri numarası
  equipment_name: string;            // Makine adı
  brand: string;                     // Marka
  model: string;                     // Model
  measurement_range: string;         // Ölçüm aralığı
  last_calibration_date: string;     // Son kalibrasyon tarihi
  calibration_org_name: string;      // Kalibrasyon kuruluşu adı
  calibration_contact_name?: string; // İletişim kişisi (opsiyonel)
  calibration_email?: string;        // Email (opsiyonel)
  calibration_phone?: string;        // Telefon (opsiyonel)
}

// Deney verisi için tip tanımı
interface DeneyData {
  id: number;
  companies?: { name: string };
  application_no: string;
  application_date: string;
  certification_type: string;
  test_count: number;
  created_at: string;
  tests?: DeneyTest[];
}

interface DeneyTest {
  id: number;
  experiment_type_name?: string;
  personnel_first_name?: string;
  personnel_last_name?: string;
  is_accredited: boolean;
  uygunluk: boolean;
  unit_price?: number;
  sample_count?: number;
  total_price?: number;
}

export class ReportGenerator {
  private backendUrl: string;  // TSE Backend URL'si
  private reportDir: string;   // Raporların kaydedileceği klasör

  constructor(backendUrl: string, reportDir: string) {
    this.backendUrl = backendUrl;
    this.reportDir = reportDir;
    
    // Raporlar klasörünün var olduğundan emin ol
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
  }

  /**
   * Calculate next calibration date and status
   */
  private getCalibrationStatus(lastCalibrationDate: string) {
    if (!lastCalibrationDate) {
      return {
        nextDate: new Date().toISOString().split('T')[0],
        status: 'normal',
        statusText: 'Tarih belirtilmemiş'
      };
    }

    const lastDate = new Date(lastCalibrationDate);
    if (isNaN(lastDate.getTime())) {
      return {
        nextDate: new Date().toISOString().split('T')[0],
        status: 'normal',
        statusText: 'Geçersiz tarih'
      };
    }

    const nextDate = new Date(lastDate);
    nextDate.setFullYear(lastDate.getFullYear() + 1); // +1 year
    
    const today = new Date();
    const diffTime = nextDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let status = 'normal';
    let statusText = 'Normal';
    
    if (diffDays < 0) {
      status = 'expired';
      statusText = `${Math.abs(diffDays)} gün geçti`;
    } else if (diffDays <= 30) {
      status = 'expiring';
      statusText = `${diffDays} gün kaldı`;
    } else {
      status = 'normal';
      statusText = `${diffDays} gün kaldı`;
    }
    
    return {
      nextDate: nextDate.toISOString().split('T')[0],
      status,
      statusText
    };
  }

  /**
   * Fetch machine data from the existing backend endpoint
   */
  async fetchMachineData(): Promise<MachineData[]> {
    try {
      console.log(`Fetching machine data from: ${this.backendUrl}/api/machine-reports/data`);
      const response = await axios.get(`${this.backendUrl}/api/machine-reports/data`, {
        timeout: 30000 // 30 second timeout
      });
      
      if (response.status === 200 && Array.isArray(response.data)) {
        console.log(`Successfully fetched ${response.data.length} machine records`);
        return response.data;
      } else {
        throw new Error(`Unexpected response format: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching machine data:', error);
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('TSE Backend is not accessible. Please ensure the main server is running on the configured URL.');
        }
        throw new Error(`HTTP Error: ${error.response?.status} - ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Fetch deney data from the backend endpoint (last 7 days only)
   */
  async fetchDeneyData(): Promise<DeneyData[]> {
    try {
      console.log(`Fetching deney data from: ${this.backendUrl}/api/applications/all`);
      const response = await axios.get(`${this.backendUrl}/api/applications/all`, {
        timeout: 30000 // 30 second timeout
      });
      
      if (response.status === 200 && Array.isArray(response.data)) {
        console.log(`Successfully fetched ${response.data.length} total deney records`);
        
        // Filter for last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const filteredData = response.data.filter((app: DeneyData) => {
          const appDate = new Date(app.application_date);
          return appDate >= sevenDaysAgo;
        });
        
        console.log(`Filtered to ${filteredData.length} deney records from last 7 days`);
        return filteredData;
      } else {
        throw new Error(`Unexpected response format: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching deney data:', error);
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('TSE Backend is not accessible. Please ensure the main server is running on the configured URL.');
        }
        throw new Error(`HTTP Error: ${error.response?.status} - ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Generate Excel report from machine data
   */
  async generateExcelReport(machineData: MachineData[]): Promise<string> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Haftalık Makine Raporu');

    // Define headers
    const headers = [
      'No',
      'Makine Adı',
      'Marka', 
      'Model',
      'Seri No',
      'Ölçüm Aralığı',
      'Son Kalibrasyon',
      'Sonraki Kalibrasyon',
      'Kalibrasyon Durumu',
      'Kalibrasyon Kuruluşu',
      'İletişim Kişisi',
      'Telefon',
      'E-posta'
    ];

    // Add header row
    worksheet.addRow(headers);

    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'DC2626' } // Red theme
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Add data rows
    machineData.forEach((machine, index) => {
      const calibrationStatus = this.getCalibrationStatus(machine.last_calibration_date);
      
      const rowData = [
        index + 1,
        machine.equipment_name,
        machine.brand || '-',
        machine.model || '-',
        machine.serial_no,
        machine.measurement_range || '-',
        new Date(machine.last_calibration_date).toLocaleDateString('tr-TR'),
        new Date(calibrationStatus.nextDate).toLocaleDateString('tr-TR'),
        calibrationStatus.statusText,
        machine.calibration_org_name || '-',
        machine.calibration_contact_name || '-',
        machine.calibration_phone || '-',
        machine.calibration_email || '-'
      ];
      
      const row = worksheet.addRow(rowData);
      
      // Style data rows
      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        
        // Alignment
        if (colNumber === 1 || colNumber === 7 || colNumber === 8 || colNumber === 9) {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        }
        
        // Status color coding
        if (colNumber === 9) { // Calibration status column
          let bgColor = 'DCFCE7'; // Green (normal)
          if (calibrationStatus.status === 'expiring') {
            bgColor = 'FEF3C7'; // Yellow
          } else if (calibrationStatus.status === 'expired') {
            bgColor = 'FEE2E2'; // Red
          }
          
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: bgColor }
          };
        }
      });
    });

    // Set column widths
    const columnWidths = [8, 30, 15, 15, 15, 20, 15, 15, 20, 25, 20, 15, 25];
    columnWidths.forEach((width, index) => {
      worksheet.getColumn(index + 1).width = width;
    });

    // Generate filename with current date and ISO week
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    
    // Calculate ISO week number
    const firstDayOfYear = new Date(year, 0, 1);
    const pastDaysOfYear = (today.getTime() - firstDayOfYear.getTime()) / 86400000;
    const week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    
    const filename = `report_${year}-${month}-${day}_week${week}.xlsx`;
    const filepath = path.join(this.reportDir, filename);
    
    // Write file
    await workbook.xlsx.writeFile(filepath);
    console.log(`Excel report generated: ${filepath}`);
    
    return filepath;
  }

  /**
   * Generate Excel report for deney data
   */
  async generateDeneyExcelReport(deneyData: DeneyData[]): Promise<string> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Son 7 Günlük Deney Raporu');

    // Define headers
    const headers = [
      'No',
      'Firma Adı', 
      'Başvuru No',
      'Başvuru Tarihi',
      'Deney Türü',
      'Deney Adı',
      'Deney Personeli',
      'Numune Sayısı',
      'Akredite',
      'Toplam Ücret (TL)'
    ];

    // Add header row
    worksheet.addRow(headers);

    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'DC2626' } // Red theme
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Add data rows
    let rowIndex = 1;
    deneyData.forEach((kayit, kayitIndex) => {
      kayit.tests?.forEach((deney, deneyIndex) => {
        rowIndex++;
        const rowData = [
          `${kayitIndex + 1}.${deneyIndex + 1}`,
          kayit.companies?.name || '',
          kayit.application_no,
          new Date(kayit.application_date).toLocaleDateString('tr-TR'),
          kayit.certification_type === 'belgelendirme' ? 'BELGELENDIRME' : 'ÖZEL',
          deney.experiment_type_name || '',
          deney.personnel_first_name && deney.personnel_last_name ? 
            `${deney.personnel_first_name} ${deney.personnel_last_name}` : '',
          deney.sample_count || 1,
          deney.is_accredited ? 'EVET' : 'HAYIR',
          deney.total_price ? `₺${Number(deney.total_price).toFixed(2)}` : '-'
        ];
        
        const row = worksheet.addRow(rowData);
        
        // Style data rows
        row.eachCell((cell, colNumber) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
          
          // Alignment
          if (colNumber === 1 || colNumber === 8 || colNumber === 9 || colNumber === 10) {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
          }
          
          // Status color coding
          if (colNumber === 9) { // Akredite kolonu
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: deney.is_accredited ? 'DCFCE7' : 'FEE2E2' } // Yeşil/Kırmızı
            };
          }
        });
      });
    });

    // Set column widths
    const columnWidths = [8, 25, 15, 12, 18, 30, 20, 8, 10, 12];
    columnWidths.forEach((width, index) => {
      worksheet.getColumn(index + 1).width = width;
    });

    // Generate filename with current date and ISO week
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    
    // Calculate ISO week number
    const firstDayOfYear = new Date(year, 0, 1);
    const pastDaysOfYear = (today.getTime() - firstDayOfYear.getTime()) / 86400000;
    const week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    
    const filename = `deney_report_son7gun_${year}-${month}-${day}_week${week}.xlsx`;
    const filepath = path.join(this.reportDir, filename);
    
    // Write file
    await workbook.xlsx.writeFile(filepath);
    console.log(`Deney Excel report generated: ${filepath}`);
    
    return filepath;
  }

  /**
   * Get week date range for email subject
   */
  getWeekDateRange(): string {
    const today = new Date();
    const currentDay = today.getDay();
    
    // Calculate Monday of current week
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1));
    
    // Calculate Sunday of current week
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    const formatDate = (date: Date) => date.toLocaleDateString('tr-TR');
    
    return `${formatDate(monday)} - ${formatDate(sunday)}`;
  }

  /**
   * Main function to generate and save weekly report
   */
  async generateWeeklyReport(): Promise<string[]> {
    console.log('Starting weekly report generation...');
    
    try {
      const reportPaths: string[] = [];
      
      // Fetch machine data
      console.log('Fetching machine data...');
      const machineData = await this.fetchMachineData();
      
      if (machineData.length === 0) {
        console.warn('No machine data found, generating empty report');
      }
      
      // Generate machine Excel report
      console.log('Generating machine calibration report...');
      const machineReportPath = await this.generateExcelReport(machineData);
      reportPaths.push(machineReportPath);
      
      // Fetch deney data
      console.log('Fetching deney data...');
      const deneyData = await this.fetchDeneyData();
      
      if (deneyData.length === 0) {
        console.warn('No deney data found, generating empty report');
      }
      
      // Generate deney Excel report
      console.log('Generating deney report...');
      const deneyReportPath = await this.generateDeneyExcelReport(deneyData);
      reportPaths.push(deneyReportPath);
      
      console.log(`Weekly reports generated successfully: ${reportPaths.join(', ')}`);
      return reportPaths;
      
    } catch (error) {
      console.error('Error generating weekly report:', error);
      throw error;
    }
  }
}
