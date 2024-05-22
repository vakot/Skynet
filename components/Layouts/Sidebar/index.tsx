import { CompassOutlined, PlusOutlined } from '@ant-design/icons'
import { Loading } from '@components/UI/Loading'
import { useGetClientQuery } from '@modules/api/client/client.api'
import { useGetGuildsQuery } from '@modules/api/guild/guild.api'
import { AppRoutes } from '@utils/routes'
import { Layout, Space, Tooltip } from 'antd'
import classNames from 'classnames'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import styles from './style.module.scss'

const Sidebar: React.FC<{ className?: string }> = ({ className }) => {
  const router = useRouter()

  const { guild: guildId = '' } = router.query as { guild: string | undefined }

  const { data: session } = useSession()
  const { data: client, isLoading: isClientLoading } = useGetClientQuery()
  const { data: guilds, isLoading: isGuildsLoading } = useGetGuildsQuery()

  return (
    <Layout.Sider className={classNames(styles.Sidebar, className)} collapsed>
      <Space direction="vertical">
        <Loading loading={isClientLoading} style={{ minHeight: 48 }}>
          <div className={styles.Container}>
            <Tooltip align={{ offset: [24, 0] }} placement="right" title="Profile">
              <Image
                onClick={() => router.push(AppRoutes.PROFILE)}
                className={classNames(styles.Image, styles.Active)}
                src={session?.user?.image ?? client?.defaultAvatarURL ?? ''}
                alt={session?.user?.name ?? 'user'}
                width={48}
                height={48}
              />
            </Tooltip>
          </div>
        </Loading>

        <div className={styles.Divider} />

        <Loading loading={isGuildsLoading} style={{ minHeight: 48 }}>
          <Space direction="vertical">
            {guilds?.map((guild) => (
              <div
                key={guild.id}
                className={classNames(styles.Container, { [styles.Active]: guildId === guild.id })}
              >
                <Tooltip align={{ offset: [24, 0] }} placement="right" title={guild.name}>
                  <Image
                    onClick={() => router.push([AppRoutes.DASHBOARD, guild.id].join('/'))}
                    className={styles.Image}
                    src={guild.iconURL ?? client?.defaultAvatarURL ?? ''}
                    alt={guild.name ?? 'guild'}
                    width={48}
                    height={48}
                  />
                </Tooltip>
              </div>
            ))}
          </Space>
        </Loading>

        <div className={styles.Divider} />

        <Tooltip align={{ offset: [24, 0] }} placement="right" title="Invite to your server">
          <div className={classNames(styles.Container, styles.Image)}>
            <PlusOutlined />
          </div>
        </Tooltip>

        <Tooltip align={{ offset: [24, 0] }} placement="right" title="Explore Discoverable Actions">
          <div className={classNames(styles.Container, styles.Image)}>
            <CompassOutlined />
          </div>
        </Tooltip>
      </Space>
    </Layout.Sider>
  )
}

export default Sidebar
