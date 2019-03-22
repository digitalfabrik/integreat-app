// @flow

import getExtension from './getExtension'
import htmlparser2 from 'htmlparser2'

const findResourcesFromHtml = (htmlStrings: Array<string>) => {
  const urls = new Set<string>()

  const onattribute = (name: string, value: string) => {
    if (name === 'href' || name === 'src') {
      if (['png', 'jpg', 'jpeg', 'pdf'].includes(getExtension(value))) {
        urls.add(value)
      }
    }
  }

  const parser = new htmlparser2.Parser({onattribute}, {decodeEntities: true})

  htmlStrings.forEach(content => parser.write(content))
  parser.end()
  return urls
}

export default findResourcesFromHtml
