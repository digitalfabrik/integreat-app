import { fireEvent } from '@testing-library/dom'
import React from 'react'

import { CategoriesMapModelBuilder } from 'shared/api'

import { renderAllRoutes } from '../../testing/render'
import CityContentToolbar from '../CityContentToolbar'
import { TtsContext } from '../TtsContainer'

jest.mock('react-i18next')

describe('CityContentToolbar', () => {
  const category = new CategoriesMapModelBuilder('augsburg', 'de').build().toArray()[3]!
  const showTtsPlayer = jest.fn()
  const defaultTtsContext = {
    setSentences: () => undefined,
    enabled: true,
    sentences: [],
    showTtsPlayer,
    visible: false,
    canRead: true,
  }

  beforeEach(jest.clearAllMocks)

  it('should show all toolbar items for categories route', () => {
    const { getByText } = renderAllRoutes('/augsburg/de', {
      CityContentElement: (
        <TtsContext.Provider value={defaultTtsContext}>
          <CityContentToolbar pageTitle='Test Page' category={category} />,
        </TtsContext.Provider>
      ),
    })
    expect(getByText('categories:createPdf').closest('a')).toHaveAttribute(
      'href',
      'https://cms-test.integreat-app.de/augsburg/de/wp-json/ig-mpdf/v1/pdf?url=%2Faugsburg%2Fde%2Fcategory_0%2Fcategory_1',
    )
    expect(getByText('feedback:useful')).toBeTruthy()
    expect(getByText('feedback:notUseful')).toBeTruthy()
    expect(getByText('socialMedia:layout:share')).toBeTruthy()
    expect(getByText('layout:readAloud')).toBeTruthy()
    expect(getByText('layout:contrastTheme')).toBeTruthy()

    fireEvent.click(getByText('layout:readAloud'))

    expect(showTtsPlayer).toHaveBeenCalledTimes(1)
  })

  it('should hide pdf for other routes', () => {
    const { queryByText, getByText } = renderAllRoutes('/augsburg/de/events', {
      CityContentElement: (
        <TtsContext.Provider value={defaultTtsContext}>
          <CityContentToolbar pageTitle='Test Page' />,
        </TtsContext.Provider>
      ),
    })
    expect(queryByText('categories:createPdf')).toBeFalsy()
    expect(getByText('feedback:useful')).toBeTruthy()
    expect(getByText('feedback:notUseful')).toBeTruthy()
    expect(getByText('socialMedia:layout:share')).toBeTruthy()
    expect(getByText('layout:readAloud')).toBeTruthy()
    expect(getByText('layout:contrastTheme')).toBeTruthy()
  })

  it('should hide feedback for news routes', () => {
    const { queryByText, getByText } = renderAllRoutes('/augsburg/de/news/local', {
      CityContentElement: (
        <TtsContext.Provider value={defaultTtsContext}>
          <CityContentToolbar pageTitle='Test Page' />,
        </TtsContext.Provider>
      ),
    })
    expect(queryByText('categories:createPdf')).toBeFalsy()
    expect(queryByText('feedback:useful')).toBeFalsy()
    expect(queryByText('feedback:notUseful')).toBeFalsy()
    expect(getByText('socialMedia:layout:share')).toBeTruthy()
    expect(getByText('layout:readAloud')).toBeTruthy()
    expect(getByText('layout:contrastTheme')).toBeTruthy()
  })

  it('tts toolbar item should be disabled if there is nothing to read', () => {
    const { getByText } = renderAllRoutes('/augsburg/de', {
      CityContentElement: (
        <TtsContext.Provider value={{ ...defaultTtsContext, canRead: false }}>
          <CityContentToolbar pageTitle='Test Page' />,
        </TtsContext.Provider>
      ),
    })

    expect(getByText('layout:readAloud').parentElement?.parentElement).toHaveClass('Mui-disabled')
  })
})
