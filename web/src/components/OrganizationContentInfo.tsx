import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { OrganizationModel } from 'shared/api'

import HighlightBox from './HighlightBox'
import Link from './base/Link'

const StyledImage = styled('img')`
  width: 100%;
  transition: transform 0.2s;
  object-fit: contain;

  ${props => props.theme.breakpoints.down('md')} {
    margin-bottom: 8px;
  }
`

const ThumbnailSizer = styled('div')`
  width: 150px;
`

const Box = styled(HighlightBox)`
  display: flex;
  place-content: space-evenly space-evenly;
  font-family: ${props => props.theme.legacy.fonts.web.decorativeFont};
  font-size: 14px;
  flex-direction: row;
  gap: 20px;

  ${props => props.theme.breakpoints.down('md')} {
    flex-direction: 'column';
  }
`

const Column = styled('div')`
  display: flex;
  flex-direction: column;
`

const OrganizationContent = styled('div')`
  padding-bottom: 8px;
  font-weight: 600;
`

type OrganizationContentInfoProps = {
  organization: OrganizationModel
}

const OrganizationContentInfo = ({ organization }: OrganizationContentInfoProps): ReactElement => {
  const { t } = useTranslation('categories')

  return (
    <Box>
      <ThumbnailSizer>
        <StyledImage alt='' src={organization.logo} />
      </ThumbnailSizer>
      <Column>
        <OrganizationContent>{t('organizationContent', { organization: organization.name })}</OrganizationContent>
        <span>
          <Trans i18nKey='categories:organizationMoreInformation' domain={new URL(organization.url).hostname}>
            This gets{{ organization: organization.name }}replaced
            <Link to={organization.url} highlighted>
              {/* @ts-expect-error gets replaced by Trans component */}
              {{ domain: new URL(organization.url).hostname }}
            </Link>
            by i18n
          </Trans>
        </span>
      </Column>
    </Box>
  )
}

export default OrganizationContentInfo
