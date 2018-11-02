// @flow

import React from 'react'
import { shallow } from 'enzyme'

import { ModalHeader } from '../ModalHeader'

describe('ModalHeader', () => {
  it('should match snapshot', () => {
    const component = shallow(
      <ModalHeader
        closeFeedbackModal={() => {}}
        title={'title'} />
    )
    expect(component).toMatchSnapshot()
  })
})
