import { TFunction } from 'i18next'

export const mockT = ((selector: (proxy: unknown) => unknown) => {
  const path: string[] = []
  const proxy: unknown = new Proxy(() => undefined, {
    get: (_, prop) => {
      if (typeof prop === 'string') {
        path.push(prop)
      }
      return proxy
    },
  })
  selector(proxy)
  return path.join('.')
}) as unknown as TFunction
