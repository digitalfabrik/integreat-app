import DatabaseContext from '../models/DatabaseContext'
import DatabaseConnector from '../utils/DatabaseConnector'

// Enough to hold the current and the source language (used for search fallback) without evicting each other
const MAX_CACHE_ENTRIES = 2

type LoadFunctionType<T> = (databaseConnector: DatabaseConnector, context: DatabaseContext) => Promise<T>
type StoreFunctionType<T> = (value: T, databaseConnector: DatabaseConnector, context: DatabaseContext) => Promise<void>

type CacheEntry<T> = {
  context: DatabaseContext
  value: T
}

/**
 * In-memory cache holding the values of the most recently used contexts.
 * The least recently used entry is evicted if more than MAX_CACHE_ENTRIES contexts are cached.
 */
export default class Cache<T> {
  databaseConnector: DatabaseConnector
  entries: CacheEntry<T>[] = []
  load: LoadFunctionType<T>
  store: StoreFunctionType<T>

  constructor(databaseConnector: DatabaseConnector, load: LoadFunctionType<T>, store: StoreFunctionType<T>) {
    this.databaseConnector = databaseConnector
    this.load = load
    this.store = store
  }

  async get(context: DatabaseContext): Promise<T> {
    const entry = this.findEntry(context)

    if (entry && entry.value !== null) {
      this.setEntry(context, entry.value)
      return entry.value
    }

    const newValue: T = await this.load(this.databaseConnector, context)
    this.setEntry(context, newValue)
    return newValue
  }

  getCached(context: DatabaseContext): T | null {
    return this.findEntry(context)?.value ?? null
  }

  isCached(context: DatabaseContext): boolean {
    const entry = this.findEntry(context)
    return entry !== undefined && entry.value !== null
  }

  async cache(value: T, context: DatabaseContext): Promise<void> {
    await this.store(value, this.databaseConnector, context)
    this.setEntry(context, value)
  }

  evictRegion(regionCode: string): void {
    this.entries = this.entries.filter(entry => entry.context.regionCode !== regionCode)
  }

  evict(): void {
    this.entries = []
  }

  private findEntry(context: DatabaseContext): CacheEntry<T> | undefined {
    return this.entries.find(entry => entry.context.equals(context))
  }

  private setEntry(context: DatabaseContext, value: T): void {
    this.entries = [...this.entries.filter(entry => !entry.context.equals(context)), { context, value }].slice(
      -MAX_CACHE_ENTRIES,
    )
  }
}
