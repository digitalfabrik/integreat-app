import * as React from "react";
import { isEmpty } from "lodash";
import type { StyledComponent } from "styled-components";
import styled from "styled-components";
import type { ThemeType } from "build-configs/ThemeType";
const StyledList: StyledComponent<{}, ThemeType, any> = styled.div`
  border-top: 2px solid ${props => props.theme.colors.themeColor};
`;
const NoItemsMessage: StyledComponent<{}, ThemeType, any> = styled.div`
  padding-top: 25px;
  text-align: center;
`;
type PropsType<T> = {
  items: Array<T>;
  noItemsMessage: string;
  renderItem: (arg0: T) => React.ReactNode;
};

class List<T> extends React.PureComponent<PropsType<T>> {
  render() {
    const {
      items,
      renderItem,
      noItemsMessage
    } = this.props;

    if (isEmpty(items)) {
      return <NoItemsMessage>{noItemsMessage}</NoItemsMessage>;
    }

    return <StyledList>{items.map(item => renderItem(item))}</StyledList>;
  }

}

export default List;