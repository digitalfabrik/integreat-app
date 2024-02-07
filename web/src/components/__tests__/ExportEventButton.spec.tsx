import { fireEvent } from '@testing-library/react'
import React from 'react'

import { EventModelBuilder } from 'shared/api'

import { renderWithTheme } from '../../testing/render'
import ExportEventButton from '../ExportEventButton'

jest.mock('react-i18next')

describe('ExportEventButton', () => {
  it('renders correctly for a single event', () => {
    const event = new EventModelBuilder('seed', 1, 'augsburg', 'de').build()[0]!
    const { queryAllByRole, getByText } = renderWithTheme(<ExportEventButton event={event} />)
    expect(queryAllByRole('button')).toHaveLength(1)
    expect(getByText('events:exportAsICal')).toBeDefined()
  })

  it('renders correctly for a recurring event', () => {
    const event = new EventModelBuilder('seed', 1, 'augsburg', 'de', true).build()[0]!
    const { getByText, queryAllByRole, queryByText } = renderWithTheme(<ExportEventButton event={event} />)
    expect(queryAllByRole('button')).toHaveLength(1)

    const exportButton = getByText('events:exportAsICal')
    fireEvent.click(exportButton)
    expect(queryAllByRole('button')).toHaveLength(2)
    expect(queryAllByRole('radio')).toHaveLength(2)
    const cancelButton = getByText('events:layout:cancel')
    expect(cancelButton).toBeDefined()

    fireEvent.click(cancelButton)
    expect(queryAllByRole('radio')).toHaveLength(0)
    expect(queryByText('events:layout:cancel')).toBeNull()
  })
})
