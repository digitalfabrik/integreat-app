import React from 'react'
import { shallow } from 'enzyme'

import FailureSwitcher from '../FailureSwitcher'
import ContentNotFoundError from '../../errors/ContentNotFoundError'
import LanguageNotFoundError from '../../../app/errors/LanguageNotFoundError'

describe('LanguageFailure', () => {
  const city = 'augsburg'

  const language = 'de'

  describe('render component not found failure', () => {
    it('should render a category not found failure and match snapshot', () => {
      const error = new ContentNotFoundError({type: 'category', id: 'willkommen', language, city})
      expect(FailureSwitcher.renderContentNotFoundComponent(error)).toMatchSnapshot()
    })

    it('should render a extra not found failure and match snapshot', () => {
      const error = new ContentNotFoundError({type: 'extra', id: 'sprungbrett', language, city})
      expect(FailureSwitcher.renderContentNotFoundComponent(error)).toMatchSnapshot()
    })

    it('should render a event not found failure and match snapshot', () => {
      const error = new ContentNotFoundError({type: 'event', id: '1234', language, city})
      expect(FailureSwitcher.renderContentNotFoundComponent(error)).toMatchSnapshot()
    })
  })

  it('should render a LanguageFailure if there is a LanguageNotFoundError', () => {
    expect(shallow(<FailureSwitcher error={new LanguageNotFoundError({city, language})} />)).toMatchSnapshot()
  })

  it('should render a content not found failure if there is a ContentNotFoundError', () => {
    expect(shallow(
      <FailureSwitcher error={new ContentNotFoundError({type: 'extra', id: 'sprungbrett', city, language})} />
    )).toMatchSnapshot()
  })

  it('should render a failure as default', () => {
    expect(shallow(<FailureSwitcher error={new Error('error message')} />)).toMatchSnapshot()
  })
})
