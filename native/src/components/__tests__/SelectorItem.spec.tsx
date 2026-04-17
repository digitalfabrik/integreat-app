import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import SelectorItemModel from '../../models/SelectorItemModel'
import render from '../../testing/render'
import SelectorItem from '../SelectorItem'

describe('SelectorItem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call onPress if enabled', () => {
    const onPress = jest.fn()
    const model = new SelectorItemModel({ name: 'Espanol', code: 'es', enabled: true, onPress })
    const { getByText } = render(<SelectorItem model={model} selected={false} />)

    fireEvent.press(getByText(model.name))

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('should show info icon if disabled and not selected', () => {
    const model = new SelectorItemModel({ name: 'Espanol', code: 'es', enabled: false, onPress: jest.fn() })
    const { getByLabelText } = render(<SelectorItem model={model} selected={false} />)

    expect(getByLabelText('informationIcon')).toBeTruthy()
  })

  it('should not show info icon if enabled', () => {
    const model = new SelectorItemModel({ name: 'Espanol', code: 'es', enabled: true, onPress: jest.fn() })
    const { queryByLabelText } = render(<SelectorItem model={model} selected={false} />)

    expect(queryByLabelText('informationIcon')).toBeNull()
  })
})
