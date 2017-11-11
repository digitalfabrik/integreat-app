import React from 'react'
import renderer from 'react-test-renderer'
import Error from '../components/Error'

jest.mock('store')
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate HoC receive the t function as a prop
  translate: () => Component => props => <Component t={() => ''} {...props} />
}))

test('Link changes the class when hovered', () => {
  const component = renderer.create(
    <Error error="Error Message"/>
  )
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
