// @flow

import getExtension from './getExtension'
import { Parser } from 'htmlparser2'
import type { FetchMapType } from './sagas/fetchResourceCache'
import { reduce } from 'lodash'
import { hashUrl } from 'api-client'
import Url from 'url-parse'

interface InputEntryType {
  path: string;
  content: string;
  thumbnail: string;
}

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
  _allowedHostNames: Array<string>

  constructor(allowedHostNames: Array<string>) {
    this._allowedHostNames = allowedHostNames
  }

  _onAttributeTagFound = (name: string, value: string) => {
    if (name === 'href' || name === 'src') {
      try {
        const extension = getExtension(value)
        if (['png', 'jpg', 'jpeg', 'pdf'].includes(extension) && this._allowedHostNames.includes(new Url(value).host)) {
          this._foundUrls.add(value)
        }
      } catch (ignored) {
        // invalid urls get ignored
      }
    }
  }

  init() {
    this._parser = new Parser({ onattribute: this._onAttributeTagFound }, { decodeEntities: true })
  }

  finalize() {
    this._parser.end()
  }

  findResourceUrls = (html: string): Set<string> => {
    this._foundUrls.clear()
    this._parser.write(html)
    return this._foundUrls
  }

  buildFetchMap(inputs: Array<InputEntryType>, buildFilePath: (url: string, urlHash: string) => string): FetchMapType {
    return reduce<InputEntryType, FetchMapType>(
      inputs,
      (fetchMap, input: InputEntryType) => {
        const path = input.path

        this.findResourceUrls(input.content)

        const urlSet = this._foundUrls
        if (input.thumbnail) {
          urlSet.add(input.thumbnail)
        }

        fetchMap[path] = Array.from(urlSet).map(url => {
          const urlHash = hashUrl(url)
          const filePath = buildFilePath(url, urlHash)
          return {
            url,
            urlHash,
            filePath
          }
        })

        return fetchMap
      },
      {}
    )
  }
}
