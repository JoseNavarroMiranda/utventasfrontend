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

const MOCK_ORDERED_IDS = [2, 5, 8]

const MOCK_PRODUCTS = [
  { id: 1, titulo: 'Laptop Lenovo Ideapad 5', descripcion: 'Equipo ideal para clases y proyectos. 16GB RAM, 512GB SSD.', precio: 8500, categoria: 'Tecnologia', contacto_metodo: 'whatsapp', contacto_telefono: '+52 555 123 4567', autor_nombre: 'Carlos Mendoza', autor_correo: 'carlos@utv.edu.mx', es_activo: true, es_premium: true, imagenes: [], created_at: '2026-06-01T10:00:00Z' },
  { id: 2, titulo: 'Mesa de estudio plegable', descripcion: 'Perfecta para departamento estudiantil. 120x60cm.', precio: 1200, categoria: 'Hogar', contacto_metodo: 'llamada', contacto_telefono: '+52 555 234 5678', autor_nombre: 'Luis Torres', autor_correo: 'luis@utv.edu.mx', es_activo: true, es_premium: false, imagenes: [], created_at: '2026-05-15T14:30:00Z' },
  { id: 3, titulo: 'Calculadora científica Casio', descripcion: 'Modelo FX-991LAX. Ideal para ingenieria.', precio: 450, categoria: 'Escolar', contacto_metodo: 'correo', contacto_telefono: '+52 555 345 6789', autor_nombre: 'Ana Rivera', autor_correo: 'ana@utv.edu.mx', es_activo: true, es_premium: false, imagenes: [], created_at: '2026-04-20T09:00:00Z' },
  { id: 4, titulo: 'Audifonos inalambricos Sony', descripcion: 'Cancelacion de ruido. 30h de bateria.', precio: 680, categoria: 'Accesorios', contacto_metodo: 'whatsapp', contacto_telefono: '+52 555 456 7890', autor_nombre: 'María López', autor_correo: 'maria@utv.edu.mx', es_activo: false, es_premium: false, imagenes: [], created_at: '2026-03-10T16:00:00Z' },
  { id: 5, titulo: 'Camiseta universitaria talla M', descripcion: 'Nueva con etiqueta. Color gris.', precio: 250, categoria: 'Ropa', contacto_metodo: 'chat', contacto_telefono: '+52 555 567 8901', autor_nombre: 'Diana Torres', autor_correo: 'diana@utv.edu.mx', es_activo: true, es_premium: false, imagenes: [], created_at: '2026-06-05T11:00:00Z' },
  { id: 6, titulo: 'Libro Calculo Diferencial', descripcion: 'Autores: Stewart. 8va edicion. Como nuevo.', precio: 350, categoria: 'Libros', contacto_metodo: 'correo', contacto_telefono: '+52 555 678 9012', autor_nombre: 'Pedro Sánchez', autor_correo: 'pedro@utv.edu.mx', es_activo: true, es_premium: true, imagenes: [], created_at: '2026-05-28T08:00:00Z' },
  { id: 7, titulo: 'Departamento cerca de UTV', descripcion: 'Renta de habitacion amueblada. Internet incluido.', precio: 3200, categoria: 'Espacios', contacto_metodo: 'llamada', contacto_telefono: '+52 555 789 0123', autor_nombre: 'Roberto Díaz', autor_correo: 'roberto@utv.edu.mx', es_activo: true, es_premium: false, imagenes: [], created_at: '2026-06-10T15:00:00Z' },
  { id: 8, titulo: 'Servicio de tutoria en matematicas', descripcion: 'Clases particulares de calculo, algebra y fisica.', precio: 150, categoria: 'Servicios', contacto_metodo: 'whatsapp', contacto_telefono: '+52 555 890 1234', autor_nombre: 'Jorge Cruz', autor_correo: 'jorge@utv.edu.mx', es_activo: true, es_premium: false, imagenes: [], created_at: '2026-06-12T12:00:00Z' },
]

const productSlice = createSlice({
  name: 'products',
  initialState: { items: MOCK_PRODUCTS, orderedProductIds: MOCK_ORDERED_IDS, loading: false, error: null },
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
