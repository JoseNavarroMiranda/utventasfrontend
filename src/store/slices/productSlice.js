import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api'

function normalizeProducts(data) {
  if (!Array.isArray(data)) return []
  return data.map(normalizeProduct)
}

function normalizeProduct(data) {
  if (!data) return null
  return {
    ...data,
    id: data.producto_id ?? data.id,
    id_autor: data.usuario_id ?? data.id_autor,
    autor_nombre: data.Usuario?.nombre ?? data.autor_nombre,
    autor_correo: data.Usuario?.correo ?? data.autor_correo,
    autor_telefono: data.Usuario?.telefono_defecto ?? data.autor_telefono,
    created_at: data.fecha_publicacion ?? data.created_at,
    categoria: data.Categoria?.nombre ?? data.Categorium?.nombre ?? data.categoria,
    autor_verificado: data.Usuario?.verificado_como_vendedor ?? false,
    contacto_telefono: data.contacto_telefono,
    contacto_metodo: data.contacto_metodo,
    imagenes: Array.isArray(data.ProductoImagens) ? data.ProductoImagens.map((img) => img.url_imagen) : data.imagenes || [],
  }
}

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/vendedor/mis-publicaciones')
      return normalizeProducts(res.data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const createProduct = createAsyncThunk(
  'products/create',
  async (productData, { rejectWithValue }) => {
    try {
      return await api.post('/api/vendedor/crear', productData)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      return await api.put(`/api/vendedor/editar/${id}`, data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/vendedor/eliminar/${id}`)
      return id
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/productos/${id}`)
      return normalizeProduct(res.data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchActiveProducts = createAsyncThunk(
  'products/fetchActive',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/productos', { es_activo: true })
      return normalizeProducts(res.data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchOrderedProductIds = createAsyncThunk(
  'products/fetchOrderedIds',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/productos/en-proceso')
      return res.ids ?? []
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchPublicCategories = createAsyncThunk(
  'products/fetchPublicCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/productos/categorias')
      return (res.data || []).map((c) => c.nombre)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const promoteToPremium = createAsyncThunk(
  'products/promoteToPremium',
  async ({ id, orderId, dias, monto }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/vendedor/promover-premium/${id}`, { orderId, dias, monto })
      return { id, es_premium: res.data?.es_premium, premium_hasta: res.data?.premium_hasta }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const toggleProductActive = createAsyncThunk(
  'products/toggleActive',
  async ({ id, es_activo }, { rejectWithValue }) => {
    try {
      return await api.put(`/api/vendedor/editar/${id}`, { es_activo })
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const productSlice = createSlice({
  name: 'products',
  initialState: { items: [], orderedProductIds: [], categories: [], loading: false, error: null },
  reducers: {
    clearProductError(state) {
      state.error = null
    },
    markProductAsOrdered(state, action) {
      const id = action.payload
      if (!state.orderedProductIds.includes(id)) {
        state.orderedProductIds.push(id)
      }
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
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false
        const idx = state.items.findIndex((p) => p.id === action.payload.id)
        if (idx !== -1) state.items[idx] = action.payload
        else state.items.push(action.payload)
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchActiveProducts.fulfilled, (state, action) => {
        state.items = action.payload
      })
      .addCase(fetchOrderedProductIds.fulfilled, (state, action) => {
        state.orderedProductIds = action.payload
      })
      .addCase(fetchPublicCategories.fulfilled, (state, action) => {
        state.categories = action.payload
      })
      .addCase(toggleProductActive.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id)
        if (idx !== -1) state.items[idx] = action.payload
      })
      .addCase(promoteToPremium.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id)
        if (idx !== -1) {
          state.items[idx].es_premium = action.payload.es_premium
          state.items[idx].premium_hasta = action.payload.premium_hasta
        }
      })
  },
})

export const { clearProductError, markProductAsOrdered } = productSlice.actions
export default productSlice.reducer
