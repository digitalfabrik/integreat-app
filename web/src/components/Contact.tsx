import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { ContactModel } from 'shared/api'

import { ExternalLinkIcon, MailIcon, PhoneIcon, WebsiteIcon } from '../assets'
import Collapsible from './Collapsible'
import ContactItem from './ContactItem'

const Contact = ({
  contact: { headline, website, phoneNumber, email, mobilePhoneNumber },
}: {
  contact: ContactModel
}): ReactElement => {
  const { t } = useTranslation('pois')

  return (
    <Collapsible title={headline ?? t('contactInformation')}>
      <div>
        {!!website && (
          <ContactItem
            iconSrc={WebsiteIcon}
            iconAlt={t('website')}
            link={website}
            content={t('Website')}
            isExternalLink={true}
          />
        )}
        {!!phoneNumber && (
          <ContactItem iconSrc={PhoneIcon} iconAlt={t('phone')} link={`tel:${phoneNumber}`} content={phoneNumber} />
        )}
        {!!mobilePhoneNumber && (
          <ContactItem
            iconSrc={PhoneIcon}
            iconAlt={t('mobilePhone')}
            link={`tel:${mobilePhoneNumber}`}
            content={mobilePhoneNumber}
          />
        )}
        {!!email && <ContactItem iconSrc={MailIcon} iconAlt={t('eMail')} link={`mailto:${email}`} content={email} />}
      </div>
    </Collapsible>
  )
}

export default Contact
