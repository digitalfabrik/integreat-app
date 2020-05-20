// @flow

import React from 'react'
import { shallow } from 'enzyme'

import { Failure } from '../Failure'

describe('Failure', () => {
  const mockTranslate = key => key || 'null'

  it('should render a simple failure and match snapshot', () => {
    const errorMessage = 'error message'
    const component = shallow(<Failure errorMessage={errorMessage} t={mockTranslate} />)

    expect(component.instance().props).toEqual({
      errorMessage: errorMessage,
      t: mockTranslate,
      ...Failure.defaultProps
    })
    expect(component).toMatchSnapshot()
  })

  it('should render a failure with goToPath and goToMessage and match snapshot', () => {
    const error = {
      errorMessage: 'error message',
      goToPath: 'goTo.extras',
      goToMessage: 'goTo.extras'
    }
    const component = shallow(<Failure {...error} t={mockTranslate} />)

    expect(component.instance().props).toEqual({ ...error, t: mockTranslate })
    expect(component).toMatchSnapshot()
  })
})
