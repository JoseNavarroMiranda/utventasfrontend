import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import productReducer from './slices/productSlice'
import saleReducer from './slices/saleSlice'
import withdrawalReducer from './slices/withdrawalSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    sales: saleReducer,
    withdrawals: withdrawalReducer,
  },
})
