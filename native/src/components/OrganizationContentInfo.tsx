import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { OrganizationModel } from 'api-client'

import HighlightBox from './HighlightBox'
import Link from './Link'
import SimpleImage from './SimpleImage'

const Thumbnail = styled(SimpleImage)`
  height: 80px;
`

const StyledText = styled.Text`
  flex-direction: row;
  flex-wrap: wrap;
`

const Box = styled(HighlightBox)`
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  margin-bottom: 16px;
  padding: 20px;
  border-radius: 4px;
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
    <Box>
      <Thumbnail source={organization.logo} />
      <View>
        <OrganizationContent>{t('organizationContent', { organization: organization.name })}</OrganizationContent>
        <StyledText>
          <Trans i18nKey='categories:organizationMoreInformation' domain={new URL(organization.url).hostname}>
            This gets{{ organization: organization.name }}replaced
            <StyledLink url={organization.url} text={new URL(organization.url).hostname} />
            by i18n
          </Trans>
        </StyledText>
      </View>
    </Box>
  )
}

export default OrganizationContentInfo
