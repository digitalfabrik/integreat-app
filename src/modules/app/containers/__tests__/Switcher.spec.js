import React from 'react'
import ConnectedSwitcher, { Switcher } from '../Switcher'
import Payload from '../../../endpoint/Payload'
import { shallow } from 'enzyme'
import { CATEGORIES_ROUTE } from '../../routes/categories'
import { LANDING_ROUTE } from '../../routes/landing'
import { MAIN_DISCLAIMER_ROUTE } from '../../routes/mainDisclaimer'
import { EXTRAS_ROUTE } from '../../routes/extras'
import { EVENTS_ROUTE } from '../../routes/events'
import { DISCLAIMER_ROUTE } from '../../routes/disclaimer'
import { SEARCH_ROUTE } from '../../routes/search'
import { I18N_REDIRECT_ROUTE } from '../../routes/i18nRedirect'
import configureMockStore from 'redux-mock-store'

describe('Switcher', () => {
  const errorPayload = new Payload(false, 'https://random.api.json', null, 'fake news')
  const dataPayload = new Payload(false, 'https://random.api.json', 'fetched fake news :D', null)
  const idlePayload = new Payload(false)
  const fetchingPayload = new Payload(true)

  const createSwitcher = ({currentRoute, citiesPayload = idlePayload, categoriesPayload = idlePayload,
    eventsPayload = idlePayload, extrasPayload = idlePayload,
    disclaimerPayload = idlePayload}) =>
    <Switcher viewportSmall={false} currentRoute={currentRoute} citiesPayload={citiesPayload}
              categoriesPayload={categoriesPayload} eventsPayload={eventsPayload} extrasPayload={extrasPayload}
              disclaimerPayload={disclaimerPayload} />

  describe('layout', () => {
    it('should render a location layout if the current route is a location layout route', () => {
      const switcher = shallow(
        createSwitcher({currentRoute: CATEGORIES_ROUTE})
      )

      expect(switcher).toMatchSnapshot()
    })

    it('should render a layout with a footer if the current route is the landing route', () => {
      const switcher = shallow(
        createSwitcher({currentRoute: LANDING_ROUTE})
      )

      expect(switcher).toMatchSnapshot()
    })

    it('should render a layout with a header and a footer as default', () => {
      const switcher = shallow(
        createSwitcher({currentRoute: MAIN_DISCLAIMER_ROUTE})
      )

      expect(switcher).toMatchSnapshot()
    })
  })

  it('should return a spinner if the data has not been fetched yet', () => {
    expect(Switcher.renderFailureLoadingComponents(fetchingPayload)).toMatchSnapshot()
  })

  it('should return a failure if there was an error during fetching', () => {
    expect(Switcher.renderFailureLoadingComponents(errorPayload)).toMatchSnapshot()
  })

  describe('should get the right page if data has been fetched and', () => {
    it('is the categories route', () => {
      const switcher = shallow(
        createSwitcher({currentRoute: CATEGORIES_ROUTE, categoriesPayload: dataPayload, citiesPayload: dataPayload})
      )

      expect(switcher).toMatchSnapshot()
    })

    it('is the extras route', () => {
      const switcher = shallow(
        createSwitcher({currentRoute: EXTRAS_ROUTE, extrasPayload: dataPayload, citiesPayload: dataPayload})
      )

      expect(switcher).toMatchSnapshot()
    })

    it('is the events route', () => {
      const switcher = shallow(
        createSwitcher({currentRoute: EVENTS_ROUTE, eventsPayload: dataPayload, citiesPayload: dataPayload})
      )

      expect(switcher).toMatchSnapshot()
    })

    it('is the disclaimer route', () => {
      const switcher = shallow(
        createSwitcher({currentRoute: DISCLAIMER_ROUTE, disclaimerPayload: dataPayload, citiesPayload: dataPayload})
      )

      expect(switcher).toMatchSnapshot()
    })

    it('is the search route', () => {
      const switcher = shallow(
        createSwitcher({currentRoute: SEARCH_ROUTE, categoriesPayload: dataPayload, citiesPayload: dataPayload})
      )

      expect(switcher).toMatchSnapshot()
    })

    it('is the main disclaimer route', () => {
      const switcher = shallow(
        createSwitcher({currentRoute: MAIN_DISCLAIMER_ROUTE})
      )

      expect(switcher).toMatchSnapshot()
    })

    it('is the landing route', () => {
      const switcher = shallow(
        createSwitcher({currentRoute: LANDING_ROUTE, citiesPayload: dataPayload})
      )

      expect(switcher).toMatchSnapshot()
    })

    it('is the i18nRedirect route', () => {
      const switcher = shallow(
        createSwitcher({currentRoute: I18N_REDIRECT_ROUTE, citiesPayload: dataPayload})
      )

      expect(switcher).toMatchSnapshot()
    })
  })

  it('should map state to props', () => {
    const currentRoute = 'RANDOM_ROUTE'
    const location = {type: currentRoute, payload: {city: 'augsburg', language: 'de'}, prev: {payload: {param: 'param'}}}
    const mockStore = configureMockStore()
    const store = mockStore({
      location,
      events: fetchingPayload,
      cities: fetchingPayload,
      categories: fetchingPayload,
      disclaimer: fetchingPayload,
      extras: fetchingPayload,
      languages: dataPayload,
      viewport: {is: {small: true}}
    })

    const switcher = shallow(
      <ConnectedSwitcher store={store} />
    )

    expect(switcher.props()).toMatchObject({
      currentRoute,
      categoriesPayload: fetchingPayload,
      eventsPayload: fetchingPayload,
      extrasPayload: fetchingPayload,
      citiesPayload: fetchingPayload,
      disclaimerPayload: fetchingPayload,
      languages: 'fetched fake news :D',
      viewportSmall: true,
      city: 'augsburg',
      param: 'param',
      language: 'de'
    })
  })
})
