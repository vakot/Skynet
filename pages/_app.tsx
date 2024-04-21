import '@styles/global.scss'
import '@styles/reset.scss'
import '@styles/variables.scss'

import { store } from '@store/index'
import { SessionProvider } from 'next-auth/react'
import { Provider as StoreProvider } from 'react-redux'

const App: React.FC<any> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <StoreProvider store={store}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </StoreProvider>
  )
}

export default App
