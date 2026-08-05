import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api'

function normalizeSolicitud(item) {
  if (!item) return null
  const imagenes = Array.isArray(item.SolicitudRelanzamientoImagens)
    ? item.SolicitudRelanzamientoImagens.map((i) => i.url_imagen)
    : item.imagenes || []
  return {
    id: item.solicitud_id,
    descripcion: item.descripcion,
    estado: item.estado,
    resolucion_texto: item.resolucion_texto,
    fecha_solicitud: item.fecha_solicitud,
    fecha_revision: item.fecha_revision,
    imagenes,
  }
}

function normalizeSuspendedProduct(item) {
  const imagenes = Array.isArray(item.ProductoImagens)
    ? item.ProductoImagens.map((i) => i.url_imagen)
    : item.imagenes || []
  const solicitud = item.SolicitudRelanzamientos?.[0] || item.solicitud
  return {
    id: item.producto_id ?? item.id,
    titulo: item.titulo,
    descripcion: item.descripcion,
    precio: Number(item.precio ?? 0),
    categoria: item.Categoria?.nombre ?? item.categoria,
    es_activo: item.es_activo,
    suspendido: item.suspendido,
    imagenes,
    imagen: imagenes[0] || null,
    solicitud: normalizeSolicitud(solicitud),
  }
}

export const fetchSuspendedProducts = createAsyncThunk(
  'relaunch/fetchSuspended',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/vendedor/publicaciones-suspendidas')
      return (res.data ?? []).map(normalizeSuspendedProduct)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const submitRelaunchRequest = createAsyncThunk(
  'relaunch/submit',
  async ({ producto_id, descripcion, imagenes }, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/vendedor/solicitar-relanzamiento', {
        producto_id,
        descripcion,
        imagenes,
      })
      return { producto_id, solicitud: res.data?.data ?? null }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const uploadRelaunchImage = createAsyncThunk(
  'relaunch/uploadImage',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append('imagen', file)
      const res = await api.upload('/api/vendedor/subir-imagen', formData)
      return res.url
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const relaunchSlice = createSlice({
  name: 'relaunch',
  initialState: { products: [], loading: false, submitting: false, error: null },
  reducers: {
    clearRelaunchError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuspendedProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSuspendedProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
      })
      .addCase(fetchSuspendedProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(submitRelaunchRequest.pending, (state) => {
        state.submitting = true
        state.error = null
      })
      .addCase(submitRelaunchRequest.fulfilled, (state, action) => {
        state.submitting = false
        const idx = state.products.findIndex((p) => p.id === action.payload.producto_id)
        if (idx !== -1) {
          state.products[idx].solicitud = { ...(state.products[idx].solicitud || {}), estado: 'pendiente' }
        }
      })
      .addCase(submitRelaunchRequest.rejected, (state, action) => {
        state.submitting = false
        state.error = action.payload
      })
  },
})

export const { clearRelaunchError } = relaunchSlice.actions
export default relaunchSlice.reducer