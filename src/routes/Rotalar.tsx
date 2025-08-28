import { Routes, Route, Navigate } from 'react-router-dom';
import DeneyEkle from '../pages/DeneyEkle/DeneyEkle';
import Raporla from '../pages/Raporla/Raporla';
import Analiz from '../pages/Analiz/Analiz';
import MakineRaporla from '../pages/MakineRaporla/MakineRaporla';
import FirmaEkle from '../pages/DeneyEkle/FirmaEkle/FirmaEkle';
import PersonelEkle from '../pages/PersonelEkle/PersonelEkle';
import KullaniciEkle from '../pages/KullaniciEkle/KullaniciEkle';
import DeneyTuruEkle from '../pages/DeneyTuruEkle/DeneyTuruEkle';
import MakineEkle from '../pages/MakineEkle/MakineEkle';
import KalibrasyonKurulusEkle from '../pages/KalibrasyonKurulusEkle/KalibrasyonKurulusEkle';
import BakimKurulusEkle from '../pages/BakimKurulusEkle/BakimKurulusEkle';
import Login from '../pages/Login/Login';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';
function Rotalar() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
  // Rol bazlı varsayılan sayfa yönlendirmesi
  const getDefaultRoute = () => {
    if (!isLoggedIn) return '/login';
    return user?.role === 'admin' ? '/analiz' : '/deney-ekle';
  };
  return (
    <Routes>
      {/* Login route - accessible only when not logged in */}
      <Route 
        path="/login" 
        element={isLoggedIn ? <Navigate to={getDefaultRoute()} replace /> : <Login />} 
      />
      
      {/* Root route - redirect based on role */}
      <Route 
        path="/" 
        element={<Navigate to={getDefaultRoute()} replace />} 
      />
      
      {/* Protected routes */}
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
      <Route path="/raporla" element={
        <ProtectedRoute>
          <Raporla />
        </ProtectedRoute>
      } />
      <Route path="/analiz" element={
        <ProtectedRoute>
          <Analiz />
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
      <Route path="/makine-ekle" element={
        <ProtectedRoute>
          <AdminRoute>
            <MakineEkle />
          </AdminRoute>
        </ProtectedRoute>
      } />
      <Route path="/kalibrasyon-kurulus-ekle" element={
        <ProtectedRoute>
          <AdminRoute>
            <KalibrasyonKurulusEkle />
          </AdminRoute>
        </ProtectedRoute>
      } />
      <Route path="/bakim-kurulus-ekle" element={
        <ProtectedRoute>
          <AdminRoute>
            <BakimKurulusEkle />
          </AdminRoute>
        </ProtectedRoute>
      } />
      <Route path="/makine-raporla" element={
        <ProtectedRoute>
          <MakineRaporla />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
export default Rotalar;
