// @flow

import * as React from 'react'
import styled, { keyframes, type StyledComponent } from 'styled-components'
import type { ThemeType } from 'build-configs/ThemeType'

/** From https://github.com/ConnorAtherton/loaders.css/blob/master/loaders.css */
const lineScaleParty = keyframes`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.5);
  }

  100% {
    transform: scale(1);
  }
`

const Spinner: StyledComponent<{||}, ThemeType, *> = styled.div`
  margin-top: 50px;
  text-align: center;
  animation-name: ${lineScaleParty};

  > div:nth-child(1) {
    animation-delay: 0.48s;
    animation-duration: 0.54s;
  }

  > div:nth-child(2) {
    animation-delay: -0.15s;
    animation-duration: 1.15s;
  }

  > div:nth-child(3) {
    animation-delay: -0.04s;
    animation-duration: 0.77s;
  }

  > div:nth-child(4) {
    animation-delay: -0.12s;
    animation-duration: 0.61s;
  }

  > div {
    background-color: ${props => props.theme.colors.textSecondaryColor};
    width: 4px;
    height: 35px;
    border-radius: 2px;
    margin: 2px;
    animation-fill-mode: both;
    display: inline-block;
    animation-name: ${lineScaleParty};
    animation-iteration-count: infinite;
  }
`

const LoadingSpinner = () => <Spinner>
  <div />
  <div />
  <div />
  <div />
</Spinner>

export default LoadingSpinner
