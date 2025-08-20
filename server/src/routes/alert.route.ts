import express from 'express';
import { AlertService } from '../services/alert.service';
import { MachineRepository } from '../repos/machine.repo';
import db from '../database/connection';

const router = express.Router();
const machineRepo = new MachineRepository(db);
const alertService = new AlertService(machineRepo);

// Tüm kalibrasyon uyarılarını getir
router.get('/calibration', async (req, res) => {
  try {
    console.log('Getting calibration alerts...');
    
    const alerts = await alertService.getCalibrationAlerts();
    
    console.log(`Found ${alerts.alerts.length} alerts (${alerts.totalExpired} expired, ${alerts.totalExpiringSoon} expiring soon)`);
    
    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    console.error('Error getting calibration alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Kalibrasyon uyarıları alınırken hata oluştu'
    });
  }
});

// Sadece özet bilgi getir (daha hızlı)
router.get('/calibration/summary', async (req, res) => {
  try {
    console.log('Getting calibration alert summary...');
    
    const summary = await alertService.getAlertSummary();
    
    console.log(`Alert summary: ${summary.totalExpired} expired, ${summary.totalExpiringSoon} expiring soon`);
    
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error getting calibration alert summary:', error);
    res.status(500).json({
      success: false,
      message: 'Kalibrasyon uyarı özeti alınırken hata oluştu'
    });
  }
});

export default router;
