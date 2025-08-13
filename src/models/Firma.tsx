export interface Firma {
  id: string;
  ad: string;
  email: string;
  telefon?: string;
  adres?: string;
}

export const FIRMALAR: Firma[] = [
  {
    id: '1',
    ad: 'ABC Makina San. Tic. Ltd. Şti.',
    email: 'info@abcmakina.com',
    telefon: '0212 123 45 67',
    adres: 'İstanbul'
  },
  {
    id: '2',
    ad: 'XYZ Metal İşleme A.Ş.',
    email: 'info@xyzmetal.com',
    telefon: '0312 987 65 43',
    adres: 'Ankara'
  },
  {
    id: '3',
    ad: 'DEF Otomotiv Ltd. Şti.',
    email: 'info@defoto.com',
    telefon: '0232 555 44 33',
    adres: 'İzmir'
  }
];