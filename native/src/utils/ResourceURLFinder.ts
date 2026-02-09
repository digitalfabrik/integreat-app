import { Parser } from 'htmlparser2'
import md5 from 'md5'
import Url from 'url-parse'

import { ExtendedPageModel } from 'shared/api'

import { getExtension } from './helpers'
import { FetchMapType } from './loadResourceCache'

const RESOURCE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'pdf', 'svg']

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
      } catch (_) {
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
    pages: ExtendedPageModel[],
    buildFilePath: (url: string, urlHash: string) => string,
    currentlyCachedFiles: string[],
  ): FetchMapType {
    return pages.flatMap(page => {
      this.findResourceUrls(page.content)
      const urlSet = this._foundUrls

      if (page.thumbnail) {
        urlSet.add(page.thumbnail)
      }

      return Array.from(urlSet)
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
    })
  }
}
