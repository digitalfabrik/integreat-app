import MailOutlinedIcon from '@mui/icons-material/MailOutlined'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import ListItem from '@mui/material/ListItem'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { ContactModel } from 'shared/api'

import ContactItem from './ContactItem'

type ContactProps = {
  contact: ContactModel
}

const Contact = ({ contact }: ContactProps): ReactElement => {
  const { headline, website, phoneNumber, email, mobilePhoneNumber } = contact
  const { t } = useTranslation('pois')

  return (
    <ListItem disablePadding>
      <Stack gap={1}>
        <Typography variant='title3'>{headline ?? t('contactInformation')}</Typography>
        {!!website && (
          <ContactItem Icon={PublicOutlinedIcon} link={website} content={t('website')} IconEnd={OpenInNewIcon} />
        )}
        {!!phoneNumber && <ContactItem Icon={PhoneOutlinedIcon} link={`tel:${phoneNumber}`} content={phoneNumber} />}
        {!!mobilePhoneNumber && (
          <ContactItem Icon={PhoneOutlinedIcon} link={`tel:${mobilePhoneNumber}`} content={mobilePhoneNumber} />
        )}
        {!!email && <ContactItem Icon={MailOutlinedIcon} link={`mailto:${email}`} content={email} />}
      </Stack>
    </ListItem>
  )
}

export default Contact
