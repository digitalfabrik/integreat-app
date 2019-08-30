// @flow

import { render } from 'react-native-testing-library'
import * as React from 'react'
import FailureContainer from '../FailureContainer'
import AsyncStorage from '@react-native-community/async-storage'
import MockComponent from './MockComponent'

const mockAsyncStorage: AsyncStorage = require('@react-native-community/async-storage/jest/async-storage-mock').default
jest.mock('@react-native-community/async-storage', () => mockAsyncStorage)
jest.mock('../../components/Failure', () => require('./MockComponent').default)
jest.mock('../../../theme/hocs/withTheme', () => () => (Component) => Component)
jest.mock('react-i18next', () => ({translate: () => (Component) => () => <Component t={key => key} />}))

describe('FailureContainer', () => {
  describe('withTheme()(translate())', () => {
    it('should pass props', () => {
      // render(<I18nProvider setContentLanguage={() => {}}><FailureContainer
      //   testID={'test'} /></I18nProvider>)

      // expect(MockComponent).toBeCalledWith({
      //   t: expect.anything(),
      //   theme: expect.anything(),
      //   testID: expect.anything(),
      //   tReady: expect.anything(),
      //   reportNS: undefined,
      //   lng: expect.anything(),
      //   i18nOptions: expect.anything(),
      //   i18n: expect.anything(),
      //   defaultNS: undefined
      // }, {})

      render(<FailureContainer />)

      expect(MockComponent).toBeCalledWith({
        t: expect.anything()
      }, {})
    })
  })
})
