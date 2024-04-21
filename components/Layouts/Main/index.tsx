import classNames from 'classnames'
import Sidebar from 'components/Layouts/Sidebar'
import styles from './style.module.scss'

const Main: React.FC<any> = ({ children, className }) => {
  return (
    <>
      <Sidebar />
      <main className={classNames(styles.Main, className)}>{children}</main>
    </>
  )
}

export default Main
