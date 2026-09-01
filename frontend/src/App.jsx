import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import useAuthStore from './stores/authStore'

// Customer Pages
import HomePage from './pages/HomePage'
import ExplorePage from './pages/ExplorePage'
import CourtDetailPage from './pages/CourtDetailPage'
import CheckoutPage from './pages/CheckoutPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'

// Admin Business Portal Pages
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminBookings from './pages/admin/AdminBookings'
import AdminSchedule from './pages/admin/AdminSchedule'
import AdminCourts from './pages/admin/AdminCourts'
import AdminCustomers from './pages/admin/AdminCustomers'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AdminStaff from './pages/admin/AdminStaff'
import AdminSettings from './pages/admin/AdminSettings'
import AdminNotifications from './pages/admin/AdminNotifications'
import AdminReviews from './pages/admin/AdminReviews'

function App() {
  const { fetchProfile } = useAuthStore()

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return (
    <Routes>
      {/* ── Customer Layout & Public/Customer Routes ── */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/courts/:id" element={<CourtDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Customer Routes */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ── Admin Management Portal (Protected with adminOnly) ── */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="schedule" element={<AdminSchedule />} />
        <Route path="courts" element={<AdminCourts />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="staff" element={<AdminStaff />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="reviews" element={<AdminReviews />} />
      </Route>
    </Routes>
  )
}

export default App
