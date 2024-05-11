import { EditListenerForm } from '@components/Form/EditListenerForm'
import Main from '@components/Layouts/Main'
import utils from '@utils/index'
import { Card, Flex, Space } from 'antd'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { useRouter } from 'next/router'
import { authOptions } from 'pages/api/auth/[...nextauth]'

const DashboardPage: React.FC<void> = () => {
  const router = useRouter()

  const guildId = router.query.guild as string

  return (
    <Main>
      <Flex gap={16}>
        <Card style={{ flex: 1 }}>
          TODO: server overview
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Card>
              <h3>TODO: Command interactions</h3>
            </Card>
            <Card>
              <h3>TODO: Button interactions</h3>
            </Card>
            <Card>
              <h3>TODO: Select interactions</h3>
            </Card>
          </Space>
        </Card>
        <Card style={{ flex: 1 }}>
          <EditListenerForm guild={guildId} showControls />
        </Card>
      </Flex>
    </Main>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return { redirect: { destination: utils.AppRoutes.AUTH } }
  }

  return {
    props: {},
  }
}

export default DashboardPage
