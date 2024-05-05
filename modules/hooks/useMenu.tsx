import { PlusCircleOutlined } from '@ant-design/icons'
import { SkynetEvents } from '@bot/models/event'
import { IGuild } from '@bot/models/guild'
import { useGetGuildByIdQuery } from '@modules/api/guild/guild.api'

export interface MenuItem {
  key: SkynetEvents | string
  label: React.ReactNode
  children?: MenuItem[]
}

export const useMenu = (guildId?: string): any[] => {
  const { data: guild } = useGetGuildByIdQuery(guildId)

  if (!guild) {
    return []
  }

  return [CommandInteractions(guild)]
    .filter((item) => item)
    .map((menuItem) => ({
      ...menuItem,
      children: [...menuItem.children, AddButtonItem],
    }))
}

const CommandInteractions = (guild: IGuild): MenuItem & { children: MenuItem[] } => {
  return {
    key: SkynetEvents.CommandInteraction,
    label: 'Command Interaction',
    children: Object.keys(guild[SkynetEvents.CommandInteraction]).map((actionId) => ({
      key: actionId,
      label: guild[SkynetEvents.CommandInteraction][actionId].name,
    })),
  }
}

const AddButtonItem = {
  key: 'add',
  label: (
    <>
      <PlusCircleOutlined style={{ marginRight: 4 }} />
      Add
    </>
  ),
}
