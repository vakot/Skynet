import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'

import { actionApi } from '@modules/api/action/action.api'
import { categoryApi } from '@modules/api/category/category.api'
import { clientApi } from '@modules/api/client/client.api'
import { commandApi } from '@modules/api/command/command.api'
import { embedApi } from '@modules/api/embed/embed.api'
import { guildApi } from '@modules/api/guild/guild.api'
import { listenerApi } from '@modules/api/listener/listener.api'
import { messageComponentApi } from '@modules/api/message/component/component.api'
import { messageApi } from '@modules/api/message/message.api'
import { permissionApi } from '@modules/api/permission/permission.api'

export const store = configureStore({
  reducer: {
    [actionApi.reducerPath]: actionApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [clientApi.reducerPath]: clientApi.reducer,
    [commandApi.reducerPath]: commandApi.reducer,
    [messageComponentApi.reducerPath]: messageComponentApi.reducer,
    [embedApi.reducerPath]: embedApi.reducer,
    [guildApi.reducerPath]: guildApi.reducer,
    [listenerApi.reducerPath]: listenerApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
    [permissionApi.reducerPath]: permissionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(actionApi.middleware)
      .concat(categoryApi.middleware)
      .concat(clientApi.middleware)
      .concat(commandApi.middleware)
      .concat(messageComponentApi.middleware)
      .concat(embedApi.middleware)
      .concat(guildApi.middleware)
      .concat(listenerApi.middleware)
      .concat(messageApi.middleware)
      .concat(permissionApi.middleware),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
