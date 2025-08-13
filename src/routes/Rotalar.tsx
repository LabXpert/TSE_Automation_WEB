import { Routes, Route } from 'react-router-dom';
import DeneyEkle from '../pages/DeneyEkle/DeneyEkle';
import Raporla from '../pages/Raporla/Raporla';

function Rotalar() {
  return (
    <Routes>
      <Route path="/" element={<DeneyEkle />} />
      <Route path="/deney-ekle" element={<DeneyEkle />} />
      <Route path="/raporla" element={<Raporla />} />
    </Routes>
  );
}

export default Rotalar;