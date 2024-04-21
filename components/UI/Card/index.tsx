import classNames from 'classnames'
import styles from './style.module.scss'

export interface CardProps {
  style?: React.CSSProperties
  className?: string
  children?: React.ReactNode
}

export const Card: React.FC<CardProps> = ({ style, className, children }) => {
  return (
    <div style={style} className={classNames(styles.Card, className)}>
      {children}
    </div>
  )
}
