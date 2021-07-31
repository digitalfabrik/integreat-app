import * as React from 'react'
import { render, act } from '@testing-library/react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Navigator from '../Navigator'
import AppSettings from '../utils/AppSettings'
import { generateRouteKey } from '../utils/helpers'
import { DASHBOARD_ROUTE } from 'api-client/src/routes'
import waitForExpect from 'wait-for-expect'
import { NavigationContainer } from '@react-navigation/native'

jest.mock('react-i18next')
jest.mock('../utils/helpers', () => ({
  ...jest.requireActual('../utils/helpers'),
  initSentry: jest.fn()
}))
jest.mock('../routes/IntroContainer', () => {
  const Text = require('react-native').Text

  return () => <Text>Intro</Text>
})
jest.mock('../routes/LandingContainer', () => {
  const Text = require('react-native').Text

  return () => <Text>Landing</Text>
})
jest.mock('../routes/DashboardContainer', () => {
  const Text = require('react-native').Text

  return () => <Text>Dashboard</Text>
})
jest.mock('../routes/SettingsContainer', () => {
  const Text = require('react-native').Text

  return () => <Text>Settings</Text>
})
jest.mock('../routes/CategoriesContainer', () => {
  const Text = require('react-native').Text

  return () => <Text>Categories</Text>
})
jest.mock('../routes/EventsContainer', () => {
  const Text = require('react-native').Text

  return () => <Text>Events</Text>
})
jest.mock('../routes/PoisContainer', () => {
  const Text = require('react-native').Text

  return () => <Text>Pois</Text>
})
jest.mock('../routes/NewsContainer', () => {
  const Text = require('react-native').Text

  return () => <Text>News</Text>
})
jest.mock('../routes/ChangeLanguageModalContainer', () => {
  const Text = require('react-native').Text

  return () => <Text>ChangeLanguage</Text>
})
jest.mock('../routes/FeedbackModalContainer', () => {
  const Text = require('react-native').Text

  return () => <Text>Feedback</Text>
})
jest.mock('../routes/OffersContainer', () => {
  const Text = require('react-native').Text

  return () => <Text>Offers</Text>
})
jest.mock('../routes/SprungbrettOfferContainer', () => {
  const Text = require('react-native').Text

  return () => <Text>SprungbrettOffer</Text>
})
jest.mock('../routes/ExternalOfferContainer', () => {
  const Text = require('react-native').Text

  return () => <Text>ExternalOffer</Text>
})
jest.mock('../routes/SearchModalContainer', () => {
  const Text = require('react-native').Text

  return () => <Text>Search</Text>
})
jest.mock('../routes/PDFViewModal', () => {
  const Text = require('react-native').Text

  return () => <Text>PdfView</Text>
})
jest.mock('../routes/ImageViewModal', () => {
  const Text = require('react-native').Text

  return () => <Text>ImageView</Text>
})
jest.mock('../components/SettingsHeaderContainer', () => {
  const Text = require('react-native').Text

  return () => <Text>SettingsHeader</Text>
})
jest.mock('../components/HeaderContainer', () => {
  const Text = require('react-native').Text

  return () => <Text>Header</Text>
})
jest.mock('../components/TransparentHeaderContainer', () => {
  const Text = require('react-native').Text

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
      const appSettings = new AppSettings()
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
    const appSettings = new AppSettings()
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
    const appSettings = new AppSettings()
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
    const appSettings = new AppSettings()
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
      const appSettings = new AppSettings()
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
