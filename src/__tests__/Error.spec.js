import React from 'react'
import renderer from 'react-test-renderer'
import { configure, shallow } from 'enzyme'
import Error from '../components/Error'
import Adapter from 'enzyme-adapter-react-16'

configure({adapter: new Adapter()})

const goBack = jest.fn()
const mockHistory = {goBack, test: 7}

const preventDefault = jest.fn()

jest.mock('store', () => ({history: mockHistory}))
jest.mock('history', () => (mockHistory))
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate HoC receive the t function as a prop
  translate: () => Component => props => <Component t={() => ''} {...props} />
}))

test('Link changes the class when hovered', () => {
  const component = renderer.create(
    <Error error="Error Message"/>
  )

  const wrapper = shallow(<Error error="Error Message"/>).dive()

  wrapper.instance().goBack({preventDefault})

  expect(goBack.mock.calls.length).toBe(1)
  expect(preventDefault.mock.calls.length).toBe(1)

  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
