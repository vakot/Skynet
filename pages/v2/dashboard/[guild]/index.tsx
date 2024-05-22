import {
  BookFilled,
  CarFilled,
  CodeFilled,
  DatabaseFilled,
  EyeFilled,
  GroupOutlined,
  LinkOutlined,
  MessageFilled,
  UndoOutlined,
} from '@ant-design/icons'
import Main from '@components/Layouts/Main'
import { Loading } from '@components/UI/Loading'
import { useGetGuildQuery } from '@modules/api/guild/guild.api'
import { AppRoutes } from '@utils/routes'
import { Button, Card, Flex, Space, Typography } from 'antd'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import Masonry from 'react-smart-masonry-layout'

const DashboardPage_unstable: React.FC<any> = ({ guild: guildId }) => {
  const router = useRouter()

  const { data: session } = useSession()

  const { data: guild, isLoading: isGuildLoading } = useGetGuildQuery(guildId)

  return (
    <Main style={{ display: 'flex', justifyContent: 'center' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Typography.Title level={1}>
            Welcome in {guild?.name || guildId}, {session?.user?.name}!
          </Typography.Title>
          <Typography.Title level={3} style={{ opacity: 0.75 }}>
            find commonly used dashboard pages below
          </Typography.Title>
        </Space>

        <Loading loading={isGuildLoading}>
          <Masonry
            gutter={16}
            breakpoints={{ 900: 3, 1200: 4 }}
            source={[
              {
                title: 'Actions',
                description: (
                  <Typography.Paragraph>
                    <strong>Supercharge</strong> your server with <strong>Actions</strong>, enabling
                    it to dynamically react to events with <strong>custom behaviors</strong>{' '}
                    tailored to your community needs and preferences
                  </Typography.Paragraph>
                ),
                icon: <CarFilled style={{ fontSize: 164 }} />,
                onClick: () => router.push(AppRoutes.ACTIONS),
                button: 'Create your own action',
              },
              {
                title: 'Listeners',
                description: (
                  <Typography.Paragraph>
                    Implementing <strong>isolated</strong> event listeners to seamlessly connect the
                    Discord user interface with various actions and <strong>functionalities</strong>
                    , ensuring <strong>efficient</strong> communication and interaction within the
                    platform
                  </Typography.Paragraph>
                ),
                icon: <EyeFilled style={{ fontSize: 164 }} />,
                onClick: () => router.push([AppRoutes.DASHBOARD, guildId, 'listeners'].join('/')),
                button: 'Create your own event listener',
              },
              {
                title: 'Messages',
                description: (
                  <Typography.Paragraph>
                    <strong>View</strong>, <strong>create</strong>, <strong>customize</strong>, and{' '}
                    <strong>send</strong> message templates tailored to the{' '}
                    <strong>specific needs</strong> of your server,{' '}
                    <strong>enhancing communication</strong> and engagement within your community
                  </Typography.Paragraph>
                ),
                icon: <MessageFilled style={{ fontSize: 164 }} />,
                onClick: () => router.push([AppRoutes.DASHBOARD, guildId, 'messages'].join('/')),
                button: 'Create your message template',
              },
              {
                title: 'Commands',
                description: (
                  <Typography.Paragraph>
                    <strong>Manage all registered commands</strong> of your server, allowing for{' '}
                    <strong>efficient organization</strong>, <strong>customization</strong> and{' '}
                    <strong>control</strong> over user interactions
                  </Typography.Paragraph>
                ),
                icon: <CodeFilled style={{ fontSize: 164 }} />,
                onClick: () => router.push([AppRoutes.DASHBOARD, guildId, 'commands'].join('/')),
                button: 'Create your own command',
              },
              {
                title: 'Storage',
                description: (
                  <Typography.Paragraph>
                    <strong>Effectively manage</strong> your <strong>server storage</strong>,
                    ensuring optimal performance and organization of all your{' '}
                    <strong>runtime data</strong>
                  </Typography.Paragraph>
                ),
                icon: <DatabaseFilled style={{ fontSize: 164 }} />,
                onClick: () => router.push([AppRoutes.DASHBOARD, guildId, 'storage'].join('/')),
              },
              {
                title: 'History',
                description: (
                  <Typography.Paragraph>
                    View the <strong>complete usage history</strong> of all actions on your server,
                    providing
                    <strong>insights</strong> and <strong>transparency</strong> into past activities
                    and interactions
                  </Typography.Paragraph>
                ),
                icon: <UndoOutlined style={{ fontSize: 164 }} />,
                onClick: () => router.push([AppRoutes.DASHBOARD, guildId, 'storage'].join('/')),
              },
              {
                title: 'Embed Builder',
                description: (
                  <Typography.Paragraph>
                    Create, customize, and manage <strong>embedded messages</strong> effortlessly
                    with the <strong>embed-builder</strong>,{' '}
                    <strong>enhancing the visual appeal</strong> and <strong>clarity</strong> of
                    your server communications.
                  </Typography.Paragraph>
                ),
                icon: <BookFilled style={{ fontSize: 164 }} />,
                onClick: () => router.push(AppRoutes.EMBEDS),
                button: 'Create your own embed',
              },
              {
                title: 'Categories',
                description: (
                  <Typography.Paragraph>
                    <strong>Organize</strong> your server actions with{' '}
                    <strong>customized categories</strong>, for streamlined <strong>access</strong>{' '}
                    and <strong>management</strong>.
                  </Typography.Paragraph>
                ),
                icon: <GroupOutlined style={{ fontSize: 164 }} />,
                onClick: () => router.push(AppRoutes.CATEGORIES),
                button: 'Create your own category',
              },
              {
                title: 'Documentation',
                description: (
                  <Typography.Paragraph>
                    Access <strong>comprehensive documentation</strong>, complete with{' '}
                    <strong>detailed tutorials</strong> and <strong>examples</strong>, to guide you
                    through the <strong>implementation</strong> and <strong>customization</strong>{' '}
                    of your server features, ensuring you can make the most of your server
                    capabilities.
                  </Typography.Paragraph>
                ),
                icon: <LinkOutlined style={{ fontSize: 164 }} />,
                onClick: () => {},
              },
            ]}
            render={(item) => (
              <Card hoverable title={item.title} onClick={() => item.onClick()}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <Flex gap={32} justify="center" wrap="wrap">
                    {item.description}
                    {item.icon}
                  </Flex>

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
    props: context.query,
  }
}

export default DashboardPage_unstable
