import { fireEvent } from '@testing-library/dom'
import React from 'react'

import { CategoriesMapModelBuilder } from 'shared/api'

import { mockDimensions } from '../../__mocks__/useDimensions'
import { TtsContext } from '../../contexts/TtsContext'
import useDimensions from '../../hooks/useDimensions'
import { renderAllRoutes } from '../../testing/render'
import RegionContentMenu from '../RegionContentMenu'

jest.mock('../../hooks/useDimensions')

describe('RegionContentMenu', () => {
  const { mocked } = jest
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
      RegionContentElement: (
        <TtsContext.Provider value={defaultTtsContext}>
          <RegionContentMenu category={category} pageTitle='Test Page' />,
        </TtsContext.Provider>
      ),
    })

    fireEvent.click(getByLabelText('common:labels.menu'))

    expect(getByText('categories:pdf.create').closest('a')).toHaveAttribute(
      'href',
      'https://cms-test.integreat-app.de/augsburg/de/wp-json/ig-mpdf/v1/pdf?url=%2Faugsburg%2Fde%2Fcategory_0%2Fcategory_1',
    )
    expect(getByText('feedback:title')).toBeTruthy()
    expect(getByText('tts:title')).toBeTruthy()
    expect(getByText('settings:contrast.title')).toBeTruthy()

    fireEvent.click(getByText('tts:title'))

    expect(showTtsPlayer).toHaveBeenCalledTimes(1)
  })

  it('should hide pdf for other routes', () => {
    const { queryByText, getByText, getByLabelText } = renderAllRoutes('/augsburg/de/events', {
      RegionContentElement: (
        <TtsContext.Provider value={defaultTtsContext}>
          <RegionContentMenu pageTitle='Test Page' />,
        </TtsContext.Provider>
      ),
    })

    fireEvent.click(getByLabelText('common:labels.menu'))

    expect(queryByText('pdf:create')).toBeFalsy()
    expect(getByText('feedback:title')).toBeTruthy()
    expect(getByText('tts:title')).toBeTruthy()
    expect(getByText('settings:contrast.title')).toBeTruthy()
  })

  it('should hide feedback for news routes', () => {
    const { queryByText, getByText, getByLabelText } = renderAllRoutes('/augsburg/de/news/local', {
      RegionContentElement: (
        <TtsContext.Provider value={defaultTtsContext}>
          <RegionContentMenu pageTitle='Test Page' />,
        </TtsContext.Provider>
      ),
    })

    fireEvent.click(getByLabelText('common:labels.menu'))

    expect(queryByText('pdf:create')).toBeFalsy()
    expect(queryByText('feedback:title')).toBeFalsy()
    expect(getByText('tts:title')).toBeTruthy()
    expect(getByText('settings:contrast.title')).toBeTruthy()
  })

  it('tts toolbar item should be disabled if there is nothing to read', () => {
    const { getByText, getByLabelText } = renderAllRoutes('/augsburg/de', {
      RegionContentElement: (
        <TtsContext.Provider value={{ ...defaultTtsContext, canRead: false }}>
          <RegionContentMenu pageTitle='Test Page' />,
        </TtsContext.Provider>
      ),
    })

    fireEvent.click(getByLabelText('common:labels.menu'))

    expect(getByText('tts:title').closest('li')).toHaveClass('Mui-disabled')
  })

  it('should hide feedback on desktop', () => {
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, desktop: true, mobile: false }))
    const { queryByText, getByText, getByLabelText } = renderAllRoutes('/augsburg/de/events', {
      RegionContentElement: (
        <TtsContext.Provider value={defaultTtsContext}>
          <RegionContentMenu pageTitle='Test Page' />,
        </TtsContext.Provider>
      ),
    })

    fireEvent.click(getByLabelText('common:labels.menu'))

    expect(queryByText('feedback:title')).toBeFalsy()
    expect(getByText('tts:title')).toBeTruthy()
    expect(getByText('settings:contrast.title')).toBeTruthy()
  })
})
