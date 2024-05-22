import { CodeFilled } from '@ant-design/icons'
import { EditCommandForm } from '@components/Form/EditCommandForm'
import { RoutesBreadcrumb } from '@components/UI/RoutesBreadcrumb'
import { useGetCommandQuery, useGetCommandsQuery } from '@modules/api/command/command.api'
import { useGetGuildQuery } from '@modules/api/guild/guild.api'
import { AppRoutes } from '@utils/routes'
import { Button, Card, Empty, Flex, Menu, Space } from 'antd'
import { ApplicationCommand, Guild } from 'discord.js'
import { useRouter } from 'next/router'

export interface CommandsProps {
  guild?: Guild['id']
  command?: ApplicationCommand['id']
}

export const Commands: React.FC<CommandsProps> = ({ guild: guildId, command: commandId }) => {
  const router = useRouter()

  const { data: guild, isLoading: isGuildLoading } = useGetGuildQuery(guildId, { skip: !guildId })
  const { data: command, isLoading: isCommandLoading } = useGetCommandQuery(
    { id: commandId, guild: guildId },
    { skip: !commandId }
  )
  const { data: commands, isLoading: isCommandsLoading } = useGetCommandsQuery({ guild: guildId })

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Flex justify="space-between">
        <RoutesBreadcrumb
          loading={isGuildLoading}
          items={
            guild
              ? [
                  {
                    path: AppRoutes.DASHBOARD,
                    title: 'Dashboard',
                  },
                  {
                    path: [AppRoutes.DASHBOARD, guild.id],
                    title: guild?.name || 'Home',
                  },
                  {
                    path: [AppRoutes.DASHBOARD, guild.id, 'commands'],
                    title: 'Commands',
                  },
                ]
              : [
                  {
                    path: AppRoutes.DASHBOARD,
                    title: 'Dashboard',
                  },
                  {
                    path: AppRoutes.COMMANDS,
                    title: 'Commands',
                  },
                ]
          }
        />
        <Space>
          {!!commandId && !!command && (
            <Button type="primary" danger>
              Delete command
            </Button>
          )}
          {!!guildId && !!guild && (
            <Button
              type="primary"
              onClick={() => router.push([AppRoutes.DASHBOARD, guild.id, 'commands'].join('/'))}
            >
              Create command
            </Button>
          )}
        </Space>
      </Flex>

      <Flex gap={8}>
        <Card
          size="small"
          style={{ width: 240, maxHeight: 338, overflowX: 'hidden', overflowY: 'auto' }}
          loading={isCommandsLoading}
        >
          {!commands ? (
            <Empty />
          ) : (
            <Menu
              mode="inline"
              onSelect={({ keyPath }) =>
                router.push(
                  (!!guild
                    ? [AppRoutes.DASHBOARD, guild.id, 'commands', ...keyPath.toReversed()]
                    : [AppRoutes.COMMANDS, ...keyPath.toReversed()]
                  ).join('/')
                )
              }
              selectedKeys={commandId ? [commandId] : []}
              items={commands.map(({ id, name }) => ({
                key: id,
                icon: <CodeFilled />,
                label: `/${name}`,
              }))}
            />
          )}
        </Card>

        <Card loading={isCommandLoading} title={command?.name || command?.id} style={{ flex: 1 }}>
          <EditCommandForm
            command={commandId}
            guild={guildId}
            onFinish={(value) =>
              router.push(
                (!!guild
                  ? [AppRoutes.DASHBOARD, guild.id, 'commands', value?.id]
                  : [AppRoutes.COMMANDS, value?.id]
                ).join('/')
              )
            }
            onAbort={() =>
              router.push(
                (!!guild ? [AppRoutes.DASHBOARD, guild.id, 'commands'] : [AppRoutes.COMMANDS]).join(
                  '/'
                )
              )
            }
            showControls
          />
        </Card>
      </Flex>
    </Space>
  )
}
