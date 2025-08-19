import { Routes, Route, Navigate } from 'react-router-dom';
import DeneyEkle from '../pages/DeneyEkle/DeneyEkle';
import Raporla from '../pages/Raporla/Raporla';
import FirmaEkle from '../pages/DeneyEkle/FirmaEkle/FirmaEkle';
import PersonelEkle from '../pages/PersonelEkle/PersonelEkle';
import KullaniciEkle from '../pages/KullaniciEkle/KullaniciEkle';
import DeneyTuruEkle from '../pages/DeneyTuruEkle/DeneyTuruEkle';
import Login from '../pages/Login/Login';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';

function Rotalar() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <Routes>
      {/* Login route - accessible only when not logged in */}
      <Route 
        path="/login" 
        element={isLoggedIn ? <Navigate to="/" replace /> : <Login />} 
      />
      
      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <DeneyEkle />
        </ProtectedRoute>
      } />
      <Route path="/deney-ekle" element={
        <ProtectedRoute>
          <DeneyEkle />
        </ProtectedRoute>
      } />
      <Route path="/firma-ekle" element={
        <ProtectedRoute>
          <FirmaEkle />
        </ProtectedRoute>
      } />
      <Route path="/personel-ekle" element={
        <ProtectedRoute>
          <AdminRoute>
            <PersonelEkle />
          </AdminRoute>
        </ProtectedRoute>
      } />
      <Route path="/kullanici-ekle" element={
        <ProtectedRoute>
          <AdminRoute>
            <KullaniciEkle />
          </AdminRoute>
        </ProtectedRoute>
      } />
      <Route path="/deney-turu-ekle" element={
        <ProtectedRoute>
          <AdminRoute>
            <DeneyTuruEkle />
          </AdminRoute>
        </ProtectedRoute>
      } />
      <Route path="/raporla" element={
        <ProtectedRoute>
          <Raporla />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default Rotalar;