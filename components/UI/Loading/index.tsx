import { Spin } from 'antd'
import classNames from 'classnames'
import styles from './style.module.scss'

export interface LoadingProps extends React.HTMLProps<HTMLDivElement> {
  loading?: boolean
}

export const Loading: React.FC<LoadingProps> = ({ loading, className, children, ...props }) => {
  return (
    <div className={classNames(styles.Loading, className)} {...props}>
      {loading ? <Spin className={styles.Spin} /> : children}
    </div>
  )
}
