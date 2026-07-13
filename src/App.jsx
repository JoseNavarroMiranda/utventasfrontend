import { Navigate, Route, Routes } from 'react-router'
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/ventas" element={<DashboardMain />} />

      <Route path="/vendedor" element={<SellerDashboard />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardOverview />} />
        <Route path="publicaciones" element={<ProductList />} />
        <Route path="publicaciones/nueva" element={<ProductForm />} />
        <Route path="publicaciones/:id/editar" element={<ProductForm />} />
        <Route path="publicaciones/:id/destacar" element={<PremiumSection />} />
        <Route path="ventas" element={<SalesList />} />
        <Route path="retiros" element={<WithdrawalPanel />} />
        <Route path="estadisticas" element={<StatisticsView />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
