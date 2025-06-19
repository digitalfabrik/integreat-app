import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined'
import MailOutlinedIcon from '@mui/icons-material/MailOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { ContactModel } from 'shared/api'

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
      {!!website && (
        <ContactItem iconSrc={PublicOutlinedIcon} iconAlt={t('website')} link={website} content={website} />
      )}
      {!!phoneNumber && (
        <ContactItem
          iconSrc={LocalPhoneOutlinedIcon}
          iconAlt={t('phone')}
          link={`tel:${phoneNumber}`}
          content={phoneNumber}
        />
      )}
      {!!mobilePhoneNumber && (
        <ContactItem
          iconSrc={LocalPhoneOutlinedIcon}
          iconAlt={t('mobilePhone')}
          link={`tel:${mobilePhoneNumber}`}
          content={mobilePhoneNumber}
        />
      )}
      {!!email && (
        <ContactItem iconSrc={MailOutlinedIcon} iconAlt={t('eMail')} link={`mailto:${email}`} content={email} />
      )}
      {!isLastContact && <Spacer borderColor={theme.colors.borderColor} />}
    </>
  )
}

export default Contact
