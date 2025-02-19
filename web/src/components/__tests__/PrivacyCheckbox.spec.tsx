import { fireEvent } from '@testing-library/react'
import React from 'react'

import { renderWithTheme } from '../../testing/render'
import PrivacyCheckbox from '../PrivacyCheckbox'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: (namespace?: string) => ({
    t: (key: string) => (namespace ? `${namespace}:${key}` : key),
  }),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}))

describe('PrivacyCheckbox', () => {
  const setChecked = jest.fn()
  it('should select checkbox on click', () => {
    const { getByText } = renderWithTheme(<PrivacyCheckbox language='en' checked={false} setChecked={setChecked} />)
    fireEvent.click(getByText('common:privacyPolicy'))
    expect(setChecked).toHaveBeenCalledTimes(1)
    expect(setChecked).toHaveBeenCalledWith(true)
  })
})
