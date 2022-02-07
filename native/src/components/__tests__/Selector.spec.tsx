import React from 'react'

import SelectorItemModel from '../../models/SelectorItemModel'
import render from '../../testing/render'
import Selector from '../Selector'

describe('Selector', () => {
  it('should show all items', () => {
    const items = [
      new SelectorItemModel({ name: 'Deutsch', code: 'de', enabled: false, onPress: () => undefined }),
      new SelectorItemModel({ name: 'English', code: 'en', enabled: false, onPress: () => undefined }),
      new SelectorItemModel({ name: 'Espanol', code: 'es', enabled: false, onPress: () => undefined })
    ]

    const { getByText } = render(<Selector items={items} selectedItemCode='de' />)

    items.forEach(item => {
      expect(getByText(item.name)).toBeTruthy()
    })
  })
})
