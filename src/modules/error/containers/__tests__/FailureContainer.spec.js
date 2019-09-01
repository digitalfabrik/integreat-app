// @flow

import { render } from '@testing-library/react-native'
import * as React from 'react'
import FailureContainer from '../FailureContainer'
import AsyncStorage from '@react-native-community/async-storage'
import Failure from '../../components/Failure'
import { brightTheme } from '../../../theme/constants/theme'

const mockAsyncStorage: AsyncStorage = require('@react-native-community/async-storage/jest/async-storage-mock').default
jest.mock('@react-native-community/async-storage', () => mockAsyncStorage)

// jest.mock('../../components/Failure', () => jest.fn(props => null))
jest.mock('react-i18next')
jest.mock('../../../theme/hocs/withTheme')

describe('FailureContainer', () => {
  describe('withTheme()(translate())', () => {
    it('should give props to inner component', () => {
      render(<FailureContainer />)

      const context = {}
      expect(Failure).toBeCalledWith(expect.objectContaining({
        t: expect.anything(),
        theme: expect.anything()
      }), context)
    })
  })

  it('should render inner component correctly without passing props explicitly', () => {
    jest.unmock('../../components/Failure')
    const t = key => key
    const tryAgain = () => {}
    // const tryAgain = undefined

    const error = new Error()
    const { container: containerFailure, debug: debugFailure, asJSON: asJSONFailure } =
      render(<Failure theme={brightTheme} error={error} tryAgain={tryAgain} t={t} />)
    const { container: containerFailureContainer, debug: debugFailureContainer, asJSON: asJSONFailureContainer } =
      render(<FailureContainer error={error} tryAgain={tryAgain} />)

    debugFailure()
    // debugFailureContainer()

    expect(containerFailure._fiber.stateNode).not.toEqual(containerFailureContainer._fiber.stateNode)
    expect(asJSONFailure()).toEqual(asJSONFailureContainer())
  })
})
