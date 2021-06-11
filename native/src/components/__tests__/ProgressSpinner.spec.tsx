import { render } from '@testing-library/react-native'
import * as React from 'react'
import ProgressSpinner from '../ProgressSpinner'
import { ThemeType } from 'build-configs'

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}

describe('ProgressSpinner', () => {
  let theme: DeepPartial<ThemeType>

  const t = input => input

  beforeEach(() => {
    theme = {
      colors: {
        themeColor: 'red'
      }
    }
  })
  it('should display a progress text', () => {
    const { queryByText } = render(<ProgressSpinner theme={theme as ThemeType} t={t} progress={0.9} />)
    expect(queryByText(/loading/)).toBeTruthy()
  })
  it('should display a progress image', () => {
    const { getByTestId } = render(<ProgressSpinner theme={theme as ThemeType} t={t} progress={0.9} />)
    expect(getByTestId('loading-image')).toBeTruthy()
  })
})
