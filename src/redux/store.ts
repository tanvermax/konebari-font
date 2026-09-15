// store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { baseApi } from './baseApi';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './features/auth/auth.slice';

// ✅ Redux Persist imports
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage

// ✅ Persist config
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth'], // 👈 শুধু auth slice persist হবে
};

// ✅ Root reducer
const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
});

// ✅ Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Store
export const store = configureStore({
  
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 👈 Redux Persist এর action গুলো ignore করুন
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

// ✅ Persistor
export const persistor = persistStore(store);

setupListeners(store.dispatch);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;