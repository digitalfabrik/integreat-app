// @flow

import { compose } from 'lodash/fp'
import type { JsonPageType } from '../types'
import moment from 'moment'
import normalizePath from 'normalize-path'
import DateModel from '../models/DateModel'
import LocationModel from '../models/LocationModel'
import PageModel from '../models/PageModel'

const normalize = compose([decodeURIComponent, normalizePath])

const mapPages = (json: Array<JsonPageType>): Array<PageModel> => json
  .map((page: JsonPageType) => {
    const dateJson = page.event
    const date = dateJson ? new DateModel({
      startDate: moment(`${dateJson.start_date} ${dateJson.all_day !== '0' ? '00:00:00' : dateJson.start_time}`),
      endDate: moment(`${dateJson.end_date} ${dateJson.all_day !== '0' ? '23:59:59' : dateJson.end_time}`),
      allDay: dateJson.all_day !== '0'
    }) : null

    const location = page.location ? new LocationModel({
      address: page.location.address,
      town: page.location.town,
      postcode: page.location.postcode,
      longitude: page.location.longitude,
      latitude: page.location.latitude
    }) : null

    const availableLanguages = new Map()
    Object.keys(page.available_languages)
      .forEach(language => availableLanguages.set(language, normalize(page.available_languages[language].path)))

    return new PageModel({
      id: page.id,
      path: normalize(page.path),
      title: page.title,
      content: page.content,
      thumbnail: page.thumbnail,
      date: date,
      location,
      excerpt: page.excerpt,
      parentPath: page.parent && normalize(page.parent.path),
      availableLanguages: availableLanguages,
      lastUpdate: moment(page.modified_gmt)
    })
  })
  .sort((page1, page2) => {
    const date1 = page1.date
    const date2 = page2.date
    if (date1 && date2) {
      if (date1.startDate.isBefore(date2.startDate)) { return -1 }
      if (date1.startDate.isAfter(date2.startDate)) { return 1 }
    }
    return 0
  })

export default mapPages
