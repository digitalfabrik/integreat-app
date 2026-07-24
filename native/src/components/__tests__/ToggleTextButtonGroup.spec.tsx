import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import render from '../../testing/render'
import ToggleTextButtonGroup from '../ToggleTextButtonGroup'

describe('ToggleTextButtonGroup', () => {
  const options = ['all', 'local', 'national'] as const
  const getLabel = (option: (typeof options)[number]) => `label-${option}`

  it('should render a label for every option', () => {
    const { getByText } = render(
      <ToggleTextButtonGroup value='all' options={[...options]} setValue={jest.fn()} getLabel={getLabel} />,
    )

    options.forEach(option => {
      expect(getByText(`label-${option}`)).toBeTruthy()
    })
  })

  it('should call setValue when an option is pressed', () => {
    const setValue = jest.fn()
    const { getByText } = render(
      <ToggleTextButtonGroup value='all' options={[...options]} setValue={setValue} getLabel={getLabel} />,
    )

    fireEvent.press(getByText('label-national'))
    expect(setValue).toHaveBeenCalledWith('national')
  })
})
