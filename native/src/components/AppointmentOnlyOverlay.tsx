import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Button, Dialog, Portal } from 'react-native-paper'
import { useTheme } from 'styled-components/native'

import Link from './Link'
import Text from './base/Text'

type AppointmentOnlyOverlayProps = {
  appointmentUrl: string | null
  isVisible: boolean
  closeOverlay: () => void
}

const AppointmentOnlyOverlay = ({
  appointmentUrl,
  isVisible,
  closeOverlay,
}: AppointmentOnlyOverlayProps): ReactElement => {
  const { t } = useTranslation('pois')
  const theme = useTheme()

  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={closeOverlay} style={{ backgroundColor: theme.colors.surfaceVariant }}>
        <Dialog.Content>
          <Text style={{ marginBottom: 16 }} variant='subtitle2'>
            {t('appointmentNecessary')}
          </Text>
          <Text>
            <Trans i18nKey='pois:makeAppointmentTooltipWithLink'>
              This gets replaced
              {appointmentUrl ? <Link url={appointmentUrl}>by react-i18next</Link> : <Text>by react-i18next</Text>}
            </Trans>
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={closeOverlay}>{t('common:close')}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

export default AppointmentOnlyOverlay
