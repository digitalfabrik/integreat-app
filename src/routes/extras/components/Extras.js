// @flow

import * as React from 'react'
import TileModel from '../../../modules/common/models/TileModel'
import { CityModel, ExtraModel, PAGE_FEEDBACK_TYPE } from '@integreat-app/integreat-api-client'
import Tiles from '../../../modules/common/components/Tiles'
import type { TFunction } from 'react-i18next'
import { SPRUNGBRETT_EXTRA, SPRUNGBRETT_ROUTE, WOHNEN_EXTRA, WOHNEN_ROUTE } from '../constants'
import { ScrollView } from 'react-native'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import FeedbackDropdownItem from '../../feedback/FeedbackDropdownItem'
import type { NavigationScreenProp } from 'react-navigation'

type PropsType = {|
  extras: Array<ExtraModel>,
  navigateToExtra: (path: string, isExternalUrl: boolean, postData: ?Map<string, string>) => void,
  navigation: NavigationScreenProp<*>,
  theme: ThemeType,
  cities: Array<CityModel>,
  t: TFunction
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
    const {navigation, extras, t, cities, cityCode} = this.props
    const cityTitle = CityModel.findCityName(cities, cityCode)
    console.warn(cityTitle)

    navigation.navigate('FeedbackModal', {
      isPositiveFeedback,
      feedbackItems: [
        new FeedbackDropdownItem(t('feedback:contentOfCity', {city: cityTitle}), PAGE_FEEDBACK_TYPE),
        ...extras.map(extra => new FeedbackDropdownItem(t('feedback:extra', {extra: extra.title}))),
        new FeedbackDropdownItem(t('feedback:technicalTopics'))
      ]
    })
  }

  render () {
    const {extras, t, theme} = this.props
    return (
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <Tiles title={t('extras')} tiles={this.toTileModels(extras)} onTilePress={this.onTilePress} theme={theme}
               navigateToFeedback={this.navigateToFeedback} />
      </ScrollView>
    )
  }
}

export default Extras
