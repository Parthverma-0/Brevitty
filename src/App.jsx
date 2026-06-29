import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import HomePage from './pages/HomePage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import CommunityPage from './pages/CommunityPage.jsx'
import EventsPage from './pages/EventsPage.jsx'
import EventDetailPage from './pages/EventDetailPage.jsx'
import MentorsPage from './pages/MentorsPage.jsx'
import MentorProfilePage from './pages/MentorProfilePage.jsx'
import PartnersPage from './pages/PartnersPage.jsx'
import GrantsPage from './pages/GrantsPage.jsx'
import SpacePage from './pages/SpacePage.jsx'
import StartupJunctionPage from './pages/StartupJunctionPage.jsx'
import AdminPage from './pages/AdminPage.jsx'

export default function App() {
  // The admin dashboard is a standalone tool — no site nav/footer, and it's
  // intentionally not linked anywhere. Reach it only via the /admin URL.
  const isAdmin = useLocation().pathname.startsWith('/admin')

  return (
    <div className="relative min-h-screen bg-white">
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:slug" element={<EventDetailPage />} />
        <Route path="/mentors" element={<MentorsPage />} />
        <Route path="/mentors/:slug" element={<MentorProfilePage />} />
        <Route path="/partners" element={<PartnersPage />} />
        <Route path="/grants" element={<GrantsPage />} />
        <Route path="/space" element={<SpacePage />} />
        <Route path="/startup-junction" element={<StartupJunctionPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      {!isAdmin && <Footer />}
    </div>
  )
}
