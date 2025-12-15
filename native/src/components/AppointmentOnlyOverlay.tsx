import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Modal as RNModal } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import Link from './Link'
import Text from './base/Text'

const BackgroundForClosing = styled.Pressable`
  flex: 1;
  background-color: ${props => props.theme.colors.action.disabled};
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
  background-color: ${props => props.theme.colors.background};
  margin: 32px;
  padding: 24px;
  border-radius: 28px;
`

const CloseButton = styled.Pressable`
  padding: 12px;
  align-self: flex-end;
`

type AppointmentOnlyOverlayProps = {
  appointmentUrl: string | null
  closeOverlay: () => void
}

const AppointmentOnlyOverlay = ({ appointmentUrl, closeOverlay }: AppointmentOnlyOverlayProps): ReactElement => {
  const { t } = useTranslation('pois')
  const theme = useTheme()
  return (
    <RNModal onRequestClose={closeOverlay} animationType='fade' transparent>
      <BackgroundForClosing onPress={closeOverlay} />
      <OverlayCenterer>
        <OverlayContainer>
          <Text style={{ marginBottom: 16 }} variant='subtitle2'>
            {t('appointmentNecessary')}
          </Text>
          <Text>
            <Trans i18nKey='pois:makeAppointmentTooltipWithLink'>
              This gets replaced
              {appointmentUrl ? <Link url={appointmentUrl}>by react-i18next</Link> : <Text>by react-i18next</Text>}
            </Trans>
          </Text>
          <CloseButton onPress={closeOverlay} role='button'>
            <Text variant='button' style={{ color: theme.colors.onSurfaceVariant }}>
              {t('common:close')}
            </Text>
          </CloseButton>
        </OverlayContainer>
      </OverlayCenterer>
    </RNModal>
  )
}

export default AppointmentOnlyOverlay
