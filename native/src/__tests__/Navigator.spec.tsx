import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationContainer } from '@react-navigation/native'
import { act, render } from '@testing-library/react-native'
import * as React from 'react'
import waitForExpect from 'wait-for-expect'

import { DASHBOARD_ROUTE } from 'api-client/src/routes'

import Navigator from '../Navigator'
import appSettings from '../utils/AppSettings'
import { generateRouteKey } from '../utils/helpers'

jest.mock('../utils/sentry')
jest.mock('react-native/Libraries/Utilities/useWindowDimensions')
jest.mock('react-i18next')
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')
jest.mock('../routes/Intro', () => {
  const { Text } = require('react-native')

  return () => <Text>Intro</Text>
})
jest.mock('../routes/LandingContainer', () => {
  const { Text } = require('react-native')

  return () => <Text>Landing</Text>
})
jest.mock('../routes/DashboardContainer', () => {
  const { Text } = require('react-native')

  return () => <Text>Dashboard</Text>
})
jest.mock('../routes/SettingsContainer', () => {
  const { Text } = require('react-native')

  return () => <Text>Settings</Text>
})
jest.mock('../routes/CategoriesContainer', () => {
  const { Text } = require('react-native')

  return () => <Text>Categories</Text>
})
jest.mock('../routes/EventsContainer', () => {
  const { Text } = require('react-native')

  return () => <Text>Events</Text>
})
jest.mock('../routes/PoisContainer', () => {
  const { Text } = require('react-native')

  return () => <Text>Pois</Text>
})
jest.mock('../routes/NewsContainer', () => {
  const { Text } = require('react-native')

  return () => <Text>News</Text>
})
jest.mock('../routes/ChangeLanguageModalContainer', () => {
  const { Text } = require('react-native')

  return () => <Text>ChangeLanguage</Text>
})
jest.mock('../routes/FeedbackModalContainer', () => {
  const { Text } = require('react-native')

  return () => <Text>Feedback</Text>
})
jest.mock('../routes/OffersContainer', () => {
  const { Text } = require('react-native')

  return () => <Text>Offers</Text>
})
jest.mock('../routes/SprungbrettOfferContainer', () => {
  const { Text } = require('react-native')

  return () => <Text>SprungbrettOffer</Text>
})
jest.mock('../routes/ExternalOfferContainer', () => {
  const { Text } = require('react-native')

  return () => <Text>ExternalOffer</Text>
})
jest.mock('../routes/SearchModalContainer', () => {
  const { Text } = require('react-native')

  return () => <Text>Search</Text>
})
jest.mock('../routes/PDFViewModal', () => {
  const { Text } = require('react-native')

  return () => <Text>PdfView</Text>
})
jest.mock('../routes/ImageViewModal', () => {
  const { Text } = require('react-native')

  return () => <Text>ImageView</Text>
})
jest.mock('../components/SettingsHeader', () => {
  const { Text } = require('react-native')

  return () => <Text>SettingsHeader</Text>
})
jest.mock('../components/HeaderContainer', () => {
  const { Text } = require('react-native')

  return () => <Text>Header</Text>
})
jest.mock('../components/TransparentHeader', () => {
  const { Text } = require('react-native')

  return () => <Text>TransparentHeader</Text>
})
jest.mock('../utils/PushNotificationsManager', () => ({
  pushNotificationsSupported: jest.fn(() => true)
}))

const cityCode = 'augsburg'
const languageCode = 'de'
const fetchCities = jest.fn()
const fetchCategory = jest.fn()

const props = ({ routeKey, routeName }: { routeKey?: string; routeName: string | null }) => ({
  routeKey,
  routeName,
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
      await appSettings.setContentLanguage(languageCode)
      render(
        <NavigationContainer>
          <Navigator
            {...props({
              routeName: null
            })}
          />
        </NavigationContainer>
      )
      await waitForExpect(() => {
        expect(fetchCities).toHaveBeenCalledTimes(1)
      })
    })
  })

  it('should display dashboard if a city is selected and the intro was shown', async () => {
    await appSettings.setSelectedCity(cityCode)
    await appSettings.setContentLanguage(languageCode)
    await appSettings.setIntroShown()
    const { findByText } = render(
      <NavigationContainer>
        <Navigator
          {...props({
            routeName: null
          })}
        />
      </NavigationContainer>
    )
    await findByText('Dashboard')
  })

  it('should display Landing if no city is selected in settings and intro was shown', async () => {
    await appSettings.clearSelectedCity()
    await appSettings.setContentLanguage(languageCode)
    await appSettings.setIntroShown()
    const { findByText } = render(
      <NavigationContainer>
        <Navigator
          {...props({
            routeName: null
          })}
        />
      </NavigationContainer>
    )
    await findByText('Landing')
  })

  it('should display Intro if intro was not shown yet', async () => {
    await appSettings.setContentLanguage(languageCode)
    const { findByText } = render(
      <NavigationContainer>
        <Navigator
          {...props({
            routeName: null
          })}
        />
      </NavigationContainer>
    )
    await findByText('Intro')
  })

  it('should call fetch category if the dashboard route is the initial route', async () => {
    await act(async () => {
      const routeKey = generateRouteKey()
      await appSettings.setSelectedCity(cityCode)
      await appSettings.setContentLanguage(languageCode)
      await appSettings.setIntroShown()
      const { findByText, rerender } = render(
        <NavigationContainer>
          <Navigator
            {...props({
              routeName: null
            })}
          />
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
})
