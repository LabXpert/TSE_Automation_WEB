import { useState, useEffect } from 'react';
import RaporlaView from './RaporlaView.tsx';
import { tumKayitlariGetir } from '../../data/DeneyListesi.tsx';
import type { DeneyKaydi } from '../../models/Deney.tsx';

function Raporla() {
  const [kayitlariListesi, setKayitlariListesi] = useState<DeneyKaydi[]>([]);

  // Sayfa yüklendiğinde kayıtları getir
  useEffect(() => {
    setKayitlariListesi(tumKayitlariGetir());
  }, []);

  return (
    <RaporlaView 
      kayitlariListesi={kayitlariListesi}
    />
  );
}

export default Raporla;
