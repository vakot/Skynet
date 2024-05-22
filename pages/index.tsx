import { AppRoutes } from '@utils/routes'
import { Button, Space } from 'antd'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { authOptions } from 'pages/api/auth/[...nextauth]'

const IndexPage: React.FC<void> = () => {
  const router = useRouter()
  const { data: session } = useSession()

  return (
    <Space direction="vertical" size="small" style={{ width: 240 }}>
      {session ? (
        <Button type="primary" size="large" block onClick={() => router.push(AppRoutes.PROFILE)}>
          Profile
        </Button>
      ) : (
        <Button type="primary" size="large" block onClick={() => router.push(AppRoutes.AUTH)}>
          Login
        </Button>
      )}
    </Space>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (session) {
    return { redirect: { destination: AppRoutes.DASHBOARD } }
  } else {
    return { redirect: { destination: AppRoutes.AUTH } }
  }
}

export default IndexPage
