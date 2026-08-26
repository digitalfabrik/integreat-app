import { fireEvent } from '@testing-library/react'
import React from 'react'

import { renderWithTheme } from '../../testing/render'
import PrivacyCheckbox from '../PrivacyCheckbox'

describe('PrivacyCheckbox', () => {
  const setChecked = jest.fn()
  it('should select checkbox on click', () => {
    const { getByText } = renderWithTheme(<PrivacyCheckbox language='en' checked={false} setChecked={setChecked} />)
    fireEvent.click(getByText('common:privacyPolicy'))
    expect(setChecked).toHaveBeenCalledTimes(1)
    expect(setChecked).toHaveBeenCalledWith(true)
  })
})
