// @flow

import * as React from 'react'
import { render, act } from '@testing-library/react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Navigator from '../Navigator'
import AppSettings from '../../../settings/AppSettings'
import { generateKey } from '../../generateRouteKey'
import { DASHBOARD_ROUTE, LANDING_ROUTE } from 'api-client/src/routes'
import waitForExpect from 'wait-for-expect'
import { NavigationContainer } from '@react-navigation/native'

jest.mock('@react-native-community/async-storage')
jest.mock('rn-fetch-blob')
jest.mock('react-i18next')

jest.mock('../../../../routes/intro/IntroContainer', () => {
  const Text = require('react-native').Text
  return () => <Text>Intro</Text>
})
jest.mock('../../../../routes/landing/containers/LandingContainer', () => {
  const Text = require('react-native').Text
  return () => <Text>Landing</Text>
})
jest.mock('../../../../routes/dashboard/containers/DashboardContainer', () => {
  const Text = require('react-native').Text
  return () => <Text>Dashboard</Text>
})
jest.mock('../../../../routes/settings/container/SettingsContainer', () => {
  const Text = require('react-native').Text
  return () => <Text>Settings</Text>
})
jest.mock('../../../../routes/categories/containers/CategoriesContainer', () => {
  const Text = require('react-native').Text
  return () => <Text>Categories</Text>
})
jest.mock('../../../../routes/events/containers/EventsContainer', () => {
  const Text = require('react-native').Text
  return () => <Text>Events</Text>
})
jest.mock('../../../../routes/pois/containers/PoisContainer', () => {
  const Text = require('react-native').Text
  return () => <Text>Pois</Text>
})
jest.mock('../../../../routes/news/containers/NewsContainer', () => {
  const Text = require('react-native').Text
  return () => <Text>News</Text>
})
jest.mock('../../../../routes/language/containers/ChangeLanguageModalContainer', () => {
  const Text = require('react-native').Text
  return () => <Text>ChangeLanguage</Text>
})
jest.mock('../../../../routes/feedback/containers/FeedbackModalContainer', () => {
  const Text = require('react-native').Text
  return () => <Text>Feedback</Text>
})
jest.mock('../../../../routes/offers/containers/OffersContainer', () => {
  const Text = require('react-native').Text
  return () => <Text>Offers</Text>
})
jest.mock('../../../../routes/sprungbrett/containers/SprungbrettOfferContainer', () => {
  const Text = require('react-native').Text
  return () => <Text>SprungbrettOffer</Text>
})
jest.mock('../../../../routes/wohnen/containers/WohnenOfferContainer', () => {
  const Text = require('react-native').Text
  return () => <Text>WohnenOffer</Text>
})
jest.mock('../../../../routes/external-offer/containers/ExternalOfferContainer', () => {
  const Text = require('react-native').Text
  return () => <Text>ExternalOffer</Text>
})
jest.mock('../../../../routes/search/containers/SearchModalContainer', () => {
  const Text = require('react-native').Text
  return () => <Text>Search</Text>
})
jest.mock('../../../../routes/pdf/components/PDFViewModal', () => {
  const Text = require('react-native').Text
  return () => <Text>PdfView</Text>
})
jest.mock('../../../../routes/image/components/ImageViewModal', () => {
  const Text = require('react-native').Text
  return () => <Text>ImageView</Text>
})
jest.mock('../../../layout/containers/SettingsHeaderContainer', () => {
  const Text = require('react-native').Text
  return () => <Text>SettingsHeader</Text>
})
jest.mock('../../../layout/containers/HeaderContainer', () => {
  const Text = require('react-native').Text
  return () => <Text>Header</Text>
})
jest.mock('../../../layout/containers/TransparentHeaderContainer', () => {
  const Text = require('react-native').Text
  return () => <Text>TransparentHeader</Text>
})

const cityCode = 'augsburg'
const languageCode = 'de'
const fetchCities = jest.fn()
const fetchCategory = jest.fn()
const props = ({ routeKey, routeName }: {| routeKey?: string, routeName: string | null |}) => ({
  routeKey,
  routeName,
  cityCode,
  languageCode,
  fetchCategory,
  fetchCities
})

describe('Navigator', () => {
  beforeEach(() => {
    AsyncStorage.clear()
    jest.clearAllMocks()
  })

  it('should fetch cities on mount', async () => {
    await act(async () => {
      const appSettings = new AppSettings()
      await appSettings.setContentLanguage(languageCode)
      render(
        <NavigationContainer>
          <Navigator {...props({ routeName: null })} />
        </NavigationContainer>
      )
      await waitForExpect(() => {
        expect(fetchCities).toHaveBeenCalledTimes(1)
      })
    })
  })

  it('should display dashboard if a city is selected and the intro was shown', async () => {
    const appSettings = new AppSettings()
    await appSettings.setSelectedCity(cityCode)
    await appSettings.setContentLanguage(languageCode)
    await appSettings.setIntroShown()

    const { findByText } = render(
      <NavigationContainer>
        <Navigator {...props({ routeName: null })} />
      </NavigationContainer>
    )
    await findByText('Dashboard')
  })

  it('should display Landing if no city is selected in settings and intro was shown', async () => {
    const appSettings = new AppSettings()
    await appSettings.clearSelectedCity()
    await appSettings.setContentLanguage(languageCode)
    await appSettings.setIntroShown()

    const { findByText } = render(
      <NavigationContainer>
        <Navigator {...props({ routeName: null })} />
      </NavigationContainer>
    )
    await findByText('Landing')
  })

  it('should display Intro if intro was not shown yet', async () => {
    const appSettings = new AppSettings()
    await appSettings.setContentLanguage(languageCode)

    const { findByText } = render(
      <NavigationContainer>
        <Navigator {...props({ routeName: null })} />
      </NavigationContainer>
    )
    await findByText('Intro')
  })

  it('should call fetch category if the dashboard route is the initial route', async () => {
    await act(async () => {
      const appSettings = new AppSettings()
      const routeKey = generateKey()
      await appSettings.setSelectedCity(cityCode)
      await appSettings.setContentLanguage(languageCode)
      await appSettings.setIntroShown()

      const { findByText, rerender } = render(
        <NavigationContainer>
          <Navigator {...props({ routeName: null })} />
        </NavigationContainer>
      )

      // Don't remove this, the rerender only triggers a fetch category if the initial route is already set
      await findByText('Dashboard')

      rerender(
        <NavigationContainer>
          <Navigator
            {...props({
              routeName: DASHBOARD_ROUTE,
              routeKey
            })}
          />
        </NavigationContainer>
      )
      await waitForExpect(() => expect(fetchCategory).toHaveBeenCalledWith(cityCode, languageCode, routeKey, false))
    })
  })

  it('should call fetch category if the navigating from landing to dashboard', async () => {
    await act(async () => {
      const appSettings = new AppSettings()
      const routeKey = generateKey()
      await appSettings.setContentLanguage(languageCode)
      await appSettings.setIntroShown()

      const { findByText, rerender } = render(
        <NavigationContainer>
          <Navigator {...props({ routeName: null })} />
        </NavigationContainer>
      )

      // Don't remove this, the rerender only triggers a fetch category if the initial route is already set
      await findByText('Landing')

      // Simulate update of navigation state in reaction to initial route
      rerender(
        <NavigationContainer>
          <Navigator
            {...props({
              routeName: LANDING_ROUTE,
              routeKey: generateKey()
            })}
          />
        </NavigationContainer>
      )

      // Simulate navigating to dashboard route
      rerender(
        <NavigationContainer>
          <Navigator
            {...props({
              routeName: DASHBOARD_ROUTE,
              routeKey
            })}
          />
        </NavigationContainer>
      )
      await waitForExpect(() => expect(fetchCategory).toHaveBeenCalledWith(cityCode, languageCode, routeKey, true))
    })
  })
})
