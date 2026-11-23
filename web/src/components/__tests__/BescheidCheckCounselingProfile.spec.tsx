import { fireEvent } from '@testing-library/react'
import React from 'react'

import { RegionModelBuilder } from 'shared/api'

import { COUNSELING_PROFILE_STORAGE_KEY } from '../../hooks/useLocalStorage'
import { mockUseQueryFromEndpointWithData } from '../../testing/mockUseQueryFromEndpoint'
import { renderWithTheme } from '../../testing/render'
import BescheidCheckCounselingProfile from '../BescheidCheckCounselingProfile'

jest.mock('../../hooks/useQueryFromEndpoint')

describe('BescheidCheckCounselingProfile', () => {
  const regions = new RegionModelBuilder(1).build()

  beforeEach(() => {
    localStorage.clear()
    mockUseQueryFromEndpointWithData(regions)
  })

  const renderCounselingProfile = (regionCode?: string) => {
    const result = renderWithTheme(<BescheidCheckCounselingProfile regionCode={regionCode} />)
    fireEvent.click(result.getByText('bescheidCheck:counselingProfile.title'))
    return result
  }

  const getStoredProfile = () => JSON.parse(localStorage.getItem(COUNSELING_PROFILE_STORAGE_KEY) ?? '{}')

  it('should store the submitted profile with the passed region as default location', () => {
    const { getByRole, getByText } = renderCounselingProfile('augsburg')

    fireEvent.mouseDown(getByRole('combobox', { name: 'bescheidCheck:counselingProfile.age.label' }))
    fireEvent.click(getByRole('option', { name: 'bescheidCheck:counselingProfile.age.options.from18To25' }))

    expect(getStoredProfile()).toEqual({})

    fireEvent.click(getByRole('button', { name: 'bescheidCheck:counselingProfile.submit' }))

    expect(getStoredProfile()).toEqual({ regionCode: 'augsburg', age: 'from18To25' })
    expect(getByText('bescheidCheck:counselingProfile.applied')).toBeTruthy()
  })

  it('should restore the stored profile', () => {
    localStorage.setItem(
      COUNSELING_PROFILE_STORAGE_KEY,
      JSON.stringify({ residenceStatus: 'germanCitizenship', regionCode: 'augsburg' }),
    )
    const { getByRole } = renderCounselingProfile()

    expect(getByRole('combobox', { name: 'bescheidCheck:counselingProfile.residenceStatus.label' })).toHaveTextContent(
      'bescheidCheck:counselingProfile.residenceStatus.options.germanCitizenship',
    )
    expect(getByRole('combobox', { name: 'bescheidCheck:counselingProfile.region.label' })).toHaveTextContent(
      'Stadt Augsburg',
    )
  })
})
