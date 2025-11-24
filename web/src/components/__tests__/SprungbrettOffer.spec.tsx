import { RenderResult } from '@testing-library/react'
import { mocked } from 'jest-mock'
import React from 'react'

import { OfferModel, SprungbrettJobModel, useLoadFromEndpoint } from 'shared/api'
import { mockUseLoadFromEndpointWithError } from 'shared/api/endpoints/testing/mockUseLoadFromEndpoint'

import { renderWithRouterAndTheme } from '../../testing/render'
import SprungbrettOffer from '../SprungbrettOffer'

jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  useLoadFromEndpoint: jest.fn(),
}))
jest.mock('react-i18next')

describe('SprungbrettOffer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const sprungbrettOffer = new OfferModel({
    alias: 'sprungbrett',
    thumbnail: 'some_other_thumbnail',
    title: 'Sprungbrett',
    path: 'https://web.integreat-app.de/proxy/sprungbrett/app-search-internships?location=augsburg',
  })
  const sprungbrettJobs = [
    new SprungbrettJobModel({
      id: 0,
      title: 'WebDeveloper',
      location: 'Augsburg',
      isEmployment: true,
      isApprenticeship: true,
      url: 'http://awesome-jobs.domain',
    }),
    new SprungbrettJobModel({
      id: 1,
      title: 'BackendDeveloper',
      location: 'Augsburg',
      isEmployment: true,
      isApprenticeship: false,
      url: 'http://awesome-jobs.domain',
    }),
    new SprungbrettJobModel({
      id: 2,
      title: 'Freelancer',
      location: 'Augsburg',
      isEmployment: false,
      isApprenticeship: true,
      url: 'http://awesome-jobs.domain',
    }),
  ]
  const returnValue = {
    data: sprungbrettJobs,
    loading: false,
    error: null,
    refresh: jest.fn,
  }

  const renderSprungbrett = (): RenderResult =>
    renderWithRouterAndTheme(<SprungbrettOffer sprungbrettOffer={sprungbrettOffer} />)

  it('should render list sprungbrett jobs', () => {
    mocked(useLoadFromEndpoint).mockImplementation(() => returnValue as never)

    const { getByText } = renderSprungbrett()

    sprungbrettJobs.forEach(sprungbrettJob => {
      expect(getByText(sprungbrettJob.title)).toBeTruthy()
    })
  })

  it('should render error when loading fails', () => {
    const errorMessage = 'Offers are not available!'
    mockUseLoadFromEndpointWithError(errorMessage)

    const { getByText } = renderSprungbrett()

    expect(getByText(`error:unknownError`)).toBeTruthy()
  })
})
