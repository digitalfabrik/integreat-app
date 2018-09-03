// @flow

import React from 'react'
import { shallow } from 'enzyme'

import { ModalHeader } from '../ModalHeader'
import { CATEGORIES_ROUTE } from '../../../../modules/app/routes/categories'

describe('ModalHeader', () => {
  it('should match snapshot', () => {
    const location = {type: CATEGORIES_ROUTE, payload: {city: 'augsburg', language: 'de'}}

    const component = shallow(
      <ModalHeader
        location={location}
        title={'title'} />
    )
    expect(component).toMatchSnapshot()
  })
})
