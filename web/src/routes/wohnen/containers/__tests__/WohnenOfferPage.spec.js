// @flow

import { mount, shallow } from 'enzyme'
import React from 'react'
import { OfferModel, WohnenFormData, WohnenOfferModel } from 'api-client'
import ConnectedWohnenOfferPage, { WohnenOfferPage } from '../WohnenOfferPage'
import moment from 'moment'
import Hashids from 'hashids'
import { Provider } from 'react-redux'
import theme from '../../../../modules/theme/constants/theme'
import { ThemeProvider } from 'styled-components'
import createLocation from '../../../../createLocation'
import { WOHNEN_ROUTE } from '../../../../modules/app/route-configs/WohnenRouteConfig'
import configureMockStore from 'redux-mock-store'

jest.mock('react-i18next')
jest.mock('redux-first-router-link')

describe('WohnenOfferPage', () => {
  const city = 'augsburg'
  const language = 'de'

  const offer = new OfferModel({
    alias: 'wohnen', path: 'path to fetch offers from', title: 'Raumfrei', thumbnail: 'xy', postData: null
  })

  const offers = [offer]

  const wohnenOffer = new WohnenOfferModel({
    email: 'mail@mail.com',
    createdDate: moment('2018-07-24T00:00:00.000Z'),
    formDataType: WohnenFormData,
    formData: new WohnenFormData(
      {
        firstName: 'Max',
        lastName: 'Ammann',
        phone: ''
      },
      {
        ofRooms: ['kitchen', 'child2', 'child1', 'bed'],
        title: 'Test Angebot',
        location: 'Augsburg',
        totalArea: 120,
        totalRooms: 4,
        moveInDate: moment('2018-07-19T15:35:12.000Z'),
        ofRoomsDiff: ['bath', 'wc', 'child3', 'livingroom', 'hallway', 'store', 'basement', 'balcony']
      },
      {
        ofRunningServices: ['chimney', 'other'],
        ofAdditionalServices: ['garage'],
        baseRent: 1000,
        runningCosts: 1200,
        hotWaterInHeatingCosts: true,
        additionalCosts: 200,
        ofRunningServicesDiff: ['heating', 'water', 'garbage'],
        ofAdditionalServicesDiff: []
      })
  })
  const wohnenOfferHash = new Hashids().encode(wohnenOffer.email.length, wohnenOffer.createdDate.milliseconds())

  const wohnenOffers = [wohnenOffer]
  const t = (key: ?string): string => key || ''

  it('should render list if no hash is supplied', () => {
    const wohnenPage = shallow(
      <WohnenOfferPage wohnenOffers={wohnenOffers}
                       city={city}
                       language={language}
                       offers={offers}
                       t={t} />
    )
    expect(wohnenPage).toMatchSnapshot()
  })

  it('should render detailed offer if hash is supplied', () => {
    const wohnenPage = shallow(
      <WohnenOfferPage wohnenOffers={wohnenOffers}
                       city={city}
                       language={language}
                       wohnenOfferHash={wohnenOfferHash}
                       offers={[offer]}
                       t={t} />
    )
    expect(wohnenPage).toMatchSnapshot()
  })

  it('should render failure offer if offer is not found', () => {
    const offersPage = shallow(
      <WohnenOfferPage wohnenOffers={wohnenOffers}
                       city={city}
                       language={language}
                       wohnenOfferHash='invalid hash'
                       offers={[offer]}
                       t={t} />
    )
    expect(offersPage).toMatchSnapshot()
  })

  it('should render failure city does not support offer', () => {
    const wohnenPage = shallow(
      <WohnenOfferPage wohnenOffers={wohnenOffers}
                       city={city}
                       language={language}
                       wohnenOfferHash={wohnenOfferHash}
                       offers={[]}
                       t={t} />
    )
    expect(wohnenPage).toMatchSnapshot()
  })

  it('should map state to props', () => {
    const offerHash = 'hASH'

    const location = createLocation({ type: WOHNEN_ROUTE, payload: { city, language, offerHash } })
    const mockStore = configureMockStore()
    const store = mockStore({
      location
    })

    const tree = mount(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <ConnectedWohnenOfferPage wohnenOffers={wohnenOffers} offers={offers} />
        </Provider>
      </ThemeProvider>
    )

    expect(tree.find(WohnenOfferPage).props()).toEqual({
      language,
      city,
      i18n: expect.anything(),
      wohnenOfferHash: offerHash,
      wohnenOffers,
      offers,
      t: expect.any(Function)
    })
  })
})
