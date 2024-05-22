import { DownOutlined } from '@ant-design/icons'
import { Breadcrumb, BreadcrumbProps, Dropdown, Spin } from 'antd'
import classNames from 'classnames'
import Link from 'next/link'
import { useMemo } from 'react'
import styles from './style.module.scss'

export interface RoutesBreadcrumbItem {
  title?: string
  path: string | string[]
  children?: Omit<RoutesBreadcrumbItem, 'children'>[]
}

export interface RoutesBreadcrumbClearItem {
  title?: string
  path: string
  children?: Omit<RoutesBreadcrumbClearItem, 'children'>[]
}

export interface RoutesBreadcrumbProps extends Omit<BreadcrumbProps, 'items'> {
  loading?: boolean
  items?: RoutesBreadcrumbItem[]
}

export const RoutesBreadcrumb: React.FC<RoutesBreadcrumbProps> = ({
  loading,
  items,
  className,
  ...props
}) => {
  const routes = useMemo<RoutesBreadcrumbClearItem[]>(() => {
    return (
      items?.map((item) => ({
        ...item,
        path: typeof item.path === 'string' ? item.path : item.path.join('/'),
        children: item.children?.map((children) => ({
          ...children,
          path: typeof children.path === 'string' ? children.path : children.path.join('/'),
        })),
      })) || []
    )
  }, [items])

  return loading ? (
    <Spin />
  ) : (
    <Breadcrumb
      items={routes?.map((item) => ({
        title: item.children ? (
          <MultipleBreacrumbItem {...item} />
        ) : (
          <SingleBreacrumbItem {...item} />
        ),
      }))}
      className={classNames(className, styles.Breadcrumb)}
      {...props}
    />
  )
}

const SingleBreacrumbItem: React.FC<RoutesBreadcrumbClearItem> = (item) => {
  return (
    <Link href={item.path} className={styles.Item}>
      {item.title}
    </Link>
  )
}

const MultipleBreacrumbItem: React.FC<RoutesBreadcrumbClearItem> = (item) => {
  return (
    <Dropdown
      destroyPopupOnHide
      menu={{
        items:
          item.children?.map((children) => ({
            key: children.path,
            label: (
              <Link href={children.path} className={styles.Item}>
                {children.title}
              </Link>
            ),
          })) || [],
      }}
    >
      <Link href={item.path} className={styles.Item}>
        {item.title} <DownOutlined style={{ marginLeft: '0.5rem', fontSize: 12 }} />
      </Link>
    </Dropdown>
  )
}
