import { DateTime } from 'luxon'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { CloseIcon } from '../assets'
import buildConfig from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import Button from './base/Button'
import Icon from './base/Icon'

const StyledBanner = styled.div<{ $isInstalled: boolean }>`
  display: none;
  justify-content: space-between;
  background-color: ${props => props.theme.colors.themeColor};
  padding: 15px;
  align-items: center;
  transition: all 2s ease-out;

  height: ${props => (!props.$isInstalled ? '80px' : 'fit-content')};

  @media ${dimensions.smallViewport} {
    display: flex;
  }
`
const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`
const StyledCloseButton = styled(Button)`
  display: flex;
  gap: 10px;
`
const StyledIcon = styled(Icon)<{ $isInstalled: boolean }>`
  width: ${props => (!props.$isInstalled ? '64px' : '34px')};
  height: ${props => (!props.$isInstalled ? '64px' : '34px')};
  background-color: 'white';
  border-radius: 5;
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
  color: ${props => props.theme.colors.textSecondaryColor};
  font-size: 12px;
`
const StyledButton = styled.button<{ $isInstalled: boolean }>`
  background-color: ${props => (!props.$isInstalled ? 'transparent' : props.theme.colors.textColor)};
  color: ${props => (!props.$isInstalled ? props.theme.colors.textColor : props.theme.colors.themeColor)};
  border: ${props => !props.$isInstalled && 'none'};
  border-radius: 40px;
  padding: 6px 12px;
  height: fit-content;
  margin: 0;
  font-size: 15px;
  font-weight: bold;
`

export const MobileBanner = () => {
  const [isHidden, setIsHidden] = useState<boolean>(true)
  const [isInstalled, setIsInstalled] = useState<boolean>(false)
  const { icons, appName, apps, hostName } = buildConfig()
  const appStoreUrl = `https://play.google.com/store/apps/details?id=${apps?.android.applicationId}`
  const ua = navigator.userAgent
  const isAndroid = Boolean(/android/i.test(ua))
  const { t } = useTranslation('layout')

  const checkIfAppIsInstalled = () => {
    const deepLink = `integreat://${hostName}`
    const timeoutDuration = 2000
    const checkIntervalMs = 100

    const startTime = Date.now()

    window.location.href = deepLink

    // Check if the app responds within the timeoutDuration
    const interval = setInterval(() => {
      if (Date.now() - startTime > timeoutDuration) {
        clearInterval(interval)
        window.location.href = appStoreUrl
      }
    }, checkIntervalMs)

    // Event listener for success if app is opened and page gets hidden
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        clearInterval(interval)
      }
    })
  }

  const toggleBanner = () => {
    const expirationDate = DateTime.now().plus({ months: 3 })
    localStorage.setItem('showBanner', expirationDate.toISO())
    setIsHidden(false)
  }

  useEffect(() => {
    if (localStorage.getItem('showBanner')) {
      if (DateTime.fromISO(localStorage.getItem('showBanner')) > DateTime.now()) {
        setIsHidden(false)
      }
    }
  }, [])

  return (
    isAndroid &&
    isHidden && (
      <StyledBanner onClick={() => setIsInstalled(prev => !prev)} $isInstalled={isInstalled}>
        <StyledDiv>
          <StyledCloseButton label='closeButton' onClick={toggleBanner}>
            {!isInstalled && <Icon src={CloseIcon} />}
          </StyledCloseButton>
          <StyledIcon $isInstalled={isInstalled} src={icons.appLogoMobile} />
          <StyledDivText>
            <StyledAppName>{appName}</StyledAppName>
            {!isInstalled && (
              <>
                <StyledDescription>Tür an Tür - Digitalfabrik gGmbH</StyledDescription>
                <StyledDescription>⭐⭐⭐⭐⭐</StyledDescription>
              </>
            )}
            <StyledDescription>{isInstalled ? t('openInApp') : 'GET — On the Google Play Store'}</StyledDescription>
          </StyledDivText>
        </StyledDiv>
        <StyledButton $isInstalled={isInstalled} onClick={checkIfAppIsInstalled}>
          {t(!isInstalled ? 'view' : 'open')}
        </StyledButton>
      </StyledBanner>
    )
  )
}
