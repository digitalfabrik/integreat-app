// @flow

import { shallow } from 'enzyme'
import React from 'react'
import { OfferModel, SprungbrettJobModel } from 'api-client'
import { SprungbrettOfferPage } from '../SprungbrettOfferPage'

describe('SprungbrettOfferPage', () => {
  const sprungbrettOffer = new OfferModel({
    alias: 'sprungbrett',
    path: 'path to fetch jobs from',
    title: 'Sprungbrett',
    thumbnail: 'xy',
    postData: null
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
      <SprungbrettOfferPage sprungbrettJobs={sprungbrettJobs} offers={[sprungbrettOffer]} t={t} />
    )
    expect(sprunbrettPage).toMatchSnapshot()
  })

  it('should render error if offer is not supported', () => {
    const sprunbrettPage = shallow(<SprungbrettOfferPage sprungbrettJobs={sprungbrettJobs} offers={[]} t={t} />)
    expect(sprunbrettPage).toMatchSnapshot()
  })
})
