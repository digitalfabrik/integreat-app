// @flow

import React from 'react'
import { shallow } from 'enzyme'
import NewsTabs from '../NewsTabs'
import { LOCAL_NEWS } from '../../constants'
import Tab from '../Tab'

describe('NewsTabs', () => {
  const language = 'en'
  const t = (key: ?string): string => key || ''

  it('should render two tabs if both local news and tunews are enabled', () => {
    const wrapper = shallow(
      <NewsTabs type={LOCAL_NEWS} city='testcity' localNewsEnabled tunewsEnabled language={language} t={t}>
        <div>dummy child</div>
      </NewsTabs>
    )
    expect(wrapper.find(Tab)).toHaveLength(2)
  })
})
