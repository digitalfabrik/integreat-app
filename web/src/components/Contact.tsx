import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { ContactModel } from 'shared/api'

import { ExternalLinkIcon, MailIcon, PhoneIcon, WebsiteIcon, MobilePhoneIcon } from '../assets'
import { helpers } from '../constants/theme'
import ContactItem from './ContactItem'
import Spacer from './Spacer'

const StyledContactHeader = styled.div`
  margin-bottom: 6px;
  ${helpers.adaptiveFontSize};
`

const Contact = ({
  contact: { headline, website, phoneNumber, email, mobileNumber },
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
      {!!website && (
        <ContactItem
          iconSource={WebsiteIcon}
          iconAlt={t('website')}
          link={website}
          content={t('website')}
          sourceIconEnd={ExternalLinkIcon}
        />
      )}
      {!!phoneNumber && (
        <ContactItem iconSource={PhoneIcon} iconAlt={t('phone')} link={`tel:${phoneNumber}`} content={phoneNumber} />
      )}
      {!!mobileNumber && (
        <ContactItem
          iconSource={MobilePhoneIcon}
          iconAlt={t('mobilePhone')}
          link={`tel:${mobileNumber}`}
          content={mobileNumber}
        />
      )}
      {!!email && <ContactItem iconSource={MailIcon} iconAlt={t('eMail')} link={`mailto:${email}`} content={email} />}
      {!isLastContact && <Spacer borderColor={theme.colors.borderColor} />}
    </>
  )
}

export default Contact
