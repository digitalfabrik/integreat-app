import React from 'react'
import { shallow } from 'enzyme'
import NewsTabs from '../NewsTabs'
import Tab from '../Tab'
import { LOCAL_NEWS_TYPE } from 'api-client'

describe('NewsTabs', () => {
  const language = 'en'
  const t = key => key

  it('should render two tabs if both local news and tunews are enabled', () => {
    const wrapper = shallow(
      <NewsTabs type={LOCAL_NEWS_TYPE} city='testcity' localNewsEnabled tunewsEnabled language={language} t={t}>
        <div>dummy child</div>
      </NewsTabs>
    )
    expect(wrapper.find(Tab)).toHaveLength(2)
  })
})
