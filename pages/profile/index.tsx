import { UserOutlined } from '@ant-design/icons'
import { AppRoutes } from '@utils/routes'
import { Avatar, Button, Card, Flex, Space } from 'antd'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import styles from './style.module.scss'

const ProfilePage: React.FC<void> = () => {
  const router = useRouter()

  const { data: session } = useSession()

  return (
    <section className={styles.Container}>
      <Card>
        <Space size="large">
          <Avatar
            size={240}
            icon={<UserOutlined />}
            src={session?.user?.image}
            className={styles.Avatar}
          />

          <Space direction="vertical" size="middle" align="center">
            <div className={styles.Name}>{session?.user?.name}</div>
            <div className={styles.Description}>{session?.user?.email}</div>

            <Flex gap={16}>
              <Space direction="vertical" align="center" size={0}>
                <span>2</span>
                <span>GUILDS</span>
              </Space>
              <Space direction="vertical" align="center" size={0}>
                <span>12</span>
                <span>ACTIONS</span>
              </Space>
              <Space direction="vertical" align="center" size={0}>
                <span>1.1k</span>
                <span>USAGES</span>
              </Space>
            </Flex>

            <Flex gap={32}>
              <Button type="primary" onClick={() => router.push(AppRoutes.DASHBOARD)}>
                Dashboard
              </Button>
              <Button onClick={() => signOut()}>Logout</Button>
            </Flex>
          </Space>
        </Space>
      </Card>
    </section>
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

export default ProfilePage
