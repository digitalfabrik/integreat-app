// @flow

import { shallow } from 'enzyme'
import React from 'react'
import { ExtraModel, SprungbrettJobModel } from '@integreat-app/integreat-api-client'
import { SprungbrettExtraPage } from '../SprungbrettExtraPage'

describe('SprungbrettExtraPage', () => {
  const sprungbrettExtra = new ExtraModel({
    alias: 'sprungbrett', path: 'path to fetch jobs from', title: 'Sprungbrett', thumbnail: 'xy', postData: null
  })

  const sprungbrettJobs = [
    new SprungbrettJobModel({
      id: 0,
      title: 'WebDeveloper',
      location: 'Augsburg',
      isEmployment: true,
      isApprenticeship: true,
      url: 'http://awesome-jobs.domain'
    }),
    new SprungbrettJobModel({
      id: 1,
      title: 'BackendDeveloper',
      location: 'Augsburg',
      isEmployment: true,
      isApprenticeship: false,
      url: 'http://awesome-jobs.domain'
    }),
    new SprungbrettJobModel({
      id: 2,
      title: 'Freelancer',
      location: 'Augsburg',
      isEmployment: false,
      isApprenticeship: true,
      url: 'http://awesome-jobs.domain'
    })
  ]

  const t = (key: ?string): string => key || ''

  it('should render list', () => {
    const sprunbrettPage = shallow(
      <SprungbrettExtraPage sprungbrettJobs={sprungbrettJobs}
                            extras={[sprungbrettExtra]}
                            t={t} />
    )
    expect(sprunbrettPage).toMatchSnapshot()
  })

  it('should render error if extra is not supported', () => {
    const sprunbrettPage = shallow(
      <SprungbrettExtraPage sprungbrettJobs={sprungbrettJobs}
                            extras={[]}
                            t={t} />
    )
    expect(sprunbrettPage).toMatchSnapshot()
  })
})
