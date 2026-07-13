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

const withdrawalSlice = createSlice({
  name: 'withdrawals',
  initialState: { items: [], balance: 0, loading: false, error: null },
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
