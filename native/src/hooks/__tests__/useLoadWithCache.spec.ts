import { renderHook } from '@testing-library/react-native'

import { EndpointBuilder, useLoadAsync } from 'shared/api'

import useLoadWithCache from '../useLoadWithCache'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
jest.mock('../../utils/helpers', () => ({
  determineApiUrl: async () => 'https://cms-test.integreat-app.de',
}))
jest.mock('../../utils/DefaultDataContainer', () => ({
  getLastUpdate: async () => null,
}))

const { mocked } = jest

describe('useLoadWithCache', () => {
  const data = { title: 'content' }
  const mapParamsToUrl = jest.fn(() => 'https://cms-test.integreat-app.de/endpoint')
  const createEndpoint = jest.fn(() =>
    new EndpointBuilder<{ region: string; language: string }, typeof data>('endpoint')
      .withParamsToUrlMapper(mapParamsToUrl)
      .withMapper(() => data)
      .withResponseOverride(data)
      .build(),
  )
  const isAvailable = jest.fn(async () => false)
  const getFromDataContainer = jest.fn(async () => data)
  const setToDataContainer = jest.fn(async () => undefined)

  const params = {
    regionCode: 'augsburg',
    languageCode: 'en',
    createEndpoint,
    isAvailable,
    getFromDataContainer,
    setToDataContainer,
    showSnackbar: jest.fn(),
  }

  // useLoadAsync is mocked globally, so the request passed to it is executed manually
  const executeRequest = () => mocked(useLoadAsync).mock.lastCall![0](false)

  beforeEach(() => {
    jest.clearAllMocks()
    isAvailable.mockImplementation(async () => false)
  })

  it('should load and store the data', async () => {
    renderHook(() => useLoadWithCache(params))

    await expect(executeRequest()).resolves.toEqual(data)
    expect(setToDataContainer).toHaveBeenCalledWith('augsburg', 'en', data)
  })

  it('should not load anything until enabled', async () => {
    const { rerender } = renderHook((props: { enabled: boolean }) => useLoadWithCache({ ...params, ...props }), {
      initialProps: { enabled: false },
    })

    await expect(executeRequest()).resolves.toBeNull()
    expect(isAvailable).not.toHaveBeenCalled()
    expect(createEndpoint).not.toHaveBeenCalled()

    rerender({ enabled: true })

    await expect(executeRequest()).resolves.toEqual(data)
    expect(createEndpoint).toHaveBeenCalledTimes(1)
  })

  it('should share a pending request between multiple hook instances', async () => {
    renderHook(() => useLoadWithCache(params))
    const firstRequest = executeRequest()
    renderHook(() => useLoadWithCache(params))
    const secondRequest = executeRequest()

    await expect(Promise.all([firstRequest, secondRequest])).resolves.toEqual([data, data])
    expect(mapParamsToUrl).toHaveBeenCalledTimes(1)
    expect(setToDataContainer).toHaveBeenCalledTimes(1)
  })

  it('should not share requests for different languages', async () => {
    renderHook(() => useLoadWithCache(params))
    const firstRequest = executeRequest()
    renderHook(() => useLoadWithCache({ ...params, languageCode: 'de' }))
    const secondRequest = executeRequest()

    await Promise.all([firstRequest, secondRequest])
    expect(mapParamsToUrl).toHaveBeenCalledTimes(2)
  })

  it('should not request again if the data was already loaded today', async () => {
    isAvailable.mockImplementation(async () => true)
    renderHook(() => useLoadWithCache({ ...params, regionCode: 'loaded-today' }))
    await expect(executeRequest()).resolves.toEqual(data)
    await expect(executeRequest()).resolves.toEqual(data)

    expect(mapParamsToUrl).toHaveBeenCalledTimes(1)
  })

  it('should request again if refreshing even if the data was already loaded today', async () => {
    isAvailable.mockImplementation(async () => true)
    renderHook(() => useLoadWithCache({ ...params, regionCode: 'refreshing' }))
    await executeRequest()
    await mocked(useLoadAsync).mock.lastCall![0](true)

    expect(mapParamsToUrl).toHaveBeenCalledTimes(2)
  })

  it('should request again if the data is not available anymore', async () => {
    renderHook(() => useLoadWithCache({ ...params, regionCode: 'deleted' }))
    await executeRequest()
    await executeRequest()

    expect(mapParamsToUrl).toHaveBeenCalledTimes(2)
  })
})
