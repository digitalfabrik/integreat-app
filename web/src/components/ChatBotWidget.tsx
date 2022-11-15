import React, { ReactElement, useEffect } from 'react'
import styled, { useTheme } from 'styled-components'

import dimensions from '../constants/dimensions'

// 33px = 17px for the width of the average scrollbar + 16px actual padding
const ChatContainer = styled.div`
  > div {
    @media ${dimensions.mediumLargeViewport} {
      right: calc(100% - 100vw + 33px);
    }
  }
`

const ChatBotWidget = (): ReactElement => {
  const theme = useTheme()

  useEffect(() => {
    const script = document.createElement('script')

    script.src = `/rasa-widget/chatbot.js`
    script.defer = true

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)

      // Rasa replaces the original element with this one
      const button = document.getElementById('rasa-chat-widget-container')
      if (button) {
        document.body.removeChild(button)
      }
    }
  }, [])

  return (
    <>
      <ChatContainer id='rasa-container' />
      <div
        id='rasa-chat-widget'
        data-root-element-id='rasa-container'
        data-primary={theme.colors.themeColor}
        data-primary-highlight={theme.colors.themeColor}
        data-websocket-url='https://integreat-demo.translatorswithoutborders.org/'
      />
    </>
  )
}

export default ChatBotWidget
