import { ArrowLeftOutlined, DiscordFilled } from '@ant-design/icons'
import { Button } from '@components/UI/Button'
import { Separator } from '@components/UI/Separator'
import utils from '@utils/index'
import classNames from 'classnames'
import type { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth/next'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { authOptions } from '../api/auth/[...nextauth]'
import styles from './style.module.scss'

const SignInPage: React.FC<void> = () => {
  const router = useRouter()

  return (
    <div className={styles.Container}>
      <Button
        type="primary"
        className={classNames(styles.Button, styles.Login)}
        onClick={() => signIn('discord')}
      >
        <DiscordFilled />
        <p>Login with Discord</p>
      </Button>
      <Separator style={{ width: 240 }} />
      <Button
        className={classNames(styles.Button, styles.Back)}
        onClick={() => router.back() /* TODO: test and maybe replace with direct path */}
      >
        <ArrowLeftOutlined className={styles.Icon} />
        <p>Back</p>
      </Button>
    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (session) {
    return { redirect: { destination: utils.AppRoutes.PROFILE } }
  }

  return {
    props: {},
  }
}

export default SignInPage
