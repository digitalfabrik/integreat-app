// https://stackoverflow.com/a/3809435
// [^\u0020-\u007F] matches non-ASCII characters (e.g. umlaute, cyrillic, arabic)
// https://stackoverflow.com/a/150078
const protocol = /([A-Za-z]{3,9}:(?:\/\/)?)/
const hostname = /(?:[-;:&=+$,\w]+@)?([A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*)/
const path = /(?:\/(?:([+~%/.\w-]|[^\u0020-\u007F])*([+~%/\w-]|[^\u0020-\u007F]+))?)?/
const query = /(?:\?(([-+=&;%@.\w]|[^\u0020-\u007F])*([-+=&;%@\w]|[^\u0020-\u007F])+)?)?/
const hash = /(?:#(([.!/\\\w]|[^\u0020-\u007F])*([!/\\\w]|[^\u0020-\u007F])+)?)?/
const mail = /[.\-;:&=+$,\w]+@([A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*)/
const regex = new RegExp(
  `(${protocol.source}${hostname.source}${path.source}${query.source}${hash.source}|${mail.source})`,
  'g',
)
type ReplaceType = (match: string) => string
export const linkify = (link: string): string => `<a href="${link}">${link}</a>`
export const replaceLinks = (content: string, replace: ReplaceType = linkify): string => content.replace(regex, replace)
export default replaceLinks
