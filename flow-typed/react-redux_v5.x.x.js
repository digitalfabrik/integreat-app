// This types are from: https://medium.com/@samgoldman/ville-saukkonen-thanks-and-thanks-for-your-thoughtful-questions-24aedcfed518

/***************/
/* react-redux */
/***************/

// A connected component wraps some component WC. Note that S (State) and D (Action)
// are "phantom" type parameters, as they are not constrained by the definition but
// rather by the context at the use site.
declare class ConnectedComponent<-S, -D, OP, +WC> extends React$Component<OP> {
  static +WrappedComponent: WC;
  getWrappedInstance(): React$ElementRef<WC>;
}

type MapStateToProps<-S, -OP, +SP> = (
  state: S,
  ownProps: OP,
) => SP;

// Same as above, but the derivation is based on dispatch instead of state.
type MapDispatchToProps<-D, -OP, +DP> = (
  dispatch: D,
  ownProps: OP,
) => DP;

type MergeProps<-SP, -DP, -OP, +MP> = (
  stateProps: SP,
  dispatchProps: DP,
  ownProps: OP,
) => MP;

// The connector function actaully perfoms the wrapping, giving us a connected
// component.
type Connector<-S, -D, OP, WC> = WC => Class<ConnectedComponent<S, D, OP, WC>>;

// Putting it all together.
declare function connect<S, D, OP, SP, DP>(
  mapStateToProps: MapStateToProps<S, OP, DP>,
  mapDispatchToProps: MapDispatchToProps<D, OP, SP>,
): Connector<S, D, OP, React$ComponentType<{|...OP, ...SP, ...DP|}>>;

declare function connect<S, D, OP, SP, DP, MP>(
  mapStateToProps: MapStateToProps<S, OP, DP>,
  mapDispatchToProps: MapDispatchToProps<D, OP, SP>,
  mergeProps: MergeProps<SP, DP, OP, MP>,
): Connector<S, D, OP, React$ComponentType<MP>>;
