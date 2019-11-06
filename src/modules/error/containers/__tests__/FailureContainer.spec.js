// @flow

import { fireEvent, render } from '@testing-library/react-native'
import * as React from 'react'
import TestRenderer from 'react-test-renderer'
import typeof FailureContainer from '../FailureContainer'

jest.mock('react-i18next')
jest.mock('../../../theme/hocs/withTheme')

describe('FailureContainer', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should pass props to inner component', () => {
    const FailureMock = () => null
    jest.doMock('../../components/Failure', () => FailureMock)
    const FailureContainerMock: FailureContainer = require('../FailureContainer').default

    const rendered = TestRenderer.create(<FailureContainerMock />)
    const instance = rendered.root.findByType(FailureMock)
    expect(instance.props).toEqual({
      t: expect.anything(),
      theme: expect.anything()
    })
  })

  it('should render inner component correctly without passing props explicitly', () => {
    jest.dontMock('../../components/Failure')
    const FailureContainer = require('../FailureContainer').default

    const tryAgain = jest.fn()
    const { getByTestId } = render(<FailureContainer tryAgain={tryAgain} />)
    fireEvent.press(getByTestId('button-tryAgain'))
    expect(tryAgain).toHaveBeenCalled()
  })
})
