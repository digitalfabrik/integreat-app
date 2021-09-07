import { shallow } from 'enzyme'
import React from 'react'

import SelectorItemModel from '../../models/SelectorItemModel'
import Selector from '../Selector'

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
  }),
  new SelectorItemModel({
    code: 'fr',
    href: null,
    name: 'Französisch'
  })
]

describe('Selector', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(
      <Selector
        verticalLayout={false}
        closeDropDown={() => {}}
        items={selectorItems}
        activeItemCode='de'
        disabledItemTooltip='random tooltip'
      />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should be vertical and match snapshot', () => {
    const wrapper = shallow(
      <Selector
        verticalLayout
        closeDropDown={() => {}}
        items={selectorItems}
        activeItemCode='de'
        disabledItemTooltip='random tooltip'
      />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
