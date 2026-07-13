export const CATEGORIES = [
  'Tecnología',
  'Hogar',
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
}

export const WITHDRAWAL_STATUS = {
  pending: { label: 'Pendiente', color: 'yellow' },
  processed_payout: { label: 'Transferido', color: 'emerald' },
  rejected: { label: 'Rechazado', color: 'red' },
}

export const NAV_ITEMS = [
  { path: '/vendedor/dashboard', label: 'Dashboard' },
  { path: '/vendedor/publicaciones', label: 'Mis Publicaciones' },
  { path: '/vendedor/publicaciones/nueva', label: 'Nueva Publicación' },
  { path: '/vendedor/ventas', label: 'Mis Ventas' },
  { path: '/vendedor/retiros', label: 'Retiros' },
  { path: '/vendedor/estadisticas', label: 'Estadisticas' },
]

export const API_BASE = import.meta.env.VITE_API_URL || ''
