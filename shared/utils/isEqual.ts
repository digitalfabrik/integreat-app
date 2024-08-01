type Primitive = string | number | null | undefined

const isEqual = (a: Record<string, Primitive>, b: Record<string, Primitive>): boolean =>
  a.size === b.size && Object.entries(a).every(([key, value]) => b[key] === value)

export default isEqual
