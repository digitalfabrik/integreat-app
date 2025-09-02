import Button from '@mui/material/Button'
import { fireEvent } from '@testing-library/react'
import React from 'react'

import { renderWithTheme } from '../../testing/render'
import Dropdown from '../Dropdown'

jest.mock('react-inlinesvg')
jest.mock('react-i18next')

describe('Dropdown', () => {
  const setOpen = jest.fn()
  const InnerComponent = () => <span>Do you see me?</span>
  const render = ({ open }: { open: boolean }) =>
    renderWithTheme(
      <>
        <span>Outside</span>
        <Dropdown ToggleButton={<Button>Open</Button>} setOpen={setOpen} open={open}>
          <InnerComponent />
        </Dropdown>
        ,
      </>,
    )

  beforeEach(jest.clearAllMocks)

  it('should render toggle button if closed', () => {
    const { getByText } = render({ open: false })
    expect(getByText('Open')).toBeTruthy()
    expect(getByText('Do you see me?')).not.toBeVisible()
  })

  it('should render toggle button and children if open', () => {
    const { getByText } = render({ open: true })
    expect(getByText('Open')).toBeTruthy()
    expect(getByText('Do you see me?')).toBeVisible()
  })

  it('should close if clicked outside', async () => {
    const { getByText } = render({ open: true })
    fireEvent.mouseDown(getByText('Outside'))

    expect(setOpen).toHaveBeenCalledTimes(1)
    expect(setOpen).toHaveBeenCalledWith(false)
  })

  it('should close if pressing escape', async () => {
    const { getByText } = render({ open: true })
    fireEvent.keyDown(getByText('Outside'), { key: 'Escape' })
    expect(setOpen).toHaveBeenCalledTimes(1)
    expect(setOpen).toHaveBeenCalledWith(false)
  })
  //
  it('should close if pressing enter', async () => {
    const { getByText } = render({ open: true })
    fireEvent.keyDown(getByText('Outside'), { key: 'Enter' })
    expect(setOpen).toHaveBeenCalledTimes(1)
    expect(setOpen).toHaveBeenCalledWith(false)
  })
})
