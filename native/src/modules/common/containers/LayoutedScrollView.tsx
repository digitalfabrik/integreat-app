import * as React from "react";
import LayoutContainer from "../../layout/containers/LayoutContainer";
import { ScrollView } from "react-native";
type ScrollViewPropsType = {
  children?: React.ReactNode;
  refreshControl: React.ReactElement<any>;
};

const LayoutedScrollView = (props: ScrollViewPropsType) => {
  const {
    children,
    refreshControl
  } = props;
  return <LayoutContainer>
      <ScrollView keyboardShouldPersistTaps='always' refreshControl={refreshControl} contentContainerStyle={{
      flexGrow: 1
    }}>
        {children}
      </ScrollView>
    </LayoutContainer>;
};

export default LayoutedScrollView;