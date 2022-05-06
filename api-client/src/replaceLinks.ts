// https://stackoverflow.com/a/3809435
const protocol = /([A-Za-z]{3,9}:(?:\/\/)?)/g
const baseUrl =  /(?:[-;:&=+$,\w]+@)?([A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*)/g
const path = /(?:\/(?:[+~%/.\w-]*[+~%/\w-]+)?)?/g
const query = /(?:\?([-+=&;%@.\w]*[-+=&;%@\w]+)?)?/g
const hash = /(?:#([.!/\\\w]*[!/\\\w]+)?)?/g
const regex = new RegExp(protocol.source + baseUrl.source + path.source + query.source + hash.source, "g")
type ReplaceType = (match: string) => string
export const linkify = (link: string): string => `<a href="${link}">${link}</a>`
export const replaceLinks = (content: string, replace: ReplaceType = linkify): string => content.replace(regex, replace)
export default replaceLinks
