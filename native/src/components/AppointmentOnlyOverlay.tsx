import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import Link from './Link'
import AlertDialog from './base/AlertDialog'
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

  return (
    <AlertDialog
      visible={isVisible}
      close={closeOverlay}
      title={<Text variant='subtitle2'>{t('appointmentNecessary')}</Text>}>
      <Text>
        <Trans i18nKey='pois:makeAppointmentTooltipWithLink'>
          This gets replaced
          {appointmentUrl ? <Link url={appointmentUrl}>by react-i18next</Link> : <Text>by react-i18next</Text>}
        </Trans>
      </Text>
    </AlertDialog>
  )
}

export default AppointmentOnlyOverlay
