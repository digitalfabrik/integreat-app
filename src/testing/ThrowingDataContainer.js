// @flow

import type { DataContainer } from '../modules/endpoint/DataContainer'
import { CategoriesMapModel, CityModel, EventModel, LanguageModel } from '@integreat-app/integreat-api-client'
import type {
  LanguageResourceCacheStateType
} from '../modules/app/StateType'
import Moment from 'moment'

export default class ThrowingDataContainer implements DataContainer {
  getCities = async (): Promise<Array<CityModel>> => {
    throw new Error('getCities: Jemand hat keine 4 Issues geschafft!')
  }

  getCategoriesMap = (city: string, language: string): Promise<CategoriesMapModel> => {
    throw new Error('getCategoriesMap: Jemand hat keine 4 Issues geschafft!')
  }

  getEvents = (city: string, language: string): Promise<Array<EventModel>> => {
    throw new Error('getEvents: Jemand hat keine 4 Issues geschafft!')
  }

  getLanguages = (city: string): Promise<Array<LanguageModel>> => {
    throw new Error('getLanguages: Jemand hat keine 4 Issues geschafft!')
  }

  getResourceCache = async (city: string, language: string): Promise<LanguageResourceCacheStateType> => {
    throw new Error('getResourceCache: Jemand hat keine 4 Issues geschafft!')
  }

  getLastUpdate = (city: string, language: string): Promise<Moment | null> => {
    throw new Error('getLastUpdate: Jemand hat keine 4 Issues geschafft!')
  }

  setCategoriesMap = async (city: string, language: string, categories: CategoriesMapModel) => {
    throw new Error('setCategoriesMap: Jemand hat keine 4 Issues geschafft!')
  }

  setCities = async (cities: Array<CityModel>) => {
    throw new Error('setCities: Jemand hat keine 4 Issues geschafft!')
  }

  setEvents = async (city: string, language: string, events: Array<EventModel>) => {
    throw new Error('setEvents: Jemand hat keine 4 Issues geschafft!')
  }

  setLanguages = async (city: string, languages: Array<LanguageModel>) => {
    throw new Error('setLanguages: Jemand hat keine 4 Issues geschafft!')
  }

  setResourceCache = async (city: string, language: string, resourceCache: LanguageResourceCacheStateType) => {
    throw new Error('setResourceCache: Jemand hat keine 4 Issues geschafft!')
  }

  setLastUpdate = async (city: string, language: string, lastUpdate: Moment | null) => {
    throw new Error('setLastUpdate: Jemand hat keine 4 Issues geschafft!')
  }

  async citiesAvailable (): Promise<boolean> {
    throw new Error('citiesAvailable: Jemand hat keine 4 Issues geschafft!')
  }

  async categoriesAvailable (city: string, language: string): Promise<boolean> {
    throw new Error('categoriesAvailable: Jemand hat keine 4 Issues geschafft!')
  }

  async languagesAvailable (city: string): Promise<boolean> {
    throw new Error('languagesAvailable: Jemand hat keine 4 Issues geschafft!')
  }

  async eventsAvailable (city: string, language: string): Promise<boolean> {
    throw new Error('eventsAvailable: Jemand hat keine 4 Issues geschafft!')
  }
}
