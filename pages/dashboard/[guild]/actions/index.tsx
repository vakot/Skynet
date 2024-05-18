import Dashboard from '@components/Dashboard'
import Main from '@components/Layouts/Main'
import { RoutesBreadcrumb } from '@components/UI/RoutesBreadcrumb'
import { useGetGuildQuery } from '@modules/api/guild/guild.api'
import { AppRoutes } from '@utils/routes'
import { Space } from 'antd'
import { Guild } from 'discord.js'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'

const DashboardGuildActionsPage: React.FC<{ guild: Guild['id'] }> = ({ guild: guildId }) => {
  const { data: guild, isLoading: isGuildLoading } = useGetGuildQuery(guildId)

  return (
    <Main>
      <Space direction="vertical" style={{ width: '100%' }}>
        <RoutesBreadcrumb
          loading={isGuildLoading}
          items={[
            { title: 'Dashboard', path: AppRoutes.DASHBOARD },
            { title: guild?.name, path: guildId },
            {
              title: 'Actions',
              path: 'actions',
              children: [
                { title: 'Categories', path: 'categories' },
                { title: 'Commands', path: 'commands' },
                { title: 'Embeds', path: 'embeds' },
                { title: 'Listeners', path: 'listeners' },
                { title: 'Messages', path: 'messages' },
              ],
            },
          ]}
        />
        <Dashboard.Actions guild={guildId} />
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

export default DashboardGuildActionsPage
