import { fireEvent, RenderResult } from '@testing-library/react-native'
import React from 'react'

import { NonNullableRouteInformationType, REGIONS_ROUTE } from 'shared'
import { ErrorCode, ErrorCodes } from 'shared/api'

import useNavigate from '../../hooks/useNavigate'
import createNavigationPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import Failure from '../Failure'

import mocked = jest.mocked
import clearAllMocks = jest.clearAllMocks

jest.mock('../../hooks/useNavigate')

describe('Failure', () => {
  const navigation = createNavigationPropMock()
  const navigateTo = jest.fn()
  mocked(useNavigate).mockImplementation(() => ({ navigateTo, navigation }))

  beforeEach(() => {
    clearAllMocks()
  })

  const renderFailure = (
    retry: (() => void) | null = null,
    code: ErrorCode = ErrorCodes.UnknownError,
    goTo?: NonNullableRouteInformationType | (() => void),
    goToLabel?: string,
  ): Promise<RenderResult> => render(<Failure code={code} retry={retry} goTo={goTo} goToLabel={goToLabel} />)

  it('should render a retry button if retry is passed', async () => {
    const { getByText } = await renderFailure(() => undefined)
    expect(getByText('error:tryAgain')).toBeTruthy()
  })

  it('should not render a retry button if retry is not passed', async () => {
    const { queryByText } = await renderFailure()
    expect(queryByText('error:tryAgain')).toBeNull()
  })

  it('should show the error code as message', async () => {
    const { getByText } = await renderFailure()
    expect(getByText(`error:unknownError`)).toBeTruthy()
  })

  it('should show notFound.region for RegionUnavailable', async () => {
    const { getByText } = await renderFailure(null, ErrorCodes.RegionUnavailable)
    expect(getByText('regions:notFound')).toBeTruthy()
  })

  it('should call retry when retry button is pressed', async () => {
    const retry = jest.fn()
    const { getByText } = await renderFailure(retry)
    await fireEvent.press(getByText('error:tryAgain'))
    expect(retry).toHaveBeenCalled()
  })

  it('should always show a back button', async () => {
    const { getByText } = await renderFailure()
    expect(getByText('common:actions.back')).toBeTruthy()
  })

  it('should use goToLabel for the back button when provided', async () => {
    const { getByText } = await renderFailure(null, ErrorCodes.UnknownError, undefined, 'error:goToRegions')
    expect(getByText('error:goToRegions')).toBeTruthy()
  })

  it('should call goTo when the back button is pressed and goTo is a function', async () => {
    const goTo = jest.fn()
    const { getByText } = await renderFailure(null, ErrorCodes.UnknownError, goTo)
    await fireEvent.press(getByText('common:actions.back'))
    expect(goTo).toHaveBeenCalled()
  })

  it('should call navigateTo with the route when goTo is a route object', async () => {
    const goTo: NonNullableRouteInformationType = { route: REGIONS_ROUTE, languageCode: 'de' }
    const { getByText } = await renderFailure(null, ErrorCodes.UnknownError, goTo)
    await fireEvent.press(getByText('common:actions.back'))
    expect(navigateTo).toHaveBeenCalledWith(goTo)
  })

  it('should navigate back if goTo is not passed', async () => {
    mocked(useNavigate).mockImplementation(() => ({ navigateTo, navigation: { ...navigation, canGoBack: () => true } }))
    const { getByText } = await renderFailure(null, ErrorCodes.UnknownError)
    await fireEvent.press(getByText('common:actions.back'))
    expect(navigation.goBack).toHaveBeenCalledTimes(1)
  })

  it('should navigate to regions if it cannot go back', async () => {
    mocked(useNavigate).mockImplementation(() => ({
      navigateTo,
      navigation: { ...navigation, canGoBack: () => false },
    }))
    const { getByText } = await renderFailure(null, ErrorCodes.UnknownError)
    await fireEvent.press(getByText('common:actions.back'))
    expect(navigateTo).toHaveBeenCalledTimes(1)
    expect(navigateTo).toHaveBeenCalledWith({ route: REGIONS_ROUTE, languageCode: '' })
  })
})
