import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

const ROLE_HOME = {
  Administrador: '/admin/dashboard',
  Vendedor: '/vendedor/dashboard',
  Comprador: '/comprador/dashboard',
}

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useSelector((s) => s.auth)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to={ROLE_HOME[user.rol] || '/'} replace />
  }

  return children
}

export default ProtectedRoute
