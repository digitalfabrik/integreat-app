import React from 'react'
import renderer from 'react-test-renderer'

import Heading from '../Heading'

jest.mock('store')
jest.mock('react-i18next')

describe('Heading', () => {
  test('should match snapshot', () => {
    const component = renderer.create(
      <Heading/>
    )

    expect(component.toJSON()).toMatchSnapshot()
  })
})
