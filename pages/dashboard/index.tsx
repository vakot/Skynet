import Main from '@components/Layouts/Main'
import utils from '@utils/index'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'

const DashboardPage: React.FC<void> = () => {
  return <Main>Welcome</Main>
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
