import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api'

export const fetchPurchases = createAsyncThunk(
  'buyer/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await api.get('/compras')
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchPurchaseDetail = createAsyncThunk(
  'buyer/fetchDetail',
  async (id, { rejectWithValue }) => {
    try {
      return await api.get(`/compras/${id}`)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const openDispute = createAsyncThunk(
  'buyer/openDispute',
  async ({ purchaseId, motivo, descripcion }, { rejectWithValue }) => {
    try {
      return await api.post(`/compras/${purchaseId}/disputa`, { motivo, descripcion })
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const updateProfile = createAsyncThunk(
  'buyer/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      return await api.put('/perfil', data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

function subMonths(date, months) {
  const d = new Date(date)
  d.setMonth(d.getMonth() - months)
  return d.toISOString()
}

const MOCK_PURCHASES = [
  { id: 1, producto: { titulo: 'Laptop Lenovo Ideapad 5', categoria: 'Tecnología', precio: 8500, imagen: null }, vendedor: { nombre: 'Carlos Mendoza', email: 'carlos@utv.edu.mx', telefono: '+52 555 123 4567' }, monto: 8500, estado: 'paid_escrow', token_entrega: 'ABC123XYZ', metodo_contacto: 'whatsapp', notas: 'Entregar en cafeteria', created_at: subMonths(new Date(), 0) },
  { id: 2, producto: { titulo: 'Calculadora científica Casio FX-991', categoria: 'Escolar', precio: 450, imagen: null }, vendedor: { nombre: 'Ana Rivera', email: 'ana@utv.edu.mx', telefono: '+52 555 234 5678' }, monto: 450, estado: 'paid_escrow', token_entrega: 'DEF456UVW', metodo_contacto: 'correo', notas: '', created_at: subMonths(new Date(), 0) },
  { id: 3, producto: { titulo: 'Mesa de estudio plegable', categoria: 'Hogar', precio: 1200, imagen: null }, vendedor: { nombre: 'Luis Torres', email: 'luis@utv.edu.mx', telefono: '+52 555 345 6789' }, monto: 1200, estado: 'delivered_completed', token_entrega: 'GHI789RST', metodo_contacto: 'whatsapp', notas: 'Mesa color blanca', created_at: subMonths(new Date(), 2) },
  { id: 4, producto: { titulo: 'Audífonos inalámbricos Sony WH-1000XM4', categoria: 'Tecnología', precio: 3200, imagen: null }, vendedor: { nombre: 'María López', email: 'maria@utv.edu.mx', telefono: '+52 555 456 7890' }, monto: 3200, estado: 'delivered_completed', token_entrega: 'JKL012MNO', metodo_contacto: 'chat', notas: '', created_at: subMonths(new Date(), 3) },
  { id: 5, producto: { titulo: 'Libro Cálculo Diferencial - Stewart', categoria: 'Libros', precio: 350, imagen: null }, vendedor: { nombre: 'Pedro Sánchez', email: 'pedro@utv.edu.mx', telefono: '+52 555 567 8901' }, monto: 350, estado: 'delivered_completed', token_entrega: 'PQR345STU', metodo_contacto: 'correo', notas: 'Séptima edición', created_at: subMonths(new Date(), 4) },
  { id: 6, producto: { titulo: 'Camiseta universitaria talla M', categoria: 'Ropa', precio: 250, imagen: null }, vendedor: { nombre: 'Diana Torres', email: 'diana@utv.edu.mx', telefono: '+52 555 678 9012' }, monto: 250, estado: 'en_disputa', metodo_contacto: 'whatsapp', notas: 'La talla no corresponde', created_at: subMonths(new Date(), 1) },
  { id: 7, producto: { titulo: 'Departamento cerca de UTV', categoria: 'Espacios', precio: 3200, imagen: null }, vendedor: { nombre: 'Roberto Díaz', email: 'roberto@utv.edu.mx', telefono: '+52 555 789 0123' }, monto: 3200, estado: 'cancelled', metodo_contacto: 'llamada', notas: '', created_at: subMonths(new Date(), 5) },
  { id: 8, producto: { titulo: 'Servicio de tutoría en matemáticas', categoria: 'Servicios', precio: 150, imagen: null }, vendedor: { nombre: 'Jorge Cruz', email: 'jorge@utv.edu.mx', telefono: '+52 555 890 1234' }, monto: 150, estado: 'paid_escrow', token_entrega: 'VWX678YZA', metodo_contacto: 'chat', notas: 'Sesiones virtuales', created_at: subMonths(new Date(), 0) },
  { id: 9, producto: { titulo: 'Laptop HP Pavilion 15', categoria: 'Tecnología', precio: 9500, imagen: null }, vendedor: { nombre: 'Laura Flores', email: 'laura@utv.edu.mx', telefono: '+52 555 901 2345' }, monto: 9500, estado: 'delivered_completed', token_entrega: 'BCD901EFG', metodo_contacto: 'whatsapp', notas: 'Con cargador incluido', created_at: subMonths(new Date(), 1) },
  { id: 10, producto: { titulo: 'Pack de libretas universitarias', categoria: 'Escolar', precio: 180, imagen: null }, vendedor: { nombre: 'Carmen Vega', email: 'carmen@utv.edu.mx', telefono: '+52 555 012 3456' }, monto: 180, estado: 'pending', metodo_contacto: 'correo', notas: '5 libretas', created_at: subMonths(new Date(), 0) },
  { id: 11, producto: { titulo: 'Teclado mecánico RGB', categoria: 'Accesorios', precio: 680, imagen: null }, vendedor: { nombre: 'Miguel Ángel', email: 'miguel@utv.edu.mx', telefono: '+52 555 123 4567' }, monto: 680, estado: 'paid_escrow', token_entrega: 'HIJ234KLM', metodo_contacto: 'whatsapp', notas: 'Switch azul', created_at: subMonths(new Date(), 0) },
  { id: 12, producto: { titulo: 'Monitor 24 pulgadas', categoria: 'Tecnología', precio: 2200, imagen: null }, vendedor: { nombre: 'Sofía López', email: 'sofia@utv.edu.mx', telefono: '+52 555 234 5678' }, monto: 2200, estado: 'cancelado_reembolsado', metodo_contacto: 'correo', notas: 'Reembolso procesado', created_at: subMonths(new Date(), 6) },
]

const buyerSlice = createSlice({
  name: 'buyer',
  initialState: { purchases: MOCK_PURCHASES, currentPurchase: null, loading: false, error: null },
  reducers: {
    clearBuyerError(state) {
      state.error = null
    },
    clearCurrentPurchase(state) {
      state.currentPurchase = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchases.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPurchases.fulfilled, (state, action) => {
        state.loading = false
        state.purchases = action.payload
      })
      .addCase(fetchPurchases.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchPurchaseDetail.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPurchaseDetail.fulfilled, (state, action) => {
        state.loading = false
        state.currentPurchase = action.payload
      })
      .addCase(fetchPurchaseDetail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(openDispute.fulfilled, (state, action) => {
        const idx = state.purchases.findIndex((p) => p.id === action.payload.id)
        if (idx !== -1) state.purchases[idx] = action.payload
        if (state.currentPurchase?.id === action.payload.id) {
          state.currentPurchase = action.payload
        }
      })
  },
})

export const { clearBuyerError, clearCurrentPurchase } = buyerSlice.actions
export default buyerSlice.reducer
