// @flow

import React from 'react'
import SelectorItemModel from '../../../common/models/SelectorItemModel'
import { shallow } from 'enzyme'
import HeaderLanguageSelectorItem from '../HeaderLanguageSelectorItem'

jest.mock('react-i18next')

describe('HeaderLanguageSelectorItem', () => {
  const selectorItems = [
    new SelectorItemModel({
      code: 'en',
      href: '/augsburg/en/',
      name: 'English'
    }),
    new SelectorItemModel({
      code: 'de',
      href: '/augsburg/de/',
      name: 'Deutsch'
    })
  ]

  const activeItemCode = 'de'

  it('should render a HeaderDropDown with a Selector if there are selectorItems', () => {
    expect(
      shallow(
        <HeaderLanguageSelectorItem activeItemCode={activeItemCode} selectorItems={selectorItems} direction={'ltr'} />
      ).dive()
    ).toMatchSnapshot()
  })

  it('should render an icon with a tooltip if there are no selectorItems', () => {
    expect(
      shallow(
        <HeaderLanguageSelectorItem activeItemCode={activeItemCode} selectorItems={[]} direction={'ltr'} />
      ).dive()
    ).toMatchSnapshot()
  })
})
