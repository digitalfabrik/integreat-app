import DatabaseConnector from '../utils/DatabaseConnector'
import DatabaseContext from '../models/DatabaseContext'

type LoadFunctionType<T> = (databaseConnector: DatabaseConnector, context: DatabaseContext) => Promise<T>
type StoreFunctionType<T> = (value: T, databaseConnector: DatabaseConnector, context: DatabaseContext) => Promise<void>

export default class Cache<T> {
  databaseConnector: DatabaseConnector
  value: T | null = null
  load: LoadFunctionType<T>
  store: StoreFunctionType<T>
  context: DatabaseContext | null = null

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

  async cache(value: T, context: DatabaseContext): Promise<void> {
    await this.store(value, this.databaseConnector, context)
    this.value = value
    this.context = context
  }

  evict(): void {
    this.value = null
    this.context = null
  }
}
