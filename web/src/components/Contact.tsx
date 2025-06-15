import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { ContactModel } from 'shared/api'

import { ExternalLinkIcon, MailIcon, PhoneIcon, WebsiteIcon } from '../assets'
import { helpers } from '../constants/theme'
import ContactItem from './ContactItem'
import Spacer from './Spacer'
import Icon from './base/Icon'

const StyledContactHeader = styled.div`
  margin-bottom: 6px;
  ${helpers.adaptiveFontSize};
`

const StyledIcon = styled(Icon)`
  width: 14px;
  height: 14px;
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
      {!!website && (
        <ContactItem
          iconSrc={WebsiteIcon}
          iconAlt={t('website')}
          link={website}
          content={
            <>
              <span>{t('website')}</span>
              <StyledIcon src={ExternalLinkIcon} title={t('externalLink')} />
            </>
          }
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
      {!isLastContact && <Spacer borderColor={theme.colors.borderColor} />}
    </>
  )
}

export default Contact
