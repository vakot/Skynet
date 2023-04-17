export function compareObjectWithSchema(obj: object, schema: object): boolean {
  for (const key in schema) {
    // skip if key is not required
    if (!schema[key].required) continue

    // if key not exist
    if (!(key in obj)) {
      return false
    }
    // recursively handle nested objects
    if (!compareObjectWithSchema(obj[key], schema[key].type)) {
      return false
    }
    // if comparator provided and comparation failed
    if (typeof schema[key].type === 'function' && !schema[key].type(obj[key])) {
      return false
    }
    // if comparator not provided and type is defferent
    if (
      typeof schema[key].type !== 'function' &&
      schema[key].type !== typeof obj[key]
    ) {
      console.log(schema[key].type)
      console.log(typeof obj[key])

      return false
    }
  }
  // object have all required properties
  return true
}
