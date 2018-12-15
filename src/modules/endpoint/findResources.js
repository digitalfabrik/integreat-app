// @flow

import getExtension from './getExtension'
import htmlparser2 from 'htmlparser2'
import { CategoryModel } from '@integreat-app/integreat-api-client'

const findResources = (categories: Array<CategoryModel>) => {
  const urls = new Set<string>()

  const onattribute = (name: string, value: string) => {
    if (name === 'href' || name === 'src') {
      if (['png', 'jpg', 'jpeg', 'pdf'].includes(getExtension(value))) {
        urls.add(value)
      }
    }
  }

  const parser = new htmlparser2.Parser({onattribute}, {decodeEntities: true})

  for (const category: CategoryModel of categories) {
    parser.write(category.content)

    if (category.thumbnail) {
      urls.add(category.thumbnail)
    }
  }

  parser.end()
  return urls
}

export default findResources
