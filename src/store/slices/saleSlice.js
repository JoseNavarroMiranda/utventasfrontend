import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api'

const STATUS_MAP = {
  pendiente_pago: 'pending',
  pagado_escrow: 'paid_escrow',
  entregado_completado: 'delivered_completed',
  cancelado_reembolsado: 'cancelled',
}

function normalizeSale(item) {
  return {
    id: item.pedido_id ?? item.id,
    producto: item.Producto
      ? { titulo: item.Producto.titulo, precio: item.Producto.precio, categoria: item.Producto.categoria }
      : item.producto,
    comprador: item.Comprador
      ? { nombre: item.Comprador.nombre, email: item.Comprador.correo }
      : item.comprador,
    monto: Number(item.precio_final ?? item.monto ?? 0),
    estado: STATUS_MAP[item.estado] || item.estado,
    token_entrega: item.token_entrega,
    created_at: item.fecha_creacion ?? item.created_at,
  }
}

export const fetchSales = createAsyncThunk(
  'sales/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/vendedor/historial-ventas')
      return (res.ventas ?? []).map(normalizeSale)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const validateToken = createAsyncThunk(
  'sales/validateToken',
  async ({ saleId, token_entrega }, { rejectWithValue }) => {
    try {
      const res = await api.put('/api/pedidos/entregar-con-pin', { pedido_id: saleId, token_entrega })
      return res.data || res
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

const MOCK_SALES = [
  { id: 1, producto: { titulo: 'Laptop Lenovo Ideapad 5' }, comprador: { nombre: 'Ana Garcia', email: 'ana@utv.edu.mx' }, monto: 8500, estado: 'delivered_completed', token_entrega: 'ABC123', created_at: subMonths(new Date(), 0) },
  { id: 2, producto: { titulo: 'Calculadora cientifica Casio' }, comprador: { nombre: 'Luis Martinez', email: 'luis@utv.edu.mx' }, monto: 450, estado: 'delivered_completed', token_entrega: 'DEF456', created_at: subMonths(new Date(), 1) },
  { id: 3, producto: { titulo: 'Mesa de estudio plegable' }, comprador: { nombre: 'Sofia Lopez', email: 'sofia@utv.edu.mx' }, monto: 1200, estado: 'paid_escrow', created_at: subMonths(new Date(), 0) },
  { id: 4, producto: { titulo: 'Audifonos inalambricos Sony' }, comprador: { nombre: 'Carlos Ruiz', email: 'carlos@utv.edu.mx' }, monto: 680, estado: 'pending', created_at: subMonths(new Date(), 0) },
  { id: 5, producto: { titulo: 'Laptop Lenovo Ideapad 5' }, comprador: { nombre: 'Maria Hernandez', email: 'maria@utv.edu.mx' }, monto: 8500, estado: 'delivered_completed', token_entrega: 'GHI789', created_at: subMonths(new Date(), 2) },
  { id: 6, producto: { titulo: 'Libro Calculo Diferencial' }, comprador: { nombre: 'Pedro Sanchez', email: 'pedro@utv.edu.mx' }, monto: 350, estado: 'delivered_completed', token_entrega: 'JKL012', created_at: subMonths(new Date(), 3) },
  { id: 7, producto: { titulo: 'Camiseta universitaria talla M' }, comprador: { nombre: 'Diana Torres', email: 'diana@utv.edu.mx' }, monto: 250, estado: 'paid_escrow', created_at: subMonths(new Date(), 0) },
  { id: 8, producto: { titulo: 'Departamento cerca de UTV' }, comprador: { nombre: 'Roberto Diaz', email: 'roberto@utv.edu.mx' }, monto: 3200, estado: 'cancelled', created_at: subMonths(new Date(), 4) },
  { id: 9, producto: { titulo: 'Laptop Lenovo Ideapad 5' }, comprador: { nombre: 'Laura Flores', email: 'laura@utv.edu.mx' }, monto: 8500, estado: 'delivered_completed', token_entrega: 'MNO345', created_at: subMonths(new Date(), 5) },
  { id: 10, producto: { titulo: 'Servicio de tutoria en matematicas' }, comprador: { nombre: 'Jorge Cruz', email: 'jorge@utv.edu.mx' }, monto: 150, estado: 'paid_escrow', created_at: subMonths(new Date(), 0) },
  { id: 11, producto: { titulo: 'Calculadora cientifica Casio' }, comprador: { nombre: 'Carmen Vega', email: 'carmen@utv.edu.mx' }, monto: 450, estado: 'delivered_completed', token_entrega: 'PQR678', created_at: subMonths(new Date(), 1) },
  { id: 12, producto: { titulo: 'Mesa de estudio plegable' }, comprador: { nombre: 'Miguel Angel', email: 'miguel@utv.edu.mx' }, monto: 1200, estado: 'pending', created_at: subMonths(new Date(), 2) },
]

const saleSlice = createSlice({
  name: 'sales',
  initialState: { items: MOCK_SALES, loading: false, error: null },
  reducers: {
    clearSaleError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        const { pedido_id, estado } = action.payload
        const idx = state.items.findIndex((s) => s.id === pedido_id)
        if (idx !== -1) state.items[idx].estado = STATUS_MAP[estado] || estado
      })
  },
})

export const { clearSaleError } = saleSlice.actions
export default saleSlice.reducer
