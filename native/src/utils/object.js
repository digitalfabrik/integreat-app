// @flow

export const values = <T> (object: $ReadOnly<{ [string]: T }>): Array<T> => {
  // $FlowFixMe
  return Object.values(object)
}

export const entries = <T> (object: $ReadOnly<{ [string]: T }>): Array<[string, T]> => {
  // $FlowFixMe
  return Object.entries(object)
}
