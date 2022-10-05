import React, { ReactElement, useEffect } from 'react'
import styled, { useTheme } from 'styled-components'

const ChatContainer = styled.div`
  > div {
    right: calc(100% - 100vw + 33px);
  }
`

const ChatBotWidget = (): ReactElement => {
  const theme = useTheme()

  useEffect(() => {
    const script = document.createElement('script')

    script.src = 'https://unpkg.com/@rasahq/rasa-chat'
    script.defer = true

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
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
