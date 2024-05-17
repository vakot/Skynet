import { CompassOutlined, PlusOutlined } from '@ant-design/icons'
import { useGetClientQuery } from '@modules/api/client/client.api'
import { useGetGuildsQuery } from '@modules/api/guild/guild.api'
import { AppRoutes } from '@utils/routes'
import { Spin, Tooltip } from 'antd'
import classNames from 'classnames'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import styles from './style.module.scss'

const Sidebar: React.FC<any> = ({}) => {
  const router = useRouter()

  const guildId = router.query.guild as string

  const { data: session } = useSession()
  const { data: client, isLoading: isClientLoading } = useGetClientQuery()
  const { data: guilds, isLoading: isGuildsLoading } = useGetGuildsQuery()

  return (
    <div className={styles.Sidebar}>
      <div className={styles.Container}>
        {isClientLoading ? (
          <Spin />
        ) : (
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
        )}
      </div>

      <div className={styles.Separator} />

      <ul className={styles.Guilds}>
        {isGuildsLoading ? (
          <Spin />
        ) : (
          guilds?.map((guild) => (
            <li
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
            </li>
          ))
        )}
      </ul>

      <div className={styles.Separator} />

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
    </div>
  )
}

export default Sidebar
