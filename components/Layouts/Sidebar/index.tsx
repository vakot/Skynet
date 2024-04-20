import { LoginOutlined } from '@ant-design/icons'
import { useGetClientGuildsQuery, useGetClientQuery } from '@modules/api/client/client.api'
import { Tooltip } from 'antd'
import classNames from 'classnames'
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import styles from './style.module.scss'

const Sidebar: React.FC<any> = ({}) => {
  const { data: session } = useSession()
  const { data: client } = useGetClientQuery()
  const { data: guilds } = useGetClientGuildsQuery(session?.user?.name ?? '', {
    skip: !session?.user?.name,
  })

  return (
    <div className={styles.Sidebar}>
      <div className={styles.Profile}>
        {session ? (
          <Tooltip placement="right" title="Profile">
            <Image
              className={styles.Image}
              src={session?.user?.image ?? client?.defaultAvatarURL ?? ''}
              alt={session?.user?.name ?? 'user'}
              width={48}
              height={48}
            />
          </Tooltip>
        ) : (
          <Tooltip placement="right" title="Auth">
            <div onClick={() => signIn()} className={classNames(styles.Image, styles.Login)}>
              <LoginOutlined />
            </div>
          </Tooltip>
        )}
      </div>

      <div className={styles.Separator} />

      <ul className={styles.ServersList}>
        {guilds?.map((guild) => (
          <li key={guild.id}>
            <Tooltip placement="right" title={guild.name}>
              <Image
                className={styles.Image}
                src={guild.iconURL ?? client?.defaultAvatarURL ?? ''}
                alt={guild.name ?? 'guild'}
                width={48}
                height={48}
              />
            </Tooltip>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar
