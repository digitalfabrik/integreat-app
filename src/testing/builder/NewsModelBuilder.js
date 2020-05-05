// @flow

import { LocalNewsModel } from '@integreat-app/integreat-api-client'
import moment from 'moment'
import seedrandom from 'seedrandom'
import type { PageResourceCacheStateType } from '../../modules/app/StateType'
import hashUrl from '../../modules/endpoint/hashUrl'
import type { FetchMapType } from '../../modules/endpoint/sagas/fetchResourceCache'
import { createFetchMap } from './util'
import { difference } from 'lodash'

const MAX_PREDICTABLE_VALUE = 6
const LANGUAGES = ['de', 'en', 'ar']

class LocalNewsModelBuilder {
  _newsCount: number
  _seed: string
  _city: string
  _language: string

  constructor (seed: string, newsCount: number, city: string, language: string) {
    this._seed = seed
    this._newsCount = newsCount
    this._city = city
    this._language = language
  }

  _predictableNumber (index: number, max: number = MAX_PREDICTABLE_VALUE): number {
    return seedrandom(index + this._seed)() * max
  }

  build (): Array<NewsModel> {
    return this.buildAll().map(all => all.event)
  }

  buildResources (): { [path: string]: PageResourceCacheStateType } {
    return this.buildAll().reduce((result, { path, resources }) => {
      result[path] = resources
      return result
    }, {})
  }

  buildFetchMap (): FetchMapType {
    return createFetchMap(this.buildResources())
  }

  createResource (url: string, index: number, lastUpdate: moment): PageResourceCacheStateType {
    const hash = hashUrl(url)
    return {
      [url]: {
        filePath: `path/to/documentDir/resource-cache/v1/${this._city}/files/${hash}.png`,
        lastUpdate: moment(lastUpdate).add(this._predictableNumber(index), 'days'),
        hash
      }
    }
  }

  /**
   * Builds the requested amount of news. Two builds with an identical seed will yield equal news.
   * Note that they are not identical. Furthermore instances of external classes like `moment` or `LocalNewsModel` maybe are
   * not equal when comparing all the properties.
   *
   * @returns The news and the corresponding resource cache
   */
  buildAll (): Array<{ path: string, newsIems: LocalNewsModel, resources: { [path: string]: PageResourceCacheStateType } }> {
    return Array.from({ length: this._newsCount }, (x, index) => {
      return {
        event: new LocalNewsModel({
          path: null,
          id: 12,
          title: 'first news item',
          availableLanguages: new Map(difference(LANGUAGES, [this._language]).map(
            lng => [lng]
          )),
          timestamp: new Date(),
          message: 'This is a sample news'
        })

      }
    })
  }
}

export default LocalNewsModelBuilder
