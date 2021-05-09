import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StyledToolbarItem from "./StyledToolbarItem";
import StyledSmallViewTip from "./StyledSmallViewTip";
import Tooltip from "../../common/components/Tooltip";
type PropsType = {
  href: string;
  icon: {};
  text: string;
  viewportSmall: boolean;
};

const ToolbarItem = ({
  href,
  text,
  icon,
  viewportSmall
}: PropsType) => {
  return <Tooltip text={viewportSmall ? null : text} flow='up' mediumViewportFlow='right' smallViewportFlow='down'>
      <StyledToolbarItem href={href} ariaLabel={text}>
        <FontAwesomeIcon icon={icon} />
        {viewportSmall && <StyledSmallViewTip>{text}</StyledSmallViewTip>}
      </StyledToolbarItem>
    </Tooltip>;
};

export default ToolbarItem;