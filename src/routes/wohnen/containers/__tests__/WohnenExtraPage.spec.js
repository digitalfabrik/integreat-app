// @flow

import { mount, shallow } from 'enzyme'
import React from 'react'

import { ExtraModel, WohnenFormData, WohnenOfferModel } from '@integreat-app/integreat-api-client'
import ConnectedWohnenExtraPage, { WohnenExtraPage } from '../WohnenExtraPage'
import moment from 'moment'
import Hashids from 'hashids'
import { Provider } from 'react-redux'
import theme from '../../../../modules/theme/constants/theme'
import { ThemeProvider } from 'styled-components'
import createLocation from '../../../../createLocation'
import { WOHNEN_ROUTE } from '../../../../modules/app/route-configs/WohnenRouteConfig'
import configureMockStore from 'redux-mock-store'

describe('WohnenExtraPage', () => {
  const city = 'augsburg'
  const language = 'de'

  const wohnenExtra = new ExtraModel({
    alias: 'wohnen', path: 'path to fetch offers from', title: 'Raumfrei', thumbnail: 'xy', postData: null
  })

  const extras = [wohnenExtra]

  const offer = new WohnenOfferModel({
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
  const offerHash = new Hashids().encode(offer.email.length, offer.createdDate.milliseconds())

  const offers = [offer]
  const t = (key: ?string): string => key || ''

  it('should render list if no hash is supplied', () => {
    const wohnenPage = shallow(
      <WohnenExtraPage offers={offers}
                       city={city}
                       language={language}
                       extras={[wohnenExtra]}
                       t={t} />
    )
    expect(wohnenPage).toMatchSnapshot()
  })

  it('should render detailed offer if hash is supplied', () => {
    const wohnenPage = shallow(
      <WohnenExtraPage offers={offers}
                       city={city}
                       language={language}
                       offerHash={offerHash}
                       extras={[wohnenExtra]}
                       t={t} />
    )
    expect(wohnenPage).toMatchSnapshot()
  })

  it('should render failure offer if offer is not found', () => {
    const extrasPage = shallow(
      <WohnenExtraPage offers={offers}
                       city={city}
                       language={language}
                       offerHash='invalid hash'
                       extras={[wohnenExtra]}
                       t={t} />
    )
    expect(extrasPage).toMatchSnapshot()
  })

  it('should render failure city does not support offer', () => {
    const wohnenPage = shallow(
      <WohnenExtraPage offers={offers}
                       city={city}
                       language={language}
                       offerHash={offerHash}
                       extras={[]}
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
          <ConnectedWohnenExtraPage extras={extras} offers={offers} />
        </Provider>
      </ThemeProvider>
    )

    expect(tree.find(WohnenExtraPage).props()).toEqual({
      language,
      city,
      i18n: expect.anything(),
      offerHash,
      extras,
      offers,
      dispatch: expect.any(Function),
      t: expect.any(Function)
    })
  })
})
