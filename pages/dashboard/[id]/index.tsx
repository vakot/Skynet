import { PlusCircleFilled } from '@ant-design/icons'
import Main from '@components/Layouts/Main'
import { Card } from '@components/UI/Card'
import { Separator } from '@components/UI/Separator'
import utils from '@utils/index'
import classNames from 'classnames'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import styles from './style.module.scss'

const DashboardPage: React.FC<void> = () => {
  // const router = useRouter()
  // const { data: guild } = useGetGuildQuery(router.query.id) // TODO:

  return (
    <Main className={styles.Main}>
      <Card className={classNames(styles.Card, styles.Actions)}>
        <div className={styles.Header}>
          <p>Actions</p>
          <PlusCircleFilled
            className={styles.Icon}
            onClick={() => console.log('TODO: open create action page/form')}
          />
        </div>
        <Separator style={{ width: 'calc(100% - 100px)' }} />
        <div className={styles.Body}>{/* TODO: */}</div>
      </Card>

      <Card className={classNames(styles.Card, styles.Commands)}>
        <div className={styles.Header}>
          <p>Commands</p>
          <PlusCircleFilled
            className={styles.Icon}
            onClick={() => console.log('TODO: open create command page/form')}
          />
        </div>
        <Separator style={{ width: 'calc(100% - 100px)' }} />
        <div className={styles.Body}>{/* TODO: */}</div>
      </Card>

      <Card className={classNames(styles.Card, styles.Plugins)}>
        <div className={styles.Header}>
          <p>Plugins</p>
          <PlusCircleFilled
            className={styles.Icon}
            onClick={() => console.log('TODO: open setup plugins page/form')}
          />
        </div>
        <Separator style={{ width: 'calc(100% - 100px)' }} />
        <div className={styles.Body}>{/* TODO: */}</div>
      </Card>

      <Card className={classNames(styles.Card, styles.Type)}>
        <div className={styles.Header}>
          <p>Type</p>
          <PlusCircleFilled
            className={styles.Icon}
            onClick={() => console.log('TODO: open Type page/form')}
          />
        </div>
        <Separator style={{ width: 'calc(100% - 100px)' }} />
        <div className={styles.Body}>{/* TODO: */}</div>
      </Card>

      <Card className={classNames(styles.Card, styles.Type)}>
        <div className={styles.Header}>
          <p>Type</p>
          <PlusCircleFilled
            className={styles.Icon}
            onClick={() => console.log('TODO: open Type page/form')}
          />
        </div>
        <Separator style={{ width: 'calc(100% - 100px)' }} />
        <div className={styles.Body}>{/* TODO: */}</div>
      </Card>

      <Card className={classNames(styles.Card, styles.Type)}>
        <div className={styles.Header}>
          <p>Type</p>
          <PlusCircleFilled
            className={styles.Icon}
            onClick={() => console.log('TODO: open Type page/form')}
          />
        </div>
        <Separator style={{ width: 'calc(100% - 100px)' }} />
        <div className={styles.Body}>{/* TODO: */}</div>
      </Card>
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
