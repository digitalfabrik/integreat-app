// @flow

import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import * as React from 'react'
import waitForExpect from 'wait-for-expect'
import { render } from '@testing-library/react-native'
import TestRenderer from 'react-test-renderer'
import typeof I18nProviderContainer from '../I18nProviderContainer'

jest.mock('@react-native-community/async-storage')
jest.mock('../../../i18n/LanguageDetector')

const mockStore = configureMockStore()

describe('I18nProviderContainer', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should pass props to inner component', () => {
    const I18nProviderMock = () => null
    jest.doMock('../../components/I18nProvider', () => I18nProviderMock)
    const I18nProviderContainerMock: I18nProviderContainer = require('../I18nProviderContainer').default

    const store = mockStore({})
    const rendered = TestRenderer.create(<Provider store={store}>
      <I18nProviderContainerMock />
    </Provider>)
    const instance = rendered.root.findByType(I18nProviderMock)
    expect(instance.props).toEqual({
      setContentLanguage: expect.anything()
    })
  })

  it('should trigger actions without passing props explicitly', async () => {
    jest.dontMock('../../components/I18nProvider')
    const I18nProviderContainer = require('../I18nProviderContainer').default

    const store = mockStore({})
    render(
      <Provider store={store}>
        <I18nProviderContainer>
          <React.Fragment />
        </I18nProviderContainer>
      </Provider>
    )

    await waitForExpect(() => {
      expect(store.getActions()).toEqual([{
        type: 'SET_CONTENT_LANGUAGE',
        params: {
          contentLanguage: 'en'
        }
      }])
    })
  })
})
