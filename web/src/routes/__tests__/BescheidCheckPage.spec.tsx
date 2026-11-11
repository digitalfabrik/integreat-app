import { fireEvent } from '@testing-library/react'
import React from 'react'

import { BescheidCheckResult } from 'shared'
import { ANALYZE_BESCHEID_ENDPOINT_NAME, analyzeBescheid, BescheidCheckAnalysisError, FetchError } from 'shared/api'

import { renderRoute } from '../../testing/render'
import BescheidCheckPage from '../BescheidCheckPage'

jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  analyzeBescheid: jest.fn(),
}))

describe('BescheidCheckPage', () => {
  const file = new File(['content'], 'page1.pdf')
  const pendingAnalysis = new Promise<BescheidCheckResult>(() => {})
  const result: BescheidCheckResult = {
    classification: { type: 'ablehnung-einfach', confidence: 0.9, reason: 'Rejected application' },
    explanation: null,
    counseling: null,
    pages: [{ pageNumber: 1, originalHtml: '<p>Bescheid</p>', translatedHtml: '<p>Decision</p>' }],
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderBescheidCheckPage = (searchParams?: string) =>
    renderRoute(<BescheidCheckPage languageCode='de' />, {
      pathname: '/bescheid-check/de',
      routePattern: '/bescheid-check/:languageCode',
      searchParams,
    })

  const renderAndSubmit = () => {
    const result = renderBescheidCheckPage('region=muenchen')
    fireEvent.change(result.getByLabelText('bescheidCheck:upload.selectFiles'), { target: { files: [file] } })
    fireEvent.click(result.getByRole('checkbox'))
    fireEvent.click(result.getByRole('button', { name: 'bescheidCheck:submit' }))
    return result
  }

  it('should render a heading', () => {
    const { getByText } = renderBescheidCheckPage()

    expect(getByText('Bescheid-Check')).toBeTruthy()
  })

  it('should show a back button that navigates to the originating region home page when no history exists', () => {
    const { getByText, router } = renderBescheidCheckPage('region=augsburg')

    fireEvent.click(getByText('common:actions.back'))

    expect(router.state.location.pathname).toBe('/augsburg/de')
  })

  it('should show a back button that navigates to the regions page when no history and no region exist', () => {
    const { getByText, router } = renderBescheidCheckPage()

    fireEvent.click(getByText('common:actions.back'))

    expect(router.state.location.pathname).toBe('/regions/de')
  })

  it('should only enable the submit button with at least one file and accepted privacy policy', () => {
    const { getByText, getByLabelText, getByRole } = renderBescheidCheckPage()
    const submitButton = getByRole('button', { name: 'bescheidCheck:submit' })

    expect(submitButton).toBeDisabled()

    fireEvent.change(getByLabelText('bescheidCheck:upload.selectFiles'), {
      target: { files: [new File(['content'], 'page1.pdf')] },
    })

    expect(getByText('page1.pdf')).toBeTruthy()
    expect(submitButton).toBeDisabled()

    fireEvent.click(getByRole('checkbox'))

    expect(submitButton).toBeEnabled()
  })

  it('should use the fallback region if none is passed', () => {
    jest.mocked(analyzeBescheid).mockReturnValue(pendingAnalysis)
    const { getByLabelText, getByRole } = renderBescheidCheckPage()
    fireEvent.change(getByLabelText('bescheidCheck:upload.selectFiles'), { target: { files: [file] } })
    fireEvent.click(getByRole('checkbox'))
    fireEvent.click(getByRole('button', { name: 'bescheidCheck:submit' }))

    expect(analyzeBescheid).toHaveBeenCalledWith(expect.objectContaining({ regionCode: 'bescheid-check' }))
  })

  it('should show the upload step while uploading', () => {
    jest.mocked(analyzeBescheid).mockReturnValue(pendingAnalysis)
    const { getByText } = renderAndSubmit()

    expect(getByText('bescheidCheck:progress.steps.uploading')).toBeTruthy()
    expect(analyzeBescheid).toHaveBeenCalledWith(
      expect.objectContaining({ languageCode: 'de', regionCode: 'muenchen', files: [file] }),
    )
  })

  it('should resubmit the same files on retry if the upload failed', async () => {
    jest
      .mocked(analyzeBescheid)
      .mockRejectedValueOnce(
        new FetchError({
          endpointName: ANALYZE_BESCHEID_ENDPOINT_NAME,
          innerError: new TypeError(),
          url: '',
          requestOptions: {},
        }),
      )
      .mockReturnValue(pendingAnalysis)
    const { findByText, getByRole, getByText } = renderAndSubmit()

    expect(await findByText('error:networkConnectionFailed')).toBeTruthy()

    fireEvent.click(getByRole('button', { name: 'error:tryAgain' }))

    expect(getByText('bescheidCheck:progress.steps.uploading')).toBeTruthy()
    expect(analyzeBescheid).toHaveBeenCalledTimes(2)
    expect(analyzeBescheid).toHaveBeenLastCalledWith(expect.objectContaining({ files: [file] }))
  })

  it('should show the stage reported by the backend', () => {
    jest.mocked(analyzeBescheid).mockImplementation(({ onStage }) => {
      onStage('translating')
      return pendingAnalysis
    })
    const { getByText } = renderAndSubmit()

    expect(getByText('bescheidCheck:progress.steps.translating')).toBeTruthy()
  })

  it('should resubmit the files on retry if the analysis failed', async () => {
    jest
      .mocked(analyzeBescheid)
      .mockImplementationOnce(({ onStage }) => {
        onStage('scanning')
        return Promise.reject(new BescheidCheckAnalysisError('Analysis failed'))
      })
      .mockReturnValue(pendingAnalysis)
    const { findByText, getByRole } = renderAndSubmit()

    expect(await findByText('bescheidCheck:progress.failed')).toBeTruthy()

    fireEvent.click(getByRole('button', { name: 'error:tryAgain' }))

    expect(analyzeBescheid).toHaveBeenCalledTimes(2)
  })

  it('should show the result when the analysis is done', async () => {
    jest.mocked(analyzeBescheid).mockResolvedValue(result)
    const { findByText, getByRole, getByText } = renderAndSubmit()

    expect(await findByText('bescheidCheck:progress.steps.done')).toBeTruthy()

    fireEvent.click(getByRole('button', { name: 'bescheidCheck:progress.showResult' }))

    expect(getByText('bescheidCheck:result.title')).toBeTruthy()
  })

  it('should clear the selected files when starting a new analysis', async () => {
    jest.mocked(analyzeBescheid).mockResolvedValue(result)
    const { findByRole, getByRole, queryByText } = renderAndSubmit()

    fireEvent.click(await findByRole('button', { name: 'bescheidCheck:progress.startNewAnalysis' }))

    expect(getByRole('button', { name: 'bescheidCheck:submit' })).toBeDisabled()
    expect(queryByText('page1.pdf')).toBeNull()
  })
})
