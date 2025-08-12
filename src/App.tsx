import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DeneyEkle from './pages/DeneyEkle/DeneyEkle';
import DeneyDuzenleSil from './pages/DeneyDuzenleSil/DeneyDuzenleSil';
import Raporla from './pages/Raporla/Raporla';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<DeneyEkle />} />
          <Route path="/deney-ekle" element={<DeneyEkle />} />
          <Route path="/duzenle-sil" element={<DeneyDuzenleSil />} />
          <Route path="/raporla" element={<Raporla />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;