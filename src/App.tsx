import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import AchievementsPage from './pages/AchievementsPage';
import AchievementDetailsPage from './pages/AchievementDetailsPage';
import CertificatesPage from './pages/CertificatesPage';
import CertificateDetailsPage from './pages/CertificateDetailsPage';
import AdminPage from './pages/AdminPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/project/:id" element={<ProjectDetailsPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/achievement/:id" element={<AchievementDetailsPage />} />
        <Route path="/certificate/:id" element={<CertificateDetailsPage />} />
        <Route path="/blog" element={<Navigate to="/certificates" replace />} />
        <Route path="/blog/:id" element={<Navigate to="/certificates" replace />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/projects/admin" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
