import { shallow } from 'enzyme'
import React from 'react'

import Toolbar from '../Toolbar'

jest.mock('react-i18next')

describe('Toolbar', () => {
  it('should render', () => {
    const component = shallow(
      <Toolbar className='sample' viewportSmall>
        <p>test item</p>
      </Toolbar>
    )
    expect(component).toMatchSnapshot()
  })
})
