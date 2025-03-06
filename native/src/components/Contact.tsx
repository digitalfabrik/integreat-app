import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import ContactModel from 'shared/api/models/ContactModel'

import { MailIcon, PhoneIcon, WebsiteIcon } from '../assets'
import Collapsible from './Collapsible'
import HorizontalLine from './HorizontalLine'
import PoiDetailRow from './PoiDetailRow'

const Contact = ({
  contact: { headline, website, phoneNumber, email },
  language,
}: {
  contact: ContactModel
  language: string
}): ReactElement => {
  const { t } = useTranslation('pois')

  return (
    <>
      <Collapsible headerContent={headline ?? t('contactInformation')} language={language}>
        {!!website && (
          <PoiDetailRow externalUrl={website} accessibilityLabel={t('website')} text={website} Icon={WebsiteIcon} />
        )}
        {!!phoneNumber && (
          <PoiDetailRow
            externalUrl={`tel:${phoneNumber}`}
            accessibilityLabel={t('phone')}
            text={phoneNumber}
            Icon={PhoneIcon}
          />
        )}
        {!!email && (
          <PoiDetailRow externalUrl={`mailto:${email}`} accessibilityLabel={t('eMail')} text={email} Icon={MailIcon} />
        )}
      </Collapsible>
      <HorizontalLine />
    </>
  )
}

export default Contact
