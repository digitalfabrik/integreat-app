import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import render from '../../testing/render'
import PrivacyCheckbox from '../PrivacyCheckbox'

jest.mock('react-i18next')

describe('PrivacyCheckbox', () => {
  const setChecked = jest.fn()
  it('should select checkbox on click', () => {
    const { getByText } = render(<PrivacyCheckbox language='en' checked={false} setChecked={setChecked} />)
    fireEvent.press(getByText('common:privacyPolicy'))
    expect(setChecked).toHaveBeenCalledTimes(1)
    expect(setChecked).toHaveBeenCalledWith(true)
  })
})
