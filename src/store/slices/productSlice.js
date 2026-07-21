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

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await api.get(`/productos/${id}`)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchActiveProducts = createAsyncThunk(
  'products/fetchActive',
  async (_, { rejectWithValue }) => {
    try {
      return await api.get('/productos', { es_activo: true })
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

const MOCK_PRODUCTS = [
  { id: 1, titulo: 'Laptop Lenovo Ideapad 5', descripcion: 'Equipo ideal para clases y proyectos. 16GB RAM, 512GB SSD.', precio: 8500, categoria: 'Tecnologia', contacto_metodo: 'whatsapp', es_activo: true, es_premium: true, imagenes: [], created_at: '2026-06-01T10:00:00Z' },
  { id: 2, titulo: 'Mesa de estudio plegable', descripcion: 'Perfecta para departamento estudiantil. 120x60cm.', precio: 1200, categoria: 'Hogar', contacto_metodo: 'llamada', es_activo: true, es_premium: false, imagenes: [], created_at: '2026-05-15T14:30:00Z' },
  { id: 3, titulo: 'Calculadora científica Casio', descripcion: 'Modelo FX-991LAX. Ideal para ingenieria.', precio: 450, categoria: 'Escolar', contacto_metodo: 'correo', es_activo: true, es_premium: false, imagenes: [], created_at: '2026-04-20T09:00:00Z' },
  { id: 4, titulo: 'Audifonos inalambricos Sony', descripcion: 'Cancelacion de ruido. 30h de bateria.', precio: 680, categoria: 'Accesorios', contacto_metodo: 'whatsapp', es_activo: false, es_premium: false, imagenes: [], created_at: '2026-03-10T16:00:00Z' },
  { id: 5, titulo: 'Camiseta universitaria talla M', descripcion: 'Nueva con etiqueta. Color gris.', precio: 250, categoria: 'Ropa', contacto_metodo: 'chat', es_activo: true, es_premium: false, imagenes: [], created_at: '2026-06-05T11:00:00Z' },
  { id: 6, titulo: 'Libro Calculo Diferencial', descripcion: 'Autores: Stewart. 8va edicion. Como nuevo.', precio: 350, categoria: 'Libros', contacto_metodo: 'correo', es_activo: true, es_premium: true, imagenes: [], created_at: '2026-05-28T08:00:00Z' },
  { id: 7, titulo: 'Departamento cerca de UTV', descripcion: 'Renta de habitacion amueblada. Internet incluido.', precio: 3200, categoria: 'Espacios', contacto_metodo: 'llamada', es_activo: true, es_premium: false, imagenes: [], created_at: '2026-06-10T15:00:00Z' },
  { id: 8, titulo: 'Servicio de tutoria en matematicas', descripcion: 'Clases particulares de calculo, algebra y fisica.', precio: 150, categoria: 'Servicios', contacto_metodo: 'whatsapp', es_activo: true, es_premium: false, imagenes: [], created_at: '2026-06-12T12:00:00Z' },
]

const productSlice = createSlice({
  name: 'products',
  initialState: { items: MOCK_PRODUCTS, loading: false, error: null },
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
      .addCase(toggleProductActive.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id)
        if (idx !== -1) state.items[idx] = action.payload
      })
  },
})

export const { clearProductError } = productSlice.actions
export default productSlice.reducer
