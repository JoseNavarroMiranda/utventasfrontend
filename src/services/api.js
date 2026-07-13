import { API_BASE } from '../constants'

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token')
  const isFormData = options.body instanceof FormData

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...options.headers,
  }

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message || `Error ${res.status}`)
  }

  if (res.status === 204) return null
  return res.json()
}

export const api = {
  get: (url, params) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request(`${url}${qs}`)
  },
  post: (url, data) => request(url, { method: 'POST', body: JSON.stringify(data) }),
  put: (url, data) => request(url, { method: 'PUT', body: JSON.stringify(data) }),
  patch: (url, data) => request(url, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (url) => request(url, { method: 'DELETE' }),
  upload: (url, formData) => request(url, { method: 'POST', body: formData }),
}
