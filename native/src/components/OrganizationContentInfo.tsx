import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { OrganizationModel } from 'api-client'

import HighlightBox from './HighlightBox'
import Link from './Link'
import SimpleImage from './SimpleImage'

const Thumbnail = styled(SimpleImage)`
  height: 150px;
`

const Box = styled(HighlightBox)`
  display: flex;
  justify-content: space-evenly;
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
`

const Column = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`

const OrganizationContent = styled.Text`
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
`

type OrganizationContentInfoProps = {
  organization: OrganizationModel
}

const OrganizationContentInfo = ({ organization }: OrganizationContentInfoProps): ReactElement => {
  const { t } = useTranslation('categories')
  return (
    <Box>
      <Thumbnail source={organization.logo} />
      <Column>
        <OrganizationContent>{t('organizationContent', { organization: organization.name })}</OrganizationContent>
        <Link url={organization.url} text={t('organizationWebsite', { organization: organization.name })} />
      </Column>
    </Box>
  )
}

export default OrganizationContentInfo
