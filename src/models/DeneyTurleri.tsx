export interface DeneyTuru {
  id: string;
  ad: string;
  kod: string;
  aciklama?: string;
}

export const DENEY_TURLERI: DeneyTuru[] = [
  {
    id: '1',
    ad: 'ÇEKME',
    kod: 'CEKME',
    aciklama: 'Çekme mukavemeti testi'
  },
  {
    id: '2',
    ad: 'KİMYASAL',
    kod: 'KIMYASAL',
    aciklama: 'Kimyasal analiz testi'
  },
  {
    id: '3',
    ad: 'ROCKWELL',
    kod: 'ROCKWELL',
    aciklama: 'Rockwell sertlik testi'
  },
  {
    id: '4',
    ad: 'BRİNELL',
    kod: 'BRINELL',
    aciklama: 'Brinell sertlik testi'
  },
  {
    id: '5',
    ad: 'ÇENTİK',
    kod: 'CENTIK',
    aciklama: 'Çentik darbe testi'
  },
  {
    id: '6',
    ad: 'VICKERS',
    kod: 'VICKERS',
    aciklama: 'Vickers sertlik testi'
  },
  {
    id: '7',
    ad: 'KAPLAMA KALINLIĞI',
    kod: 'KAPLAMA',
    aciklama: 'Kaplama kalınlığı ölçümü'
  },
  {
    id: '8',
    ad: 'BOYUT ÖLÇME',
    kod: 'BOYUT',
    aciklama: 'Boyut ölçme testi'
  },
  {
    id: '9',
    ad: 'YÜZEY PÜRÜZLÜLÜĞÜ',
    kod: 'YUZEY',
    aciklama: 'Yüzey pürüzlülük ölçümü'
  },
  {
    id: '10',
    ad: 'BOYUTSAL ÖLÇÜM',
    kod: 'BOYUTSAL',
    aciklama: 'Boyutsal ölçüm testi'
  },
  {
    id: '11',
    ad: 'MİKROYAPI',
    kod: 'MIKROYAPI',
    aciklama: 'Mikroyapı analizi'
  },
  {
    id: '12',
    ad: 'BUHAR GERİ KAZANIM',
    kod: 'BUHAR',
    aciklama: 'Buhar geri kazanım testi'
  }
];