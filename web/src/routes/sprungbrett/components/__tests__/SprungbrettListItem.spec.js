// @flow

import React from 'react'
import { SprungbrettJobModel } from 'api-client'
import { shallow } from 'enzyme'
import SprungbrettListItem from '../SprungbrettListItem'

describe('SprungbrettListItem', () => {
  const job = new SprungbrettJobModel({
    id: 0,
    title: 'WebDeveloper',
    location: 'Augsburg',
    isEmployment: true,
    isApprenticeship: true,
    url: 'http://awesome-jobs.domain'
  })

  it('should render and match snapshot', () => {
    expect(shallow(
      <SprungbrettListItem job={job} />
    )).toMatchSnapshot()
  })
})
