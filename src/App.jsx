import { Navigate, Route, Routes } from 'react-router'
import Login from './Components/Login/Login'
import DashboardMain from './Components/Layout/Dashboard/DashboardMain'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/ventas" element={<DashboardMain />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
