import throughDirectory from '../helpers/throughDirectory'
import logger from '../helpers/logger'

import { IComponent } from '../../models/component'

export default async function (path: string): Promise<IComponent[]> {
  const components: IComponent[] = []

  for (const componentPath of throughDirectory(path)) {
    const componentFileName = componentPath.replace(/\\/g, '/').split('/').pop()

    if (!componentPath.endsWith('.ts') && !componentPath.endsWith('.js')) {
      logger.info(`File ${componentFileName} skipped`)
      continue
    }

    const component: IComponent = (await import(componentPath))?.default

    if (!component?.data || !component?.callback) {
      logger.warn(`File ${componentFileName} is unresolvable`)
      continue
    }

    logger.log(`File ${componentFileName} loaded`)

    components.push(component)
  }

  return components
}
