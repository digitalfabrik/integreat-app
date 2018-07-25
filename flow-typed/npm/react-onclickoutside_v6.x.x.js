// flow-typed signature: 6eb42473f8963358a108bc3234413fa1
// flow-typed version: 83f69ebb56/react-onclickoutside_v6.x.x/flow_>=v0.54.1

declare module 'react-onclickoutside' {
  declare export type OnClickOutsideProps = {
    eventTypes?: Array<string>,
    outsideClickIgnoreClass?: string,
    preventDefault?: boolean,
    stopPropagation?: boolean
  };

  declare export var IGNORE_CLASS_NAME: string;

  declare export default <P, S>(
    BaseComponent: Class<React$Component<P, S>>,
    config?: { excludeScrollbar?: boolean }
  ) => React$ComponentType<P & OnClickOutsideProps & {
    excludeScrollbar?: boolean,
    disableOnClickOutside?: boolean
  }>;
}
