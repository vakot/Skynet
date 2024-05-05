import { IGuild } from '@bot/models/guild'
import { useMenu } from '@modules/hooks/useMenu'
import { AppRoutes } from '@utils/index'
import { Menu as AntdMenu } from 'antd'
import { useRouter } from 'next/router'
import styles from './style.module.scss'

export interface MenuProps {
  guild?: IGuild['_id']
}

const Menu: React.FC<MenuProps> = ({ guild: guildId }) => {
  const router = useRouter()
  const menu = useMenu(guildId)

  const handleSelect = ({ keyPath }: { keyPath: string[] }) => {
    router.replace(AppRoutes.DASHBOARD + '/' + guildId + '/' + keyPath?.reverse().join('/'))
  }

  return (
    <div className={styles.Menu}>
      <AntdMenu
        mode="inline"
        selectedKeys={[router.query.action as string]}
        onSelect={handleSelect}
        items={menu}
      />
    </div>
  )
}

export default Menu
