import { fireEvent } from '@testing-library/react'
import React, { ReactElement } from 'react'

import { renderWithRouterAndTheme } from '../../testing/render'
import Layout, { LAYOUT_ELEMENT_ID } from '../Layout'
import Modal from '../Modal'

jest.mock('react-i18next')
jest.mock('focus-trap-react', () => ({ children }: { children: ReactElement }) => <div>{children}</div>)

describe('Modal', () => {
  beforeEach(jest.clearAllMocks)

  const title = 'my-title'
  const content = 'my-content'
  const closeModal = jest.fn()

  const renderModal = (wrapInPortal?: boolean) =>
    renderWithRouterAndTheme(
      <Layout>
        <Modal title={title} closeModal={closeModal} direction='ltr' wrapInPortal={wrapInPortal}>
          {content}
        </Modal>
      </Layout>
    )

  it('should set and unset aria-hidden for background', () => {
    const { getAllByLabelText, getByText, container, unmount } = renderModal()

    expect(getByText(title)).toBeTruthy()
    expect(getByText(content)).toBeTruthy()
    expect(container.querySelector(`[id="${LAYOUT_ELEMENT_ID}"]`)?.getAttribute('aria-hidden')).toBe('true')

    fireEvent.click(getAllByLabelText('common:close')[0]!)

    expect(closeModal).toHaveBeenCalledTimes(1)
    const spy = jest.spyOn(container.querySelector(`[id="${LAYOUT_ELEMENT_ID}"]`)!, 'setAttribute')
    unmount()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('aria-hidden', 'false')
  })
})
