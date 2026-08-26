import { TFunction } from 'i18next'

const mockT = ((selector: (proxy: unknown) => unknown) => {
  let lastKey = ''
  const proxy: unknown = new Proxy(() => undefined, {
    get: (_, prop) => {
      lastKey = String(prop)
      return proxy
    },
  })
  selector(proxy)
  return lastKey
}) as unknown as TFunction

export default mockT
