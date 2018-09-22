// @flow

export default (url: string) => {
  return url.substring(url.lastIndexOf('.') + 1)
}
