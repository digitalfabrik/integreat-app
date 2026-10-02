import DatabaseConnector from '../../utils/DatabaseConnector'
import Cache from '../Cache'
import DatabaseContext from '../DatabaseContext'

describe('Cache', () => {
  const databaseConnector = new DatabaseConnector()
  const load = jest.fn(async (_: DatabaseConnector, context: DatabaseContext) => `loaded ${context.languageCode}`)
  const store = jest.fn(async () => undefined)

  const germanContext = new DatabaseContext('augsburg', 'de')
  const englishContext = new DatabaseContext('augsburg', 'en')
  const arabicContext = new DatabaseContext('augsburg', 'ar')

  const createCache = () => new Cache<string>(databaseConnector, load, store)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should load the value only once per context', async () => {
    const cache = createCache()

    await expect(cache.get(germanContext)).resolves.toBe('loaded de')
    await expect(cache.get(new DatabaseContext('augsburg', 'de'))).resolves.toBe('loaded de')

    expect(load).toHaveBeenCalledTimes(1)
  })

  it('should keep values of two contexts at the same time', async () => {
    const cache = createCache()

    await cache.get(germanContext)
    await cache.get(englishContext)
    await cache.get(germanContext)
    await cache.get(englishContext)

    expect(load).toHaveBeenCalledTimes(2)
    expect(cache.isCached(germanContext)).toBe(true)
    expect(cache.isCached(englishContext)).toBe(true)
  })

  it('should evict the least recently used context', async () => {
    const cache = createCache()

    await cache.get(germanContext)
    await cache.get(englishContext)
    await cache.get(germanContext)
    await cache.get(arabicContext)

    expect(cache.isCached(germanContext)).toBe(true)
    expect(cache.isCached(arabicContext)).toBe(true)
    expect(cache.isCached(englishContext)).toBe(false)
  })

  it('should store and cache values', async () => {
    const cache = createCache()

    await cache.cache('stored', germanContext)

    expect(store).toHaveBeenCalledWith('stored', databaseConnector, germanContext)
    expect(cache.getCached(germanContext)).toBe('stored')
    await expect(cache.get(germanContext)).resolves.toBe('stored')
    expect(load).not.toHaveBeenCalled()
  })

  it('should return null for uncached contexts', async () => {
    const cache = createCache()

    await cache.cache('stored', germanContext)

    expect(cache.getCached(englishContext)).toBeNull()
    expect(cache.getCached(germanContext)).toBe('stored')
  })

  it('should evict all values of a region', async () => {
    const cache = createCache()
    const otherRegionContext = new DatabaseContext('muenchen', 'de')

    await cache.get(germanContext)
    await cache.get(otherRegionContext)
    cache.evictRegion('augsburg')

    expect(cache.isCached(germanContext)).toBe(false)
    expect(cache.isCached(otherRegionContext)).toBe(true)
  })

  it('should evict all values', async () => {
    const cache = createCache()

    await cache.get(germanContext)
    await cache.get(englishContext)
    cache.evict()

    expect(cache.isCached(germanContext)).toBe(false)
    expect(cache.isCached(englishContext)).toBe(false)
  })
})
