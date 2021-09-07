import { shallow } from 'enzyme'
import React from 'react'

import { LOCAL_NEWS_TYPE } from 'api-client'

import NewsTab from '../NewsTab'
import NewsTabs from '../NewsTabs'

describe('NewsTabs', () => {
  const language = 'en'
  const t = (key: string) => key

  it('should render two tabs if both local news and tunews are enabled', () => {
    const wrapper = shallow(
      <NewsTabs type={LOCAL_NEWS_TYPE} city='testcity' localNewsEnabled tunewsEnabled language={language} t={t}>
        <div>dummy child</div>
      </NewsTabs>
    )
    expect(wrapper.find(NewsTab)).toHaveLength(2)
  })
})
