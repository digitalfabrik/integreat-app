// @flow

import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { render, act, screen, waitFor } from '@testing-library/react'
import I18nProvider from '../I18nProvider'
import createLocation from '../../../../createLocation'
import { LOCAL_NEWS_DETAILS_ROUTE } from '../../../app/route-configs/LocalNewsDetailsRouteConfig'
import { Translation } from 'react-i18next'
import Helmet from 'react-helmet'
import BrowserLanguageDetector from '../../BrowserLanguageDetector'

const mockStore = configureMockStore()
jest.mock('../../BrowserLanguageDetector')
jest.mock('translations/src/loadTranslations')

const prepareStore = (contentLanguage?: string) => {
  const payload = contentLanguage
    ? {
        city: 'augsburg',
        language: contentLanguage,
        id: 1
      }
    : {}

  const location = createLocation({
    payload: payload,
    pathname: '/',
    type: LOCAL_NEWS_DETAILS_ROUTE
  })

  return mockStore({
    location: location
  })
}

describe('I18nProvider', () => {
  it('should choose the browser language', async () => {
    BrowserLanguageDetector.detect.mockReturnValue(['ar'])
    const store = prepareStore()
    act(() => {
      render(
        <Provider store={store}>
          <I18nProvider>
            <Translation>{(t, { i18n }) => <p>{i18n.languages[0]}</p>}</Translation>
          </I18nProvider>
        </Provider>
      )
    })
    await waitFor(() => screen.getByText('ar'))

    expect(screen.getByText('ar')).toBeTruthy()
  })

  it('should use fallbacks for ui translations', async () => {
    BrowserLanguageDetector.detect.mockReturnValue(['ckb'])
    const store = prepareStore()
    act(() => {
      render(
        <Provider store={store}>
          <I18nProvider>
            <Translation>{(t, { i18n }) => <p>{t('dashboard:localInformation')}</p>}</Translation>
          </I18nProvider>
        </Provider>
      )
    })
    await waitFor(() => screen.debug())
    await waitFor(() => screen.getByText('Zanyariyên xwecihî'))

    expect(screen.getByText('Zanyariyên xwecihî')).toBeTruthy()
  })

  it('should choose the default fallback for ui translations', async () => {
    BrowserLanguageDetector.detect.mockReturnValue(['en'])
    const store = prepareStore()
    act(() => {
      render(
        <Provider store={store}>
          <I18nProvider>
            <Translation>{(t, { i18n }) => <p>{t('dashboard:localInformation')}</p>}</Translation>
          </I18nProvider>
        </Provider>
      )
    })
    await waitFor(() => screen.getByText('Lokale Informationen'))

    expect(screen.getByText('Lokale Informationen')).toBeTruthy()
  })

  it('should set ui language to content language', async () => {
    const store = prepareStore('ar')

    act(() => {
      render(
        <Provider store={store}>
          <I18nProvider>
            <Translation>{(t, { i18n }) => <p>{i18n.languages[0]}</p>}</Translation>
          </I18nProvider>
        </Provider>
      )
    })

    await waitFor(() => screen.getByText('ar'))

    expect(screen.getByText('ar')).toBeTruthy()
  })

  it('should choose rtl with ar as language', async () => {
    const store = prepareStore('ar')
    act(() => {
      render(
        <Provider store={store}>
          <I18nProvider>Hello</I18nProvider>
        </Provider>
      )
    })

    await waitFor(() => screen.getByTestId('direction'))

    expect(screen.getByTestId('direction')).toHaveAttribute('dir', 'rtl')
  })

  it('should choose ltr with en as language', async () => {
    const store = prepareStore('en')

    act(() => {
      render(
        <Provider store={store}>
          <I18nProvider>Hello</I18nProvider>
        </Provider>
      )
    })

    await waitFor(() => screen.getByTestId('direction'))

    expect(screen.getByTestId('direction')).toHaveAttribute('dir', 'ltr')
  })

  it('should set document language', async () => {
    const store = prepareStore('ar')
    act(() => {
      render(
        <Provider store={store}>
          <I18nProvider>Hello</I18nProvider>
        </Provider>
      )
    })

    await waitFor(() => screen.getByTestId('direction'))

    expect(document.documentElement?.lang).toBe('ar')
  })

  it('should use additional font for arabic', async () => {
    const store = prepareStore('ar')
    act(() => {
      render(
        <Provider store={store}>
          <I18nProvider>Hello</I18nProvider>
        </Provider>
      )
    })

    await waitFor(() => screen.getByTestId('direction'))

    // Checking for side-effect
    const helmet = Helmet.peek()
    expect(helmet.linkTags.map(link => link.href)).toContain('/fonts/lateef/lateef.css')
  })

  it('should use no additional font for english', async () => {
    const store = prepareStore('en')
    act(() => {
      render(
        <Provider store={store}>
          <I18nProvider>Hello</I18nProvider>
        </Provider>
      )
    })

    await waitFor(() => screen.getByTestId('direction'))

    // Checking for side-effect
    const helmet = Helmet.peek()
    expect(helmet.linkTags.map(link => link.href)).not.toContain('/fonts/lateef/lateef.css')
  })

  it('should dispatch action for setting ui direction', async () => {
    const store = prepareStore('en')
    act(() => {
      render(
        <Provider store={store}>
          <I18nProvider>Hello</I18nProvider>
        </Provider>
      )
    })

    expect(store.getActions()).toEqual([{ payload: 'ltr', type: 'SET_UI_DIRECTION' }])
  })

  it('should use zh-CN if any chinese variant is chosen', async () => {
    BrowserLanguageDetector.detect.mockReturnValue(['zh-CN'])
    const store = prepareStore()
    act(() => {
      render(
        <Provider store={store}>
          <I18nProvider>
            <Translation>{(t, { i18n }) => <p>{t('dashboard:localInformation')}</p>}</Translation>
          </I18nProvider>
        </Provider>
      )
    })
    await waitFor(() => screen.getByText('本地信息'))

    expect(screen.getByText('本地信息')).toBeTruthy()
  })

  it('should support language tags with dashes', async () => {
    BrowserLanguageDetector.detect.mockReturnValue(['zh-hans'])
    const store = prepareStore()
    act(() => {
      render(
        <Provider store={store}>
          <I18nProvider>
            <Translation>{(t, { i18n }) => <p>{t('dashboard:localInformation')}</p>}</Translation>
          </I18nProvider>
        </Provider>
      )
    })
    await waitFor(() => screen.getByText('本地信息'))

    expect(screen.getByText('本地信息')).toBeTruthy()
  })

  it('should support de-DE and select de', async () => {
    BrowserLanguageDetector.detect.mockReturnValue(['de-DE'])
    const store = prepareStore()
    act(() => {
      render(
        <Provider store={store}>
          <I18nProvider>
            <Translation>{(t, { i18n }) => <p>{t('dashboard:localInformation')}</p>}</Translation>
            <Translation>{(t, { i18n }) => <p>{i18n.languages[0]}</p>}</Translation>
          </I18nProvider>
        </Provider>
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
  it.skip('should remember the language over sessions', async () => {})
})
