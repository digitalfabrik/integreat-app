import { fireEvent } from '@testing-library/react'
import { DateTime } from 'luxon'
import React from 'react'

import { UNSUPPORTED_BESCHEID_TYPE } from 'shared'
import { BescheidCheckResult as AnalysisResult } from 'shared/api'

import { renderWithRouterAndTheme } from '../../testing/render'
import BescheidCheckResult from '../BescheidCheckResult'

describe('BescheidCheckResult', () => {
  const startNewAnalysis = jest.fn()
  const result: AnalysisResult = {
    classification: { type: 'ablehnung-einfach', confidence: 0.9, reason: 'Rejected application' },
    topic: 'Ablehnung des Asylantrags',
    consequences: ['Abschiebung nach Ablauf der Ausreisefrist & Einreiseverbot'],
    actionRequired: true,
    deadline: { date: null },
    explanation: {
      title: 'Ablehnung einfach',
      content: '<p>Dein Asylantrag wurde abgelehnt.</p>',
      url: 'https://example.com/ablehnung-einfach',
    },
    counseling: null,
    pages: [],
  }
  const unsupportedResult: AnalysisResult = {
    ...result,
    classification: { ...result.classification, type: UNSUPPORTED_BESCHEID_TYPE },
    explanation: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderResult = (analysisResult: AnalysisResult) =>
    renderWithRouterAndTheme(<BescheidCheckResult result={analysisResult} startNewAnalysis={startNewAnalysis} />)

  it('should render the explanation of a recognized Bescheid', () => {
    const { getByText, queryByText } = renderResult(result)

    expect(getByText('bescheidCheck:result.title')).toBeTruthy()
    expect(getByText('bescheidCheck:result.documentTypeRecognized')).toBeTruthy()
    expect(getByText('Ablehnung einfach')).toBeTruthy()
    expect(getByText('bescheidCheck:result.description')).toBeTruthy()
    expect(getByText('Dein Asylantrag wurde abgelehnt.')).toBeTruthy()
    expect(getByText('bescheidCheck:result.actionRequired')).toBeTruthy()
    expect(getByText('bescheidCheck:result.deadline')).toBeTruthy()
    expect(queryByText('Ablehnung des Asylantrags')).toBeNull()
    expect(queryByText('Abschiebung nach Ablauf der Ausreisefrist & Einreiseverbot')).toBeNull()
  })

  it('should fall back to the topic and consequences if the backend returned no explanation', () => {
    const { getByText } = renderResult({ ...result, explanation: null })

    expect(getByText('Ablehnung des Asylantrags')).toBeTruthy()
    expect(getByText('Abschiebung nach Ablauf der Ausreisefrist & Einreiseverbot')).toBeTruthy()
  })

  it('should show the deadline date if known', () => {
    const { getByText } = renderResult({ ...result, deadline: { date: DateTime.fromISO('2026-12-08') } })

    expect(getByText(/bescheidCheck:result\.deadlineUntil/)).toBeTruthy()
  })

  it('should not show the action and deadline chips if nothing was extracted', () => {
    const { queryByText } = renderResult({ ...result, actionRequired: false, deadline: null })

    expect(queryByText('bescheidCheck:result.actionRequired')).toBeNull()
    expect(queryByText(/bescheidCheck:result\.deadline/)).toBeNull()
  })

  it('should start a new analysis', () => {
    const { getByRole } = renderResult(result)

    fireEvent.click(getByRole('button', { name: 'bescheidCheck:progress.startNewAnalysis' }))

    expect(startNewAnalysis).toHaveBeenCalledTimes(1)
  })

  it('should print the result', () => {
    const print = jest.spyOn(window, 'print').mockImplementation(() => undefined)
    const { getByRole } = renderResult(result)

    fireEvent.click(getByRole('button', { name: 'categories:pdf.create' }))

    expect(print).toHaveBeenCalledTimes(1)
    print.mockRestore()
  })

  it('should show the failure and the next steps for an unsupported Bescheid', () => {
    const { getByText, queryByText } = renderResult(unsupportedResult)

    expect(getByText('bescheidCheck:result.analysisFailed')).toBeTruthy()
    expect(getByText('bescheidCheck:result.notRecognized.title')).toBeTruthy()
    expect(getByText(/bescheidCheck:result\.notRecognized\.description/)).toBeTruthy()
    expect(getByText('bescheidCheck:result.notRecognized.steps.tryAgain.title')).toBeTruthy()
    expect(queryByText('bescheidCheck:result.title')).toBeNull()
    expect(queryByText('bescheidCheck:result.documentTypeRecognized')).toBeNull()
  })

  it('should show the explanation of an unsupported Bescheid if the backend returned one', () => {
    const { getByText, queryByText } = renderResult({ ...unsupportedResult, explanation: result.explanation })

    expect(getByText('bescheidCheck:result.notRecognized.title')).toBeTruthy()
    expect(getByText('Dein Asylantrag wurde abgelehnt.')).toBeTruthy()
    expect(queryByText('bescheidCheck:result.notRecognized.steps.tryAgain.title')).toBeNull()
  })
})
