// @flow

// https://stackoverflow.com/a/3809435
const regex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|[-;:&=+$,\w]+@[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/g

type ReplaceType = (match: string) => string

export const linkify = (link: string): string => {
  return `<a href="${link}">${link}</a>`
}

export const replaceLinks = (content: string, replace: ReplaceType = linkify) => {
  return content.replace(regex, replace)
}

export default replaceLinks
