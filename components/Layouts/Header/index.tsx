import styles from './style.module.scss'

const Header: React.FC<any> = ({}) => {
  return (
    <header className={styles.Header}>
      <div className={styles.Container}>
        <div className={styles.Logo}>Skynet</div>
      </div>
    </header>
  )
}

export default Header
