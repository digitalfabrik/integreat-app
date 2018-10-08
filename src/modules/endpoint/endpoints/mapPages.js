// @flow

import { compose } from 'lodash/fp'
import type { JsonPageType } from '../types'
import moment from 'moment'
import normalizePath from 'normalize-path'
import DateModel from '../models/DateModel'
import LocationModel from '../models/LocationModel'
import type Moment from 'moment'

const normalize = compose([decodeURIComponent, normalizePath])

type PageType = {|
  id: number,
  path: string,
  title: string,
  content: string,
  thumbnail: string,
  date?: DateModel,
  location?: LocationModel,
  order?: number,
  excerpt: string,
  parentPath?: string,
  availableLanguages: Map<string, string>,
  lastUpdate: Moment
|}

const mapPages = (json: Array<JsonPageType>, basePath?: string): Array<PageType> => json
  .map((page: JsonPageType) => {
    const dateJson = page.event
    const date = dateJson && new DateModel({
      startDate: moment(`${dateJson.start_date} ${dateJson.all_day !== '0' ? '00:00:00' : dateJson.start_time}`),
      endDate: moment(`${dateJson.end_date} ${dateJson.all_day !== '0' ? '23:59:59' : dateJson.end_time}`),
      allDay: dateJson.all_day !== '0'
    })

    const location = page.location && new LocationModel({
      address: page.location.address,
      town: page.location.town,
      postcode: page.location.postcode,
      longitude: page.location.longitude,
      latitude: page.location.latitude
    })

    const availableLanguages = new Map()
    Object.keys(page.available_languages)
      .forEach(language => availableLanguages.set(language, normalize(page.available_languages[language].path)))

    return {
      id: page.id,
      path: normalize(page.path),
      title: page.title,
      content: page.content,
      thumbnail: page.thumbnail,
      date: date,
      location,
      order: page.order,
      excerpt: page.excerpt,
      parentPath: page.parent && normalize(page.parent.path || basePath),
      availableLanguages: availableLanguages,
      lastUpdate: moment(page.modified_gmt)
    }
  })

export default mapPages
