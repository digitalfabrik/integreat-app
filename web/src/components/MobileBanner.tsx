import { DateTime } from 'luxon'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import buildConfig from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import Button from './base/Button'
import Icon from './base/Icon'
import Link from './base/Link'

const StyledBanner = styled.div<{ $isInstalled: boolean }>`
  display: none;
  justify-content: space-between;
  background-color: ${props => props.theme.colors.themeColor};
  padding: 15px;
  align-items: center;
  transition: all 2s ease-out;

  height: ${props => (props.$isInstalled ? '90px' : 'fit-content')};

  @media ${dimensions.smallViewport} {
    display: flex;
  }
`
const StyledDiv = styled.div`
  display: flex;
  gap: 10px;
`
const StyledDivText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const StyledAppName = styled.span`
  font-weight: bold;
  font-size: 14px;
`
const StyledDescription = styled.span`
  color: #848489;
  font-size: 12px;
`
const StyledButton = styled(Link)`
  background-color: ${props => props.theme.colors.textColor};
  color: ${props => props.theme.colors.themeColor};
  border-radius: 40px;
  padding: 6px 12px;
  height: fit-content;
  margin: 0;
  font-size: 15px;
  font-weight: bold;
`

export const MobileBanner = () => {
  const [isAndroid, setIsAndroid] = useState<boolean>(false)
  const [isHidden, setIsHidden] = useState<boolean>(true)
  const [isInstalled, setIsInstalled] = useState<boolean>(false)
  const { icons, appName, apps, hostName } = buildConfig()

  const checkIfAppIsInstalled = (applicationId: string) => {
    const deepLink = `integreat://`
    const appStoreUrl = `https://play.google.com/store/apps/details?id=${applicationId}`

    return new Promise(resolve => {
      const startTime = Date.now()
      const timeoutDuration = 2000
      window.location.href = deepLink

      const interval = setInterval(() => {
        if (Date.now() - startTime > timeoutDuration) {
          clearInterval(interval)

          //   window.location.href = appStoreUrl
          resolve(false)
        } else {
          resolve(true)
        }
      }, 100)
    })
  }

  const toggleBanner = () => {
    const expirationDate = DateTime.now().plus({ months: 3 })
    localStorage.setItem('showBanner', expirationDate.toISO())
    setIsHidden(false)
  }

  useEffect(() => {
    if (!checkIfAppIsInstalled(apps?.android.applicationId)) {
      console.log('installed')
    }
    const ua = navigator.userAgent
    if (/android/i.test(ua)) {
      setIsAndroid(true)
    } else {
      setIsAndroid(false)
    }
    if (localStorage.getItem('showBanner')) {
      if (DateTime.fromISO(localStorage.getItem('showBanner')) > DateTime.local()) {
        setIsHidden(false)
      }
    }
  }, [])

  return (
    isAndroid &&
    isHidden && (
      <StyledBanner $isInstalled={isInstalled}>
        <StyledDiv>
          {/* <Icon src={icons.appLogoMobile} /> */}
          <div style={{ width: 34, height: 34, backgroundColor: 'white', borderRadius: 5 }} />
          <StyledDivText>
            <StyledAppName>{appName}</StyledAppName>
            <StyledDescription>Ouvrir dans l'app Integreat</StyledDescription>
          </StyledDivText>
        </StyledDiv>
        <StyledButton to={`https://play.google.com/store/apps/details?id=${apps?.android.applicationId}`}>
          OUVRIR
        </StyledButton>
      </StyledBanner>
    )
  )
}
