import type { DeneyKaydi } from '../models/Deney.tsx';

// Basit liste - kayıtlar burada tutulacak
export const deneyKayitlari: DeneyKaydi[] = [];

// Liste fonksiyonları
export const kayitEkle = (kayit: Omit<DeneyKaydi, 'id' | 'kayitTarihi'>) => {
  const yeniKayit: DeneyKaydi = {
    ...kayit,
    id: Date.now().toString(),
    kayitTarihi: new Date().toISOString()
  };
  deneyKayitlari.push(yeniKayit);
  return yeniKayit;
};

export const tumKayitlariGetir = () => {
  return [...deneyKayitlari];
};

export const listeTemizle = () => {
  deneyKayitlari.length = 0;
};