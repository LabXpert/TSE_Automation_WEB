// Kalibrasyon Kuruluşu Model
export interface KalibrasyonKurulusu {
  id: number;
  org_name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  created_at?: Date;
}

export interface KalibrasyonKurulusuInput {
  org_name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
}

// Makine Model
export interface Makine {
  id: number;
  serial_no: string;
  equipment_name: string;
  brand?: string;
  model?: string;
  measurement_range?: string;
  last_calibration_date: Date;
  calibration_org_id: number;
  created_at?: Date;
  
  // Join fields
  calibration_org?: {
    id: number;
    org_name: string;
    contact_name?: string;
    email?: string;
    phone?: string;
  };
}

export interface MakineInput {
  serial_no: string;
  equipment_name: string;
  brand?: string;
  model?: string;
  measurement_range?: string;
  last_calibration_date: Date;
  calibration_org_id: number;
}

// Makine uygulaması arayüzü (raporlama için)
export interface MakineUygulama {
  id: number;
  basvuruNo: string;
  basvuruTarihi: string;
  belgelendirmeTuru: 'belgelendirme' | 'özel';
  firmaAdi: string;
  sorumluPersonel: string;
  ucret: number;
}

// Makine kaydı arayüzü (raporlama için)
export interface MakineKaydi {
  id: number;
  makineAdi: string;
  model: string;
  marka: string;
  seriNo: string;
  konum: string;
  tedarikTarihi: string;
  sonKalibrasyonTarihi: string;
  sonrakiKalibrasyonTarihi: string;
  durum: string;
  notlar: string;
  kalibrasyonKurulusu: string;
  kullanimSayisi: number;
  toplamGelir: number;
  uygulamalar: MakineUygulama[];
}
