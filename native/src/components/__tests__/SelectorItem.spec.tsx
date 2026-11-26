import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import SelectorItemModel from '../../models/SelectorItemModel'
import render from '../../testing/render'
import SelectorItem from '../SelectorItem'

describe('SelectorItem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call onPress if enabled', async () => {
    const onPress = jest.fn()
    const model = new SelectorItemModel({ name: 'Espanol', code: 'es', enabled: true, onPress })
    const { getByText } = await render(<SelectorItem model={model} selected={false} />)

    await fireEvent.press(getByText(model.name))

    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
