import { Routes, Route } from 'react-router-dom';
import DeneyEkle from '../pages/DeneyEkle/DeneyEkle';
import DeneyDuzenleSil from '../pages/DeneyDuzenleSil/DeneyDuzenleSil';
import Raporla from '../pages/Raporla/Raporla';

function Rotalar() {
  return (
    <Routes>
      <Route path="/" element={<DeneyEkle />} />
      <Route path="/deney-ekle" element={<DeneyEkle />} />
      <Route path="/duzenle-sil" element={<DeneyDuzenleSil />} />
      <Route path="/raporla" element={<Raporla />} />
    </Routes>
  );
}

export default Rotalar;
