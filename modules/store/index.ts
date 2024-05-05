import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'

import { actionApi } from '@modules/api/action/action.api'
import { clientApi } from '@modules/api/client/client.api'
import { guildApi } from '@modules/api/guild/guild.api'

export const store = configureStore({
  reducer: {
    [clientApi.reducerPath]: clientApi.reducer,
    [guildApi.reducerPath]: guildApi.reducer,
    [actionApi.reducerPath]: actionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(clientApi.middleware)
      .concat(guildApi.middleware)
      .concat(actionApi.middleware),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
