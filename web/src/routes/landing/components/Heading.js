// @flow

import React, { useCallback, useState } from 'react'
import styled, { type StyledComponent } from 'styled-components'
import buildConfig from '../../../modules/app/constants/buildConfig'
import type { ThemeType } from 'build-configs/ThemeType'

const Logo: StyledComponent<{||}, ThemeType, *> = styled.img`
  display: block;
  height: 70px;
  margin: 0 auto;
`

const Heading = () => {
  const [counter, setCounter] = useState(0)

  const increment = useCallback(() => {
    setCounter(counter + 1)

    const CRASH_COUNTER_MAX = 13
    if (counter === CRASH_COUNTER_MAX) {
      throw new Error('This error was thrown for testing purposes.')
    }
  }, [counter])

  return <Logo src={buildConfig().icons.locationMarker} alt='' onClick={increment} />
}

export default Heading
