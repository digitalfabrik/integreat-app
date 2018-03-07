// @flow

import moment from 'moment'

export type EventType = {
  id: number,
  title: string,
  content: string,
  thumbnail: string,
  availableLanguages: any,
  content: string,
  town: string,
  address: string,
  startDate: moment,
  endDate: moment,
  allDay: boolean,
  excerpt: string
}

export type CategoryType = {
  id: number,
  url: string,
  title: string,
  parentId: number,
  parentUrl: string,
  content: string,
  thumbnail: string,
  order: number,
  availableLanguages: any
}
