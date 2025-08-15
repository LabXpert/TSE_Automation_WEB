import { Router } from 'express';
import { CompanyService } from '../services/company.service';

const router = Router();
const companyService = new CompanyService();

// GET /api/companies
router.get('/', async (_req, res) => {
  try {
    const companies = await companyService.getAllCompanies();
    res.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// GET /api/companies/:id
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid company ID' });
    }
    
    const company = await companyService.getCompanyById(id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    res.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// POST /api/companies
router.post('/', async (req, res) => {
  try {
    const { name, tax_no, contact_name, address, phone, email } = req.body;
    
    const company = await companyService.createCompany({
      name,
      tax_no,
      contact_name,
      address,
      phone,
      email
    });
    
    res.status(201).json(company);
  } catch (error: any) {
    console.error('Error creating company:', error);
    if (error.message.includes('required') || error.message.includes('Invalid email')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Sunucu hatası' });
    }
  }
});

// PUT /api/companies/:id
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid company ID' });
    }
    
    const { name, tax_no, contact_name, address, phone, email } = req.body;
    
    const company = await companyService.updateCompany(id, {
      name,
      tax_no,
      contact_name,
      address,
      phone,
      email
    });
    
    res.json(company);
  } catch (error: any) {
    console.error('Error updating company:', error);
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else if (error.message.includes('required') || error.message.includes('Invalid email')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Sunucu hatası' });
    }
  }
});

// DELETE /api/companies/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid company ID' });
    }
    
    await companyService.deleteCompany(id);
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting company:', error);
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Sunucu hatası' });
    }
  }
});

export default router;
