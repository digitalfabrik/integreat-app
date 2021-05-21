import * as React from 'react'

const Link = (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>NoLinkHere...</div>

Link.displayName = 'Connect(Link)'
export default Link
