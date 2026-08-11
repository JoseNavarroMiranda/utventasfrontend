import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api'

const STATUS_MAP = {
  pendiente_pago: 'pending',
  pagado_escrow: 'paid_escrow',
  entregado_completado: 'delivered_completed',
  cancelado_reembolsado: 'cancelado_reembolsado',
}

function normalizeCompra(item) {
  return {
    id: item.pedido_id ?? item.id,
    producto: item.Producto
      ? {
          titulo: item.Producto.titulo,
          precio: item.Producto.precio,
          categoria: item.Producto.Categoria?.nombre ?? item.Producto.categoria,
        }
      : item.producto,
    vendedor: item.Vendedor
      ? { nombre: item.Vendedor.nombre, email: item.Vendedor.correo, telefono: item.Vendedor.telefono_defecto }
      : item.vendedor,
    monto: Number(item.precio_final ?? item.monto ?? 0),
    estado: STATUS_MAP[item.estado] || item.estado,
    token_entrega: item.token_entrega,
    paypal_order_id: item.paypal_order_id,
    paypal_capture_id: item.paypal_capture_id,
    paypal_refund_id: item.paypal_refund_id ?? null,
    created_at: item.fecha_creacion ?? item.created_at,
    metodo_contacto: item.Producto?.contacto_metodo ?? item.metodo_contacto,
    notas: item.notas,
  }
}

export const fetchPurchases = createAsyncThunk(
  'buyer/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/comprador/mis-compras')
      return (res.compras ?? []).map(normalizeCompra)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchPurchaseDetail = createAsyncThunk(
  'buyer/fetchDetail',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/comprador/mis-compras/${id}`)
      return normalizeCompra(res.compra)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const openDispute = createAsyncThunk(
  'buyer/openDispute',
  async ({ purchaseId, motivo, descripcion, imagenes }, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/comprador/disputas', {
        pedido_id: purchaseId,
        motivo,
        descripcion,
        imagenes,
      })
      return { ...res.disputa, id: res.disputa.disputa_id }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const updateProfile = createAsyncThunk(
  'buyer/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      return await api.put('/api/sesiones/actualizar-perfil', data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const buyerSlice = createSlice({
  name: 'buyer',
  initialState: { purchases: [], currentPurchase: null, loading: false, error: null },
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
        const idx = state.purchases.findIndex((p) => p.id === action.meta.arg.purchaseId)
        if (idx !== -1) state.purchases[idx].estado = 'en_disputa'
        if (state.currentPurchase?.id === action.meta.arg.purchaseId) {
          state.currentPurchase.estado = 'en_disputa'
        }
      })
  },
})

export const { clearBuyerError, clearCurrentPurchase } = buyerSlice.actions
export default buyerSlice.reducer
