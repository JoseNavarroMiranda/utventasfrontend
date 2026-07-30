import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router'
import { fetchProfile } from './store/slices/authSlice'
import Login from './Components/Login/Login'
import DashboardMain from './Components/Layout/Dashboard/DashboardMain'
import SellerDashboard from './Components/Seller/SellerDashboard'
import DashboardOverview from './Components/Seller/DashboardOverview'
import ProductList from './Components/Seller/ProductList'
import ProductForm from './Components/Seller/ProductForm'
import PremiumSection from './Components/Seller/PremiumSection'
import SalesList from './Components/Seller/SalesList'
import WithdrawalPanel from './Components/Seller/WithdrawalPanel'
import StatisticsView from './Components/Seller/StatisticsView'
import AdminDashboard from './Components/Admin/AdminDashboard'
import AdminOverview from './Components/Admin/AdminOverview'
import UserModeration from './Components/Admin/UserModeration'
import ContentModeration from './Components/Admin/ContentModeration'
import DisputeResolution from './Components/Admin/DisputeResolution'
import PayoutManagement from './Components/Admin/PayoutManagement'
import AuditLogs from './Components/Admin/AuditLogs'
import CompradorDashboard from './Components/Comprador/CompradorDashboard'
import BuyerDashboardOverview from './Components/Comprador/DashboardOverview'
import PurchaseList from './Components/Comprador/PurchaseList'
import PurchaseDetail from './Components/Comprador/PurchaseDetail'
import DisputePanel from './Components/Comprador/DisputePanel'
import ProfileSettings from './Components/Shared/ProfileSettings'
import Home from './Components/Public/Home'
import Register from './Components/Public/Register'
import VerifyAccount from './Components/Public/VerifyAccount'
import ProductDetail from './Components/Public/ProductDetail'
import Privacy from './Components/Public/Privacy'
import Terms from './Components/Public/Terms'
import UpdatePrompt from './Components/PWA/UpdatePrompt'
import OfflineIndicator from './Components/PWA/OfflineIndicator'
import ProtectedRoute from './Components/Auth/ProtectedRoute'
import LoadingSpinner from './Components/Shared/LoadingSpinner'

function App() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const [restoring, setRestoring] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && !user) {
      dispatch(fetchProfile()).finally(() => setRestoring(false))
    } else {
      setRestoring(false)
    }
  }, [dispatch, user])

  if (restoring) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <>
      <OfflineIndicator />
      <UpdatePrompt />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/verificar" element={<VerifyAccount />} />
        <Route path="/productos/:id" element={<ProductDetail />} />
        <Route path="/privacidad" element={<Privacy />} />
        <Route path="/terminos" element={<Terms />} />
        <Route path="/ventas" element={<DashboardMain />} />

        <Route
          path="/comprador"
          element={
            <ProtectedRoute allowedRoles={['Comprador']}>
              <CompradorDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<BuyerDashboardOverview />} />
          <Route path="compras" element={<PurchaseList />} />
          <Route path="compras/:id" element={<PurchaseDetail />} />
          <Route path="disputas" element={<DisputePanel />} />
          <Route path="ajustes" element={<ProfileSettings />} />
        </Route>

        <Route
          path="/vendedor"
          element={
            <ProtectedRoute allowedRoles={['Vendedor']}>
              <SellerDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardOverview />} />
          <Route path="publicaciones" element={<ProductList />} />
          <Route path="publicaciones/nueva" element={<ProductForm />} />
          <Route path="publicaciones/:id/editar" element={<ProductForm />} />
          <Route path="publicaciones/:id/destacar" element={<PremiumSection />} />
          <Route path="ventas" element={<SalesList />} />
          <Route path="retiros" element={<WithdrawalPanel />} />
          <Route path="estadisticas" element={<StatisticsView />} />
          <Route path="ajustes" element={<ProfileSettings />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['Administrador']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminOverview />} />
          <Route path="usuarios" element={<UserModeration />} />
          <Route path="contenido" element={<ContentModeration />} />
          <Route path="disputas" element={<DisputeResolution />} />
          <Route path="pagos" element={<PayoutManagement />} />
          <Route path="logs" element={<AuditLogs />} />
          <Route path="ajustes" element={<ProfileSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}

export default App
