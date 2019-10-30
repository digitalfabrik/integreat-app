// @flow

import * as React from 'react'
import TileModel from '../../../modules/common/models/TileModel'
import {
  CATEGORIES_FEEDBACK_TYPE,
  CityModel,
  EXTRA_FEEDBACK_TYPE,
  ExtraModel,
  EXTRAS_FEEDBACK_TYPE
} from '@integreat-app/integreat-api-client'
import Tiles from '../../../modules/common/components/Tiles'
import type { TFunction } from 'react-i18next'
import { SPRUNGBRETT_EXTRA, SPRUNGBRETT_ROUTE, WOHNEN_EXTRA, WOHNEN_ROUTE } from '../constants'
import { ScrollView, View } from 'react-native'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import FeedbackVariant from '../../feedback/FeedbackVariant'
import type { NavigationScreenProp } from 'react-navigation'
import SpaceBetween from '../../../modules/common/components/SpaceBetween'
import SiteHelpfulBox from '../../../modules/common/components/SiteHelpfulBox'
import type { FeedbackType } from '@integreat-app/integreat-api-client/endpoints/createFeedbackEndpoint'

type PropsType = {|
  extras: Array<ExtraModel>,
  navigateToExtra: (path: string, isExternalUrl: boolean, postData: ?Map<string, string>) => void,
  navigation: NavigationScreenProp<*>,
  theme: ThemeType,
  cities: Array<CityModel>,
  t: TFunction,
  cityCode: string,
  language: string
|}

class Extras extends React.Component<PropsType> {
  onTilePress = (tile: TileModel) => {
    this.props.navigateToExtra(tile.path, tile.isExternalUrl, tile.postData)
  }

  toTileModels (extras: Array<ExtraModel>): Array<TileModel> {
    return extras.map(
      extra => {
        let path = extra.path
        if (extra.alias === SPRUNGBRETT_EXTRA) {
          path = SPRUNGBRETT_ROUTE
        } else if (extra.alias === WOHNEN_EXTRA) {
          path = WOHNEN_ROUTE
        }

        return new TileModel({
          title: extra.title,
          path: path,
          thumbnail: extra.thumbnail,
          // every extra except the sprungbrett and the wohnen extra is just a link to an external site
          isExternalUrl: path === extra.path,
          postData: extra.postData
        })
      }
    )
  }

  navigateToFeedback = (isPositiveFeedback: boolean) => {
    const { navigation, extras, t, cities, cityCode, language } = this.props
    if (!cityCode || !language) {
      throw Error('language or cityCode not available')
    }
    const createFeedbackVariant = (label: string, feedbackType: FeedbackType, alias?: string) =>
      new FeedbackVariant(label, language, cityCode, feedbackType, undefined, alias)
    const cityTitle = CityModel.findCityName(cities, cityCode)

    const feedbackItems = [
      createFeedbackVariant(t('feedback:contentOfCity', { city: cityTitle }), EXTRAS_FEEDBACK_TYPE),
      ...extras.map(extra => createFeedbackVariant(t('feedback:contentOfExtra', { extra: extra.title }), EXTRA_FEEDBACK_TYPE, extra.alias)),
      createFeedbackVariant(t('feedback:technicalTopics'), CATEGORIES_FEEDBACK_TYPE)
    ]

    navigation.navigate('FeedbackModal', { isPositiveFeedback, feedbackItems })
  }

  render () {
    const { language, extras, t, theme } = this.props
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <SpaceBetween>
          <View>
            <Tiles title={t('extras')} tiles={this.toTileModels(extras)} onTilePress={this.onTilePress} theme={theme}
                   language={language} />
          </View>
          <SiteHelpfulBox navigateToFeedback={this.navigateToFeedback} theme={theme} t={t} />
        </SpaceBetween>
      </ScrollView>
    )
  }
}

export default Extras
