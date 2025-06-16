import styled from '@emotion/styled'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import React, { ReactElement, useState } from 'react'

import Icon from './base/Icon'

const StyledIcon = styled(Icon)`
  color: ${props => props.theme.colors.themeColor};
  display: block;
  height: 64px;
  width: 96px;
  margin: 0 auto;
`

const CrashTestingIcon = (): ReactElement => {
  const [counter, setCounter] = useState(0)

  const increment = () => {
    setCounter(counter + 1)

    const CRASH_COUNTER_MAX = 13
    if (counter === CRASH_COUNTER_MAX) {
      throw new Error('This error was thrown for testing purposes.')
    }
  }

  return (
    // Disable a11y linting since it is a hidden dev tool
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div onClick={increment}>
      <StyledIcon src={LocationOnIcon} />
    </div>
  )
}

export default CrashTestingIcon
