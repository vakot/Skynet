import classNames from 'classnames'
import { useRouter } from 'next/router'
import Menu from '../Menu'
import Sidebar from '../Sidebar'
import styles from './style.module.scss'

const Main: React.FC<any> = ({ children, className }) => {
  const router = useRouter()

  const guildId = router.query.id?.[0] as string

  return (
    <>
      <Sidebar />
      {guildId && <Menu guild={guildId} />}
      <main className={classNames(styles.Main, { [styles.MenuCollapsed]: !guildId }, className)}>
        {children}
      </main>
    </>
  )
}

export default Main
