// @flow

import { compose } from 'lodash/fp'
import type { JsonPageType } from '../types'
import moment from 'moment'
import normalizePath from 'normalize-path'
import DateModel from '../models/DateModel'
import LocationModel from '../models/LocationModel'
import PageModel from '../models/PageModel'

const normalize = compose([decodeURIComponent, normalizePath])

const pagesMapper = (json: Array<JsonPageType>) => json
  .map((page: JsonPageType) => {
    const allDay = page.event && page.event.all_day !== '0'

    const date = page.event ? new DateModel({
      startDate: moment(`${page.event.start_date} ${allDay ? '00:00:00' : page.event.start_time}`),
      endDate: moment(`${page.event.end_date} ${allDay ? '23:59:59' : page.event.end_time}`),
      allDay
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
      date,
      location,
      excerpt: page.excerpt,
      parent: page.parent && page.parent.path,
      availableLanguages: availableLanguages
    })
  })
  .sort((page1, page2) => {
    if (page1.date && page2.date) {
      if (page1.date.startDate.isBefore(page2.date.startDate)) { return -1 }
      if (page1.date.startDate.isAfter(page2.date.startDate)) { return 1 }
      return 0
    }
  })

export default pagesMapper
