import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api'

const STATUS_MAP = {
  pendiente_pago: 'pending',
  pagado_escrow: 'paid_escrow',
  entregado_completado: 'delivered_completed',
  cancelado_reembolsado: 'cancelado_reembolsado',
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
    paypal_refund_id: item.paypal_refund_id ?? null,
    created_at: item.fecha_creacion ?? item.created_at,
  }
}

export const fetchSales = createAsyncThunk(
  'sales/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/vendedor/historial-ventas')
      return {
        items: (res.ventas ?? []).map(normalizeSale),
        totales: res.totales ?? null,
      }
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

const saleSlice = createSlice({
  name: 'sales',
  initialState: { items: [], totales: null, loading: false, error: null },
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
        state.items = action.payload.items
        state.totales = action.payload.totales
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
