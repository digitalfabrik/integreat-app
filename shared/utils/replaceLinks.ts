// Match \w and ' characters
// https://stackoverflow.com/a/6041965
// language=RegExp
const unicode = 'a-zA-Z0-9\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF'

// https://stackoverflow.com/a/150078
const protocol = /([A-Za-z]{3,9}:(?:\/\/)?)/
const hostname = /(?:[-;:&=+$,\w]+@)?([A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*)/
// language=RegExp
const path = `(?:\\/(?:[+~%/_.${unicode}-]*[+~%/${unicode}-]+)?)?`
// language=RegExp
const query = `(?:\\?([-+=&;%@.${unicode}]*[-+=&;%@${unicode}]+)?)?`
// language=RegExp
const hash = `(?:#([.!/\\\\${unicode}]*[!/\\\\${unicode}]+)?)?`
const mail = /[.\-;:&=+$,\w]+@([A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*)/

const regex = new RegExp(`(${protocol.source}${hostname.source}${path}${query}${hash}|${mail.source})`, 'g')

type ReplaceType = (match: string) => string
export const linkify = (link: string): string => {
  const isEmail = mail.test(link) && !link.toLowerCase().startsWith('mailto:') && !link.includes('://')
  const href = isEmail ? `mailto:${link}` : link
  return `<a href='${href}'>${link}</a>`
}
export const replaceLinks = (content: string, replace: ReplaceType = linkify): string => content.replace(regex, replace)

export default replaceLinks
