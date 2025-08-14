import { Router } from 'express';
import { userService } from '../services/userService.ts';

const router = Router();

// Tüm kullanıcıları getir
router.get('/', async (req, res) => {
  const result = await userService.getAll();
  
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

export default router;