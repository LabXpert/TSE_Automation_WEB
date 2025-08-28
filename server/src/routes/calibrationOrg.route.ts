import { Router, Request, Response } from 'express';
import { CalibrationOrgService } from '../services/calibrationOrg.service';
import { CalibrationOrgRepository } from '../repos/calibrationOrg.repo';

const router = Router();
const calibrationOrgRepo = new CalibrationOrgRepository();
const calibrationOrgService = new CalibrationOrgService(calibrationOrgRepo);

// GET /api/calibration-orgs - Tüm kalibrasyon kuruluşlarını getir
router.get('/', async (req: Request, res: Response) => {
  try {
    const orgs = await calibrationOrgService.getAllOrgs();
    res.json({
      success: true,
      data: orgs,
      count: orgs.length
    });
  } catch (error) {
    console.error('GET /api/calibration-orgs error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Kalibrasyon kuruluşları getirilemedi'
    });
  }
});

// GET /api/calibration-orgs/search?q=term - Kalibrasyon kuruluşlarında arama
router.get('/search', async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.q as string;
    const orgs = await calibrationOrgService.searchOrgs(searchTerm);
    res.json({
      success: true,
      data: orgs,
      count: orgs.length,
      searchTerm
    });
  } catch (error) {
    console.error('GET /api/calibration-orgs/search error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Arama sırasında hata oluştu'
    });
  }
});

// GET /api/calibration-orgs/:id - Belirli bir kalibrasyon kuruluşunu getir
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir ID giriniz'
      });
    }

    const org = await calibrationOrgService.getOrgById(id);
    res.json({
      success: true,
      data: org
    });
  } catch (error) {
    console.error('GET /api/calibration-orgs/:id error:', error);
    const statusCode = error instanceof Error && error.message.includes('bulunamadı') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : 'Kalibrasyon kuruluşu getirilemedi'
    });
  }
});

// POST /api/calibration-orgs - Yeni kalibrasyon kuruluşu oluştur
router.post('/', async (req: Request, res: Response) => {
  try {
    const orgData = req.body;
    const newOrg = await calibrationOrgService.createOrg(orgData);
    res.status(201).json({
      success: true,
      message: 'Kalibrasyon kuruluşu başarıyla oluşturuldu',
      data: newOrg
    });
  } catch (error) {
    console.error('POST /api/calibration-orgs error:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Kalibrasyon kuruluşu oluşturulamadı'
    });
  }
});

// PUT /api/calibration-orgs/:id - Kalibrasyon kuruluşunu güncelle
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir ID giriniz'
      });
    }

    const orgData = req.body;
    const updatedOrg = await calibrationOrgService.updateOrg(id, orgData);
    res.json({
      success: true,
      message: 'Kalibrasyon kuruluşu başarıyla güncellendi',
      data: updatedOrg
    });
  } catch (error) {
    console.error('PUT /api/calibration-orgs/:id error:', error);
    const statusCode = error instanceof Error && error.message.includes('bulunamadı') ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : 'Kalibrasyon kuruluşu güncellenemedi'
    });
  }
});

// DELETE /api/calibration-orgs/:id - Kalibrasyon kuruluşunu sil
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir ID giriniz'
      });
    }

    await calibrationOrgService.deleteOrg(id);
    res.json({
      success: true,
      message: 'Kalibrasyon kuruluşu başarıyla silindi'
    });
  } catch (error) {
    console.error('DELETE /api/calibration-orgs/:id error:', error);
    const statusCode = error instanceof Error && error.message.includes('bulunamadı') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : 'Kalibrasyon kuruluşu silinemedi'
    });
  }
});

export default router;
