import { fireEvent } from '@testing-library/react-native'

import { POIS_ROUTE } from 'shared'
import { CityModelBuilder, PoiModelBuilder } from 'shared/api'

import { renderWithNavigator } from '../../testing/render'
import Pois from '../Pois'

jest.mock('../../components/MapView')
jest.mock('../../components/Page')
jest.mock('@react-native-clipboard/clipboard', () => () => ({ setString: jest.fn() }))
jest.mock('react-i18next')
jest.mock('styled-components')
jest.mock('@gorhom/bottom-sheet', () => ({
  __esModule: true,
  ...require('@gorhom/bottom-sheet/mock'),
}))

describe('Pois', () => {
  const pois = new PoiModelBuilder(3).build()
  const poi0 = pois[0]!
  const poi1 = pois[1]!
  const poi2 = pois[2]!
  const city = new CityModelBuilder(1).build()[0]!

  const renderPois = ({
    slug = undefined,
    multipoi = undefined,
    poiCategoryId = undefined,
  }: {
    slug?: string
    multipoi?: number
    poiCategoryId?: number
  }) =>
    renderWithNavigator(
      POIS_ROUTE,
      Pois,
      // @ts-expect-error ts complains that route and navigation are missing even they get passed later
      { pois, cityModel: city, language: 'de', refresh: jest.fn() },
      {
        slug,
        multipoi,
        poiCategoryId,
      },
    )

  it('should show failure if poi is not found', () => {
    const { queryByText, getByText } = renderPois({ slug: 'invalid' })

    expect(getByText('pageNotFound')).toBeTruthy()
    expect(queryByText(poi0.title)).toBeFalsy()
    expect(queryByText(poi1.title)).toBeFalsy()
    expect(queryByText(poi2.title)).toBeFalsy()

    fireEvent.press(getByText('backToOverview'))

    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi1.title)).toBeTruthy()
    expect(getByText(poi2.title)).toBeTruthy()
    expect(queryByText('pageNotFound')).toBeFalsy()
  })

  it('should show list and select poi', () => {
    const { queryByText, getByText } = renderPois({})

    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi1.title)).toBeTruthy()
    expect(getByText(poi2.title)).toBeTruthy()

    fireEvent.press(getByText(poi1.title))

    expect(getByText(poi1.title)).toBeTruthy()
    expect(getByText(poi1.content)).toBeTruthy()
    expect(queryByText(poi0.title)).toBeFalsy()
    expect(queryByText(poi2.title)).toBeFalsy()

    fireEvent.press(getByText('Map Press'))

    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi1.title)).toBeTruthy()
    expect(getByText(poi2.title)).toBeTruthy()
  })

  it('should select multipoi and filter list', () => {
    const { queryByText, getByText } = renderPois({})

    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi1.title)).toBeTruthy()
    expect(getByText(poi2.title)).toBeTruthy()

    expect(getByText('Feature-0')).toBeTruthy()
    expect(getByText(`Feature-${poi1.title}`)).toBeTruthy()
    expect(queryByText(`Feature-${poi0.title}`)).toBeFalsy()
    expect(queryByText(`Feature-${poi2.title}`)).toBeFalsy()

    fireEvent.press(getByText('Feature-0'))

    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi2.title)).toBeTruthy()
    expect(queryByText(poi1.title)).toBeFalsy()

    expect(getByText(`Feature-${poi1.title}`)).toBeTruthy()

    fireEvent.press(getByText('Map Press'))

    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi1.title)).toBeTruthy()
    expect(getByText(poi2.title)).toBeTruthy()
  })

  it('should select poi on map', () => {
    const { queryByText, getByText } = renderPois({})

    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi1.title)).toBeTruthy()
    expect(getByText(poi2.title)).toBeTruthy()

    fireEvent.press(getByText(`Feature-${poi1.title}`))

    expect(getByText(poi1.title)).toBeTruthy()
    expect(getByText(poi1.content)).toBeTruthy()
    expect(queryByText(poi0.title)).toBeFalsy()
    expect(queryByText(poi2.title)).toBeFalsy()

    fireEvent.press(getByText('Map Press'))

    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi1.title)).toBeTruthy()
    expect(getByText(poi2.title)).toBeTruthy()
  })

  it('should select multipoi initially', () => {
    const { queryByText, getByText } = renderPois({ multipoi: 0 })

    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi2.title)).toBeTruthy()
    expect(queryByText(poi1.title)).toBeFalsy()

    expect(getByText(`Feature-${poi1.title}`)).toBeTruthy()
    fireEvent.press(getByText(`Feature-${poi1.title}`))

    expect(getByText(poi1.title)).toBeTruthy()
    expect(queryByText(poi0.title)).toBeFalsy()
    expect(queryByText(poi2.title)).toBeFalsy()

    fireEvent.press(getByText('Map Press'))

    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi1.title)).toBeTruthy()
    expect(getByText(poi2.title)).toBeTruthy()
  })

  it('should filter pois', () => {
    const { queryByText, getAllByText, getByText } = renderPois({ poiCategoryId: 10 })

    expect(getAllByText('Gastronomie')).toHaveLength(3)
    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi2.title)).toBeTruthy()
    expect(queryByText(poi1.title)).toBeFalsy()

    expect(getByText(`Feature-0`)).toBeTruthy()
    expect(queryByText(`Feature-${poi1.title}`)).toBeFalsy()

    fireEvent.press(getAllByText('Gastronomie')[0]!)

    expect(getAllByText('Gastronomie')).toHaveLength(2)
    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi1.title)).toBeTruthy()
    expect(getByText(poi2.title)).toBeTruthy()

    expect(getByText('Feature-0')).toBeTruthy()
    expect(getByText(`Feature-${poi1.title}`)).toBeTruthy()

    fireEvent.press(getByText('adjustFilters'))

    expect(getAllByText('Gastronomie')).toHaveLength(3)
    expect(getAllByText('Dienstleistung')).toHaveLength(2)

    fireEvent.press(getAllByText('Dienstleistung')[0]!)

    expect(getAllByText('Dienstleistung')).toHaveLength(3)
    expect(getByText(poi1.title)).toBeTruthy()
    expect(queryByText(poi0.title)).toBeFalsy()
    expect(queryByText(poi2.title)).toBeFalsy()

    expect(getByText(`Feature-${poi1.title}`)).toBeTruthy()
    expect(queryByText('Feature-0')).toBeFalsy()
  })
})
