import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api'

export const fetchAdminMetrics = createAsyncThunk(
  'admin/fetchMetrics',
  async (_, { rejectWithValue }) => {
    try {
      return await api.get('/admin/metricas')
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const suspendUser = createAsyncThunk(
  'admin/suspendUser',
  async ({ id, suspendido }, { rejectWithValue }) => {
    try {
      return await api.patch(`/admin/usuarios/${id}`, { suspendido })
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const verifyUser = createAsyncThunk(
  'admin/verifyUser',
  async ({ id, verificado }, { rejectWithValue }) => {
    try {
      return await api.patch(`/admin/usuarios/${id}`, { verificado })
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async ({ id, rol_id }, { rejectWithValue }) => {
    try {
      return await api.patch(`/admin/usuarios/${id}`, { rol_id })
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const resolveDispute = createAsyncThunk(
  'admin/resolveDispute',
  async ({ id, estado, notas_auditoria }, { rejectWithValue }) => {
    try {
      return await api.post(`/admin/disputas/${id}/resolver`, { estado, notas_auditoria })
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const approveWithdrawal = createAsyncThunk(
  'admin/approveWithdrawal',
  async ({ id, paypal_payout_batch_id }, { rejectWithValue }) => {
    try {
      return await api.post(`/admin/retiros/${id}/aprobar`, { paypal_payout_batch_id })
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const MOCK_USERS = [
  { id: 1, nombre: 'Admin UTJ', email: 'admin@utj.edu.mx', rol_id: 1, verificado: true, suspendido: false, created_at: '2025-01-01T00:00:00Z' },
  { id: 2, nombre: 'Jose Navarro', email: 'jose.navarro@utv.edu.mx', rol_id: 2, verificado: true, suspendido: false, created_at: '2026-01-15T10:00:00Z' },
  { id: 3, nombre: 'Ana Garcia', email: 'ana.garcia@utv.edu.mx', rol_id: 2, verificado: true, suspendido: false, created_at: '2026-02-10T14:00:00Z' },
  { id: 4, nombre: 'Luis Martinez', email: 'luis.martinez@utv.edu.mx', rol_id: 3, verificado: true, suspendido: false, created_at: '2026-02-20T09:00:00Z' },
  { id: 5, nombre: 'Sofia Lopez', email: 'sofia.lopez@utv.edu.mx', rol_id: 3, verificado: true, suspendido: true, created_at: '2026-03-05T11:00:00Z' },
  { id: 6, nombre: 'Carlos Ruiz', email: 'carlos.ruiz@utv.edu.mx', rol_id: 2, verificado: false, suspendido: false, created_at: '2026-03-15T16:00:00Z' },
  { id: 7, nombre: 'Maria Hernandez', email: 'maria.hernandez@utv.edu.mx', rol_id: 3, verificado: true, suspendido: false, created_at: '2026-04-01T08:00:00Z' },
  { id: 8, nombre: 'Pedro Sanchez', email: 'pedro.sanchez@utv.edu.mx', rol_id: 2, verificado: true, suspendido: false, created_at: '2026-04-10T12:00:00Z' },
  { id: 9, nombre: 'Diana Torres', email: 'diana.torres@utv.edu.mx', rol_id: 3, verificado: false, suspendido: false, created_at: '2026-04-20T15:00:00Z' },
  { id: 10, nombre: 'Roberto Diaz', email: 'roberto.diaz@utv.edu.mx', rol_id: 2, verificado: true, suspendido: true, created_at: '2026-05-01T10:00:00Z' },
  { id: 11, nombre: 'Laura Flores', email: 'laura.flores@utv.edu.mx', rol_id: 3, verificado: true, suspendido: false, created_at: '2026-05-10T13:00:00Z' },
  { id: 12, nombre: 'Jorge Cruz', email: 'jorge.cruz@utv.edu.mx', rol_id: 2, verificado: true, suspendido: false, created_at: '2026-05-20T09:00:00Z' },
  { id: 13, nombre: 'Carmen Vega', email: 'carmen.vega@utv.edu.mx', rol_id: 3, verificado: true, suspendido: false, created_at: '2026-06-01T11:00:00Z' },
  { id: 14, nombre: 'Miguel Angel', email: 'miguel.angel@utv.edu.mx', rol_id: 3, verificado: false, suspendido: false, created_at: '2026-06-05T14:00:00Z' },
]

const MOCK_DISPUTES = [
  {
    id: 1, pedido_id: 101, producto: { titulo: 'Laptop Lenovo Ideapad 5' },
    comprador: { nombre: 'Ana Garcia', email: 'ana@utv.edu.mx' },
    vendedor: { nombre: 'Jose Navarro', email: 'jose@utv.edu.mx' },
    monto: 8500, estado: 'en_disputa', created_at: '2026-06-10T10:00:00Z',
    historico: [
      { fecha: '2026-06-01T10:00:00Z', accion: 'Pedido creado', usuario: 'Sistema' },
      { fecha: '2026-06-02T14:00:00Z', accion: 'Pago recibido en Escrow', usuario: 'Sistema' },
      { fecha: '2026-06-10T10:00:00Z', accion: 'Comprador abrio disputa: producto no coincide con descripcion', usuario: 'Ana Garcia', notas: 'La laptop tiene un golpe en la esquina que no se mencionaba en la publicacion' },
    ],
  },
  {
    id: 2, pedido_id: 102, producto: { titulo: 'Calculadora cientifica Casio' },
    comprador: { nombre: 'Luis Martinez', email: 'luis@utv.edu.mx' },
    vendedor: { nombre: 'Pedro Sanchez', email: 'pedro@utv.edu.mx' },
    monto: 450, estado: 'en_disputa', created_at: '2026-06-12T15:00:00Z',
    historico: [
      { fecha: '2026-06-08T09:00:00Z', accion: 'Pedido creado', usuario: 'Sistema' },
      { fecha: '2026-06-08T12:00:00Z', accion: 'Pago recibido en Escrow', usuario: 'Sistema' },
      { fecha: '2026-06-12T15:00:00Z', accion: 'Comprador abrio disputa: no recibio el producto', usuario: 'Luis Martinez', notas: 'Ya pasaron 4 dias y el vendedor no ha entregado' },
    ],
  },
  {
    id: 3, pedido_id: 103, producto: { titulo: 'Mesa de estudio plegable' },
    comprador: { nombre: 'Sofia Lopez', email: 'sofia@utv.edu.mx' },
    vendedor: { nombre: 'Maria Hernandez', email: 'maria@utv.edu.mx' },
    monto: 1200, estado: 'en_disputa', created_at: '2026-06-14T11:00:00Z',
    historico: [
      { fecha: '2026-06-10T16:00:00Z', accion: 'Pedido creado', usuario: 'Sistema' },
      { fecha: '2026-06-10T17:00:00Z', accion: 'Pago recibido en Escrow', usuario: 'Sistema' },
      { fecha: '2026-06-12T10:00:00Z', accion: 'Vendedor marco como entregado', usuario: 'Maria Hernandez' },
      { fecha: '2026-06-14T11:00:00Z', accion: 'Comprador abrio disputa: token de entrega invalido', usuario: 'Sofia Lopez', notas: 'El codigo que me dio el vendedor no funciona en el sistema' },
    ],
  },
]

const MOCK_AUDIT_LOGS = [
  { id: 1, fecha: '2026-06-15T09:00:00Z', usuario: 'Admin UTJ', accion: 'Usuario suspendido', detalle: 'Se suspendio a Sofia Lopez por reporte de fraude', pedido_id: null },
  { id: 2, fecha: '2026-06-14T11:30:00Z', usuario: 'Sofia Lopez', accion: 'Disputa abierta', detalle: 'Disputa #103 - Token de entrega invalido para Mesa de estudio', pedido_id: 103 },
  { id: 3, fecha: '2026-06-12T15:15:00Z', usuario: 'Luis Martinez', accion: 'Disputa abierta', detalle: 'Disputa #102 - Producto no recibido: Calculadora Casio', pedido_id: 102 },
  { id: 4, fecha: '2026-06-10T10:05:00Z', usuario: 'Ana Garcia', accion: 'Disputa abierta', detalle: 'Disputa #101 - Producto danado: Laptop Lenovo', pedido_id: 101 },
  { id: 5, fecha: '2026-06-09T14:00:00Z', usuario: 'Admin UTJ', accion: 'Pago autorizado', detalle: 'Retiro #3 aprobado por $800 MXN a jose.navarro@paypal.com', pedido_id: null },
  { id: 6, fecha: '2026-06-08T12:00:00Z', usuario: 'Sistema', accion: 'Pago recibido', detalle: 'Pago de $450 MXN recibido en Escrow para pedido #102', pedido_id: 102 },
  { id: 7, fecha: '2026-06-07T10:00:00Z', usuario: 'Admin UTJ', accion: 'Usuario verificado', detalle: 'Se verifico manualmente a Carlos Ruiz', pedido_id: null },
  { id: 8, fecha: '2026-06-05T16:00:00Z', usuario: 'Admin UTJ', accion: 'Producto eliminado', detalle: 'Se elimino publicacion "Audifonos genericos" por contenido inapropiado', pedido_id: null },
  { id: 9, fecha: '2026-06-04T09:00:00Z', usuario: 'Sistema', accion: 'Pago liberado', detalle: 'Fondos de $8,500 MXN liberados al vendedor para pedido #98', pedido_id: 98 },
  { id: 10, fecha: '2026-06-03T11:00:00Z', usuario: 'Admin UTJ', accion: 'Rol actualizado', detalle: 'Se cambio rol de Jorge Cruz a Vendedor', pedido_id: null },
  { id: 11, fecha: '2026-06-02T14:00:00Z', usuario: 'Sistema', accion: 'Pago recibido', detalle: 'Pago de $8,500 MXN recibido en Escrow para pedido #101', pedido_id: 101 },
  { id: 12, fecha: '2026-06-01T10:00:00Z', usuario: 'Sistema', accion: 'Pedido creado', detalle: 'Pedido #101 creado por Ana Garcia: Laptop Lenovo Ideapad', pedido_id: 101 },
  { id: 13, fecha: '2026-05-28T15:00:00Z', usuario: 'Admin UTJ', accion: 'Categoria creada', detalle: 'Se agrego categoria "Espacios" al catalogo', pedido_id: null },
  { id: 14, fecha: '2026-05-20T10:00:00Z', usuario: 'Sistema', accion: 'Pago procesado', detalle: 'Payout batch #BATCH-12345 procesado: $3,500 MXN a jose.navarro@paypal.com', pedido_id: null },
  { id: 15, fecha: '2026-05-15T09:00:00Z', usuario: 'Admin UTJ', accion: 'Disputa resuelta', detalle: 'Disputa #95 resuelta - Entregado completado. Fondos liberados al vendedor', pedido_id: 95 },
]

const MOCK_PENDING_PAYOUTS = [
  { id: 3, correo_paypal_destino: 'jose.navarro@paypal.com', monto: 800, estado: 'pending', vendedor: 'Jose Navarro', created_at: '2026-06-08T10:00:00Z' },
  { id: 5, correo_paypal_destino: 'ana.garcia@paypal.com', monto: 2500, estado: 'pending', vendedor: 'Ana Garcia', created_at: '2026-06-12T14:00:00Z' },
  { id: 6, correo_paypal_destino: 'pedro.sanchez@paypal.com', monto: 1200, estado: 'pending', vendedor: 'Pedro Sanchez', created_at: '2026-06-14T09:00:00Z' },
  { id: 7, correo_paypal_destino: 'jorge.cruz@paypal.com', monto: 3500, estado: 'pending', vendedor: 'Jorge Cruz', created_at: '2026-06-15T11:00:00Z' },
]

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: MOCK_USERS,
    disputes: MOCK_DISPUTES,
    auditLogs: MOCK_AUDIT_LOGS,
    pendingPayouts: MOCK_PENDING_PAYOUTS,
    metrics: {
      total_usuarios: 14,
      usuarios_verificados: 10,
      transacciones_dia: 8,
      dinero_escrow: 3400,
      disputas_activas: 3,
    },
    loading: false,
    error: null,
  },
  reducers: {
    clearAdminError(state) { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(suspendUser.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u.id === action.payload.id)
        if (idx !== -1) state.users[idx] = action.payload
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u.id === action.payload.id)
        if (idx !== -1) state.users[idx] = action.payload
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u.id === action.payload.id)
        if (idx !== -1) state.users[idx] = action.payload
      })
      .addCase(resolveDispute.fulfilled, (state, action) => {
        const idx = state.disputes.findIndex((d) => d.id === action.payload.id)
        if (idx !== -1) state.disputes[idx] = action.payload
      })
      .addCase(approveWithdrawal.fulfilled, (state, action) => {
        state.pendingPayouts = state.pendingPayouts.filter((p) => p.id !== action.payload.id)
      })
  },
})

export const { clearAdminError } = adminSlice.actions
export default adminSlice.reducer
