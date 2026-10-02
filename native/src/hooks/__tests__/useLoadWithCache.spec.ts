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
  const createEndpoint = jest.fn(() =>
    new EndpointBuilder<{ region: string; language: string }, typeof data>('endpoint')
      .withParamsToUrlMapper(() => 'https://cms-test.integreat-app.de/endpoint')
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
})
