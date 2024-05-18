import { BugOutlined, FolderOpenOutlined } from '@ant-design/icons'
import Main from '@components/Layouts/Main'
import { RoutesBreadcrumb } from '@components/UI/RoutesBreadcrumb'
import { useGetGuildQuery, useGetGuildsQuery } from '@modules/api/guild/guild.api'
import { AppRoutes } from '@utils/routes'
import { Button, Card, Flex, Space } from 'antd'
import { Guild } from 'discord.js'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { useRouter } from 'next/router'
import { authOptions } from 'pages/api/auth/[...nextauth]'

const DashboardGuildPage: React.FC<{ guild: Guild['id'] }> = ({ guild: guildId }) => {
  const { data: guilds, isLoading: isGuildsLoading } = useGetGuildsQuery()
  const { data: guild, isLoading: isGuildLoading } = useGetGuildQuery(guildId)

  const baseUrl = AppRoutes.DASHBOARD + '/' + guildId

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
          ]}
        />
        <Card>
          <Space direction="vertical" style={{ width: '100%' }}>
            <DashboardGuildLinkButton
              loading={isGuildLoading}
              label="Embeds"
              icon={<BugOutlined />}
              path={baseUrl + '/embeds'}
            />
            <DashboardGuildLinkButton
              loading={isGuildLoading}
              label="Messages"
              icon={<BugOutlined />}
              path={baseUrl + '/messages'}
            />
            <DashboardGuildLinkButton
              loading={isGuildLoading}
              label="Categories"
              icon={<BugOutlined />}
              path={baseUrl + '/categories'}
            />
            <DashboardGuildLinkButton
              loading={isGuildLoading}
              label="Actions"
              icon={<BugOutlined />}
              path={baseUrl + '/actions'}
            />
            <DashboardGuildLinkButton
              loading={isGuildLoading}
              label="Listeners"
              icon={<BugOutlined />}
              path={baseUrl + '/listeners'}
            />
            <DashboardGuildLinkButton
              loading={isGuildLoading}
              label="Commands"
              icon={<BugOutlined />}
              path={baseUrl + '/commands'}
            />
          </Space>
        </Card>
      </Space>
    </Main>
  )
}

const DashboardGuildLinkButton: React.FC<{
  label?: React.ReactNode
  icon?: React.ReactNode
  path: string
  loading?: boolean
}> = ({ label, icon, path, loading }) => {
  const router = useRouter()

  return (
    <Button
      loading={loading}
      type="default"
      size="large"
      style={{ width: '100%' }}
      onClick={() => router.replace(path)}
    >
      {icon ? (
        <Flex justify="space-between">
          <Space>
            {icon} {label}
          </Space>
          <FolderOpenOutlined />
        </Flex>
      ) : (
        label
      )}
    </Button>
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

export default DashboardGuildPage
