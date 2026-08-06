import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import RoleRedirect from './pages/RoleRedirect'
import NotFound from './pages/NotFound'

import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'

import CustomerLayout from './components/customer/CustomerLayout'
import Home from './pages/customer/Home'
import Destinations from './pages/customer/Destinations'
import DestinationDetail from './pages/customer/DestinationDetail'
import Planner from './pages/customer/Planner'
import PackageDetail from './pages/customer/PackageDetail'
import Bookings from './pages/customer/Bookings'
import Profile from './pages/customer/Profile'

import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/Dashboard'
import AdminBookings from './pages/admin/Bookings'
import Customers from './pages/admin/Customers'
import CustomerDetail from './pages/admin/CustomerDetail'
import AdminDestinations from './pages/admin/Destinations'
import AdminPackages from './pages/admin/Packages'
import ChatLogs from './pages/admin/ChatLogs'
import Enquiries from './pages/admin/Enquiries'
import Payments from './pages/admin/Payments'
import AdminReviews from './pages/admin/Reviews'
import Reports from './pages/admin/Reports'
import Settings from './pages/admin/Settings'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleRedirect />} />
      <Route path="/redirect" element={<RoleRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route
        path="/app"
        element={
          <ProtectedRoute requireRole="customer">
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="destinations" element={<Destinations />} />
        <Route path="destinations/:slug" element={<DestinationDetail />} />
        <Route path="planner" element={<Planner />} />
        <Route path="packages/:slug" element={<PackageDetail />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute requireRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="customers" element={<Customers />} />
        <Route path="customers/:id" element={<CustomerDetail />} />
        <Route path="destinations" element={<AdminDestinations />} />
        <Route path="packages" element={<AdminPackages />} />
        <Route path="chat-logs" element={<ChatLogs />} />
        <Route path="enquiries" element={<Enquiries />} />
        <Route path="payments" element={<Payments />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
