import GuildAction from '@components/GuildAction'
import Main from '@components/Layouts/Main'
import utils from '@utils/index'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { useRouter } from 'next/router'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import styles from './style.module.scss'

const DashboardPage: React.FC<void> = () => {
  const router = useRouter()

  const guildId = router.query.id?.[0] as string
  const actionId = router.query.id?.[2] as string
  const type = router.query.id?.[1] as string

  return (
    <Main className={styles.Main}>
      <GuildAction guild={guildId} action={actionId} type={type} />
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
