import { Parser } from 'htmlparser2'
import { reduce } from 'lodash'
import md5 from 'md5'
import Url from 'url-parse'

import { getExtension } from './helpers'
import { FetchMapType } from './loadResourceCache'

const RESOURCE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'pdf', 'svg']

type InputEntryType = {
  path: string
  content: string
  thumbnail: string | null
}
/**
 * A ResourceURLFinder allows to find resource urls in html source code.
 * It only searches for urls ending on png,jpg,jpeg,pdf in src and href attribute tags of any html element.
 * It also allows to build a fetch map using an array of inputs of the form { path, content, thumbnail }
 * Before calling findResourceUrls or buildFetchMap you need to initialize the finder by calling init.
 * After finishing your work with the finder, you need to call finalize, to clear the  resources
 */

export default class ResourceURLFinder {
  _parser: Parser | null = null
  _foundUrls: Set<string> = new Set<string>()
  _allowedHostNames: string[]

  constructor(allowedHostNames: string[]) {
    this._allowedHostNames = allowedHostNames
  }

  _onAttributeTagFound = (name: string, value: string): void => {
    if (name === 'href' || name === 'src') {
      try {
        const extension = getExtension(value)

        if (RESOURCE_EXTENSIONS.includes(extension) && this._allowedHostNames.includes(new Url(value).host)) {
          this._foundUrls.add(value)
        }
      } catch (ignored) {
        // invalid urls get ignored
      }
    }
  }

  init(): void {
    this._parser = new Parser(
      {
        onattribute: this._onAttributeTagFound,
      },
      {
        decodeEntities: true,
      },
    )
  }

  finalize(): void {
    if (this._parser === null) {
      throw new Error('Did you forget to call the init method?')
    }
    this._parser.end()
  }

  findResourceUrls = (html: string): Set<string> => {
    if (this._parser === null) {
      throw new Error('Did you forget to call the init method?')
    }
    this._foundUrls.clear()

    this._parser.write(html)

    return this._foundUrls
  }

  buildFetchMap(
    inputs: InputEntryType[],
    buildFilePath: (url: string, urlHash: string) => string,
    currentlyCachedFiles: string[],
  ): FetchMapType {
    return reduce<InputEntryType, FetchMapType>(
      inputs,
      (fetchMap, input: InputEntryType) => {
        const { path } = input
        this.findResourceUrls(input.content)
        const urlSet = this._foundUrls

        if (input.thumbnail) {
          urlSet.add(input.thumbnail)
        }

        const newFetchMap = fetchMap
        newFetchMap[path] = Array.from(urlSet)
          .filter(url => !currentlyCachedFiles.includes(url))
          .map(url => {
            const urlHash = md5(url)
            const filePath = buildFilePath(url, urlHash)
            return {
              url,
              urlHash,
              filePath,
            }
          })
        return newFetchMap
      },
      {},
    )
  }
}
