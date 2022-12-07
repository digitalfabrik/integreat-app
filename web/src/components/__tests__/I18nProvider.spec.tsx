import { act, getByTestId, getByText, render, waitFor } from '@testing-library/react'
import { mocked } from 'jest-mock'
import React from 'react'
import Helmet from 'react-helmet'
import { Translation } from 'react-i18next'

import BrowserLanguageDetector from '../../utils/BrowserLanguageDetector'
import I18nProvider from '../I18nProvider'

jest.mock('../../utils/BrowserLanguageDetector')
jest.mock('translations/src/loadTranslations')

describe('I18nProvider', () => {
  const mockDetect = mocked(BrowserLanguageDetector.detect)

  it.each`
    detectedLanguage | contentLanguage | expectedLanguage | expectedTranslation
    ${'ar'}          | ${'ar'}         | ${'ar'}          | ${'معلومات محلية'}
    ${'ku'}          | ${undefined}    | ${'ku'}          | ${'Zanyariyên xwecihî'}
    ${'en'}          | ${'invalid'}    | ${'en'}          | ${'Lokale Informationen'}
    ${'zh-CN'}       | ${undefined}    | ${'zh-CN'}       | ${'本地信息'}
    ${'zh-hans'}     | ${undefined}    | ${'zh-CN'}       | ${'本地信息'}
    ${'de-DE'}       | ${undefined}    | ${'de'}          | ${'Lokale Informationen'}
  `(
    `should choose correct direction and translation for detected $detectedLanguage and content language $contentLanguage`,
    async ({ detectedLanguage, contentLanguage, expectedLanguage, expectedTranslation }) => {
      mockDetect.mockReturnValue([detectedLanguage])
      const { findByText } = render(
        <I18nProvider contentLanguage={contentLanguage}>
          <Translation>{(t, { i18n }) => <p>{i18n.languages[0]}</p>}</Translation>
          <Translation>{t => <p>{t('dashboard:localInformation')}</p>}</Translation>
        </I18nProvider>
      )
      expect(await findByText(expectedLanguage)).toBeTruthy()
      expect(await findByText(expectedTranslation)).toBeTruthy()
    }
  )

  it(`should set the browser direction correctly to rtl for ar`, async () => {
    mockDetect.mockReturnValue(['ar'])
    const { findByText, getByTestId } = render(
      <I18nProvider contentLanguage={undefined}>
        <Translation>{(t, { i18n }) => <p>{i18n.languages[0]}</p>}</Translation>
      </I18nProvider>
    )

    expect((await findByText('ar')).parentElement?.dir).toBe('rtl')
    expect(getByTestId('direction')).toHaveAttribute('dir', 'rtl')
  })

  it(`should set the browser direction correctly to ltr for de`, async () => {
    mockDetect.mockReturnValue(['de'])
    const { findByText, getByTestId } = render(
      <I18nProvider contentLanguage={undefined}>
        <Translation>{(t, { i18n }) => <p>{i18n.languages[0]}</p>}</Translation>
      </I18nProvider>
    )

    expect((await findByText('de')).parentElement?.dir).toBe('ltr')
    expect(getByTestId('direction')).toHaveAttribute('dir', 'ltr')
  })

  it('should set ui language to fallback of content language', async () => {
    const { findByText } = render(
      <I18nProvider contentLanguage='fa'>
        <Translation>{(t, { i18n }) => <p>{i18n.languages[0]}</p>}</Translation>
      </I18nProvider>
    )
    expect(await findByText('pes')).toBeTruthy()
  })

  it('should set link for additional font noto sans arabic', async () => {
    mockDetect.mockReturnValue(['ar'])
    render(
      <I18nProvider contentLanguage={undefined}>
        <Translation>{(t, { i18n }) => <p>{i18n.languages[0]}</p>}</Translation>
      </I18nProvider>
    )
    await waitFor(() =>
      expect(document.querySelector('link')?.getAttribute('href')).toBe('/fonts/noto-sans-arabic/noto-sans-arabic.css')
    )
  })

  it('should set link for additional font noto-sans-sc', async () => {
    mockDetect.mockReturnValue(['zh-CN'])
    render(
      <I18nProvider contentLanguage={undefined}>
        <Translation>{(t, { i18n }) => <p>{i18n.languages[0]}</p>}</Translation>
      </I18nProvider>
    )
    await waitFor(() =>
      expect(document.querySelector('link')?.getAttribute('href')).toBe('/fonts/noto-sans-sc/noto-sans-sc.css')
    )
  })

  it('should set link for additional font noto-sans-georgian', async () => {
    mockDetect.mockReturnValue(['ka'])
    render(
      <I18nProvider contentLanguage={undefined}>
        <Translation>{(t, { i18n }) => <p>{i18n.languages[0]}</p>}</Translation>
      </I18nProvider>
    )
    await waitFor(() =>
      expect(document.querySelector('link')?.getAttribute('href')).toBe(
        '/fonts/noto-sans-georgian/noto-sans-georgian.css'
      )
    )
  })

  it('should choose the default fallback for ui translations', async () => {
    mockDetect.mockReturnValue(['en'])
    const { findByText } = render(
      <I18nProvider contentLanguage={undefined}>
        <Translation>{t => <p>{t('dashboard:localInformation')}</p>}</Translation>
      </I18nProvider>
    )
    expect(await findByText('Lokale Informationen')).toBeTruthy()
  })

  it('should set document language', async () => {
    render(<I18nProvider contentLanguage='ar'>Hello</I18nProvider>)
    await waitFor(() => expect(document.documentElement.lang).toBe('ar'))
  })

  it('should use additional font for arabic', async () => {
    render(<I18nProvider contentLanguage='ar'>Hello</I18nProvider>)

    await waitFor(() => {
      // Checking for side-effect
      const helmet = Helmet.peek()
      expect(helmet.linkTags.map(link => link.href)).toContain('/fonts/noto-sans-arabic/noto-sans-arabic.css')
    })
  })

  it('should use no additional font for english', async () => {
    render(<I18nProvider contentLanguage={undefined}>Hello</I18nProvider>)
    await waitFor(() => {
      // Checking for side-effect
      const helmet = Helmet.peek()
      expect(helmet.linkTags.map(link => link.href)).not.toContain('/fonts/noto-sans-arabic/noto-sans-arabic.css')
    })
  })

  it('should support language tags with dashes', async () => {
    mockDetect.mockReturnValue(['zh-hans'])
    const { findByText } = render(
      <I18nProvider contentLanguage={undefined}>
        <Translation>{t => <p>{t('dashboard:localInformation')}</p>}</Translation>
      </I18nProvider>
    )

    expect(await findByText('本地信息')).toBeTruthy()
  })

  it('should support de-DE and select de', async () => {
    mockDetect.mockReturnValue(['de-DE'])
    const { findByText, queryByText } = render(
      <I18nProvider contentLanguage={undefined}>
        <Translation>{t => <p>{t('dashboard:localInformation')}</p>}</Translation>
        <Translation>{(t, { i18n }) => <p>{i18n.languages[0]}</p>}</Translation>
      </I18nProvider>
    )

    expect(await findByText('Lokale Informationen')).toBeTruthy()
    expect(await findByText('de')).toBeTruthy()
    expect(queryByText('de-DE')).toBeFalsy()
  })
})
