// @flow

import React from 'react'
import { mount } from 'enzyme'
import { FailureSwitcher } from '../FailureSwitcher'
import { NotFoundError } from 'api-client'
import { Failure } from '../Failure'

describe('FailureSwitcher', () => {
  const city = 'augsburg'

  const language = 'de'

  describe.each`
    type                | id
    ${'category'}       | ${'willkommen'}
    ${'event'}          | ${'1234'}
    ${'localNewsItem'}  | ${'/augsburg/en/news/local/1'}
    ${'tunewsItem'}     | ${'/augsburg/en/news/tu-news/1'}
    ${'offer'}          | ${'sprungbrett'}
    ${'poi'}            | ${'1234'}
    `('render $type component not found failure',
  ({ type, id }) => {
    it(`should render a ${type} not found failure and match snapshot`, () => {
      const error = new NotFoundError({ type, id, language, city })
      const component = FailureSwitcher.renderContentNotFoundComponent(error)
      expect(component).toMatchSnapshot()
    })

    it('should call render content not found component and create a Failure component', () => {
      const error = new NotFoundError({ type, id, language, city })
      const spy = jest.spyOn(FailureSwitcher, 'renderContentNotFoundComponent')
      const component = mount(<FailureSwitcher error={error} />)
      expect(spy).toHaveBeenCalledWith(error)
      expect(component.find(Failure)).toHaveLength(1)

      spy.mockRestore()
    })
  })

  it('should render a failure as default', () => {
    const error = new Error('error message')
    const component = mount(<FailureSwitcher error={new Error('error message')} />)

    expect(component.find(Failure)).toHaveLength(1)
    expect(component.find(Failure).at(0).props().errorMessage).toEqual(error.message)
  })
})
