import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'

import { categoryApi } from '@modules/api/action-category/action-category.api'
import { actionApi } from '@modules/api/action/action.api'
import { clientApi } from '@modules/api/client/client.api'
import { commandApi } from '@modules/api/command/command.api'
import { guildApi } from '@modules/api/guild/guild.api'
import { listenerApi } from '@modules/api/listener/listener.api'

export const store = configureStore({
  reducer: {
    [clientApi.reducerPath]: clientApi.reducer,
    [guildApi.reducerPath]: guildApi.reducer,
    [actionApi.reducerPath]: actionApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [commandApi.reducerPath]: commandApi.reducer,
    [listenerApi.reducerPath]: listenerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(clientApi.middleware)
      .concat(guildApi.middleware)
      .concat(actionApi.middleware)
      .concat(categoryApi.middleware)
      .concat(commandApi.middleware)
      .concat(listenerApi.middleware),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
