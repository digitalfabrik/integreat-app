import styled from '@emotion/styled'
import MailOutlinedIcon from '@mui/icons-material/MailOutlined'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import SmartphoneOutlinedIcon from '@mui/icons-material/SmartphoneOutlined'
import Divider from '@mui/material/Divider'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { ContactModel } from 'shared/api'

import { helpers } from '../constants/theme'
import ContactItem from './ContactItem'

const StyledContactHeader = styled.div`
  margin-bottom: 6px;
  ${helpers.adaptiveFontSize};
`

const StyledDivider = styled(Divider)`
  margin: 12px 0;
`

const Contact = ({
  contact: { headline, website, phoneNumber, email, mobileNumber },
  isLastContact,
}: {
  contact: ContactModel
  isLastContact?: boolean
}): ReactElement => {
  const { t } = useTranslation('pois')

  return (
    <>
      <StyledContactHeader>{headline ?? t('contactInformation')}</StyledContactHeader>
      {!!website && (
        <ContactItem
          iconSource={PublicOutlinedIcon}
          iconAlt={t('website')}
          link={website}
          content={t('website')}
          sourceIconEnd={OpenInNewIcon}
        />
      )}
      {!!phoneNumber && (
        <ContactItem
          iconSource={PhoneOutlinedIcon}
          iconAlt={t('phone')}
          link={`tel:${phoneNumber}`}
          content={phoneNumber}
        />
      )}
      {!!mobileNumber && (
        <ContactItem
          iconSource={SmartphoneOutlinedIcon}
          iconAlt={t('mobilePhone')}
          link={`tel:${mobileNumber}`}
          content={mobileNumber}
        />
      )}
      {!!email && (
        <ContactItem iconSource={MailOutlinedIcon} iconAlt={t('eMail')} link={`mailto:${email}`} content={email} />
      )}
      {!isLastContact && <StyledDivider />}
    </>
  )
}

export default Contact
