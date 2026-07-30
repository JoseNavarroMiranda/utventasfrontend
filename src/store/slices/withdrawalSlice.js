import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api'

export const fetchMyWithdrawals = createAsyncThunk(
  'withdrawals/fetchMine',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/vendedor/mis-retiros')
      return (res.data || []).map(normalizeWithdrawal)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const createWithdrawal = createAsyncThunk(
  'withdrawals/create',
  async ({ usuario, contrasena, pedido_id }, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/vendedor/solicitar-retiro', { usuario, contrasena, pedido_id })
      return normalizeWithdrawal(res.data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

function normalizeWithdrawal(data) {
  return {
    id: data.retiro_id ?? data.id,
    pedido_id: data.pedido_id,
    usuario_destino: data.usuario_destino,
    monto: data.monto_neto ?? data.monto,
    estado: data.estado,
    created_at: data.fecha_solicitud ?? data.created_at,
  }
}

const MOCK_WITHDRAWALS = [
  { id: 1, pedido_id: null, usuario_destino: 'vendedor1', monto: 2500, estado: 'processed_payout', created_at: '2026-05-15T10:00:00Z' },
  { id: 2, pedido_id: null, usuario_destino: 'vendedor1', monto: 1200, estado: 'processed_payout', created_at: '2026-04-20T14:30:00Z' },
  { id: 3, pedido_id: null, usuario_destino: 'vendedor1', monto: 800, estado: 'pending', created_at: '2026-06-10T09:00:00Z' },
  { id: 4, pedido_id: null, usuario_destino: 'vendedor1', monto: 3500, estado: 'processed_payout', created_at: '2026-03-05T16:00:00Z' },
  { id: 5, pedido_id: null, usuario_destino: 'vendedor1', monto: 1500, estado: 'pending', created_at: '2026-06-12T11:00:00Z' },
]

const withdrawalSlice = createSlice({
  name: 'withdrawals',
  initialState: { items: MOCK_WITHDRAWALS, balance: 4500, loading: false, error: null },
  reducers: {
    clearWithdrawalError(state) {
      state.error = null
    },
    addWithdrawal(state, action) {
      state.items.unshift(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyWithdrawals.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMyWithdrawals.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchMyWithdrawals.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createWithdrawal.pending, (state) => {
        state.error = null
      })
      .addCase(createWithdrawal.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(createWithdrawal.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { clearWithdrawalError, addWithdrawal } = withdrawalSlice.actions
export default withdrawalSlice.reducer
