import Sidebar from '@components/Layouts/Sidebar'
import { Layout } from 'antd'
import classNames from 'classnames'
import styles from './style.module.scss'

const Main: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <Layout className={classNames(styles.Main, className)}>
      <Sidebar />

      <Layout style={{ padding: 16 }}>
        <Layout.Content>
          {/* <div
            style={{
              padding: 32,
              minHeight: 'calc(100vh - 32px)',
              background: 'white',
              borderRadius: 16,
            }}
          >
            {children}
          </div> */}
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  )
}

export default Main
