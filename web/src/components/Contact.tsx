import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'styled-components'

import ContactModel from 'shared/api/models/ContactModel'

import { MailIcon, PhoneIcon, WebsiteIcon } from '../assets'
import Collapsible from './Collapsible'
import ContactItem from './ContactItem'
import Spacer from './Spacer'

const Contact = ({ contact: { headline, website, phoneNumber, email } }: { contact: ContactModel }): ReactElement => {
  const theme = useTheme()
  const { t } = useTranslation('pois')

  return (
    <>
      <Spacer $borderColor={theme.colors.borderColor} />
      <Collapsible title={headline ?? t('contactInformation')}>
        <div>
          {!!website && <ContactItem iconSrc={WebsiteIcon} iconAlt={t('website')} link={website} content={website} />}
          {!!phoneNumber && (
            <ContactItem iconSrc={PhoneIcon} iconAlt={t('phone')} link={`tel:${phoneNumber}`} content={phoneNumber} />
          )}
          {!!email && <ContactItem iconSrc={MailIcon} iconAlt={t('eMail')} link={`mailto:${email}`} content={email} />}
        </div>
      </Collapsible>
    </>
  )
}

export default Contact
