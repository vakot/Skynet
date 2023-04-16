import { ApplicationCommand } from 'discord.js'

export function isChoicesEquals(localChoices, applicationChoices): boolean {
  if (!localChoices && !applicationChoices) return true

  if (localChoices.length !== applicationChoices.length) return false

  for (const localChoice of localChoices) {
    const applicationChoice = applicationChoices?.find(
      (choice) => choice.name === localChoice.name
    )

    if (!applicationChoice) {
      return false
    }
    if (localChoice.value !== applicationChoice.value) {
      return false
    }
  }

  return true
}

export function isOptionsEquals(localOptions, applicationOptions): boolean {
  if (!localOptions && !applicationOptions) return true

  if (localOptions.length !== applicationOptions.length) return false

  for (const localOption of localOptions) {
    const applicationOption = applicationOptions?.find(
      (option) => option.name === localOption.name
    )

    if (!applicationOption) {
      return false
    }
    if (localOption.description !== applicationOption.description) {
      return false
    }
    if (localOption.type !== applicationOption.type) {
      return false
    }
    if (localOption.required !== applicationOption.required) {
      return false
    }
    if (!isChoicesEquals(localOption.choices, applicationOption.choices)) {
      return false
    }
  }

  return true
}

export function isCommandsEqual(
  localCommand: ApplicationCommand,
  applicationCommand: ApplicationCommand
): boolean {
  if (localCommand.name !== applicationCommand.name) {
    return false
  }
  if (localCommand.description !== applicationCommand.description) {
    return false
  }
  if (localCommand.nsfw ?? false !== applicationCommand.nsfw) {
    return false
  }
  if (!isOptionsEquals(localCommand.options, applicationCommand.options)) {
    return false
  }
  if (
    // @ts-ignore
    localCommand.default_member_permissions !==
    applicationCommand.defaultMemberPermissions?.bitfield.toString()
  ) {
    return false
  }

  return true
}
