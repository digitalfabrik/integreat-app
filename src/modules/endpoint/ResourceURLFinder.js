// @flow

import getExtension from './getExtension'
import { Parser } from 'htmlparser2'
import type { FetchMapType } from './sagas/fetchResourceCache'
import { keyBy, reduce } from 'lodash/collection'

export default class ResourceURLFinder {
  parser: Parser
  _foundUrls: Set<string> = new Set<string>()

  _onAttributeTagFound = (name: string, value: string) => {
    if (name === 'href' || name === 'src') {
      if (['png', 'jpg', 'jpeg', 'pdf'].includes(getExtension(value))) {
        this.foundUrls.add(value)
      }
    }
  }

  init () {
    this.parser = new Parser({onattribute: this._onAttributeTagFound}, {decodeEntities: true})
  }

  finalize () {
    this.parser.end()
  }

  findResourceUrls = (html: string): Set<string> => {
    this._foundUrls.clear()
    this.parser.write(html)
    return this.foundUrls
  }

  get foundUrls (): Set<string> {
    return this._foundUrls
  }

  buildFetchMap (
    inputs: Array<{ path: string, content: string, thumbnail: string }>,
    buildFilePath: (url: string, path: string) => string
  ): FetchMapType {
    return reduce(inputs, (result, input: { path: string, content: string, thumbnail: string }) => {
      const path = input.path

      this.findResourceUrls(input.content)

      const urlSet = this.foundUrls
      if (input.thumbnail) {
        urlSet.add(input.thumbnail)
      }

      return {
        ...result,
        ...keyBy(
          Array.from(urlSet).map(url => [url, path]),
          ([url, path]) => buildFilePath(url, path)
        )
      }
    }, {})
  }
}
