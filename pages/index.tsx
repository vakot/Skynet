import { AppRoutes } from '@utils/routes'
import { Button } from 'antd'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const IndexPage: React.FC<void> = () => {
  const router = useRouter()
  const { data: session } = useSession()

  return (
    <>
      TODO: Beatiful landing
      {session ? (
        <Button type="primary" onClick={() => router.push(AppRoutes.PROFILE)}>
          Profile
        </Button>
      ) : (
        <Button type="primary" onClick={() => router.push(AppRoutes.AUTH)}>
          Login
        </Button>
      )}
    </>
  )
}

export default IndexPage
