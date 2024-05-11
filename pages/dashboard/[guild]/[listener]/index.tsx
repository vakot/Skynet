import { EditListenerForm } from '@components/Form/EditListenerForm'
import Main from '@components/Layouts/Main'
import utils from '@utils/index'
import { Card } from 'antd'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { useRouter } from 'next/router'
import { authOptions } from 'pages/api/auth/[...nextauth]'

const DashboardPage: React.FC<void> = () => {
  const router = useRouter()

  const guildId = router.query.guild as string
  const listenerId = router.query.listener as string

  return (
    <Main>
      <Card style={{ maxWidth: 800, marginInline: 'auto' }}>
        <EditListenerForm guild={guildId} listener={listenerId} showControls />
      </Card>
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
