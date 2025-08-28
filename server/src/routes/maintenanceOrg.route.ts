import { Router, Request, Response } from 'express';
import { MaintenanceOrgService } from '../services/maintenanceOrg.service';
import { MaintenanceOrgRepository } from '../repos/maintenanceOrg.repo';

const router = Router();
const maintenanceOrgRepo = new MaintenanceOrgRepository();
const maintenanceOrgService = new MaintenanceOrgService(maintenanceOrgRepo);

// GET /api/maintenance-orgs - list all
router.get('/', async (_req: Request, res: Response) => {
  try {
    const orgs = await maintenanceOrgService.getAllOrgs();
    res.json({ success: true, data: orgs, count: orgs.length });
  } catch (error) {
    console.error('GET /api/maintenance-orgs error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Bakım kuruluşları getirilemedi'
    });
  }
});

// GET /api/maintenance-orgs/search?q=term - search
router.get('/search', async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.q as string;
    const orgs = await maintenanceOrgService.searchOrgs(searchTerm);
    res.json({ success: true, data: orgs, count: orgs.length, searchTerm });
  } catch (error) {
    console.error('GET /api/maintenance-orgs/search error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Arama sırasında hata oluştu'
    });
  }
});

// GET /api/maintenance-orgs/:id - get by id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Geçerli bir ID giriniz' });
    }
    const org = await maintenanceOrgService.getOrgById(id);
    res.json({ success: true, data: org });
  } catch (error) {
    console.error('GET /api/maintenance-orgs/:id error:', error);
    const statusCode = error instanceof Error && error.message.includes('bulunamadı') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : 'Bakım kuruluşu getirilemedi'
    });
  }
});

// POST /api/maintenance-orgs - create
router.post('/', async (req: Request, res: Response) => {
  try {
    const orgData = req.body;
    const newOrg = await maintenanceOrgService.createOrg(orgData);
    res.status(201).json({
      success: true,
      message: 'Bakım kuruluşu başarıyla oluşturuldu',
      data: newOrg
    });
  } catch (error) {
    console.error('POST /api/maintenance-orgs error:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Bakım kuruluşu oluşturulamadı'
    });
  }
});

// PUT /api/maintenance-orgs/:id - update
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Geçerli bir ID giriniz' });
    }
    const orgData = req.body;
    const updatedOrg = await maintenanceOrgService.updateOrg(id, orgData);
    res.json({
      success: true,
      message: 'Bakım kuruluşu başarıyla güncellendi',
      data: updatedOrg
    });
  } catch (error) {
    console.error('PUT /api/maintenance-orgs/:id error:', error);
    const statusCode = error instanceof Error && error.message.includes('bulunamadı') ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : 'Bakım kuruluşu güncellenemedi'
    });
  }
});

// DELETE /api/maintenance-orgs/:id - delete
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Geçerli bir ID giriniz' });
    }
    await maintenanceOrgService.deleteOrg(id);
    res.json({ success: true, message: 'Bakım kuruluşu başarıyla silindi' });
  } catch (error) {
    console.error('DELETE /api/maintenance-orgs/:id error:', error);
    const statusCode = error instanceof Error && error.message.includes('bulunamadı') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : 'Bakım kuruluşu silinemedi'
    });
  }
});

export default router;
