// flow-typed signature: 915e4eee2f36397e85284315af5dba7d
// flow-typed version: c6154227d1/react-onclickoutside_v6.x.x/flow_>=v0.104.x

declare module 'react-onclickoutside' {
  declare export var IGNORE_CLASS_NAME: 'ignore-react-onclickoutside';

  declare export default function onClickOutsideHOC<Props: {...}, Instance>(
    WrappedComponent: React$AbstractComponent<Props, Instance>,
    config?: { excludeScrollbar?: boolean, ... }):
      React$AbstractComponent<$Diff<Props, {
        disableOnClickOutside?: () => void,
        enableOnClickOutside?: () => void,
        eventTypes?: Array<string>,
        excludeScrollbar?: boolean,
        outsideClickIgnoreClass?: string,
        preventDefault?: boolean,
        stopPropagation?: boolean,
        ...
      }>,
      { +getInstance: () => Instance, ... }>;
}
