/* eslint-disable flowtype/no-weak-types */
// @flow

import { render } from '@testing-library/react-native'
import * as React from 'react'
import ProgressSpinner from '../ProgressSpinner'
import type { ThemeType } from './../../../../../../build-configs/ThemeType'

describe('ProgressSpinner', () => {
  let theme: any
  const t = input => input

  beforeEach(() => {
    theme = {
      colors: {
        themeColor: 'red'
      }
    }
  })

  it('should display a progress text', () => {
    const { queryByText } = render(<ProgressSpinner theme={(theme: ThemeType)} t={t} progress={0.9} />)
    expect(queryByText(/loading/)).toBeTruthy()
  })

  it('should display a progress image', () => {
    const { getByTestId } = render(<ProgressSpinner theme={(theme: ThemeType)} t={t} progress={0.9} />)
    expect(getByTestId('loading-image')).toBeTruthy()
  })
})
