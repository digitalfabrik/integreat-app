import { $ReadOnly } from 'utility-types'
export const values = <T>(object: $ReadOnly<Record<string, T>>): Array<T> => {
  // $FlowFixMe
  return Object.values(object)
}
export const entries = <T>(object: $ReadOnly<Record<string, T>>): Array<[string, T]> => {
  // $FlowFixMe
  return Object.entries(object)
}