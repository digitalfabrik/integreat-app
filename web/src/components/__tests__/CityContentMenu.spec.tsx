import { fireEvent } from '@testing-library/dom'
import { mocked } from 'jest-mock'
import React from 'react'

import { CategoriesMapModelBuilder } from 'shared/api'

import { mockDimensions } from '../../__mocks__/useDimensions'
import useDimensions from '../../hooks/useDimensions'
import { renderAllRoutes } from '../../testing/render'
import CityContentMenu from '../CityContentMenu'
import { TtsContext } from '../TtsContainer'

jest.mock('react-i18next')
jest.mock('../../hooks/useDimensions')

describe('CityContentMenu', () => {
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

  it('should show all menu items for categories route', () => {
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: true }))
    const { getByText, getByLabelText } = renderAllRoutes('/augsburg/de', {
      CityContentElement: (
        <TtsContext.Provider value={defaultTtsContext}>
          <CityContentMenu category={category} pageTitle='Test Page' />,
        </TtsContext.Provider>
      ),
    })

    fireEvent.click(getByLabelText('layout:sideBarOpenAriaLabel'))

    expect(getByText('categories:createPdf').closest('a')).toHaveAttribute(
      'href',
      'https://cms-test.integreat-app.de/augsburg/de/wp-json/ig-mpdf/v1/pdf?url=%2Faugsburg%2Fde%2Fcategory_0%2Fcategory_1',
    )
    expect(getByText('layout:feedback')).toBeTruthy()
    expect(getByText('layout:readAloud')).toBeTruthy()
    expect(getByText('layout:contrastTheme')).toBeTruthy()

    fireEvent.click(getByText('layout:readAloud'))

    expect(showTtsPlayer).toHaveBeenCalledTimes(1)
  })

  it('should hide pdf for other routes', () => {
    const { queryByText, getByText, getByLabelText } = renderAllRoutes('/augsburg/de/events', {
      CityContentElement: (
        <TtsContext.Provider value={defaultTtsContext}>
          <CityContentMenu pageTitle='Test Page' />,
        </TtsContext.Provider>
      ),
    })

    fireEvent.click(getByLabelText('layout:sideBarOpenAriaLabel'))

    expect(queryByText('categories:createPdf')).toBeFalsy()
    expect(getByText('layout:feedback')).toBeTruthy()
    expect(getByText('layout:readAloud')).toBeTruthy()
    expect(getByText('layout:contrastTheme')).toBeTruthy()
  })

  it('should hide feedback for news routes', () => {
    const { queryByText, getByText, getByLabelText } = renderAllRoutes('/augsburg/de/news/local', {
      CityContentElement: (
        <TtsContext.Provider value={defaultTtsContext}>
          <CityContentMenu pageTitle='Test Page' />,
        </TtsContext.Provider>
      ),
    })

    fireEvent.click(getByLabelText('layout:sideBarOpenAriaLabel'))

    expect(queryByText('categories:createPdf')).toBeFalsy()
    expect(queryByText('layout:feedback')).toBeFalsy()
    expect(getByText('layout:readAloud')).toBeTruthy()
    expect(getByText('layout:contrastTheme')).toBeTruthy()
  })

  it('tts toolbar item should be disabled if there is nothing to read', () => {
    const { getByText, getByLabelText } = renderAllRoutes('/augsburg/de', {
      CityContentElement: (
        <TtsContext.Provider value={{ ...defaultTtsContext, canRead: false }}>
          <CityContentMenu pageTitle='Test Page' />,
        </TtsContext.Provider>
      ),
    })

    fireEvent.click(getByLabelText('layout:sideBarOpenAriaLabel'))

    expect(getByText('layout:readAloud').parentElement?.parentElement).toHaveClass('Mui-disabled')
  })

  it('should hide feedback on desktop', () => {
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, desktop: true, mobile: false }))
    const { queryByText, getByText, getByLabelText } = renderAllRoutes('/augsburg/de/events', {
      CityContentElement: (
        <TtsContext.Provider value={defaultTtsContext}>
          <CityContentMenu pageTitle='Test Page' />,
        </TtsContext.Provider>
      ),
    })

    fireEvent.click(getByLabelText('layout:sideBarOpenAriaLabel'))

    expect(queryByText('layout:feedback')).toBeFalsy()
    expect(getByText('layout:readAloud')).toBeTruthy()
    expect(getByText('layout:contrastTheme')).toBeTruthy()
  })
})
