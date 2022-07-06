import { act, render, screen, waitFor } from '@testing-library/react'
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

  it('should choose the browser language', async () => {
    mockDetect.mockReturnValue(['ar'])
    act(() => {
      render(
        <I18nProvider contentLanguage={undefined}>
          <Translation>{(t, { i18n }) => <p>{i18n.languages[0]}</p>}</Translation>
        </I18nProvider>
      )
    })
    await waitFor(() => screen.getByText('ar'))
    expect(screen.getByText('ar')).toBeTruthy()
  })

  it('should set the browser direction correctly to ltr', async () => {
    mockDetect.mockReturnValue(['ru'])
    act(() => {
      render(
        <I18nProvider contentLanguage={undefined}>
          <Translation>{(t, { i18n }) => <p>{i18n.languages[0]}</p>}</Translation>
        </I18nProvider>
      )
    })
    await waitFor(() => screen.getByText('ru'))
    expect(screen.getByText('ru').parentElement?.dir).toBe('ltr')
  })

  it('should set the browser direction correctly to rtl', async () => {
    mockDetect.mockReturnValue(['ar'])
    act(() => {
      render(
        <I18nProvider contentLanguage={undefined}>
          <Translation>{(t, { i18n }) => <p>{i18n.languages[0]}</p>}</Translation>
        </I18nProvider>
      )
    })
    await waitFor(() => screen.getByText('ar'))
    expect(screen.getByText('ar').parentElement?.dir).toBe('rtl')
  })

  it('should set link for additional font noto sans arabic', async () => {
    mockDetect.mockReturnValue(['ar'])
    act(() => {
      render(
        <I18nProvider contentLanguage={undefined}>
          <Translation>{(t, { i18n }) => <p>{i18n.languages[0]}</p>}</Translation>
        </I18nProvider>
      )
    })
    await waitFor(() =>
      expect(document.querySelector('link')?.getAttribute('href')).toBe('/fonts/noto-sans-arabic/noto-sans-arabic.css')
    )
  })

  it('should set link for additional font noto-sans-sc', async () => {
    mockDetect.mockReturnValue(['zh-CN'])
    act(() => {
      render(
        <I18nProvider contentLanguage={undefined}>
          <Translation>{(t, { i18n }) => <p>{i18n.languages[0]}</p>}</Translation>
        </I18nProvider>
      )
    })
    await waitFor(() =>
      expect(document.querySelector('link')?.getAttribute('href')).toBe('/fonts/noto-sans-sc/noto-sans-sc.css')
    )
  })

  it('should set link for additional font noto-sans-georgian', async () => {
    mockDetect.mockReturnValue(['ka'])
    act(() => {
      render(
        <I18nProvider contentLanguage={undefined}>
          <Translation>{(t, { i18n }) => <p>{i18n.languages[0]}</p>}</Translation>
        </I18nProvider>
      )
    })
    await waitFor(() =>
      expect(document.querySelector('link')?.getAttribute('href')).toBe(
        '/fonts/noto-sans-georgian/noto-sans-georgian.css'
      )
    )
  })

  it('should use fallbacks for ui translations', async () => {
    mockDetect.mockReturnValue(['ku'])
    act(() => {
      render(
        <I18nProvider contentLanguage={undefined}>
          <Translation>{t => <p>{t('dashboard:localInformation')}</p>}</Translation>
        </I18nProvider>
      )
    })
    await waitFor(() => screen.debug())
    await waitFor(() => screen.getByText('Zanyariyên xwecihî'))
    expect(screen.getByText('Zanyariyên xwecihî')).toBeTruthy()
  })

  it('should choose the default fallback for ui translations', async () => {
    mockDetect.mockReturnValue(['en'])
    act(() => {
      render(
        <I18nProvider contentLanguage={undefined}>
          <Translation>{t => <p>{t('dashboard:localInformation')}</p>}</Translation>
        </I18nProvider>
      )
    })
    await waitFor(() => screen.getByText('Lokale Informationen'))
    expect(screen.getByText('Lokale Informationen')).toBeTruthy()
  })

  it('should set ui language to content language', async () => {
    act(() => {
      render(
        <I18nProvider contentLanguage='ar'>
          <Translation>{(t, { i18n }) => <p>{i18n.languages[0]}</p>}</Translation>
        </I18nProvider>
      )
    })
    await waitFor(() => screen.getByText('ar'))
    expect(screen.getByText('ar')).toBeTruthy()
  })

  it('should not set ui language for invalid content language', async () => {
    act(() => {
      render(
        <I18nProvider contentLanguage='invalid'>
          <Translation>{(t, { i18n }) => <p>{i18n.languages[0]}</p>}</Translation>
        </I18nProvider>
      )
    })
    await waitFor(() => screen.getByText('en'))
    expect(screen.getByText('en')).toBeTruthy()
  })

  it('should set ui language to fallback of content language', async () => {
    act(() => {
      render(
        <I18nProvider contentLanguage='fa'>
          <Translation>{(t, { i18n }) => <p>{i18n.languages[0]}</p>}</Translation>
        </I18nProvider>
      )
    })
    await waitFor(() => screen.getByText('pes'))
    expect(screen.getByText('pes')).toBeTruthy()
  })

  it('should choose rtl with ar as language', async () => {
    act(() => {
      render(<I18nProvider contentLanguage='ar'>Hello</I18nProvider>)
    })
    await waitFor(() => screen.getByTestId('direction'))
    expect(screen.getByTestId('direction')).toHaveAttribute('dir', 'rtl')
  })

  it('should choose ltr with en as language', async () => {
    act(() => {
      render(<I18nProvider contentLanguage={undefined}>Hello</I18nProvider>)
    })
    await waitFor(() => screen.getByTestId('direction'))
    expect(screen.getByTestId('direction')).toHaveAttribute('dir', 'ltr')
  })

  it('should set document language', async () => {
    act(() => {
      render(<I18nProvider contentLanguage='ar'>Hello</I18nProvider>)
    })
    await waitFor(() => screen.getByTestId('direction'))
    expect(document.documentElement.lang).toBe('ar')
  })

  it('should use additional font for arabic', async () => {
    act(() => {
      render(<I18nProvider contentLanguage='ar'>Hello</I18nProvider>)
    })
    await waitFor(() => screen.getByTestId('direction'))
    // Checking for side-effect
    const helmet = Helmet.peek()
    expect(helmet.linkTags.map(link => link.href)).toContain('/fonts/noto-sans-arabic/noto-sans-arabic.css')
  })

  it('should use no additional font for english', async () => {
    act(() => {
      render(<I18nProvider contentLanguage={undefined}>Hello</I18nProvider>)
    })
    await waitFor(() => screen.getByTestId('direction'))
    // Checking for side-effect
    const helmet = Helmet.peek()
    expect(helmet.linkTags.map(link => link.href)).not.toContain('/fonts/noto-sans-arabic/noto-sans-arabic.css')
  })

  it('should use zh-CN if any chinese variant is chosen', async () => {
    mockDetect.mockReturnValue(['zh-CN'])
    act(() => {
      render(
        <I18nProvider contentLanguage={undefined}>
          <Translation>{t => <p>{t('dashboard:localInformation')}</p>}</Translation>
        </I18nProvider>
      )
    })
    await waitFor(() => screen.getByText('本地信息'))
    expect(screen.getByText('本地信息')).toBeTruthy()
  })

  it('should support language tags with dashes', async () => {
    mockDetect.mockReturnValue(['zh-hans'])
    act(() => {
      render(
        <I18nProvider contentLanguage={undefined}>
          <Translation>{t => <p>{t('dashboard:localInformation')}</p>}</Translation>
        </I18nProvider>
      )
    })
    await waitFor(() => screen.getByText('本地信息'))
    expect(screen.getByText('本地信息')).toBeTruthy()
  })

  it('should support de-DE and select de', async () => {
    mockDetect.mockReturnValue(['de-DE'])
    act(() => {
      render(
        <I18nProvider contentLanguage={undefined}>
          <Translation>{t => <p>{t('dashboard:localInformation')}</p>}</Translation>
          <Translation>{(t, { i18n }) => <p>{i18n.languages[0]}</p>}</Translation>
        </I18nProvider>
      )
    })
    await waitFor(() => screen.getByText('Lokale Informationen'))
    await waitFor(() => screen.debug())
    expect(screen.getByText('Lokale Informationen')).toBeTruthy()
    expect(screen.getByText('de')).toBeTruthy()
    expect(screen.queryByText('de-DE')).toBeFalsy()
  })
  // We can not switch the language right now because it is bound to redux-first-router, we would need to trigger a
  // state update through the router which is very difficult.
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should remember the language over sessions', async () => undefined)
})
