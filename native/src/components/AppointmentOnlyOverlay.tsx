import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import Link from './Link'
import { SimpleAlertDialog } from './base/AlertDialog'
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
  const { t } = useTranslation()

  return (
    <SimpleAlertDialog
      visible={isVisible}
      close={closeOverlay}
      title={<Text variant='subtitle2'>{t($ => $.places.hours.appointment.required)}</Text>}>
      <Text>
        <Trans
          ns='places'
          i18nKey={$ => $.places.hours.appointment.make.description}
          components={{ Link: appointmentUrl ? <Link url={appointmentUrl}>website</Link> : <Text>website</Text> }}
        />
      </Text>
    </SimpleAlertDialog>
  )
}

export default AppointmentOnlyOverlay
