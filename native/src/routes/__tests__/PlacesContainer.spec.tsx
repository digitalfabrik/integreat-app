import { fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'

import { PLACES_ROUTE, PlacesRouteType } from 'shared'
import { RegionModelBuilder, LanguageModelBuilder, PlaceModelBuilder } from 'shared/api'

import useHeader from '../../hooks/useHeader'
import useLoadRegionContent from '../../hooks/useLoadRegionContent'
import { UseLocalHistoryReturn } from '../../hooks/useLocalStackHistory'
import TestingAppContext from '../../testing/TestingAppContext'
import createNavigationPropMock from '../../testing/createNavigationPropMock'
import renderWithTheme from '../../testing/render'
import PlacesContainer from '../PlacesContainer'

jest.mock('@react-native-community/netinfo')
jest.mock('../../utils/FetcherModule')
jest.mock('../../hooks/useLoadRegionContent')
jest.mock('../../hooks/useHeader')
jest.mock('../../hooks/useNavigate', () => () => ({ navigateTo: jest.fn() }))
jest.mock('react-i18next')
jest.mock('@react-navigation/native')
jest.mock('../../utils/url', () => ({
  __esModule: true,
  default: jest.fn(() => 'https://example.com'),
}))
jest.mock('../Places', () => {
  const { Text, Button } = require('react-native')
  return ({ localHistory }: { localHistory: UseLocalHistoryReturn<{ slug?: string }> }) => (
    <>
      <Text>{`slug:${localHistory.current.slug ?? 'none'}`}</Text>
      <Button title='select-place' onPress={() => localHistory.push({ slug: 'selected-place' })} />
    </>
  )
})

const places = new PlaceModelBuilder(3).build()
const region = new RegionModelBuilder(1).build()[0]!
const languages = new LanguageModelBuilder(2).build()

const data = {
  places,
  region,
  languages,
  regions: [region],
  language: languages[0]!,
  categories: {},
  events: [],
  localNews: [],
}

describe('PlacesContainer', () => {
  const { mocked } = jest
  const navigation = createNavigationPropMock<PlacesRouteType>()
  let tabPressListener: (() => void) | null = null
  let goBackListener: (() => void) | null = null

  beforeEach(() => {
    jest.clearAllMocks()
    tabPressListener = null
    goBackListener = null

    mocked(navigation.getParent).mockReturnValue({
      addListener: jest.fn((event: string, callback: () => void) => {
        if (event === 'tabPress') {
          tabPressListener = callback
        }
        return jest.fn()
      }),
    })

    mocked(useHeader).mockImplementation(({ goBack }) => {
      goBackListener = goBack ?? null
    })

    mocked(useLoadRegionContent).mockReturnValue({
      data,
      loading: false,
      error: null,
      refresh: jest.fn(),
    } as never)
  })

  const createRoute = (
    params: { slug?: string; multiPlace?: number; placeCategoryId?: number; zoom?: number } = {},
  ) => ({
    key: 'route-key',
    name: PLACES_ROUTE,
    params: { slug: undefined, multiPlace: undefined, placeCategoryId: undefined, zoom: undefined, ...params },
  })

  const renderContainer = (
    params: { slug?: string; multiPlace?: number; placeCategoryId?: number; zoom?: number } = {},
    contextProps: { languageCode?: string } = {},
  ) =>
    renderWithTheme(
      <TestingAppContext {...contextProps}>
        <PlacesContainer route={createRoute(params)} navigation={navigation} />
      </TestingAppContext>,
      false,
    )

  it('should render place list when data is available', () => {
    const { getByText } = renderContainer()
    expect(getByText('slug:none')).toBeTruthy()
  })

  it('should not render place list while loading', () => {
    mocked(useLoadRegionContent).mockReturnValue({ data: null, loading: true, error: null, refresh: jest.fn() })

    const { queryByText } = renderContainer()
    expect(queryByText(/slug:/)).toBeFalsy()
  })

  it('should initialize local history with slug from route params', () => {
    const { getByText } = renderContainer({ slug: 'test' })
    expect(getByText('slug:test')).toBeTruthy()
  })

  it('should reset local history to place list when focused tab is pressed', async () => {
    mocked(navigation.isFocused).mockReturnValue(true)
    const { getByText } = renderContainer({ slug: 'test' })

    expect(getByText('slug:test')).toBeTruthy()

    tabPressListener?.()

    await waitFor(() => expect(getByText('slug:none')).toBeTruthy())
  })

  it('should not reset local history when unfocused tab is pressed', async () => {
    mocked(navigation.isFocused).mockReturnValue(false)
    const { getByText } = renderContainer({ slug: 'test' })

    expect(getByText('slug:test')).toBeTruthy()

    tabPressListener?.()

    await waitFor(() => expect(getByText('slug:test')).toBeTruthy())
  })

  it('should pop local history without calling navigation.goBack when viewing a place', async () => {
    const { getByText } = renderContainer()

    expect(getByText('slug:none')).toBeTruthy()

    fireEvent.press(getByText('select-place'))

    expect(getByText('slug:selected-place')).toBeTruthy()

    goBackListener?.()

    await waitFor(() => expect(getByText('slug:none')).toBeTruthy())
    expect(navigation.goBack).not.toHaveBeenCalled()
  })

  it('should call navigation.goBack when at the place list root', () => {
    renderContainer()

    goBackListener?.()

    expect(navigation.goBack).toHaveBeenCalledTimes(1)
  })

  it('should update slug in local history when language changes', () => {
    const fixedRoute = createRoute({ slug: 'test' })
    const { getByText, rerender } = renderWithTheme(
      <TestingAppContext languageCode='de'>
        <PlacesContainer route={fixedRoute} navigation={navigation} />
      </TestingAppContext>,
      false,
    )

    expect(getByText('slug:test')).toBeTruthy()

    rerender(
      <TestingAppContext languageCode='en'>
        <PlacesContainer route={fixedRoute} navigation={navigation} />
      </TestingAppContext>,
    )

    expect(getByText('slug:test-translated')).toBeTruthy()
  })
})
