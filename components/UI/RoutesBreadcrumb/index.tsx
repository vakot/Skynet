import { DownOutlined } from '@ant-design/icons'
import { Breadcrumb, BreadcrumbProps, Dropdown, Spin } from 'antd'
import classNames from 'classnames'
import Link from 'next/link'
import { useMemo } from 'react'
import styles from './style.module.scss'

export interface RoutesBreadcrumbItem {
  title?: string
  path: string
  children?: Omit<RoutesBreadcrumbItem, 'children'>[]
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
  const routes = useMemo<RoutesBreadcrumbItem[]>(() => {
    if (!items) {
      return []
    }

    return items.reduce<RoutesBreadcrumbItem[]>((acc, current, index) => {
      if (index === 0) {
        acc.push({ ...current })
      } else {
        const prevPath = acc[index - 1].path
        // const nextPath = items[index + 1]

        acc.push({
          ...current,
          path: `${prevPath}/${current.path}`,
          children: current.children?.map((children) => ({
            ...children,
            path: `${prevPath}/${children.path}`,
          })),
        })
      }
      return acc
    }, [])
  }, [items])

  return loading ? (
    <Spin />
  ) : (
    <Breadcrumb
      items={routes.map((item) => ({
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

const SingleBreacrumbItem: React.FC<RoutesBreadcrumbItem> = (item) => {
  return (
    <Link href={item.path} className={styles.Item}>
      {item.title}
    </Link>
  )
}

const MultipleBreacrumbItem: React.FC<RoutesBreadcrumbItem> = (item) => {
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
