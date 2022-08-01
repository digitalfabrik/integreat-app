import { render } from '@testing-library/react'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import { SprungbrettJobModel } from 'api-client'

import buildConfig from '../../constants/buildConfig'
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
    const { getByText } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <SprungbrettListItem job={job} />
      </ThemeProvider>
    )

    expect(getByText(job.title)).toBeTruthy()
    expect(getByText(job.title).closest('a')).toHaveAttribute('href', job.url)
    expect(getByText(job.location)).toBeTruthy()
  })
})
