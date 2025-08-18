export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'user';
  unvan?: string;
  phone?: string;
  created_at: string;
}
