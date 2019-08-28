// @flow

import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { shallow } from 'enzyme'
import I18nProviderContainer from '../I18nProviderContainer'
import React from 'react'
import I18nProvider from '../../components/I18nProvider'
import AsyncStorage from '@react-native-community/async-storage'

const mockStore = configureMockStore()

const mockAsyncStorage: AsyncStorage = require('@react-native-community/async-storage/jest/async-storage-mock').default
jest.mock('@react-native-community/async-storage', () => mockAsyncStorage)

describe('I18nProviderContainer', () => {
  it('should pass the right props', () => {
    const store = mockStore({})
    store.dispatch = jest.fn()
    const wrapper = shallow(
      <Provider store={store}>
        <I18nProviderContainer>
          <React.Fragment />
        </I18nProviderContainer>
      </Provider>
    )

    const props = wrapper.dive().find(I18nProvider).props()
    expect(props.children).toEqual(<React.Fragment />)

    const setContentLanguage = props.setContentLanguage
    setContentLanguage('de')
    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'SET_CONTENT_LANGUAGE',
      params: {
        contentLanguage: 'de'
      }
    })
  })
})
