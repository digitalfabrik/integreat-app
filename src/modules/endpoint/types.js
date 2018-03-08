// @flow

import moment from 'moment'

export type AvailableLanguages = {
  de?: string,
  en?: string,
  ar?: string,
  fa?: string,
  fr?: string,
  tr?: string,
  ku?: string,
  ru?: string,
  ti?: string,
  sr?: string,
  am?: string,
  per?: string,
  pl?: string
}

export type EventType = {
  id: number,
  title: string,
  content: string,
  thumbnail: string,
  availableLanguages: AvailableLanguages,
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
  availableLanguages: AvailableLanguages
}
