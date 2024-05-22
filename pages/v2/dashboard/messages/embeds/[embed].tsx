import Dashboard from '@components/Dashboard'
import Main from '@components/Layouts/Main'
import { AppRoutes } from '@utils/routes'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'

const DashboardPage_unstable: React.FC<any> = ({ embed: embedId }) => {
  return (
    <Main style={{ display: 'flex', justifyContent: 'center' }}>
      <Dashboard.Embeds embed={embedId} />
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
