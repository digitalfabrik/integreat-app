import { fireEvent } from '@testing-library/react'
import React from 'react'

import { getChatName, PLACES_ROUTE } from 'shared'

import buildConfig from '../../constants/buildConfig'
import { TtsContext } from '../../contexts/TtsContext'
import { mockDimensions } from '../../hooks/__mocks__/useDimensions'
import useDimensions from '../../hooks/useDimensions'
import useRegionContentParams from '../../hooks/useRegionContentParams'
import { renderRoute } from '../../testing/render'
import { log } from '../../utils/sentry'
import ToolsFab from '../ToolsFab'

jest.mock('../../hooks/useDimensions')
jest.mock('../../hooks/useRegionContentParams')
jest.mock('../../utils/sentry', () => ({ log: jest.fn() }))

const { mocked } = jest
const chatName = getChatName(buildConfig().appName)
const digitalAssistantLabel = 'common:labels.assistant.title'

const renderToolsFab = (
  props: { chatEnabled: boolean; bescheidCheckEnabled: boolean; unreadMessageCount?: number },
  { ttsPlayerVisible = false }: { ttsPlayerVisible?: boolean } = {},
) =>
  renderRoute(
    <TtsContext.Provider
      value={{
        canRead: false,
        visible: ttsPlayerVisible,
        showTtsPlayer: () => undefined,
        sentences: [],
        setSentences: () => undefined,
      }}>
      <ToolsFab unreadMessageCount={0} {...props} />
    </TtsContext.Provider>,
    { pathname: '/', routePattern: '/' },
  )

describe('ToolsFab', () => {
  beforeEach(() => {
    mocked(useDimensions).mockReturnValue({ ...mockDimensions, xsmall: false, desktop: true })
    mocked(useRegionContentParams).mockReturnValue({ regionCode: 'augsburg', languageCode: 'de', route: 'categories' })
  })

  afterEach(jest.clearAllMocks)

  it('should render nothing when chat and Bescheid-Check are both disabled', () => {
    const { container } = renderToolsFab({ chatEnabled: false, bescheidCheckEnabled: false })
    expect(container).toBeEmptyDOMElement()
  })

  it('should render nothing on the places route', () => {
    mocked(useRegionContentParams).mockReturnValue({ regionCode: 'augsburg', languageCode: 'de', route: PLACES_ROUTE })
    const { container } = renderToolsFab({ chatEnabled: true, bescheidCheckEnabled: false })
    expect(container).toBeEmptyDOMElement()
  })

  it('should render nothing when the tts player is visible on a small screen', () => {
    mocked(useDimensions).mockReturnValue({ ...mockDimensions, xsmall: true })
    const { container } = renderToolsFab({ chatEnabled: true, bescheidCheckEnabled: false }, { ttsPlayerVisible: true })
    expect(container).toBeEmptyDOMElement()
  })

  it('should open chat directly when only chat is enabled', () => {
    const { getByLabelText, router } = renderToolsFab({ chatEnabled: true, bescheidCheckEnabled: false })

    fireEvent.click(getByLabelText(chatName))

    expect(router.state.location.search).toBe('?chat=true')
  })

  it('should show the tool choice dialog instead of opening chat directly when Bescheid-Check is also enabled', () => {
    const { getByText, queryByRole, getByRole, router } = renderToolsFab({
      chatEnabled: true,
      bescheidCheckEnabled: true,
    })

    expect(queryByRole('heading')).toBeNull()

    fireEvent.click(getByText(digitalAssistantLabel))

    expect(getByRole('heading')).toBeTruthy()
    expect(router.state.location.search).toBeFalsy()
  })

  it('should show the unread message count as a badge', () => {
    const { getByText } = renderToolsFab({ chatEnabled: true, bescheidCheckEnabled: false, unreadMessageCount: 3 })
    expect(getByText('3')).toBeTruthy()
  })

  it('should not show a badge when there are no unread messages', () => {
    const { queryByText } = renderToolsFab({ chatEnabled: true, bescheidCheckEnabled: false, unreadMessageCount: 0 })
    expect(queryByText('0')).toBeNull()
  })

  it('should render nothing and log an error when Bescheid-Check is enabled without chat', () => {
    const { container } = renderToolsFab({ chatEnabled: false, bescheidCheckEnabled: true })
    expect(container).toBeEmptyDOMElement()
    expect(log).toHaveBeenCalledWith(expect.stringContaining('bescheid-check'), 'error')
  })
})
