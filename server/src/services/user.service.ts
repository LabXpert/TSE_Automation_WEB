import { UserRepository, UserData, UserUpdateData } from '../repos/user.repo';

export class UserService {
  private repo = new UserRepository();

  async getAllUsers() {
    return await this.repo.findAll();
  }

  async getUserById(id: number) {
    return await this.repo.findById(id);
  }

  async createUser(data: UserData) {
    // Business logic validations
    await this.validateUserData(data);

    try {
      return await this.repo.create(data);
    } catch (error: any) {
      console.error('Database error in createUser:', error);
      
      // PostgreSQL unique constraint violations
      if (error.code === '23505') {
        if (error.constraint === 'users_username_key') {
          throw new Error('Bu kullanıcı adı zaten kullanılmaktadır');
        }
        if (error.constraint === 'users_email_key') {
          throw new Error('Bu email adresi zaten kullanılmaktadır');
        }
      }
      
      // Generic database error
      throw new Error('Kullanıcı kaydedilirken veritabanı hatası oluştu: ' + error.message);
    }
  }

  async updateUser(id: number, data: UserUpdateData) {
    // Business logic validations
    await this.validateUserUpdateData(data);

    try {
      const result = await this.repo.update(id, data);
      if (!result) {
        throw new Error('Kullanıcı bulunamadı');
      }
      return result;
    } catch (error: any) {
      console.error('Database error in updateUser:', error);
      
      // PostgreSQL unique constraint violations
      if (error.code === '23505') {
        if (error.constraint === 'users_username_key') {
          throw new Error('Bu kullanıcı adı zaten kullanılmaktadır');
        }
        if (error.constraint === 'users_email_key') {
          throw new Error('Bu email adresi zaten kullanılmaktadır');
        }
      }
      
      throw error;
    }
  }

  async deleteUser(id: number) {
    const deleted = await this.repo.delete(id);
    if (!deleted) {
      throw new Error('Kullanıcı bulunamadı');
    }
    return { success: true };
  }

  private async validateUserData(data: UserData) {
    if (!data.username?.trim()) {
      throw new Error('Kullanıcı adı gereklidir');
    }
    if (data.username.trim().length < 3) {
      throw new Error('Kullanıcı adı en az 3 karakter olmalıdır');
    }
    if (!data.first_name?.trim()) {
      throw new Error('Ad gereklidir');
    }
    if (!data.last_name?.trim()) {
      throw new Error('Soyad gereklidir');
    }
    if (!data.email?.trim()) {
      throw new Error('Email adresi gereklidir');
    }
    if (!data.password?.trim()) {
      throw new Error('Şifre gereklidir');
    }
    if (data.password.trim().length < 6) {
      throw new Error('Şifre en az 6 karakter olmalıdır');
    }
    if (!data.role || !['admin', 'user'].includes(data.role)) {
      throw new Error('Geçerli bir rol seçiniz (admin veya user)');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Geçerli bir email adresi giriniz');
    }

    // Username validation (only alphanumeric and underscore)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(data.username)) {
      throw new Error('Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir');
    }

    // Check if username or email already exists
    const existingUserByUsername = await this.repo.findByUsername(data.username.trim());
    if (existingUserByUsername) {
      throw new Error('Bu kullanıcı adı zaten kullanılmaktadır');
    }

    const existingUserByEmail = await this.repo.findByEmail(data.email.trim());
    if (existingUserByEmail) {
      throw new Error('Bu email adresi zaten kullanılmaktadır');
    }
  }

  private async validateUserUpdateData(data: UserUpdateData) {
    if (!data.username?.trim()) {
      throw new Error('Kullanıcı adı gereklidir');
    }
    if (data.username.trim().length < 3) {
      throw new Error('Kullanıcı adı en az 3 karakter olmalıdır');
    }
    if (!data.first_name?.trim()) {
      throw new Error('Ad gereklidir');
    }
    if (!data.last_name?.trim()) {
      throw new Error('Soyad gereklidir');
    }
    if (!data.email?.trim()) {
      throw new Error('Email adresi gereklidir');
    }
    if (data.password && data.password.trim().length < 6) {
      throw new Error('Şifre en az 6 karakter olmalıdır');
    }
    if (!data.role || !['admin', 'user'].includes(data.role)) {
      throw new Error('Geçerli bir rol seçiniz (admin veya user)');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Geçerli bir email adresi giriniz');
    }

    // Username validation (only alphanumeric and underscore)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(data.username)) {
      throw new Error('Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir');
    }
  }
}
