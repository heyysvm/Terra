import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import AppLayout from './components/layout/AppLayout';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import VoiceAssistant from './pages/VoiceAssistant';
import CropDoctor from './pages/CropDoctor';
import GovernmentSchemes from './pages/GovernmentSchemes';
import MandiPrices from './pages/MandiPrices';
import SellToGovt from './pages/SellToGovt';

function RequireProfile({ children }) {
  const profile = localStorage.getItem('terra_profile');
  if (!profile) return <Navigate to="/onboarding" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route
        path="/*"
        element={
          <RequireProfile>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/voice" element={<VoiceAssistant />} />
                <Route path="/crop-doctor" element={<CropDoctor />} />
                <Route path="/schemes" element={<GovernmentSchemes />} />
                <Route path="/mandi" element={<MandiPrices />} />
                <Route path="/sell" element={<SellToGovt />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppLayout>
          </RequireProfile>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </LanguageProvider>
  );
}
