import { Router } from 'express';
import { UserService } from '../services/user.service';
import { UserRepository } from '../repos/user.repo';

const router = Router();
const userService = new UserService();
const userRepo = new UserRepository();

// POST /api/users/login - Basit login endpoint'i
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Kullanıcı adı ve şifre gereklidir!'
      });
    }

    // Kullanıcıyı şifresi ile birlikte bul
    const user = await userRepo.findByUsernameWithPassword(username);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Kullanıcı adı veya şifre hatalı!'
      });
    }

    // Şifreyi kontrol et
    const isPasswordValid = await userRepo.verifyPassword(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Kullanıcı adı veya şifre hatalı!'
      });
    }

    // Başarılı login
    return res.json({
      success: true,
      message: 'Giriş başarılı!',
      user: {
        id: user.id,
        username: user.username,
        fullName: `${user.first_name} ${user.last_name}`,
        role: user.role,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Giriş sırasında bir hata oluştu!'
    });
  }
});

// GET /api/users
router.get('/', async (_req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Geçersiz kullanıcı ID' });
    }
    
    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// POST /api/users
router.post('/', async (req, res) => {
  try {
    const { username, first_name, last_name, email, password, role, unvan, phone } = req.body;
    
    console.log('Creating user with data:', { username, first_name, last_name, email, role, unvan, phone });
    
    const user = await userService.createUser({
      username,
      first_name,
      last_name,
      email,
      password,
      role,
      unvan,
      phone
    });
    
    console.log('User created successfully:', user);
    res.status(201).json(user);
  } catch (error: any) {
    console.error('Error creating user:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      constraint: error.constraint,
      detail: error.detail
    });
    
    if (error.message.includes('kullanıcı adı') || 
        error.message.includes('email') || 
        error.message.includes('gerekli') || 
        error.message.includes('karakter') ||
        error.message.includes('rol') ||
        error.message.includes('şifre')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Sunucu hatası: ' + error.message });
    }
  }
});

// PUT /api/users/:id
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Geçersiz kullanıcı ID' });
    }
    
    const { username, first_name, last_name, email, password, role, unvan, phone } = req.body;
    
    console.log('Updating user with data:', { username, first_name, last_name, email, role, unvan, phone });
    
    const user = await userService.updateUser(id, {
      username,
      first_name,
      last_name,
      email,
      password,
      role,
      unvan,
      phone
    });
    
    console.log('User updated successfully:', user);
    res.json(user);
  } catch (error: any) {
    console.error('Error updating user:', error);
    if (error.message.includes('bulunamadı')) {
      res.status(404).json({ error: error.message });
    } else if (error.message.includes('kullanıcı adı') || 
               error.message.includes('email') || 
               error.message.includes('gerekli') || 
               error.message.includes('karakter') ||
               error.message.includes('rol') ||
               error.message.includes('şifre')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Sunucu hatası' });
    }
  }
});

// DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Geçersiz kullanıcı ID' });
    }
    
    await userService.deleteUser(id);
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    if (error.message.includes('bulunamadı')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Sunucu hatası' });
    }
  }
});

export default router;
