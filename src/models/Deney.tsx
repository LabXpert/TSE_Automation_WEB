export interface Deney {
  id: string;
  deneyTuru: string;
  sorumluPersonel: string;
  akredite: boolean;
  unit_price?: number;
}

export interface DeneyKaydi {
  id: string;
  firmaAdi: string;
  basvuruNo: string;
  basvuruTarihi: string;
  belgelendirmeTuru: 'özel' | 'belgelendirme';
  deneySayisi: number;
  deneyler: Deney[];
  kayitTarihi: string;
}