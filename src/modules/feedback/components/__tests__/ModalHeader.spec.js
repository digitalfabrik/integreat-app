// @flow

import React from 'react'
import { shallow } from 'enzyme'

import { ModalHeader } from '../ModalHeader'

describe('ModalHeader', () => {
  it('should call close function when clicking on close', () => {
    const jestMockFn = jest.fn()
    const component = shallow(
      <ModalHeader
        closeFeedbackModal={jestMockFn}
        title={'title'} />
    )

    component.findWhere(elem => elem.name() ? elem.name().includes('CloseButton') : false).simulate('click')
    expect(jestMockFn).toHaveBeenCalled()
  })
})
