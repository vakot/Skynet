import classNames from 'classnames'
import styles from './style.module.scss'

export interface ButtonProps {
  type?: 'primary' | 'secondary' | 'error'
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export const Button: React.FC<ButtonProps> = ({
  type = 'secondary',
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={classNames(
        styles.Button,
        {
          [styles.Secondary]: type === 'secondary',
          [styles.Primary]: type === 'primary',
          [styles.Error]: type === 'error',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
