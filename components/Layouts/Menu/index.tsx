import {
  BugFilled,
  BuildFilled,
  CarFilled,
  CodeFilled,
  DatabaseFilled,
  EyeFilled,
  GroupOutlined,
  LinkOutlined,
  SendOutlined,
  UndoOutlined,
} from '@ant-design/icons'
import { Loading } from '@components/UI/Loading'
import { useGetGuildQuery } from '@modules/api/guild/guild.api'
import { AppRoutes } from '@utils/routes'
import { Menu as AntdMenu, Layout } from 'antd'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import styles from './style.module.scss'

const Menu: React.FC<{ className?: string }> = ({ className }) => {
  const router = useRouter()

  const { guild: guildId = '' } = router.query as {
    guild: string
  }

  const { data: guild, isLoading: isGuildLoading } = useGetGuildQuery(guildId, { skip: !guildId })

  return (
    <Layout.Sider className={classNames(styles.Menu, className)}>
      <Loading loading={isGuildLoading}>
        <AntdMenu
          theme="dark"
          mode="inline"
          selectedKeys={router.asPath.split('/')}
          items={[
            {
              type: 'group',
              label: 'Overview',
              children: [
                {
                  key: 'actions',
                  icon: <CarFilled />,
                  label: 'Actions',
                  onClick: () => router.push(AppRoutes.ACTIONS),
                },
                {
                  key: 'categories',
                  icon: <GroupOutlined />,
                  label: 'Categories',
                  onClick: () => router.push(AppRoutes.CATEGORIES),
                },
                ...(!!guildId && !!guild?.id
                  ? [
                      {
                        key: 'history',
                        icon: <UndoOutlined />,
                        label: 'History',
                        onClick: () =>
                          router.push([AppRoutes.DASHBOARD, guildId, 'history'].join('/')),
                      },
                      {
                        key: 'storage',
                        icon: <DatabaseFilled />,
                        label: 'Storage',
                        onClick: () =>
                          router.push([AppRoutes.DASHBOARD, guildId, 'storage'].join('/')),
                      },
                      {
                        key: 'listeners',
                        icon: <EyeFilled />,
                        label: 'Listeners',
                        onClick: () =>
                          router.push([AppRoutes.DASHBOARD, guildId, 'listeners'].join('/')),
                      },
                      {
                        key: 'commands',
                        icon: <CodeFilled />,
                        label: 'Commands',
                        onClick: () =>
                          router.push([AppRoutes.DASHBOARD, guildId, 'commands'].join('/')),
                      },
                    ]
                  : []),
              ],
            },
            {
              type: 'group',
              label: 'Plugins',
              children: [
                {
                  key: 'plugins',
                  icon: <BugFilled />,
                  label: 'Skynet',
                  onClick: () => router.push(AppRoutes.COMMANDS),
                },
                {
                  key: 'plugins/messages',
                  icon: <SendOutlined />,
                  label: 'Send Message',
                  onClick: () => router.push(AppRoutes.MESSAGES),
                },
                {
                  key: 'plugins/embeds',
                  icon: <BuildFilled />,
                  label: 'Embed Builder',
                  onClick: () => router.push(AppRoutes.EMBEDS),
                },
              ],
            },
            {
              type: 'group',
              label: 'Resources',
              children: [
                {
                  key: 'documentation',
                  icon: <LinkOutlined />,
                  label: 'Documentation',
                  onClick: () => {},
                },
                {
                  key: 'support-server',
                  icon: <LinkOutlined />,
                  label: 'Support Server',
                  onClick: () => {},
                },
              ],
            },
          ]}
        />
      </Loading>
    </Layout.Sider>
  )
}

export default Menu
