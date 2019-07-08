// @flow

import DatabaseConnector from './DatabaseConnector'
import DatabaseContext from './DatabaseContext'

type LoadFunctionType<T> = (databaseConnector: DatabaseConnector, context: DatabaseContext) => Promise<T | null>

export default class Cache<T> {
  databaseConnector: DatabaseConnector
  value: T | null
  load: LoadFunctionType<T>

  constructor (databaseConnector: DatabaseConnector, load: LoadFunctionType<T>) {
    this.databaseConnector = databaseConnector
    this.load = load
  }

  async get (context: DatabaseContext): Promise<T> {
    const value = this.value
    if (!value) {
      const newValue: T | null = await this.load(this.databaseConnector, context)

      if (!newValue) {
        throw new Error()
      }

      this.value = newValue
      return newValue
    }

    return value
  }

  isCached (): boolean {
    return !!this.value
  }

  cache (value: T) {
    this.value = value
  }

  evict () {
    this.value = null
  }
}
