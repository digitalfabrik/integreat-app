import { fireEvent, waitFor } from '@testing-library/react'
import React from 'react'

import { renderWithTheme } from '../../../testing/render'
import Accordion from '../Accordion'

jest.mock('react-i18next')

describe('Accordion', () => {
  const content = 'Some Content'
  const title = 'TestTitle'

  it('shows content by default', () => {
    const { getByText } = renderWithTheme(
      <Accordion id='test' title={title}>
        {content}
      </Accordion>,
    )
    expect(getByText(content)).toBeTruthy()
  })

  it('hides content by clicking on the header', async () => {
    const { getByText } = renderWithTheme(
      <Accordion id='test' title={title}>
        {content}
      </Accordion>,
    )
    expect(getByText(content)).toBeVisible()
    fireEvent.click(getByText(title))
    await waitFor(() => expect(getByText(content)).not.toBeVisible())
  })

  it('shows content by clicking on the header if default collapsed is set to true', async () => {
    const { getByText } = renderWithTheme(
      <Accordion id='test' title={title} defaultCollapsed>
        {content}
      </Accordion>,
    )
    expect(getByText(content)).not.toBeVisible()
    fireEvent.click(getByText(title))
    await waitFor(() => expect(getByText(content)).toBeVisible())
  })
})
