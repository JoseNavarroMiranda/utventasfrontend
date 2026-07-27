export const CATEGORIES = [
  'Tecnología',
  'Escolar',
  'Accesorios',
  'Ropa',
  'Libros',
  'Servicios',
  'Espacios',
]

export const CONTACT_METHODS = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'llamada', label: 'Llamada telefónica' },
  { value: 'correo', label: 'Correo electrónico' },
  { value: 'chat', label: 'Chat interno' },
]

export const ORDER_STATUS = {
  pending: { label: 'Pendiente', color: 'yellow' },
  paid_escrow: { label: 'Pagado (Escrow)', color: 'emerald' },
  delivered_completed: { label: 'Entregado', color: 'blue' },
  cancelled: { label: 'Cancelado', color: 'red' },
  en_disputa: { label: 'En Disputa', color: 'orange' },
  cancelado_reembolsado: { label: 'Reembolsado', color: 'purple' },
}

export const USER_ROLES = {
  1: { label: 'Admin', color: 'red' },
  2: { label: 'Vendedor', color: 'cyan' },
  3: { label: 'Comprador', color: 'blue' },
}

export const WITHDRAWAL_STATUS = {
  pending: { label: 'Pendiente', color: 'yellow' },
  processed_payout: { label: 'Transferido', color: 'emerald' },
  rejected: { label: 'Rechazado', color: 'red' },
}

export const ADMIN_NAV_ITEMS = [
  { path: '/admin/dashboard', label: 'Dashboard' },
  { path: '/admin/usuarios', label: 'Usuarios' },
  { path: '/admin/contenido', label: 'Contenido' },
  { path: '/admin/disputas', label: 'Disputas' },
  { path: '/admin/pagos', label: 'Pagos' },
  { path: '/admin/logs', label: 'Auditoria' },
]

export const COMPRADOR_NAV_ITEMS = [
  { path: '/comprador/dashboard', label: 'Inicio' },
  { path: '/comprador/compras', label: 'Mis Compras' },
  { path: '/comprador/disputas', label: 'Disputas' },
  { path: '/comprador/ajustes', label: 'Ajustes' },
]

export const NAV_ITEMS = [
  { path: '/vendedor/dashboard', label: 'Dashboard' },
  { path: '/vendedor/publicaciones', label: 'Mis Publicaciones' },
  { path: '/vendedor/publicaciones/nueva', label: 'Nueva Publicación' },
  { path: '/vendedor/ventas', label: 'Mis Ventas' },
  { path: '/vendedor/retiros', label: 'Retiros' },
  { path: '/vendedor/estadisticas', label: 'Estadisticas' },
]

export const API_BASE = import.meta.env.VITE_API_URL || ''
