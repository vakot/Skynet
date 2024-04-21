import { Button } from '@components/UI/Buttons'
import utils from '@utils/index'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import styles from './style.module.scss'

const ProfilePage: React.FC<void> = () => {
  const router = useRouter()
  const { data: session } = useSession()

  return (
    <section className={styles.Container}>
      <div className={styles.Card}>
        <div className={styles.Background} />

        <div className={styles.Avatar}>
          <Image width={240} height={240} src={session!.user?.image ?? ''} alt="avatar" />
        </div>

        <div className={styles.About}>
          <div className={styles.Name}>{session!.user?.name}</div>
          <div className={styles.Description}>{session!.user?.email}</div>
        </div>

        <div className={styles.Statistic}>
          <div>
            <span>2</span>
            <span>GUILDS</span>
          </div>
          <div>
            <span>12</span>
            <span>ACTIONS</span>
          </div>
          <div>
            <span>1.1k</span>
            <span>USAGES</span>
          </div>
        </div>

        <div className={styles.Buttons}>
          <Button type="primary" onClick={() => router.push(utils.AppRoutes.DASHBOARD)}>
            Dashboard
          </Button>
          <Button onClick={() => signOut()}>Logout</Button>
        </div>
      </div>
    </section>
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

export default ProfilePage
