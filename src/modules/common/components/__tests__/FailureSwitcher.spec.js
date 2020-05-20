// @flow

import React from 'react'
import { mount } from 'enzyme'

import { FailureSwitcher } from '../FailureSwitcher'
import ContentNotFoundError from '../../errors/ContentNotFoundError'
import { Failure } from '../Failure'

describe('FailureSwitcher', () => {
  const city = 'augsburg'

  const language = 'de'

  describe('render component not found failure', () => {
    it('should render a category not found failure and match snapshot', () => {
      const error = new ContentNotFoundError({ type: 'category', id: 'willkommen', language, city })
      const renderContentNotFoundComponent = FailureSwitcher.renderContentNotFoundComponent(error)
      expect(renderContentNotFoundComponent).toMatchSnapshot()
    })

    it('should render a extra not found failure and match snapshot', () => {
      const error = new ContentNotFoundError({ type: 'extra', id: 'sprungbrett', language, city })
      expect(FailureSwitcher.renderContentNotFoundComponent(error)).toMatchSnapshot()
    })

    it('should render a event not found failure and match snapshot', () => {
      const error = new ContentNotFoundError({ type: 'event', id: '1234', language, city })
      expect(FailureSwitcher.renderContentNotFoundComponent(error)).toMatchSnapshot()
    })

    it('should render a poi not found failure and match snapshot', () => {
      const error = new ContentNotFoundError({ type: 'poi', id: 'poiId', language, city })
      expect(FailureSwitcher.renderContentNotFoundComponent(error)).toMatchSnapshot()
    })
  })

  it('should render a content not found failure if there is a ContentNotFoundError', () => {
    const error = new ContentNotFoundError({ type: 'extra', id: 'sprungbrett', city, language })
    const spy = jest.spyOn(FailureSwitcher, 'renderContentNotFoundComponent')

    const component = mount(<FailureSwitcher error={error} />)

    expect(spy).toHaveBeenCalledWith(error)
    expect(component.find(Failure)).toHaveLength(1)

    spy.mockRestore()
  })

  it('should render a failure as default', () => {
    const error = new Error('error message')
    const component = mount(<FailureSwitcher error={new Error('error message')} />)

    expect(component.find(Failure)).toHaveLength(1)
    expect(component.find(Failure).at(0).props().errorMessage).toEqual(error.message)
  })
})
