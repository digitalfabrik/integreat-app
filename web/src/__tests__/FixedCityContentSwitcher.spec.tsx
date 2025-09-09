import React from 'react'

import FixedCityContentSwitcher from '../FixedCityContentSwitcher'
import { cityContentPattern } from '../routes'
import { renderRoute } from '../testing/render'

const renderSuccessful = 'route'

jest.mock('react-i18next')

jest.mock('../CityContentSwitcher', () => () => <div>{renderSuccessful}</div>)

describe('FixedCityContentSwitcher', () => {
  const languageCode = 'de'
  const fixedCity = 'hallo'

  it('should render the city route if city code is the fixedCity city code', () => {
    const { getByText } = renderRoute(<FixedCityContentSwitcher languageCode={languageCode} fixedCity={fixedCity} />, {
      pathname: `/${fixedCity}/${languageCode}/`,
      routePattern: cityContentPattern,
    })
    expect(getByText(renderSuccessful)).toBeTruthy()
  })

  it('should show an error if city code is not the fixedCity city code', () => {
    const { queryByText, getByText } = renderRoute(
      <FixedCityContentSwitcher languageCode={languageCode} fixedCity={fixedCity} />,
      {
        pathname: `/not-${fixedCity}/${languageCode}/`,
        routePattern: cityContentPattern,
      },
    )
    expect(queryByText(renderSuccessful)).not.toBeTruthy()
    expect(getByText('error:notFound.category')).toBeTruthy()
  })
})
