import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'

import { clientApi } from '@api/client/client.api'

export const store = configureStore({
  reducer: {
    [clientApi.reducerPath]: clientApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(clientApi.middleware),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
