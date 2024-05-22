import Menu from '@components/Layouts/Menu'
import Sidebar from '@components/Layouts/Sidebar'
import { Layout } from 'antd'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import styles from './style.module.scss'

const Main: React.FC<{
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}> = ({ children, className, style }) => {
  const router = useRouter()

  const { guild: guildId = '' } = router.query as { guild: string | undefined }

  return (
    <Layout className={styles.Main}>
      <Sidebar className={styles.Sidebar} />
      <Menu className={styles.Menu} />
      <Layout.Content style={style} className={classNames(styles.Content, className)}>
        {children}
      </Layout.Content>
    </Layout>
  )
}

export default Main
