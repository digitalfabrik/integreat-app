import React from 'react'

import { AMAL_NEWS_SOURCE, LOCAL_NEWS_SOURCE, TU_NEWS_SOURCE } from 'shared/api'

import render from '../../testing/render'
import NewsSourceChip from '../NewsSourceChip'

jest.mock('react-i18next')

describe('NewsSourceChip', () => {
  it('should render the translated label for local news', () => {
    const { getByText } = render(<NewsSourceChip source={LOCAL_NEWS_SOURCE} />)
    expect(getByText('local')).toBeTruthy()
  })

  it('should render the Amal News label for amal news', () => {
    const { getByText } = render(<NewsSourceChip source={AMAL_NEWS_SOURCE} />)
    expect(getByText('Amal News')).toBeTruthy()
  })

  it('should render the tuenews label for tu news', () => {
    const { getByText } = render(<NewsSourceChip source={TU_NEWS_SOURCE} />)
    expect(getByText('tuenews')).toBeTruthy()
  })
})
