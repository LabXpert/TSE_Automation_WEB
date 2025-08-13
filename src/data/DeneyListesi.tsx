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

export const kayitGuncelle = (id: string, guncelKayit: Omit<DeneyKaydi, 'id' | 'kayitTarihi'>) => {
  const index = deneyKayitlari.findIndex(kayit => kayit.id === id);
  if (index !== -1) {
    deneyKayitlari[index] = {
      ...guncelKayit,
      id,
      kayitTarihi: deneyKayitlari[index].kayitTarihi // Orijinal kayıt tarihini koru
    };
    return deneyKayitlari[index];
  }
  return null;
};

export const kayitSil = (id: string) => {
  const index = deneyKayitlari.findIndex(kayit => kayit.id === id);
  if (index !== -1) {
    const silinenKayit = deneyKayitlari[index];
    deneyKayitlari.splice(index, 1);
    return silinenKayit;
  }
  return null;
};

export const kayitBul = (id: string) => {
  return deneyKayitlari.find(kayit => kayit.id === id) || null;
};

export const tumKayitlariGetir = () => {
  return [...deneyKayitlari];
};

export const listeTemizle = () => {
  deneyKayitlari.length = 0;
};