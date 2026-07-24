import { fireEvent } from '@testing-library/react'
import React from 'react'

import { renderWithTheme } from '../../testing/render'
import ToggleTextButtonGroup from '../ToggleTextButtonGroup'

describe('ToggleTextButtonGroup', () => {
  const options = ['all', 'local', 'national']
  const getLabel = (option: string) => `label-${option}`

  it('should render a label for every option', () => {
    const { getByText } = renderWithTheme(
      <ToggleTextButtonGroup value='all' options={options} setValue={jest.fn()} getLabel={getLabel} />,
    )

    options.forEach(option => expect(getByText(`label-${option}`)).toBeTruthy())
  })

  it('should mark only the selected option as pressed', () => {
    const { getByRole } = renderWithTheme(
      <ToggleTextButtonGroup value='local' options={options} setValue={jest.fn()} getLabel={getLabel} />,
    )

    expect(getByRole('button', { name: 'label-all' })).toHaveAttribute('aria-pressed', 'false')
    expect(getByRole('button', { name: 'label-local' })).toHaveAttribute('aria-pressed', 'true')
    expect(getByRole('button', { name: 'label-national' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('should call setValue with the pressed option', () => {
    const setValue = jest.fn()
    const { getByRole } = renderWithTheme(
      <ToggleTextButtonGroup value='all' options={[...options]} setValue={setValue} getLabel={getLabel} />,
    )

    fireEvent.click(getByRole('button', { name: 'label-national' }))
    expect(setValue).toHaveBeenCalledWith('national')
  })
})
