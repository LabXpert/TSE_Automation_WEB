import { Router, Request, Response } from 'express';
import { MachineService } from '../services/machine.service';
import { MachineRepository } from '../repos/machine.repo';
import db from '../database/connection';
const router = Router();
const machineRepo = new MachineRepository(db);
const machineService = new MachineService(machineRepo);
// GET /api/machines - Tüm makineleri getir
router.get('/', async (req: Request, res: Response) => {
  try {
    const machines = await machineService.getAllMachines();
    res.json({
      success: true,
      data: machines,
      count: machines.length
    });
  } catch (error) {
    console.error('GET /api/machines error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Makineler getirilemedi'
    });
  }
});
// GET /api/machines/search?q=term - Makinelerde arama
router.get('/search', async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.q as string;
    const machines = await machineService.searchMachines(searchTerm);
    res.json({
      success: true,
      data: machines,
      count: machines.length,
      searchTerm
    });
  } catch (error) {
    console.error('GET /api/machines/search error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Arama sırasında hata oluştu'
    });
  }
});
// GET /api/machines/expiring?days=30 - Süresi dolacak kalibrasyonlar
router.get('/expiring', async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const machines = await machineService.getExpiringCalibrations(days);
    res.json({
      success: true,
      data: machines,
      count: machines.length,
      days
    });
  } catch (error) {
    console.error('GET /api/machines/expiring error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Süresi dolacak kalibrasyonlar getirilemedi'
    });
  }
});
// GET /api/machines/maintenance-expiring?days=30 - Süresi dolacak bakımlar
router.get('/maintenance-expiring', async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const machines = await machineService.getExpiringMaintenances(days);
    res.json({
      success: true,
      data: machines,
      count: machines.length,
      days
    });
  } catch (error) {
    console.error('GET /api/machines/maintenance-expiring error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Süresi dolacak bakımlar getirilemedi'
    });
  }
})
// GET /api/machines/stats - Kalibrasyon istatistikleri
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await machineService.getCalibrationStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('GET /api/machines/stats error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'İstatistikler getirilemedi'
    });
  }
});
// GET /api/machines/maintenance-stats - Bakım istatistikleri
router.get('/maintenance-stats', async (_req: Request, res: Response) => {
  try {
    const stats = await machineService.getMaintenanceStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('GET /api/machines/maintenance-stats error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'İstatistikler getirilemedi'
    });
  }
});
// GET /api/machines/by-org/:orgId - Belirli kuruluşa ait makineler
router.get('/by-org/:orgId', async (req: Request, res: Response) => {
  try {
    const orgId = parseInt(req.params.orgId);
    if (isNaN(orgId)) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir kuruluş ID giriniz'
      });
    }
    const machines = await machineService.getMachinesByCalibrationOrg(orgId);
    res.json({
      success: true,
      data: machines,
      count: machines.length
    });
  } catch (error) {
    console.error('GET /api/machines/by-org/:orgId error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Kuruluşa ait makineler getirilemedi'
    });
  }
});
// GET /api/machines/by-maint-org/:orgId - Belirli bakım kuruluşuna ait makineler
router.get('/by-maint-org/:orgId', async (req: Request, res: Response) => {
  try {
    const orgId = parseInt(req.params.orgId);
    if (isNaN(orgId)) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir kuruluş ID giriniz'
      });
    }
    const machines = await machineService.getMachinesByMaintenanceOrg(orgId);
    res.json({
      success: true,
      data: machines,
      count: machines.length
    });
  } catch (error) {
    console.error('GET /api/machines/by-maint-org/:orgId error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Kuruluşa ait makineler getirilemedi'
    });
  }
});

// GET /api/machines/:id - Belirli bir makineyi getir
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir ID giriniz'
      });
    }
    const machine = await machineService.getMachineById(id);
    res.json({
      success: true,
      data: machine
    });
  } catch (error) {
    console.error('GET /api/machines/:id error:', error);
    const statusCode = error instanceof Error && error.message.includes('bulunamadı') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : 'Makine getirilemedi'
    });
  }
});
// POST /api/machines - Yeni makine oluştur
router.post('/', async (req: Request, res: Response) => {
  try {
    const machineData = req.body;
    const newMachine = await machineService.createMachine(machineData);
    res.status(201).json({
      success: true,
      message: 'Makine başarıyla oluşturuldu',
      data: newMachine
    });
  } catch (error) {
    console.error('POST /api/machines error:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Makine oluşturulamadı'
    });
  }
});
// PUT /api/machines/:id/calibration - Kalibrasyon tarihi güncelle
router.put('/:id/calibration', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir ID giriniz'
      });
    }
    const { calibrationDate } = req.body;
    if (!calibrationDate) {
      return res.status(400).json({
        success: false,
        message: 'Kalibrasyon tarihi gereklidir'
      });
    }
    const updatedMachine = await machineService.updateCalibrationDate(id, calibrationDate);
    res.json({
      success: true,
      message: 'Kalibrasyon tarihi başarıyla güncellendi',
      data: updatedMachine
    });
  } catch (error) {
    console.error('PUT /api/machines/:id/calibration error:', error);
    const statusCode = error instanceof Error && error.message.includes('bulunamadı') ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : 'Kalibrasyon tarihi güncellenemedi'
    });
  }
});
// PUT /api/machines/:id/maintenance - Bakım tarihini güncelle
router.put('/:id/maintenance', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir ID giriniz'
      });
    }
    const { maintenanceDate } = req.body;
    if (!maintenanceDate) {
      return res.status(400).json({
        success: false,
        message: 'Bakım tarihi gereklidir'
      });
    }
    const updatedMachine = await machineService.updateMaintenanceDate(id, maintenanceDate);
    res.json({
      success: true,
      message: 'Bakım tarihi başarıyla güncellendi',
      data: updatedMachine
    });
  } catch (error) {
    console.error('PUT /api/machines/:id/maintenance error:', error);
    const statusCode = error instanceof Error && error.message.includes('bulunamadı') ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : 'Bakım tarihi güncellenemedi'
    });
  }
});
// PUT /api/machines/:id - Makineyi güncelle
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir ID giriniz'
      });
    }
    const machineData = req.body;
    const updatedMachine = await machineService.updateMachine(id, machineData);
    res.json({
      success: true,
      message: 'Makine başarıyla güncellendi',
      data: updatedMachine
    });
  } catch (error) {
    console.error('PUT /api/machines/:id error:', error);
    const statusCode = error instanceof Error && error.message.includes('bulunamadı') ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : 'Makine güncellenemedi'
    });
  }
});
// DELETE /api/machines/:id - Makineyi sil
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir ID giriniz'
      });
    }
    await machineService.deleteMachine(id);
    res.json({
      success: true,
      message: 'Makine başarıyla silindi'
    });
  } catch (error) {
    console.error('DELETE /api/machines/:id error:', error);
    const statusCode = error instanceof Error && error.message.includes('bulunamadı') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : 'Makine silinemedi'
    });
  }
});
export default router;
