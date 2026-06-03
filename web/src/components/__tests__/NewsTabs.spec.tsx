import React from 'react'

import { LOCAL_NEWS_TYPE, tuNewsLabel } from 'shared'

import { renderWithRouterAndTheme } from '../../testing/render'
import NewsTabs from '../NewsTabs'

jest.mock('react-i18next')

describe('NewsTabs', () => {
  const language = 'en'

  it('should render two tabs if both local news and tuNews are enabled', () => {
    const { getByLabelText } = renderWithRouterAndTheme(
      <NewsTabs type={LOCAL_NEWS_TYPE} region='testregion' localNewsEnabled tuNewsEnabled language={language} />,
    )
    expect(getByLabelText(tuNewsLabel)).toBeDefined()
    expect(getByLabelText('news:local')).toBeDefined()
  })
})
