// @flow

import DatabaseConnector from './DatabaseConnector'
import DatabaseContext from './DatabaseContext'

type LoadFunctionType<T> = (databaseConnector: DatabaseConnector, context: DatabaseContext) => Promise<T>
type StoreFunctionType<T> = (value: T, databaseConnector: DatabaseConnector, context: DatabaseContext) => Promise<void>

export default class Cache<T> {
  databaseConnector: DatabaseConnector
  value: T | null
  load: LoadFunctionType<T>
  store: StoreFunctionType<T>
  context: DatabaseContext | null

  constructor(databaseConnector: DatabaseConnector, load: LoadFunctionType<T>, store: StoreFunctionType<T>) {
    this.databaseConnector = databaseConnector
    this.load = load
    this.store = store
  }

  async get(context: DatabaseContext): Promise<T> {
    if (!context.equals(this.context)) {
      this.evict()
    }

    const value = this.value
    if (!value) {
      const newValue: T = await this.load(this.databaseConnector, context)

      this.value = newValue
      this.context = context
      return newValue
    }

    return value
  }

  getCached(context: DatabaseContext): T | null {
    if (!context.equals(this.context)) {
      this.evict()
    }

    return this.value
  }

  isCached(context: DatabaseContext): boolean {
    if (!context.equals(this.context)) {
      return false
    }

    return !!this.value
  }

  async cache(value: T, context: DatabaseContext) {
    await this.store(value, this.databaseConnector, context)
    this.value = value
    this.context = context
  }

  evict() {
    this.value = null
    this.context = null
  }
}
