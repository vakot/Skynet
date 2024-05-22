import Main from '@components/Layouts/Main'
import { Loading } from '@components/UI/Loading'
import { useGetGuildsQuery } from '@modules/api/guild/guild.api'
import { AppRoutes } from '@utils/routes'
import { Avatar, Button, Card, Flex, Space, Typography } from 'antd'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import Masonry from 'react-smart-masonry-layout'

const DashboardPage_unstable: React.FC = () => {
  const router = useRouter()

  const { data: session } = useSession()

  const { data: guilds, isLoading: isGuildsLoading } = useGetGuildsQuery()

  return (
    <Main style={{ display: 'flex', justifyContent: 'center' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Typography.Title level={1}>Welcome, {session?.user?.name}!</Typography.Title>
          <Typography.Title level={3} style={{ opacity: 0.75 }}>
            find your related servers below
          </Typography.Title>
        </Space>

        <Loading loading={isGuildsLoading}>
          <Masonry
            gutter={16}
            breakpoints={{ 900: 3, 1200: 4 }}
            source={
              guilds?.map((guild) => ({
                title: guild.name,
                icon: <Avatar src={guild.iconURL} size={200} />,
                onClick: () => router.push([AppRoutes.DASHBOARD, guild.id].join('/')),
                button: 'Open dashboard',
              })) || []
            }
            render={(item) => (
              <Card hoverable title={item.title} onClick={() => item.onClick()}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <Flex justify="center">{item.icon}</Flex>

                  {item.button && <Button type="primary">{item.button}</Button>}
                </Space>
              </Card>
            )}
          />
        </Loading>

        <Card style={{ marginBottom: 32 }}>
          <strong>
            <a href="https://github.com/vakot" target="_blank">
              github.com/vakot
            </a>
          </strong>
          , 2023-{new Date().getFullYear()}
        </Card>
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
    props: {},
  }
}

export default DashboardPage_unstable
