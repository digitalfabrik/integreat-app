// @flow

import getExtension from './getExtension'
import htmlparser2 from 'htmlparser2'

const findResourceUrls = (html: string): Set<string> => {
  const urls = new Set<string>()

  const onattribute = (name: string, value: string) => {
    if (name === 'href' || name === 'src') {
      if (['png', 'jpg', 'jpeg', 'pdf'].includes(getExtension(value))) {
        urls.add(value)
      }
    }
  }

  const parser = new htmlparser2.Parser({onattribute}, {decodeEntities: true})

  parser.write(html)
  parser.end()
  return urls
}

export default findResourceUrls
