import React, { Fragment, memo, ReactElement, useContext } from 'react'
import { StyleSheet, View } from 'react-native'
import { List as PaperList } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import { getMatchingAliases, MAX_NUMBER_OF_ALIASES_SHOWN } from 'shared'
import { RegionModel } from 'shared/api'

import { AppContext } from '../contexts/AppContext'
import Highlighter from './Highlighter'
import Text from './base/Text'

const Label = styled(Highlighter)`
  color: ${props => props.theme.colors.onSurface};
  font-family: ${props => props.theme.fonts.body2.fontFamily};
`
const AliasLabel = styled(Highlighter)`
  font-size: 11px;
  color: ${props => props.theme.colors.onSurfaceVariant};
`
const AliasesWrapper = styled.View`
  flex: 1;
  flex-flow: row wrap;
  align-items: flex-start;
  margin: 0 5px;
`

type RegionEntryProps = {
  region: RegionModel
  query: string
  navigateToDashboard: (region: RegionModel) => void
}

const RegionEntry = ({ region, query, navigateToDashboard }: RegionEntryProps): ReactElement => {
  const theme = useTheme()
  const styles = StyleSheet.create({
    separator: {
      color: theme.colors.onSurfaceVariant,
    },
  })
  const matchingAliases = getMatchingAliases(region.aliases, query)
  const aliases = matchingAliases.slice(0, MAX_NUMBER_OF_ALIASES_SHOWN)
  const { languageCode } = useContext(AppContext)

  const Aliases =
    aliases.length > 0 ? (
      <AliasesWrapper>
        {aliases.map((it, index) => (
          <Fragment key={it}>
            <AliasLabel search={query} text={it} wordStartOnly />
            {index !== aliases.length - 1 && (
              <Text variant='body3' style={styles.separator}>
                ,{' '}
              </Text>
            )}
          </Fragment>
        ))}
        {matchingAliases.length > MAX_NUMBER_OF_ALIASES_SHOWN && (
          <Text variant='body3' style={styles.separator}>
            , ...
          </Text>
        )}
      </AliasesWrapper>
    ) : null

  return (
    <PaperList.Item
      borderless
      titleNumberOfLines={0}
      title={
        <View>
          <Label search={query} text={region.name} wordStartOnly />
        </View>
      }
      description={Aliases}
      role='link'
      accessibilityLabel={region.name}
      onPress={() => navigateToDashboard(region)}
      accessibilityLanguage={languageCode}
    />
  )
}

export default memo(RegionEntry)
