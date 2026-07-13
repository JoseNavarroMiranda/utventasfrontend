import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api'

export const fetchWithdrawals = createAsyncThunk(
  'withdrawals/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await api.get('/retiros')
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const requestWithdrawal = createAsyncThunk(
  'withdrawals/request',
  async (data, { rejectWithValue }) => {
    try {
      return await api.post('/retiros', data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const MOCK_WITHDRAWALS = [
  { id: 1, correo_paypal_destino: 'jose.navarro@paypal.com', monto: 2500, estado: 'processed_payout', created_at: '2026-05-15T10:00:00Z' },
  { id: 2, correo_paypal_destino: 'jose.navarro@paypal.com', monto: 1200, estado: 'processed_payout', created_at: '2026-04-20T14:30:00Z' },
  { id: 3, correo_paypal_destino: 'jose.navarro@paypal.com', monto: 800, estado: 'pending', created_at: '2026-06-10T09:00:00Z' },
  { id: 4, correo_paypal_destino: 'jose.navarro@paypal.com', monto: 3500, estado: 'processed_payout', created_at: '2026-03-05T16:00:00Z' },
  { id: 5, correo_paypal_destino: 'jose.navarro@paypal.com', monto: 1500, estado: 'pending', created_at: '2026-06-12T11:00:00Z' },
]

const withdrawalSlice = createSlice({
  name: 'withdrawals',
  initialState: { items: MOCK_WITHDRAWALS, balance: 4500, loading: false, error: null },
  reducers: {
    clearWithdrawalError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWithdrawals.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWithdrawals.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items || action.payload
        state.balance = action.payload.saldo_disponible || 0
      })
      .addCase(fetchWithdrawals.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(requestWithdrawal.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
        state.balance -= action.payload.monto || 0
      })
  },
})

export const { clearWithdrawalError } = withdrawalSlice.actions
export default withdrawalSlice.reducer
