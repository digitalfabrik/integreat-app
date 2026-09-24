import React, { ReactElement, useCallback, useState } from 'react'
import { RefreshControl, ScrollView, SectionList } from 'react-native'
import { Divider } from 'react-native-paper'
import styled from 'styled-components/native'

import { CATEGORIES_ROUTE, getCategoryTiles, RouteInformationType } from 'shared'
import { CategoriesMapModel, CategoryModel, RegionModel } from 'shared/api'

import dimensions from '../constants/dimensions'
import useTtsPlayer from '../hooks/useTtsPlayer'
import Caption from './Caption'
import CategoryListItem from './CategoryListItem'
import EmbeddedOffers from './EmbeddedOffers'
import OrganizationContentInfo from './OrganizationContentInfo'
import { SpaceForTts } from './Page'
import RemoteContent from './RemoteContent'
import SubCategoryListItem from './SubCategoryListItem'
import Tiles from './Tiles'
import TimeStamp from './TimeStamp'

const IndentedDivider = styled(Divider)`
  margin-left: 56px;
  margin-right: 56px;
`

const SectionSeparator = ({ leadingItem, trailingSection }: { leadingItem?: object; trailingSection?: object }) =>
  leadingItem && !trailingSection ? null : <Divider />

export type CategoriesProps = {
  regionModel: RegionModel
  language: string
  categories: CategoriesMapModel
  category: CategoryModel
  navigateTo: (routeInformation: RouteInformationType) => void
  goBack: () => void
  refresh?: () => void
}

type CategorySection = {
  category: CategoryModel
  data: CategoryModel[]
}

const Categories = ({
  regionModel,
  language,
  navigateTo,
  categories,
  category,
  goBack,
  refresh,
}: CategoriesProps): ReactElement => {
  const children = categories.getChildren(category)
  const regionCode = regionModel.code
  const { visible: ttsPlayerVisible } = useTtsPlayer(category)

  const [loading, setLoading] = useState(category.content.length !== 0)
  const onLoad = useCallback(() => setLoading(false), [])

  const navigateToCategory = ({ path }: { path: string }) =>
    navigateTo({
      route: CATEGORIES_ROUTE,
      regionCode,
      languageCode: language,
      regionContentPath: path,
    })

  if (category.isRoot()) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl onRefresh={refresh} refreshing={false} />}>
        <Tiles
          tiles={getCategoryTiles({ categories: children, regionCode })}
          language={language}
          onTilePress={navigateToCategory}
        />
      </ScrollView>
    )
  }

  const renderPageHeader = (
    <>
      {!loading && category.title ? <Caption title={category.title} language={language} /> : null}
      <RemoteContent content={category.content} onLoad={onLoad} loading={loading} language={language} />
      {!loading && category.organization && <OrganizationContentInfo organization={category.organization} />}
      {!loading && !!category.content && <TimeStamp lastUpdate={category.lastUpdate} />}
    </>
  )

  if (!children.length) {
    return (
      <SectionList
        sections={[]}
        keyExtractor={item => item.path}
        renderItem={() => null}
        ListHeaderComponent={renderPageHeader}
        ListFooterComponent={
          <>
            {!loading && (
              <EmbeddedOffers category={category} regionCode={regionCode} languageCode={language} goBack={goBack} />
            )}
            <SpaceForTts $ttsPlayerVisible={ttsPlayerVisible} />
          </>
        }
        onRefresh={refresh}
        refreshing={false}
        contentContainerStyle={{
          paddingHorizontal: dimensions.pageContainerPaddingHorizontal,
          paddingBottom: 8,
        }}
      />
    )
  }

  const sections: CategorySection[] = children.map(child => ({
    category: child,
    data: categories.getChildren(child),
  }))

  return (
    <SectionList
      sections={loading ? [] : sections}
      keyExtractor={item => item.path}
      accessibilityRole='list'
      ListHeaderComponent={renderPageHeader}
      ListFooterComponent={<SpaceForTts $ttsPlayerVisible={ttsPlayerVisible} />}
      renderSectionHeader={({ section }) => {
        const isLastListItem = sections[sections.length - 1]?.category.path === section.category.path
        return (
          <CategoryListItem
            category={section.category}
            language={language}
            onItemPress={navigateToCategory}
            isLastListItem={isLastListItem}
          />
        )
      }}
      renderItem={({ item }) => (
        <SubCategoryListItem subCategory={item} onItemPress={navigateToCategory} language={language} />
      )}
      onRefresh={refresh}
      refreshing={false}
      stickySectionHeadersEnabled={false}
      SectionSeparatorComponent={SectionSeparator}
      ItemSeparatorComponent={IndentedDivider}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={{
        paddingHorizontal: dimensions.pageContainerPaddingHorizontal,
        paddingBottom: 8,
      }}
    />
  )
}

export default Categories
