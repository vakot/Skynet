import Header from 'components/Layouts/Header'
import Sidebar from 'components/Layouts/Sidebar'
import styles from './style.module.scss'

const Main: React.FC<any> = ({ children }) => {
  return (
    <>
      <Header />
      <Sidebar />
      <main className={styles.Main}>{children}</main>
    </>
  )
}

export default Main
