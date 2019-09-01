// @flow

export default (url: string) => {
  const noHashOrQuery = url.split('?')[0].split('#')[0]
  return noHashOrQuery.substring(noHashOrQuery.lastIndexOf('.') + 1)
}
