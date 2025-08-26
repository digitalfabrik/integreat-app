import { TFunction } from 'i18next'
import React from 'react'

import { LOCAL_NEWS_TYPE, tunewsLabel } from 'shared'

import { renderWithRouterAndTheme } from '../../testing/render'
import NewsTabs from '../NewsTabs'

describe('NewsTabs', () => {
  const language = 'en'
  const t = ((key: string) => key) as TFunction

  it('should render two tabs if both local news and tunews are enabled', () => {
    const { getByLabelText } = renderWithRouterAndTheme(
      <NewsTabs type={LOCAL_NEWS_TYPE} city='testcity' localNewsEnabled tunewsEnabled language={language} t={t}>
        <div>dummy child</div>
      </NewsTabs>,
    )
    expect(getByLabelText(tunewsLabel)).toBeDefined()
    expect(getByLabelText('local')).toBeDefined()
  })
})
