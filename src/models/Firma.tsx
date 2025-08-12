export interface Firma {
  id: string;
  ad: string;
  kod: string;
  adres?: string;
  telefon?: string;
  email?: string;
}

export const FIRMALAR: Firma[] = [
  {
    id: '1',
    ad: 'ABC Makina San. Tic. Ltd. Şti.',
    kod: 'ABC001',
    adres: 'İstanbul',
    telefon: '0212 123 45 67',
    email: 'info@abcmakina.com'
  },
  {
    id: '2',
    ad: 'XYZ Metal İşleme A.Ş.',
    kod: 'XYZ002',
    adres: 'Ankara',
    telefon: '0312 987 65 43',
    email: 'info@xyzmetal.com'
  },
  {
    id: '3',
    ad: 'DEF Otomotiv Ltd. Şti.',
    kod: 'DEF003',
    adres: 'İzmir',
    telefon: '0232 555 44 33',
    email: 'info@defoto.com'
  }
];