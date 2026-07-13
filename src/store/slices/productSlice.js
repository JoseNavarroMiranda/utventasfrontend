import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api'

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await api.get('/productos/mis-publicaciones')
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const createProduct = createAsyncThunk(
  'products/create',
  async (productData, { rejectWithValue }) => {
    try {
      return await api.post('/productos', productData)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      return await api.put(`/productos/${id}`, data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/productos/${id}`)
      return id
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const toggleProductActive = createAsyncThunk(
  'products/toggleActive',
  async ({ id, es_activo }, { rejectWithValue }) => {
    try {
      return await api.patch(`/productos/${id}`, { es_activo })
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const productSlice = createSlice({
  name: 'products',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    clearProductError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id)
        if (idx !== -1) state.items[idx] = action.payload
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload)
      })
      .addCase(toggleProductActive.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id)
        if (idx !== -1) state.items[idx] = action.payload
      })
  },
})

export const { clearProductError } = productSlice.actions
export default productSlice.reducer
