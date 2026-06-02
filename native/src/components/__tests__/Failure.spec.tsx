import { fireEvent, RenderAPI } from '@testing-library/react-native'
import React from 'react'

import { NonNullableRouteInformationType, REGIONS_ROUTE } from 'shared'
import { ErrorCode } from 'shared/api'

import useNavigate from '../../hooks/useNavigate'
import createNavigationPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import Failure from '../Failure'

import mocked = jest.mocked
import clearAllMocks = jest.clearAllMocks

jest.mock('react-i18next')
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
    code: ErrorCode = ErrorCode.UnknownError,
    goTo?: NonNullableRouteInformationType | (() => void),
    goToLabel?: string,
  ): RenderAPI => render(<Failure code={code} retry={retry} goTo={goTo} goToLabel={goToLabel} />)

  it('should render a retry button if retry is passed', () => {
    const { getByText } = renderFailure(() => undefined)
    expect(getByText('tryAgain')).toBeTruthy()
  })

  it('should not render a retry button if retry is not passed', () => {
    const { queryByText } = renderFailure()
    expect(queryByText('tryAgain')).toBeNull()
  })

  it('should show the error code as message', () => {
    const { getByText } = renderFailure()
    expect(getByText(ErrorCode.UnknownError)).toBeTruthy()
  })

  it('should show notFound.region for RegionUnavailable', () => {
    const { getByText } = renderFailure(null, ErrorCode.RegionUnavailable)
    expect(getByText('notFound.region')).toBeTruthy()
  })

  it('should call retry when retry button is pressed', () => {
    const retry = jest.fn()
    const { getByText } = renderFailure(retry)
    fireEvent.press(getByText('tryAgain'))
    expect(retry).toHaveBeenCalled()
  })

  it('should always show a back button', () => {
    const { getByText } = renderFailure()
    expect(getByText('common:back')).toBeTruthy()
  })

  it('should use goToLabel for the back button when provided', () => {
    const { getByText } = renderFailure(null, ErrorCode.UnknownError, undefined, 'error:goToRegions')
    expect(getByText('error:goToRegions')).toBeTruthy()
  })

  it('should call goTo when the back button is pressed and goTo is a function', () => {
    const goTo = jest.fn()
    const { getByText } = renderFailure(null, ErrorCode.UnknownError, goTo)
    fireEvent.press(getByText('common:back'))
    expect(goTo).toHaveBeenCalled()
  })

  it('should call navigateTo with the route when goTo is a route object', () => {
    const goTo: NonNullableRouteInformationType = { route: REGIONS_ROUTE, languageCode: 'de' }
    const { getByText } = renderFailure(null, ErrorCode.UnknownError, goTo)
    fireEvent.press(getByText('common:back'))
    expect(navigateTo).toHaveBeenCalledWith(goTo)
  })

  it('should navigate back if goTo is not passed', () => {
    mocked(useNavigate).mockImplementation(() => ({ navigateTo, navigation: { ...navigation, canGoBack: () => true } }))
    const { getByText } = renderFailure(null, ErrorCode.UnknownError)
    fireEvent.press(getByText('common:back'))
    expect(navigation.goBack).toHaveBeenCalledTimes(1)
  })

  it('should navigate to regions if it cannot go back', () => {
    mocked(useNavigate).mockImplementation(() => ({
      navigateTo,
      navigation: { ...navigation, canGoBack: () => false },
    }))
    const { getByText } = renderFailure(null, ErrorCode.UnknownError)
    fireEvent.press(getByText('common:back'))
    expect(navigateTo).toHaveBeenCalledTimes(1)
    expect(navigateTo).toHaveBeenCalledWith({ route: REGIONS_ROUTE, languageCode: '' })
  })
})
