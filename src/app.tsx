import { Deck, DefaultTemplate, Heading, Slide } from 'spectacle'

import theme from './theme'

const App = () => (
  <Deck theme={theme} template={<DefaultTemplate />}>
    <Slide>
      <Heading>Hello World</Heading>
    </Slide>
  </Deck>
)

export default App
