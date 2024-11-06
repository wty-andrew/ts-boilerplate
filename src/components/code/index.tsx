import { type HighlightedCode, Pre } from 'codehike/code'

const Code = ({ codeblock }: { codeblock: HighlightedCode }) => (
  <Pre code={codeblock} />
)

export default Code
