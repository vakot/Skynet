import { BugOutlined, RightOutlined } from '@ant-design/icons'
import Main from '@components/Layouts/Main'
import { RoutesBreadcrumb } from '@components/UI/RoutesBreadcrumb'
import { useGetGuildQuery, useGetGuildsQuery } from '@modules/api/guild/guild.api'
import { AppRoutes } from '@utils/routes'
import { Card, Collapse, List, Skeleton, Space } from 'antd'
import { Guild } from 'discord.js'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { useRouter } from 'next/router'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import React from 'react'

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
          <Collapse
            bordered={false}
            defaultActiveKey={['0', '1']}
            style={{ background: 'transparent' }}
            items={[
              {
                label: 'Components',
                children: <Components baseUrl={baseUrl} loading={isGuildLoading} />,
                style: {
                  marginBottom: 16,
                  backgroundColor: 'rgba(0,0,0,0.025)',
                  borderRadius: 8,
                  border: 'none',
                },
              },
              {
                label: 'Utilities',
                children: <Utilities baseUrl={baseUrl} loading={isGuildLoading} />,
                style: {
                  backgroundColor: 'rgba(0,0,0,0.025)',
                  borderRadius: 8,
                  border: 'none',
                },
              },
            ]}
          />
        </Card>
      </Space>
    </Main>
  )
}

const Components: React.FC<{ loading?: boolean; baseUrl?: string }> = ({ loading, baseUrl }) => {
  return (
    <List>
      <Space direction="vertical" style={{ width: '100%' }}>
        <DashboardGuildLinkButton
          loading={loading}
          label="Embeds"
          icon={<BugOutlined />}
          path={baseUrl + '/embeds'}
        />
        <DashboardGuildLinkButton
          loading={loading}
          label="Messages"
          icon={<BugOutlined />}
          path={baseUrl + '/messages'}
        />
        <DashboardGuildLinkButton
          loading={loading}
          label="Categories"
          icon={<BugOutlined />}
          path={baseUrl + '/categories'}
        />
        <DashboardGuildLinkButton
          loading={loading}
          label="Actions"
          icon={<BugOutlined />}
          path={baseUrl + '/actions'}
        />
        <DashboardGuildLinkButton
          loading={loading}
          label="Listeners"
          icon={<BugOutlined />}
          path={baseUrl + '/listeners'}
        />
        <DashboardGuildLinkButton
          loading={loading}
          label="Commands"
          icon={<BugOutlined />}
          path={baseUrl + '/commands'}
        />
      </Space>
    </List>
  )
}
const Utilities: React.FC<{ loading?: boolean; baseUrl?: string }> = ({ loading, baseUrl }) => {
  return (
    <List>
      <Space direction="vertical" style={{ width: '100%' }}>
        <DashboardGuildLinkButton
          loading={loading}
          label="Send message"
          icon={<BugOutlined />}
          path={baseUrl + '/utilities/send-message'}
        />
      </Space>
    </List>
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
    <Card size="small" hoverable onClick={() => router.replace(path)}>
      <List.Item style={{ padding: 0 }}>
        {loading ? (
          <Skeleton.Button style={{ width: `${Math.random() * 100 + 100}px` }} />
        ) : (
          <List.Item.Meta avatar={icon} title={label} />
        )}
        <RightOutlined />
      </List.Item>
    </Card>
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
