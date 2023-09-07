import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'

import theme from './theme'
import routes from './routes'

const router = createBrowserRouter(routes)

const App = () => (
  <MantineProvider theme={theme}>
    <RouterProvider router={router} />
  </MantineProvider>
)

export default App
