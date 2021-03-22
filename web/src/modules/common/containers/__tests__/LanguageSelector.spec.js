// @flow

import React from 'react'
import { shallow } from 'enzyme'
import { LanguageSelector } from '../LanguageSelector'
import { DISCLAIMER_ROUTE } from '../../../app/route-configs/DisclaimerRouteConfig'
import createLocation from '../../../../createLocation'

jest.mock('react-i18next')

describe('LanguageSelector', () => {
  const city = 'augsburg'
  const language = 'en'

  const languageChangePaths = [
    { code: 'de', name: 'Deutsch', path: '/augsburg/de/disclaimer' },
    { code: 'en', name: 'English', path: '/augsburg/en/disclaimer' },
    { code: 'ar', name: 'Arabic', path: '/augsburg/ar/disclaimer' }
  ]

  it('should render a HeaderLanguageSelectorItem if it is a header action item', () => {
    const location = createLocation({
      pathname: '/augsburg/en/disclaimer',
      type: DISCLAIMER_ROUTE,
      payload: { city, language }
    })

    const languageSelector = shallow(
      <LanguageSelector
        languageChangePaths={languageChangePaths}
        location={location}
        isHeaderActionItem
        t={key => key || 'null'}
        direction={'ltr'}
      />
    )

    expect(languageSelector).toMatchSnapshot()
  })

  it('should render a normal Selector if it is not a header action item', () => {
    const location = createLocation({
      pathname: '/augsburg/en/disclaimer',
      type: DISCLAIMER_ROUTE,
      payload: { city, language }
    })

    const languageSelector = shallow(
      <LanguageSelector
        languageChangePaths={languageChangePaths}
        location={location}
        isHeaderActionItem={false}
        t={key => key || 'null'}
        direction={'ltr'}
      />
    )

    expect(languageSelector).toMatchSnapshot()
  })
})
