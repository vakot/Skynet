import Dashboard from '@components/Dashboard'
import Main from '@components/Layouts/Main'
import { RoutesBreadcrumb } from '@components/UI/RoutesBreadcrumb'
import { useGetGuildQuery, useGetGuildsQuery } from '@modules/api/guild/guild.api'
import { AppRoutes } from '@utils/routes'
import { Space } from 'antd'
import { Guild } from 'discord.js'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'

const DashboardGuildCommandsPage: React.FC<{ guild: Guild['id'] }> = ({ guild: guildId }) => {
  const { data: guilds, isLoading: isGuildsLoading } = useGetGuildsQuery()
  const { data: guild, isLoading: isGuildLoading } = useGetGuildQuery(guildId)

  return (
    <Main>
      <Space direction="vertical" style={{ width: '100%' }}>
        <RoutesBreadcrumb
          loading={isGuildLoading || isGuildsLoading}
          items={[
            { title: 'Dashboard', path: AppRoutes.DASHBOARD },
            {
              title: guild?.name,
              path: guildId,
              children: guilds
                ?.filter(({ id }) => id !== guildId)
                .map(({ name, id }) => ({
                  title: name,
                  path: id,
                })),
            },
            {
              title: 'Commands',
              path: 'commands',
              children: [
                { title: 'Actions', path: 'actions' },
                { title: 'Categories', path: 'categories' },
                { title: 'Embeds', path: 'embeds' },
                { title: 'Listeners', path: 'listeners' },
                { title: 'Messages', path: 'messages' },
                { title: 'Utilities', path: 'utilities' },
              ],
            },
          ]}
        />
        <Dashboard.Commands guild={guildId} />
      </Space>
    </Main>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return { redirect: { destination: AppRoutes.AUTH } }
  }

  return {
    props: context.params,
  }
}

export default DashboardGuildCommandsPage
