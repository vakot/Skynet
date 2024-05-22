import { ArrowLeftOutlined, DiscordFilled } from '@ant-design/icons'
import { AppRoutes } from '@utils/routes'
import { Button, Divider, Space } from 'antd'
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
      <Space direction="vertical" size="small" style={{ width: 300 }}>
        <Button size="large" block type="primary" onClick={() => signIn('discord')}>
          <DiscordFilled /> Login with Discord
        </Button>
        <Divider style={{ margin: '16px 0' }} />
        <Button
          size="large"
          block
          className={styles.Back}
          onClick={() => router.back() /* TODO: test and maybe replace with direct path */}
        >
          <ArrowLeftOutlined className={styles.Icon} /> Back
        </Button>
      </Space>
    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (session) {
    return { redirect: { destination: AppRoutes.PROFILE } }
  }

  return {
    props: {},
  }
}

export default SignInPage
