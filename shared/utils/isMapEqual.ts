type Primitive = string | number | null | undefined

const isMapEqual = (a: Map<string, Primitive>, b: Map<string, Primitive>): boolean =>
  a.size === b.size && Array.from(a.keys()).every(key => b.has(key) && a.get(key) === b.get(key))

export default isMapEqual
