import { SkynetEvents } from '@bot/models/event'
import { Menu as AntdMenu } from 'antd'
import { Guild } from 'discord.js'
import { useRouter } from 'next/router'
import styles from './style.module.scss'

export interface MenuProps {
  guild?: Guild['id']
}

const Menu: React.FC<MenuProps> = ({ guild: guildId }) => {
  const router = useRouter()

  const items: { key: SkynetEvents; [key: string]: any }[] = [
    {
      key: SkynetEvents.CommandInteraction,
      label: 'Command Interaction',
      children: [
        {
          key: 'command-id-1',
          label: '/command-name-1',
        },
        {
          key: 'command-id-2',
          label: '/command-name-2',
        },
      ],
    },
    {
      key: SkynetEvents.MessageCreate,
      label: 'Message Create',
      children: [
        {
          key: 'action-id-1',
          label: 'message-action-name-or-id-1',
        },
        {
          key: 'action-id-2',
          label: 'message-action-name-or-id-2',
        },
      ],
    },
  ]

  return (
    <div className={styles.Menu}>
      <AntdMenu
        mode="inline"
        onSelect={({ keyPath }) => {
          console.log()
          router.push(guildId + '/' + keyPath.reverse().join('/'))
        }}
        items={items}
      />
    </div>
  )
}

export default Menu
