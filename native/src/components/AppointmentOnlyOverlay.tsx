import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Modal as RNModal, Text } from 'react-native'
import styled from 'styled-components/native'

import Link from './Link'

const BackgroundForClosing = styled.Pressable`
  flex: 1;
  background-color: ${props => props.theme.colors.textDecorationColor};
  opacity: 0.25;
`

const OverlayCenterer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
`

const OverlayContainer = styled.View`
  background-color: white;
  margin: 32px;
  padding: 24px;
  border-radius: 28px;
`

const OverlayTitle = styled.Text`
  font-weight: 700;
  margin-bottom: 16px;
`

const CloseButton = styled.Pressable`
  padding: 12px;
  align-self: flex-end;
`

const CloseButtonText = styled.Text`
  font-weight: 700;
  color: ${props => props.theme.colors.textSecondaryColor};
`

type AppointmentOnlyOverlayProps = {
  appointmentUrl: string | null
  closeOverlay: () => void
}

const AppointmentOnlyOverlay = ({ appointmentUrl, closeOverlay }: AppointmentOnlyOverlayProps): ReactElement => {
  const { t } = useTranslation('pois')
  return (
    <RNModal onRequestClose={closeOverlay} animationType='fade' transparent>
      <BackgroundForClosing onPress={closeOverlay} />
      <OverlayCenterer>
        <OverlayContainer>
          <OverlayTitle>{t('appointmentNecessary')}</OverlayTitle>
          <Text>
            {/* More information: https://react.i18next.com/latest/trans-component */}
            <Trans i18nKey='pois:makeAppointmentTooltipWithLink'>
              This gets replaced by react-i18next
              {appointmentUrl ? <Link url={appointmentUrl} text={t('theWebsite')} /> : <Text>{t('theWebsite')}</Text>}
            </Trans>
          </Text>
          <CloseButton onPress={closeOverlay}>
            <CloseButtonText>{t('common:close')}</CloseButtonText>
          </CloseButton>
        </OverlayContainer>
      </OverlayCenterer>
    </RNModal>
  )
}

export default AppointmentOnlyOverlay
