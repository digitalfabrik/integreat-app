// @flow

import React from 'react'
import { shallow } from 'enzyme'
import { LanguageFailure } from '../LanguageFailure'
import createLocation from '../../../../createLocation'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'

jest.mock('react-i18next')

describe('LanguageFailure', () => {
  const cities = new CityModelBuilder(1).build()

  const location = createLocation({ type: 'CATEGORIES', payload: { city: 'augsburg' } })

  const languageChangePaths = [
    { code: 'de', name: 'Deutsch', path: '/augsburg/de' },
    { code: 'en', name: 'English', path: '/augsburg/en' },
    { code: 'ar', name: 'Arabic', path: '/augsburg/ar' }
  ]

  it('should match snapshot', () => {
    const wrapper = shallow(
      <LanguageFailure
        cities={cities}
        location={location}
        languageChangePaths={languageChangePaths}
        t={key => key || 'null'}
        direction={'ltr'}
      />
    )

    expect(wrapper).toMatchSnapshot()
  })
})
