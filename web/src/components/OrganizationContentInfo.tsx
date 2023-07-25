import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { OrganizationModel } from 'api-client'

import useWindowDimensions from '../hooks/useWindowDimensions'
import HighlightBox from './HighlightBox'

const StyledImage = styled.img<{ viewportSmall: boolean }>`
  width: 100%;
  transition: transform 0.2s;
  object-fit: contain;
  ${props => props.viewportSmall && 'margin-bottom: 8px;'}
`

const ThumbnailSizer = styled.div`
  width: 150px;
`

const Box = styled(HighlightBox)<{ viewportSmall: boolean }>`
  display: flex;
  justify-content: space-evenly;
  align-content: space-evenly;
  font-family: ${props => props.theme.fonts.web.decorativeFont};
  font-size: 14px;
  flex-direction: ${props => (props.viewportSmall ? 'column' : 'row')};
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
`

const OrganizationContent = styled.div`
  padding-bottom: 8px;
  font-weight: 600;
`

type OrganizationContentInfoProps = {
  organization: OrganizationModel
}

const OrganizationContentInfo = ({ organization }: OrganizationContentInfoProps): ReactElement => {
  const { t } = useTranslation('categories')
  const { viewportSmall } = useWindowDimensions()

  return (
    <Box viewportSmall={viewportSmall}>
      <ThumbnailSizer>
        <StyledImage alt='' src={organization.logo} viewportSmall={viewportSmall} />
      </ThumbnailSizer>
      <Column>
        <OrganizationContent>{t('organizationContent', { organization: organization.name })}</OrganizationContent>
        <span>
          <Trans i18nKey='categories:organizationMoreInformation' domain={new URL(organization.url).hostname}>
            This gets{{ organization: organization.name }}replaced
            <a href={organization.url} target='_blank' rel='noopener noreferrer'>
              {/* @ts-expect-error gets replaced by Trans component */}
              {{ domain: new URL(organization.url).hostname }}
            </a>
            by i18n
          </Trans>
        </span>
      </Column>
    </Box>
  )
}

export default OrganizationContentInfo
