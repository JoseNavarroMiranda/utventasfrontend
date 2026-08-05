import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api'

export const fetchAdminMetrics = createAsyncThunk(
  'admin/fetchMetrics',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/admin/kpis-ventas')
      return {
        ingresos_confirmados: res.kpis?.ingresos_confirmados ?? 0,
        fondos_en_escrow: res.kpis?.fondos_en_escrow ?? 0,
        pedidos_completados: res.kpis?.pedidos_completados ?? 0,
        ticket_promedio: res.kpis?.ticket_promedio ?? 0,
        total_usuarios: res.kpis?.total_usuarios ?? 0,
        usuarios_verificados: res.kpis?.usuarios_verificados ?? 0,
        disputas_activas: res.kpis?.disputas_activas ?? 0,
        productos_publicados: res.kpis?.productos_publicados ?? 0,
        desglose_estados: res.desglose_estados ?? {},
        top_productos: res.top_productos ?? [],
      }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/admin/usuarios')
      return (res.data || []).map((u) => ({
        id: u.usuario_id,
        nombre: u.nombre,
        email: u.correo,
        rol_id: u.Rol?.rol_id ?? u.rol_id ?? 3,
        verificado: u.es_verificado ?? false,
        suspendido: u.es_activo === false,
        created_at: u.fecha_registro,
      }))
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchDisputes = createAsyncThunk(
  'admin/fetchDisputes',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/admin/disputas')
      return (res.data || []).map((d) => {
        const prod = d.Pedido?.Producto
        const imagenes = prod?.ProductoImagens || []
        const imagenPrincipal = imagenes.find((i) => i.es_principal) || imagenes[0]
        return {
          id: d.disputa_id ?? d.id,
          pedido_id: d.pedido_id,
          producto: prod
            ? {
                titulo: prod.titulo,
                descripcion: prod.descripcion,
                precio: Number(prod.precio ?? 0),
                categoria: prod.Categoria?.nombre ?? prod.categoria ?? null,
                imagen: imagenPrincipal?.url_imagen ?? null,
                es_activo: prod.es_activo,
                fecha_publicacion: prod.fecha_publicacion,
              }
            : (d.producto || { titulo: '—' }),
        comprador: d.Comprador ? { nombre: d.Comprador.nombre, email: d.Comprador.correo } : (d.comprador || { nombre: '—' }),
        vendedor: d.Vendedor ? { nombre: d.Vendedor.nombre, email: d.Vendedor.correo } : (d.vendedor || { nombre: '—' }),
        monto: d.monto ?? d.Pedido?.precio_final ?? 0,
        estado: d.estado,
        motivo: d.motivo ?? '',
        descripcion: d.descripcion ?? '',
        evidencias: (d.DisputaImagens || []).map((img) => img.url_imagen),
        fecha_apertura: d.fecha_apertura ?? null,
        created_at: d.fecha_creacion ?? d.fecha_apertura ?? d.created_at,
        historico: d.Pedido?.HistoricoPedidos?.map((h) => ({
          fecha: h.fecha_cambio,
          accion: h.accion ?? `Cambio a '${h.estado_nuevo}'`,
          usuario: h.UsuarioAccion?.nombre || h.usuario_accion_id || 'Sistema',
          notas: h.detalle || h.notes_auditoria,
        })) || d.historico || [],
        }
      })
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchAuditLogs = createAsyncThunk(
  'admin/fetchAuditLogs',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/admin/auditoria-pedidos')
      return (res.data?.data || res.data || []).map((l) => ({
        id: l.historico_id ?? l.id,
        fecha: l.fecha_cambio ?? l.fecha,
        usuario: l.UsuarioAccion?.nombre ?? l.usuario ?? 'Sistema',
        usuario_correo: l.UsuarioAccion?.correo ?? '',
        accion: l.accion ?? '',
        detalle: l.detalle ?? '',
        pedido_id: l.pedido_id,
        estado_anterior: l.estado_anterior,
        estado_nuevo: l.estado_nuevo,
        notas: l.notes_auditoria ?? l.notas_auditoria ?? '',
        producto: l.Pedido?.Producto
          ? {
              titulo: l.Pedido.Producto.titulo,
              precio: l.Pedido.Producto.precio,
              es_activo: l.Pedido.Producto.es_activo,
              suspendido: l.Pedido.Producto.suspendido,
            }
          : null,
        pedido_estado: l.Pedido?.estado ?? null,
        pedido_monto: l.Pedido?.precio_final ?? null,
      }))
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchCategories = createAsyncThunk(
  'admin/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/admin/categorias')
      return (res.data || []).map((c) => ({
        id: c.categoria_id,
        nombre: c.nombre,
      }))
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const createCategory = createAsyncThunk(
  'admin/createCategory',
  async (nombre, { rejectWithValue }) => {
    try {
      return await api.post('/api/admin/categorias', { nombre })
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const updateCategory = createAsyncThunk(
  'admin/updateCategory',
  async ({ id, nombre }, { rejectWithValue }) => {
    try {
      return await api.put(`/api/admin/categorias/${id}`, { nombre })
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const deleteCategory = createAsyncThunk(
  'admin/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/admin/categorias/${id}`)
      return id
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchPendingPayouts = createAsyncThunk(
  'admin/fetchPendingPayouts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/admin/retiros/pendientes')
      return (res.data || []).map((p) => ({
        id: p.retiro_id ?? p.id,
        vendedor: p.Vendedor?.nombre ?? p.vendedor ?? '—',
        correo_paypal_destino: p.correo_paypal_destino,
        monto: p.monto ?? 0,
        estado: p.estado,
        created_at: p.fecha_solicitud ?? p.created_at,
      }))
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const suspendUser = createAsyncThunk(
  'admin/suspendUser',
  async ({ id, suspendido }, { rejectWithValue }) => {
    try {
      return await api.put(`/api/admin/usuarios/${id}/estatus`, { es_activo: !suspendido })
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const verifyUser = createAsyncThunk(
  'admin/verifyUser',
  async ({ id, verificado }, { rejectWithValue }) => {
    try {
      return await api.put(`/api/admin/usuarios/${id}/estatus`, { es_activo: verificado })
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async ({ id, rol_id }, { rejectWithValue }) => {
    try {
      return await api.put(`/api/admin/usuarios/${id}/estatus`, { rol_id })
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const resolveDispute = createAsyncThunk(
  'admin/resolveDispute',
  async ({ id, estado, notas_auditoria }, { rejectWithValue }) => {
    try {
      return await api.put(`/api/admin/disputas/${id}/resolver`, { veredicto: estado, resolucion_texto: notas_auditoria })
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const approveWithdrawal = createAsyncThunk(
  'admin/approveWithdrawal',
  async ({ id, paypal_payout_batch_id }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/admin/retiros/${id}/aprobar`, { paypal_payout_batch_id })
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchRelaunchRequests = createAsyncThunk(
  'admin/fetchRelaunchRequests',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/admin/relanzamientos')
      return (res.data || []).map((r) => {
        const prod = r.Producto
        const prodImagenes = prod?.ProductoImagens || []
        const principal = prodImagenes.find((i) => i.es_principal) || prodImagenes[0]
        return {
          id: r.solicitud_id,
          producto_id: r.producto_id,
          descripcion: r.descripcion,
          estado: r.estado,
          resolucion_texto: r.resolucion_texto,
          fecha_solicitud: r.fecha_solicitud,
          fecha_revision: r.fecha_revision,
          producto: prod
            ? {
                titulo: prod.titulo,
                descripcion: prod.descripcion,
                precio: Number(prod.precio ?? 0),
                categoria: prod.Categoria?.nombre ?? null,
                es_activo: prod.es_activo,
                suspendido: prod.suspendido,
                fecha_publicacion: prod.fecha_publicacion,
                imagen: principal?.url_imagen ?? null,
              }
            : { titulo: '—' },
          vendedor: r.Vendedor
            ? { nombre: r.Vendedor.nombre, email: r.Vendedor.correo }
            : { nombre: '—' },
          imagenes: (r.SolicitudRelanzamientoImagens || []).map((i) => i.url_imagen),
        }
      })
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const reviewRelaunchRequest = createAsyncThunk(
  'admin/reviewRelaunchRequest',
  async ({ id, aprobada, resolucion_texto }, { rejectWithValue }) => {
    try {
      return await api.put(`/api/admin/relanzamientos/${id}/revisar`, { aprobada, resolucion_texto })
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    disputes: [],
    auditLogs: [],
    pendingPayouts: [],
    categories: [],
    relaunchRequests: [],
    metrics: {
      ingresos_confirmados: 0,
      fondos_en_escrow: 0,
      pedidos_completados: 0,
      ticket_promedio: 0,
      total_usuarios: 0,
      usuarios_verificados: 0,
      disputas_activas: 0,
      productos_publicados: 0,
      desglose_estados: {},
      top_productos: [],
    },
    loading: false,
    error: null,
  },
  reducers: {
    clearAdminError(state) { state.error = null },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null }
    const rejected = (state, action) => { state.loading = false; state.error = action.payload }

    builder
      .addCase(fetchAdminMetrics.pending, pending)
      .addCase(fetchAdminMetrics.fulfilled, (state, action) => {
        state.loading = false
        state.metrics = action.payload
      })
      .addCase(fetchAdminMetrics.rejected, rejected)

      .addCase(fetchUsers.pending, pending)
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, rejected)

      .addCase(fetchDisputes.pending, pending)
      .addCase(fetchDisputes.fulfilled, (state, action) => {
        state.loading = false
        state.disputes = action.payload
      })
      .addCase(fetchDisputes.rejected, rejected)

      .addCase(fetchAuditLogs.pending, pending)
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false
        state.auditLogs = action.payload
      })
      .addCase(fetchAuditLogs.rejected, rejected)

      .addCase(fetchCategories.pending, pending)
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, rejected)

      .addCase(fetchPendingPayouts.pending, pending)
      .addCase(fetchPendingPayouts.fulfilled, (state, action) => {
        state.loading = false
        state.pendingPayouts = action.payload
      })
      .addCase(fetchPendingPayouts.rejected, rejected)

      .addCase(suspendUser.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u.id === action.payload.id)
        if (idx !== -1) state.users[idx] = { ...state.users[idx], suspendido: !state.users[idx].suspendido }
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u.id === action.payload.id)
        if (idx !== -1) state.users[idx] = { ...state.users[idx], verificado: !state.users[idx].verificado }
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u.id === action.payload.id)
        if (idx !== -1) state.users[idx] = { ...state.users[idx], rol_id: action.payload.rol_id }
      })
      .addCase(resolveDispute.fulfilled, (state, action) => {
        state.disputes = state.disputes.filter((d) => d.id !== action.meta.arg.id)
      })
      .addCase(approveWithdrawal.fulfilled, (state, action) => {
        state.pendingPayouts = state.pendingPayouts.filter((p) => p.id !== action.meta.arg.id)
      })

      .addCase(fetchRelaunchRequests.pending, pending)
      .addCase(fetchRelaunchRequests.fulfilled, (state, action) => {
        state.loading = false
        state.relaunchRequests = action.payload
      })
      .addCase(fetchRelaunchRequests.rejected, rejected)
      .addCase(reviewRelaunchRequest.fulfilled, (state, action) => {
        state.relaunchRequests = state.relaunchRequests.filter((r) => r.id !== action.meta.arg.id)
      })
  },
})

export const { clearAdminError } = adminSlice.actions
export default adminSlice.reducer
