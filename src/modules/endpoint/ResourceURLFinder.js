// @flow

import getExtension from './getExtension'
import { Parser } from 'htmlparser2'
import type { FetchMapType } from './sagas/fetchResourceCache'
import { keyBy, reduce } from 'lodash/collection'
import { hexHash } from './fnv1a'

/**
 * A ResourceURLFinder allows to find resource urls in html source code.
 * It only searches for urls ending on png,jpg,jpeg,pdf in src and href attribute tags of any html element.
 * It also allows to build a fetch map using an array of inputs of the form { path, content, thumbnail }
 * Before calling findResourceUrls or buildFetchMap you need to initialize the finder by calling init.
 * After finishing your work with the finder, you need to call finalize, to clear the  resources
 */
export default class ResourceURLFinder {
  _parser: Parser
  _foundUrls: Set<string> = new Set<string>()

  _onAttributeTagFound = (name: string, value: string) => {
    if (name === 'href' || name === 'src') {
      if (['png', 'jpg', 'jpeg', 'pdf'].includes(getExtension(value))) {
        this._foundUrls.add(value)
      }
    }
  }

  init () {
    this._parser = new Parser({ onattribute: this._onAttributeTagFound }, { decodeEntities: true })
  }

  finalize () {
    this._parser.end()
  }

  findResourceUrls = (html: string): Set<string> => {
    this._foundUrls.clear()
    this._parser.write(html)
    return this._foundUrls
  }

  buildFetchMap (
    inputs: Array<{ path: string, content: string, thumbnail: string }>,
    buildFilePath: (url: string, path: string, urlHash: string) => string
  ): FetchMapType {
    return reduce(inputs, (acc, input: { path: string, content: string, thumbnail: string }) => {
      const path = input.path

      this.findResourceUrls(input.content)

      const urlSet = this._foundUrls
      if (input.thumbnail) {
        urlSet.add(input.thumbnail)
      }

      return {
        ...acc,
        ...keyBy(
          Array.from(urlSet).map(url => [url, path, hexHash(url)]),
          ([url, path, urlHash]) => buildFilePath(url, path, urlHash)
        )
      }
    }, {})
  }
}
