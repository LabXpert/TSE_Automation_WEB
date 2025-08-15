import { Router } from 'express';
import { PersonnelService } from '../services/personnel.service';

const router = Router();
const personnelService = new PersonnelService();

// GET /api/personnel
router.get('/', async (_req, res) => {
  try {
    const personnel = await personnelService.getAllPersonnel();
    res.json(personnel);
  } catch (error) {
    console.error('Error fetching personnel:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/personnel/:id
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid personnel ID' });
    }
    
    const person = await personnelService.getPersonnelById(id);
    if (!person) {
      return res.status(404).json({ error: 'Personnel not found' });
    }
    
    res.json(person);
  } catch (error) {
    console.error('Error fetching personnel:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/personnel
router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, title } = req.body;
    
    const person = await personnelService.createPersonnel({
      first_name,
      last_name,
      title
    });
    
    res.status(201).json(person);
  } catch (error: any) {
    console.error('Error creating personnel:', error);
    if (error.message.includes('required')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// PUT /api/personnel/:id
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid personnel ID' });
    }
    
    const { first_name, last_name, title } = req.body;
    
    const person = await personnelService.updatePersonnel(id, {
      first_name,
      last_name,
      title
    });
    
    res.json(person);
  } catch (error: any) {
    console.error('Error updating personnel:', error);
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else if (error.message.includes('required')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// DELETE /api/personnel/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid personnel ID' });
    }
    
    await personnelService.deletePersonnel(id);
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting personnel:', error);
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

export default router;
