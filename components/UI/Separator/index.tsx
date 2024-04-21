import classNames from 'classnames'
import styles from './style.module.scss'

export interface SeparatorProps {
  style?: React.CSSProperties
  className?: string
}

export const Separator: React.FC<SeparatorProps> = ({ style, className }) => {
  return <div style={style} className={classNames(styles.Separator, className)} />
}
