import { fireEvent } from '@testing-library/react'
import React from 'react'

import { analyzeBescheid, FetchError } from 'shared/api'

import { renderRoute } from '../../testing/render'
import BescheidCheckPage from '../BescheidCheckPage'

jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  analyzeBescheid: jest.fn(),
}))

describe('BescheidCheckPage', () => {
  const file = new File(['content'], 'page1.pdf')
  const pendingAnalysis = new Promise<void>(() => {})

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderAndSubmit = () => {
    const result = renderRoute(<BescheidCheckPage languageCode='de' />, {
      pathname: '/bescheid-check/de',
      routePattern: '/bescheid-check/:languageCode',
      searchParams: 'region=muenchen',
    })
    fireEvent.change(result.getByLabelText('bescheidCheck:upload.selectFiles'), { target: { files: [file] } })
    fireEvent.click(result.getByRole('checkbox'))
    fireEvent.click(result.getByRole('button', { name: 'bescheidCheck:submit' }))
    return result
  }

  it('should render a heading', () => {
    const { getByText } = renderRoute(<BescheidCheckPage languageCode='de' />, {
      pathname: '/bescheid-check/de',
      routePattern: '/bescheid-check/:languageCode',
    })

    expect(getByText('Bescheid-Check')).toBeTruthy()
  })

  it('should show a back button that navigates to the originating region home page when no history exists', () => {
    const { getByText, router } = renderRoute(<BescheidCheckPage languageCode='de' />, {
      pathname: '/bescheid-check/de',
      routePattern: '/bescheid-check/:languageCode',
      searchParams: 'region=augsburg',
    })

    fireEvent.click(getByText('common:actions.back'))

    expect(router.state.location.pathname).toBe('/augsburg/de')
  })

  it('should show a back button that navigates to the regions page when no history and no region exist', () => {
    const { getByText, router } = renderRoute(<BescheidCheckPage languageCode='de' />, {
      pathname: '/bescheid-check/de',
      routePattern: '/bescheid-check/:languageCode',
    })

    fireEvent.click(getByText('common:actions.back'))

    expect(router.state.location.pathname).toBe('/regions/de')
  })

  it('should only enable the submit button with at least one file and accepted privacy policy', () => {
    const { getByText, getByLabelText, getByRole } = renderRoute(<BescheidCheckPage languageCode='de' />, {
      pathname: '/bescheid-check/de',
      routePattern: '/bescheid-check/:languageCode',
    })
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
        new FetchError({ endpointName: 'analyzeBescheid', innerError: new TypeError(), url: '', requestOptions: {} }),
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
        return Promise.reject(new Error('Analysis failed'))
      })
      .mockReturnValue(pendingAnalysis)
    const { findByText, getByRole } = renderAndSubmit()

    expect(await findByText('bescheidCheck:progress.failed')).toBeTruthy()

    fireEvent.click(getByRole('button', { name: 'error:tryAgain' }))

    expect(analyzeBescheid).toHaveBeenCalledTimes(2)
  })

  it('should show the results when the analysis is done', async () => {
    jest.mocked(analyzeBescheid).mockResolvedValue(undefined)
    const { findByText, getByRole, getByText } = renderAndSubmit()

    expect(await findByText('bescheidCheck:progress.steps.done')).toBeTruthy()

    fireEvent.click(getByRole('button', { name: 'bescheidCheck:progress.showResults' }))

    expect(getByText('bescheidCheck:results.title')).toBeTruthy()
  })

  it('should clear the selected files when starting a new analysis', async () => {
    jest.mocked(analyzeBescheid).mockResolvedValue(undefined)
    const { findByRole, getByRole, queryByText } = renderAndSubmit()

    fireEvent.click(await findByRole('button', { name: 'bescheidCheck:progress.startNewAnalysis' }))

    expect(getByRole('button', { name: 'bescheidCheck:submit' })).toBeDisabled()
    expect(queryByText('page1.pdf')).toBeNull()
  })
})
