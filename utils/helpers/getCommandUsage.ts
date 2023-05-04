import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js'

/**
 * function to easely create command using tutorial in following format
 * /command-name <required-option> (optional-option)
 * return as array to simplify discord text formatting, like below
 * ```/command-name <opt1> (op2)``` or `/command-name` `<opt1>` `(opt2)`
 * `\`\`\`${usage.join(' ')}\`\`\`` or usage.map(opt => `\`${opt}\``).join(' ')
 *
 * @param {SlashCommandBuilder} command - instance of SlashCommandBuilder
 * @returns {string[]} - returns array [command name, ...options] in right format
 */
export function getCommandUsage(command: SlashCommandBuilder): string[] {
  const { name, options } = command

  const nameStr = `/${name}`
  const optionsStr = options.map((option) => {
    const { name, required } = option.toJSON()

    return required || option instanceof SlashCommandSubcommandBuilder ? `<${name}>` : `(${name})`
  })

  return [nameStr, ...optionsStr]
}
