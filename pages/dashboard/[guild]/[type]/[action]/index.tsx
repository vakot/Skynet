import Action from '@components/Guild/Action'
import Main from '@components/Layouts/Main'
import utils from '@utils/index'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { useRouter } from 'next/router'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import styles from '../../../style.module.scss'

const DashboardPage: React.FC<void> = () => {
  const router = useRouter()

  const guildId = router.query.guild as string
  const type = router.query.type as string
  const actionId = router.query.action as string

  console.log({
    guildId,
    type,
    actionId,
  })

  return (
    <Main className={styles.Main}>
      <Action guild={guildId} action={actionId} />
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
