import { PermissionFlags } from 'discord.js'

export type GetPermissionsRequest = void
export type GetPermissionsResponse = PermissionFlags | undefined

export type GetPermissionRequest = number | undefined | void
export type GetPermissionResponse = [keyof PermissionFlags] | undefined
