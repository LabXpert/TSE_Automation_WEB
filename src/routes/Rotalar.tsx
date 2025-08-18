import { Routes, Route } from 'react-router-dom';
import DeneyEkle from '../pages/DeneyEkle/DeneyEkle';
import Raporla from '../pages/Raporla/Raporla';
import FirmaEkle from '../pages/DeneyEkle/FirmaEkle/FirmaEkle';
import PersonelEkle from '../pages/PersonelEkle/PersonelEkle';
import KullaniciEkle from '../pages/KullaniciEkle/KullaniciEkle';

function Rotalar() {
  return (
    <Routes>
      <Route path="/" element={<DeneyEkle />} />
      <Route path="/deney-ekle" element={<DeneyEkle />} />
      <Route path="/firma-ekle" element={<FirmaEkle />} />
      <Route path="/personel-ekle" element={<PersonelEkle />} />
      <Route path="/kullanici-ekle" element={<KullaniciEkle />} />
      <Route path="/raporla" element={<Raporla />} />
    </Routes>
  );
}

export default Rotalar;