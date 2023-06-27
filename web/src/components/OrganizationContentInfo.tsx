import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { OrganizationModel } from 'api-client'

import HighlightBox from './HighlightBox'
import Thumbnail from './Thumbnail'

const Box = styled(HighlightBox)`
  display: flex;
  justify-content: space-evenly;
  font-family: ${props => props.theme.fonts.web.decorativeFont};
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`

const OrganizationContent = styled.div`
  font-weight: 600;
`

type OrganizationContentInfoProps = {
  organization: OrganizationModel
}

const OrganizationContentInfo = ({ organization }: OrganizationContentInfoProps): ReactElement => {
  const { t } = useTranslation('categories')
  return (
    <Box>
      <Thumbnail src={organization.logo} />
      <Column>
        <OrganizationContent>{t('organizationContent', { organization: organization.name })}</OrganizationContent>
        <a href={organization.url} target='_blank' rel='noopener noreferrer'>
          {t('organizationWebsite', { organization: organization.name })}
        </a>
      </Column>
    </Box>
  )
}

export default OrganizationContentInfo
