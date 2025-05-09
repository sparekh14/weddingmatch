// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/Home';
import MatchResultsPage from './pages/MatchResults';
import VendorDashboardPage from './pages/VendorDashboard';
import VendorQuotesPage from './pages/VendorQuotesPage';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Landing/onboarding form */}
        <Route path="/" element={<HomePage />} />

        {/* After submit, show your matches */}
        <Route path="/matches" element={<MatchResultsPage />} />

        {/* Vendor portal */}
        <Route path="/vendor" element={<VendorDashboardPage />} />

        {/* Vendor quotes */}
        <Route path="/vendor/quotes" element={<VendorQuotesPage />} />

        {/* Catch-all: redirect unknown URLs back to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
