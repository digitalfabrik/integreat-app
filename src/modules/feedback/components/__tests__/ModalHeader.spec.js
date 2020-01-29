// @flow

import React from 'react'
import { shallow } from 'enzyme'

import { ModalHeader } from '../ModalHeader'

describe('ModalHeader', () => {
  it('should match snapshot', () => {
    const jestMockFn = jest.fn()
    const component = shallow(
      <ModalHeader
        closeFeedbackModal={jestMockFn}
        title={'title'} />
    )

    component.findWhere(elem => elem.name()?.includes('CloseButton')).simulate('click')
    expect(jestMockFn).toHaveBeenCalled()
  })
})
