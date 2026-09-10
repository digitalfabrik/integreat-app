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

// Options interpreted by i18next itself, i.e. everything but the interpolation parameters passed by us
const i18nextOptions = [
  'context',
  'defaultValue',
  'fallbackLng',
  'interpolation',
  'joinArrays',
  'keyPrefix',
  'keySeparator',
  'lng',
  'lngs',
  'ns',
  'nsSeparator',
  'ordinal',
  'postProcess',
  'replace',
  'returnDetails',
  'returnObjects',
]

// Translations are not available in tests, so the key is rendered instead.
// The interpolation parameters are appended to it to make them testable as well.
export const parseMissingKeyHandler = (
  key: string,
  _defaultValue?: string,
  options?: Record<string, unknown>,
): string => {
  const parameters = Object.entries(options ?? {})
    .filter(([name, value]) => value !== undefined && !i18nextOptions.includes(name))
    .map(([_, value]) => value)
  return parameters.length > 0 ? `${key} ${parameters.length === 1 ? parameters[0] : JSON.stringify(parameters)}` : key
}
