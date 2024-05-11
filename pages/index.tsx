import utils from '@utils/index'
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
        <Button type="primary" onClick={() => router.push(utils.AppRoutes.PROFILE)}>
          Profile
        </Button>
      ) : (
        <Button type="primary" onClick={() => router.push(utils.AppRoutes.AUTH)}>
          Login
        </Button>
      )}
    </>
  )
}

export default IndexPage
