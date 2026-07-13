import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api'

export const fetchSales = createAsyncThunk(
  'sales/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await api.get('/ventas')
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const validateToken = createAsyncThunk(
  'sales/validateToken',
  async ({ saleId, token_entrega }, { rejectWithValue }) => {
    try {
      return await api.post(`/ventas/${saleId}/validar-token`, { token_entrega })
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const saleSlice = createSlice({
  name: 'sales',
  initialState: { items: [], loading: false, error: null },
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
        const idx = state.items.findIndex((s) => s.id === action.payload.id)
        if (idx !== -1) state.items[idx] = action.payload
      })
  },
})

export const { clearSaleError } = saleSlice.actions
export default saleSlice.reducer
