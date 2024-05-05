import { IGuild } from '@bot/models/guild'

export interface GuildProps {
  guild?: IGuild['_id']
}

const Guild: React.FC<GuildProps> = ({ guild: guildId }) => {
  return <h2>Guild {guildId} Overview</h2>
}

export default Guild
