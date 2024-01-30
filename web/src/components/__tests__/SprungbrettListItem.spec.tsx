import React from 'react'

import { SprungbrettJobModel } from 'shared/api'

import { renderWithRouterAndTheme } from '../../testing/render'
import SprungbrettListItem from '../SprungbrettListItem'

describe('SprungbrettListItem', () => {
  const job = new SprungbrettJobModel({
    id: 0,
    title: 'WebDeveloper',
    location: 'Augsburg',
    isEmployment: true,
    isApprenticeship: true,
    url: 'http://awesome-jobs.domain',
  })

  it('should render a sprungbrett list item', () => {
    const { getByText } = renderWithRouterAndTheme(<SprungbrettListItem job={job} />)

    expect(getByText(job.title)).toBeTruthy()
    expect(getByText(job.title).closest('a')).toHaveAttribute('href', job.url)
    expect(getByText(job.location)).toBeTruthy()
  })
})
