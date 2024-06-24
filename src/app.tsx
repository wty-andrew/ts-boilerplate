import { MantineProvider } from '@mantine/core'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import routes from './routes'
import theme from './theme'

const router = createBrowserRouter(routes)

const App = () => (
  <MantineProvider theme={theme}>
    <RouterProvider router={router} />
  </MantineProvider>
)

export default App
