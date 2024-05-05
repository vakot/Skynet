import { LoadingOutlined } from '@ant-design/icons'
import { Separator } from '@components/UI/Separator'
import { useGetClientGuildsQuery, useGetClientQuery } from '@modules/api/client/client.api'
import utils from '@utils/index'
import { Spin, Tooltip } from 'antd'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import styles from './style.module.scss'

const Sidebar: React.FC<any> = ({}) => {
  const router = useRouter()
  const { data: session } = useSession()
  const { data: client, isLoading: isClientLoading } = useGetClientQuery()
  const { data: guilds, isLoading: isGuildsLoading } = useGetClientGuildsQuery()

  return (
    <div className={styles.Sidebar}>
      {isClientLoading ? (
        <div className={styles.Container}>
          <Spin indicator={<LoadingOutlined />} />
        </div>
      ) : (
        <div className={styles.Container} onClick={() => router.push(utils.AppRoutes.PROFILE)}>
          <Tooltip align={{ offset: [24, 0] }} placement="right" title="Profile">
            <Image
              className={styles.Image}
              src={session?.user?.image ?? client?.defaultAvatarURL ?? ''}
              alt={session?.user?.name ?? 'user'}
              width={48}
              height={48}
            />
          </Tooltip>
        </div>
      )}

      <Separator />

      <ul className={styles.Guilds}>
        {isGuildsLoading || isClientLoading ? (
          <div className={styles.Container}>
            <Spin indicator={<LoadingOutlined />} />
          </div>
        ) : (
          guilds?.map((guild) => (
            <li
              key={guild.id}
              className={styles.Container}
              onClick={() => router.push([utils.AppRoutes.DASHBOARD, guild.id].join('/'))}
            >
              <Tooltip align={{ offset: [24, 0] }} placement="right" title={guild.name}>
                <Image
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
    </div>
  )
}

export default Sidebar
