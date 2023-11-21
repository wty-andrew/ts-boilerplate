import { Deck, Slide, Heading, DefaultTemplate } from 'spectacle'

import theme from './theme'

const App = () => (
  <Deck theme={theme} template={<DefaultTemplate />}>
    <Slide>
      <Heading>Hello World</Heading>
    </Slide>
  </Deck>
)

export default App
