import { $Diff } from "utility-types";
import * as React from "react";
import { connect } from "react-redux";
import SearchInput from "../../../modules/common/components/SearchInput";
import { CategoriesMapModel, CategoryModel } from "api-client";
import CategoryList from "../../categories/components/CategoryList";
import type { TFunction } from "react-i18next";
import { withTranslation } from "react-i18next";
import type { StateType } from "../../../modules/app/StateType";
import SearchFeedback from "../components/SearchFeedback";
import type { LocationState } from "redux-first-router";
import normalizeSearchString from "../../../modules/common/utils/normalizeSearchString";
import { Parser } from "htmlparser2";
type CategoryEntryType = {
  model: CategoryModel;
  contentWithoutHtml?: string;
  subCategories: Array<CategoryModel>;
};
type OwnPropsType = {
  categories: CategoriesMapModel;
};
type PropsType = OwnPropsType & {
  location: LocationState;
  t: TFunction;
};
type LocalStateType = {
  filterText: string;
};

const noop = () => {};

export class SearchPage extends React.Component<PropsType, LocalStateType> {
  constructor(props: PropsType) {
    super(props);
    const initialFilterText = props.location.query?.query ? props.location.query.query : '';
    this.state = {
      filterText: initialFilterText
    };
  }

  findCategories(): Array<CategoryEntryType> {
    const categories = this.props.categories;
    const filterText = normalizeSearchString(this.state.filterText);
    // find all categories whose titles include the filter text and sort them lexicographically
    const categoriesWithTitle = categories.toArray().filter(category => normalizeSearchString(category.title).includes(filterText)).sort((category1, category2) => category1.title.localeCompare(category2.title));
    // find all categories whose contents but not titles include the filter text and sort them lexicographically
    let contentWithoutHtml = [];
    const parser = new Parser({
      ontext(text: string) {
        contentWithoutHtml.push(text);
      }

    });
    const categoriesWithContent = categories.toArray().filter(category => !normalizeSearchString(category.title).includes(filterText)).map((category: CategoryModel): CategoryEntryType => {
      contentWithoutHtml = [];
      parser.write(category.content);
      parser.end();
      return {
        model: category,
        contentWithoutHtml: contentWithoutHtml.join(' '),
        subCategories: []
      };
    }).filter(categoryEntry => categoryEntry.contentWithoutHtml && normalizeSearchString(categoryEntry.contentWithoutHtml).includes(filterText)).sort((category1, category2) => category1.model.title.localeCompare(category2.model.title));
    // return all categories from above and remove the root category
    return categoriesWithTitle.filter(category => !category._root).map((category): CategoryEntryType => ({
      model: category,
      subCategories: []
    })).concat(categoriesWithContent);
  }

  handleFilterTextChanged = (filterText: string) => {
    this.setState({
      filterText: filterText
    });
    const appendToUrl = filterText.length !== 0 ? `?query=${filterText}` : '';
    history.replaceState(null, '', `${this.props.location.pathname}${appendToUrl}`);
  };

  render() {
    const categories = this.findCategories();
    const {
      t,
      location
    } = this.props;
    const {
      filterText
    } = this.state;
    return <>
        <SearchInput filterText={this.state.filterText} placeholderText={t('searchPlaceholder')} onFilterTextChange={this.handleFilterTextChanged} spaceSearch />
        <CategoryList categories={categories} query={this.state.filterText} onInternalLinkClick={noop} />
        <SearchFeedback location={location} resultsFound={categories.length !== 0} query={filterText} />
      </>;
  }

}

const mapStateToProps = (state: StateType) => ({
  location: state.location
});

export default connect<$Diff<PropsType, {
  t: TFunction;
}>, OwnPropsType, _, _, _, _>(mapStateToProps, () => ({}))(withTranslation<PropsType>('search')(SearchPage));