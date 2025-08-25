import { Router, Request, Response } from 'express';
import { MachineCalibrationService } from '../services/machineCalibration.service';
import { MachineCalibrationRepository } from '../repos/machineCalibration.repo';
import db from '../database/connection';

const router = Router();
const machineCalibrationRepo = new MachineCalibrationRepository(db);
const machineCalibrationService = new MachineCalibrationService(machineCalibrationRepo);

// GET /api/machine-calibrations - Tüm kalibrasyon kayıtlarını getir
router.get('/', async (req: Request, res: Response) => {
  try {
    const calibrations = await machineCalibrationService.getAllCalibrations();
    res.json({
      success: true,
      data: calibrations,
      count: calibrations.length
    });
  } catch (error) {
    console.error('GET /api/machine-calibrations error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Kalibrasyon kayıtları getirilemedi'
    });
  }
});

// GET /api/machine-calibrations/machine/:machineId - Belirli makineye ait kalibrasyonlar
router.get('/machine/:machineId', async (req: Request, res: Response) => {
  try {
    const machineId = parseInt(req.params.machineId);
    if (isNaN(machineId)) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir makine ID giriniz'
      });
    }

    const calibrations = await machineCalibrationService.getCalibrationsByMachine(machineId);
    res.json({
      success: true,
      data: calibrations,
      count: calibrations.length,
      machineId
    });
  } catch (error) {
    console.error('GET /api/machine-calibrations/machine/:machineId error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Makine kalibrasyonları getirilemedi'
    });
  }
});

// GET /api/machine-calibrations/org/:orgId - Belirli kuruluşa ait kalibrasyonlar
router.get('/org/:orgId', async (req: Request, res: Response) => {
  try {
    const orgId = parseInt(req.params.orgId);
    if (isNaN(orgId)) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir kuruluş ID giriniz'
      });
    }

    const calibrations = await machineCalibrationService.getCalibrationsByOrg(orgId);
    res.json({
      success: true,
      data: calibrations,
      count: calibrations.length,
      orgId
    });
  } catch (error) {
    console.error('GET /api/machine-calibrations/org/:orgId error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Kuruluş kalibrasyonları getirilemedi'
    });
  }
});

// GET /api/machine-calibrations/date-range - Tarih aralığına göre kalibrasyonlar
router.get('/date-range', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Başlangıç ve bitiş tarihleri gereklidir'
      });
    }

    const calibrations = await machineCalibrationService.getCalibrationsByDateRange(
      startDate as string, 
      endDate as string
    );
    
    res.json({
      success: true,
      data: calibrations,
      count: calibrations.length,
      dateRange: { startDate, endDate }
    });
  } catch (error) {
    console.error('GET /api/machine-calibrations/date-range error:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Tarih aralığı kalibrasyonları getirilemedi'
    });
  }
});

// GET /api/machine-calibrations/stats - Kalibrasyon istatistikleri
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await machineCalibrationService.getCalibrationStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('GET /api/machine-calibrations/stats error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Kalibrasyon istatistikleri getirilemedi'
    });
  }
});

// GET /api/machine-calibrations/machine/:machineId/last - Makinenin son kalibrasyonu
router.get('/machine/:machineId/last', async (req: Request, res: Response) => {
  try {
    const machineId = parseInt(req.params.machineId);
    if (isNaN(machineId)) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir makine ID giriniz'
      });
    }

    const lastCalibration = await machineCalibrationService.getLastCalibrationByMachine(machineId);
    res.json({
      success: true,
      data: lastCalibration,
      machineId
    });
  } catch (error) {
    console.error('GET /api/machine-calibrations/machine/:machineId/last error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Son kalibrasyon kaydı getirilemedi'
    });
  }
});

// GET /api/machine-calibrations/history - Kalibrasyon geçmişi raporu
router.get('/history', async (req: Request, res: Response) => {
  try {
    const machineId = req.query.machineId ? parseInt(req.query.machineId as string) : undefined;
    const orgId = req.query.orgId ? parseInt(req.query.orgId as string) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;

    const history = await machineCalibrationService.getCalibrationHistory(machineId, orgId, limit);
    res.json({
      success: true,
      data: history,
      count: history.length,
      filters: { machineId, orgId, limit }
    });
  } catch (error) {
    console.error('GET /api/machine-calibrations/history error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Kalibrasyon geçmişi getirilemedi'
    });
  }
});

// GET /api/machine-calibrations/:id - Belirli bir kalibrasyon kaydını getir
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir ID giriniz'
      });
    }

    const calibration = await machineCalibrationService.getCalibrationById(id);
    res.json({
      success: true,
      data: calibration
    });
  } catch (error) {
    console.error('GET /api/machine-calibrations/:id error:', error);
    const statusCode = error instanceof Error && error.message.includes('bulunamadı') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : 'Kalibrasyon kaydı getirilemedi'
    });
  }
});

// POST /api/machine-calibrations - Yeni kalibrasyon kaydı oluştur
router.post('/', async (req: Request, res: Response) => {
  try {
    const calibrationData = req.body;
    const newCalibration = await machineCalibrationService.createCalibration(calibrationData);
    res.status(201).json({
      success: true,
      message: 'Kalibrasyon kaydı başarıyla oluşturuldu',
      data: newCalibration
    });
  } catch (error) {
    console.error('POST /api/machine-calibrations error:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Kalibrasyon kaydı oluşturulamadı'
    });
  }
});

// POST /api/machine-calibrations/calibrate/:machineId - Makine kalibre et
router.post('/calibrate/:machineId', async (req: Request, res: Response) => {
  try {
    const machineId = parseInt(req.params.machineId);
    if (isNaN(machineId)) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir makine ID giriniz'
      });
    }

    const { calibration_org_id, calibrated_by, calibration_date, notes } = req.body;
    
    if (!calibration_org_id || !calibration_date) {
      return res.status(400).json({
        success: false,
        message: 'Kalibrasyon kuruluşu ve tarihi gereklidir'
      });
    }

    if (!calibrated_by || calibrated_by.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Kalibre eden kişi gereklidir'
      });
    }

    const calibrationData = {
      calibration_org_id,
      calibrated_by,
      calibration_date,
      notes
    };

    const newCalibration = await machineCalibrationService.calibrateMachine(machineId, calibrationData);
    res.status(201).json({
      success: true,
      message: 'Makine başarıyla kalibre edildi',
      data: newCalibration
    });
  } catch (error) {
    console.error('POST /api/machine-calibrations/calibrate/:machineId error:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Makine kalibre edilemedi'
    });
  }
});

// PUT /api/machine-calibrations/:id - Kalibrasyon kaydını güncelle
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir ID giriniz'
      });
    }

    const calibrationData = req.body;
    const updatedCalibration = await machineCalibrationService.updateCalibration(id, calibrationData);
    res.json({
      success: true,
      message: 'Kalibrasyon kaydı başarıyla güncellendi',
      data: updatedCalibration
    });
  } catch (error) {
    console.error('PUT /api/machine-calibrations/:id error:', error);
    const statusCode = error instanceof Error && error.message.includes('bulunamadı') ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : 'Kalibrasyon kaydı güncellenemedi'
    });
  }
});

// DELETE /api/machine-calibrations/:id - Kalibrasyon kaydını sil
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir ID giriniz'
      });
    }

    await machineCalibrationService.deleteCalibration(id);
    res.json({
      success: true,
      message: 'Kalibrasyon kaydı başarıyla silindi'
    });
  } catch (error) {
    console.error('DELETE /api/machine-calibrations/:id error:', error);
    const statusCode = error instanceof Error && error.message.includes('bulunamadı') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : 'Kalibrasyon kaydı silinemedi'
    });
  }
});

export default router;
