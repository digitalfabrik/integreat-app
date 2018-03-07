import React from 'react'
import { shallow } from 'enzyme'
import Selector from '../Selector'
import SelectorItemModel from '../../models/SelectorItemModel'

const selectorItems = [
  new SelectorItemModel({
    code: 'en',
    path: '/augsburg/en/',
    name: 'English'
  }),
  new SelectorItemModel({
    code: 'de',
    path: '/augsburg/de/',
    name: 'Deutsch'
  })
]

describe('Selector', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(
      <Selector verticalLayout={false}
                closeDropDownCallback={() => {}}
                items={selectorItems}
                activeItemCode={'de'} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should be vertical and match snapshot', () => {
    const wrapper = shallow(
      <Selector verticalLayout
                closeDropDownCallback={() => {}}
                items={selectorItems}
                activeItemCode={'de'} />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
