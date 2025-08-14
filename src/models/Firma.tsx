export interface Firma {
  id: number;
  name: string;
  tax_no?: string;
  contact_name?: string;
  address?: string;
  phone?: string;
  email?: string;
  created_at?: string;
}

// Artık sabit liste kullanılmıyor, firmalar API'den geliyor