import '@styles/global.css'
import '@styles/reset.css'
import '@styles/variables.css'

import { store } from '@store/index'
import { ConfigProvider } from 'antd'
import { SessionProvider } from 'next-auth/react'
import { Provider as StoreProvider } from 'react-redux'

const App: React.FC<any> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <StoreProvider store={store}>
      <SessionProvider session={session}>
        <ConfigProvider>
          <Component {...pageProps} />
        </ConfigProvider>
      </SessionProvider>
    </StoreProvider>
  )
}

export default App
