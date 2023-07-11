import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { OrganizationModel } from 'api-client'

import HighlightBox from './HighlightBox'
import Link from './Link'
import SimpleImage from './SimpleImage'
import Text from './base/Text'

const Thumbnail = styled(SimpleImage)`
  height: 80px;
`

const Box = styled(HighlightBox)`
  display: flex;
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  margin-bottom: 16px;
`

const Column = styled.View`
  display: flex;
  flex-direction: column;
`

const OrganizationContent = styled.Text`
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
  padding: 16px 0 8px;
`

const StyledLink = styled(Link)`
  padding: 0;
`

type OrganizationContentInfoProps = {
  organization: OrganizationModel
}

const OrganizationContentInfo = ({ organization }: OrganizationContentInfoProps): ReactElement => {
  const { t } = useTranslation('categories')
  return (
    <Box $padding>
      <Thumbnail source={organization.logo} />
      <Column>
        <OrganizationContent>{t('organizationContent', { organization: organization.name })}</OrganizationContent>
        <Text>
          <Trans i18nKey='categories:organizationMoreInformation' domain={new URL(organization.url).hostname}>
            This gets{{ organization: organization.name }}replaced
            <StyledLink url={organization.url} text={new URL(organization.url).hostname} />
            by i18n
          </Trans>
        </Text>
      </Column>
    </Box>
  )
}

export default OrganizationContentInfo
