import * as React from 'react'
import TestRenderer from 'react-test-renderer'

import { fireEvent, render } from '@testing-library/react-native'

import { ErrorCode } from 'api-client'

jest.mock('react-i18next')

describe('FailureContainer', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should pass props to inner component', () => {
    const FailureMock = () => null

    jest.doMock('../../components/Failure', () => FailureMock)

    const FailureContainerMock = require('../FailureContainer').default

    const rendered = TestRenderer.create(<FailureContainerMock code={ErrorCode.UnknownError} />)
    const instance = rendered.root.findByType(FailureMock)
    expect(instance.props).toEqual({
      code: 'unknownError',
      t: expect.anything(),
      theme: expect.anything()
    })
  })

  it('should render inner component correctly without passing props explicitly', () => {
    jest.dontMock('../../components/Failure')

    const FailureContainer = require('../FailureContainer').default

    const tryAgain = jest.fn()
    const { getByTestId } = render(<FailureContainer code={ErrorCode.NetworkConnectionFailed} tryAgain={tryAgain} />)
    fireEvent.press(getByTestId('button-tryAgain'))
    expect(tryAgain).toHaveBeenCalled()
  })
})
