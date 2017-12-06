import React from 'react'
import renderer from 'react-test-renderer'

import Heading from '../index'

jest.mock('store')
jest.mock('react-i18next')

describe('Heading', () => {
  test('should render', () => {
    renderer.create(<Heading/>)
  })
})
