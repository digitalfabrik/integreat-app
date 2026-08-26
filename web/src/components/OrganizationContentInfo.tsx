import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { OrganizationModel } from 'shared/api'

import useDimensions from '../hooks/useDimensions'
import Link from './base/Link'

const StyledCard = styled(Card)({
  marginBlock: 16,
  marginInline: 8,
}) as typeof Card

const StyledImage = styled('img')({
  width: 'auto',
  maxWidth: 320,
  height: '100%',
  objectFit: 'contain',
})

type OrganizationContentInfoProps = {
  organization: OrganizationModel
}

const OrganizationContentInfo = ({ organization }: OrganizationContentInfoProps): ReactElement => {
  const { mobile } = useDimensions()
  const { t } = useTranslation(['categories'])

  return (
    <StyledCard elevation={2}>
      <Stack direction={mobile ? 'column' : 'row'} sx={{ padding: 2, gap: 2 }}>
        <Stack sx={{ height: 80, alignItems: 'flex-start' }}>
          <StyledImage alt='' src={organization.logo} />
        </Stack>
        <Stack>
          <Typography variant='subtitle1'>
            {t($ => $.categories.organizationContent, { organization: organization.name })}
          </Typography>
          <Typography variant='body2'>
            <Trans
              ns='categories'
              i18nKey={$ => $.categories.organizationMoreInformation}
              components={{
                1: <span>{organization.name}</span>,
                3: (
                  <Link to={organization.url} highlighted>
                    {new URL(organization.url).hostname}
                  </Link>
                ),
              }}
            />
          </Typography>
        </Stack>
      </Stack>
    </StyledCard>
  )
}

export default OrganizationContentInfo
