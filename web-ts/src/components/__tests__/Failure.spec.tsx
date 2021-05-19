import React from 'react'
import { shallow } from 'enzyme'

import { Failure } from '../Failure'
import Link from '../../../../__mocks__/redux-first-router-link'

jest.mock('redux-first-router-link')

describe('Failure', () => {
  const mockTranslate = key => key

  it('should render a simple failure and match snapshot', () => {
    const errorMessage = 'error message'
    const component = shallow(<Failure errorMessage={errorMessage} t={mockTranslate} />)

    expect(component.instance().props).toEqual({
      errorMessage: errorMessage,
      t: mockTranslate,
      ...Failure.defaultProps
    })
    expect(component.childAt(0).text()).toEqual(errorMessage)
    expect(component.find(Link).prop('to')).toEqual(Failure.defaultProps.goToPath)
    expect(component.find(Link).childAt(0).text()).toEqual(Failure.defaultProps.goToMessage)
  })

  it('should render a failure with goToPath and goToMessage and match snapshot', () => {
    const error = {
      errorMessage: 'error message',
      goToPath: 'goTo.offers',
      goToMessage: 'goTo.offers'
    }
    const component = shallow(<Failure {...error} t={mockTranslate} />)

    expect(component.instance().props).toEqual({ ...error, t: mockTranslate })
    expect(component.childAt(0).text()).toEqual(error.errorMessage)
    expect(component.find(Link).prop('to')).toEqual(error.goToPath)
    expect(component.find(Link).childAt(0).text()).toEqual(error.goToMessage)
  })
})
