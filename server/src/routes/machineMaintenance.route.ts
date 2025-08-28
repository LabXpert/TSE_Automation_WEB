import { Router, Request, Response } from 'express';
import { MachineMaintenanceService } from '../services/machineMaintenance.service';
import { MachineMaintenanceRepository } from '../repos/machineMaintenance.repo';
import db from '../database/connection';

const router = Router();
const repo = new MachineMaintenanceRepository(db);
const service = new MachineMaintenanceService(repo);

// GET /api/machine-maintenances
router.get('/', async (_req: Request, res: Response) => {
  try {
    const maintenances = await service.getAllMaintenances();
    res.json({ success: true, data: maintenances, count: maintenances.length });
  } catch (error) {
    console.error('GET /api/machine-maintenances error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Bakım kayıtları getirilemedi'
    });
  }
});

// GET /api/machine-maintenances/machine/:machineId
router.get('/machine/:machineId', async (req: Request, res: Response) => {
  try {
    const machineId = parseInt(req.params.machineId);
    if (isNaN(machineId)) {
      return res.status(400).json({ success: false, message: 'Geçerli bir makine ID giriniz' });
    }
    const maintenances = await service.getMaintenancesByMachine(machineId);
    res.json({ success: true, data: maintenances, count: maintenances.length, machineId });
  } catch (error) {
    console.error('GET /api/machine-maintenances/machine/:machineId error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Makine bakım kayıtları getirilemedi'
    });
  }
});

// GET /api/machine-maintenances/org/:orgId
router.get('/org/:orgId', async (req: Request, res: Response) => {
  try {
    const orgId = parseInt(req.params.orgId);
    if (isNaN(orgId)) {
      return res.status(400).json({ success: false, message: 'Geçerli bir kuruluş ID giriniz' });
    }
    const maintenances = await service.getMaintenancesByOrg(orgId);
    res.json({ success: true, data: maintenances, count: maintenances.length, orgId });
  } catch (error) {
    console.error('GET /api/machine-maintenances/org/:orgId error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Kuruluş bakım kayıtları getirilemedi'
    });
  }
});

// GET /api/machine-maintenances/date-range
router.get('/date-range', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Başlangıç ve bitiş tarihleri gereklidir' });
    }
    const maintenances = await service.getMaintenancesByDateRange(startDate as string, endDate as string);
    res.json({ success: true, data: maintenances, count: maintenances.length, dateRange: { startDate, endDate } });
  } catch (error) {
    console.error('GET /api/machine-maintenances/date-range error:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Tarih aralığı bakım kayıtları getirilemedi'
    });
  }
});

// GET /api/machine-maintenances/stats
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const stats = await service.getMaintenanceStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('GET /api/machine-maintenances/stats error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Bakım istatistikleri getirilemedi'
    });
  }
});

// GET /api/machine-maintenances/machine/:machineId/last
router.get('/machine/:machineId/last', async (req: Request, res: Response) => {
  try {
    const machineId = parseInt(req.params.machineId);
    if (isNaN(machineId)) {
      return res.status(400).json({ success: false, message: 'Geçerli bir makine ID giriniz' });
    }
    const lastMaintenance = await service.getLastMaintenanceByMachine(machineId);
    res.json({ success: true, data: lastMaintenance, machineId });
  } catch (error) {
    console.error('GET /api/machine-maintenances/machine/:machineId/last error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Son bakım kaydı getirilemedi'
    });
  }
});

// GET /api/machine-maintenances/history
router.get('/history', async (req: Request, res: Response) => {
  try {
    const machineId = req.query.machineId ? parseInt(req.query.machineId as string) : undefined;
    const orgId = req.query.orgId ? parseInt(req.query.orgId as string) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const history = await service.getMaintenanceHistory(machineId, orgId, limit);
    res.json({ success: true, data: history, count: history.length, filters: { machineId, orgId, limit } });
  } catch (error) {
    console.error('GET /api/machine-maintenances/history error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Bakım geçmişi getirilemedi'
    });
  }
});

// GET /api/machine-maintenances/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Geçerli bir ID giriniz' });
    }
    const maintenance = await service.getMaintenanceById(id);
    res.json({ success: true, data: maintenance });
  } catch (error) {
    console.error('GET /api/machine-maintenances/:id error:', error);
    const statusCode = error instanceof Error && error.message.includes('bulunamadı') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : 'Bakım kaydı getirilemedi'
    });
  }
});

// POST /api/machine-maintenances
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newMaintenance = await service.createMaintenance(data);
    res.status(201).json({ success: true, message: 'Bakım kaydı başarıyla oluşturuldu', data: newMaintenance });
  } catch (error) {
    console.error('POST /api/machine-maintenances error:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Bakım kaydı oluşturulamadı'
    });
  }
});

// POST /api/machine-maintenances/maintain/:machineId
router.post('/maintain/:machineId', async (req: Request, res: Response) => {
  try {
    const machineId = parseInt(req.params.machineId);
    if (isNaN(machineId)) {
      return res.status(400).json({ success: false, message: 'Geçerli bir makine ID giriniz' });
    }
    const { maintenance_org_id, maintained_by, maintenance_date, next_maintenance_date, notes } = req.body;
    if (!maintenance_org_id || !maintenance_date) {
      return res.status(400).json({ success: false, message: 'Bakım kuruluşu ve tarihi gereklidir' });
    }
    if (!maintained_by || maintained_by.trim() === '') {
      return res.status(400).json({ success: false, message: 'Bakımı yapan kişi gereklidir' });
    }
    const maintenanceData = { maintenance_org_id, maintained_by, maintenance_date, next_maintenance_date, notes };
    const newMaintenance = await service.maintainMachine(machineId, maintenanceData);
    res.status(201).json({ success: true, message: 'Makine bakımı kaydedildi', data: newMaintenance });
  } catch (error) {
    console.error('POST /api/machine-maintenances/maintain/:machineId error:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Makine bakımı kaydedilemedi'
    });
  }
});

// PUT /api/machine-maintenances/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Geçerli bir ID giriniz' });
    }
    const data = req.body;
    const updated = await service.updateMaintenance(id, data);
    res.json({ success: true, message: 'Bakım kaydı başarıyla güncellendi', data: updated });
  } catch (error) {
    console.error('PUT /api/machine-maintenances/:id error:', error);
    const statusCode = error instanceof Error && error.message.includes('bulunamadı') ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : 'Bakım kaydı güncellenemedi'
    });
  }
});

// DELETE /api/machine-maintenances/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Geçerli bir ID giriniz' });
    }
    await service.deleteMaintenance(id);
    res.json({ success: true, message: 'Bakım kaydı başarıyla silindi' });
  } catch (error) {
    console.error('DELETE /api/machine-maintenances/:id error:', error);
    const statusCode = error instanceof Error && error.message.includes('bulunamadı') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : 'Bakım kaydı silinemedi'
    });
  }
});

export default router;