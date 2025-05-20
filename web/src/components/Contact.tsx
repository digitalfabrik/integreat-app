import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { ContactModel } from 'shared/api'

import { MailIcon, PhoneIcon, WebsiteIcon } from '../assets'
import { helpers } from '../constants/theme'
import ContactItem from './ContactItem'
import Spacer from './Spacer'

const StyledContactHeader = styled.div`
  margin-bottom: 6px;
  ${helpers.adaptiveFontSize};
`

const Contact = ({
  contact: { headline, website, phoneNumber, email, mobilePhoneNumber },
  isLastContact,
}: {
  contact: ContactModel
  isLastContact?: boolean
}): ReactElement => {
  const { t } = useTranslation('pois')
  const theme = useTheme()

  return (
    <>
      <StyledContactHeader>{headline ?? t('contactInformation')}</StyledContactHeader>
      {!!website && <ContactItem iconSrc={WebsiteIcon} iconAlt={t('website')} link={website} content={website} />}
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
      {!isLastContact && <Spacer borderColor={theme.colors.borderColor} />}
    </>
  )
}

export default Contact
