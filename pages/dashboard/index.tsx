import Main from '@components/Layouts/Main'
import { AppRoutes } from '@utils/routes'
import { Card } from 'antd'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'

const DashboardPage: React.FC<void> = () => {
  return (
    <Main>
      <Card>Welcome</Card>
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

export default DashboardPage
