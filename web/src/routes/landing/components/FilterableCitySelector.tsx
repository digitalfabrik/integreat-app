import React from "react";
import Heading from "./Heading";
import ScrollingSearchBox from "../../../modules/common/components/ScrollingSearchBox";
import CitySelector from "./CitySelector";
import { CityModel } from "api-client";
import type { StyledComponent } from "styled-components";
import styled from "styled-components";
import type { TFunction } from "react-i18next";
import { withTranslation } from "react-i18next";
import type { ThemeType } from "build-configs/ThemeType";
const Container: StyledComponent<{}, ThemeType, any> = styled.div`
  padding-top: 22px;
`;
type PropsType = {
  cities: Array<CityModel>;
  language: string;
  t: TFunction;
};
type StateType = {
  filterText: string;
  stickyTop: number;
};
export class FilterableCitySelector extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      filterText: '',
      stickyTop: 0
    };
  }

  handleFilterTextChanged = (filterText: string) => this.setState({
    filterText
  });
  handleStickyTopChanged = (stickyTop: number) => this.setState({
    stickyTop
  });

  render() {
    const {
      cities,
      language,
      t
    } = this.props;
    const {
      filterText,
      stickyTop
    } = this.state;
    return <Container>
        <Heading />
        <ScrollingSearchBox filterText={filterText} onFilterTextChange={this.handleFilterTextChanged} placeholderText={t('searchCity')} spaceSearch={false} onStickyTopChanged={this.handleStickyTopChanged}>
          <CitySelector stickyTop={stickyTop} cities={cities} filterText={filterText} language={language} />
        </ScrollingSearchBox>
      </Container>;
  }

}
export default withTranslation<PropsType>('landing')(FilterableCitySelector);