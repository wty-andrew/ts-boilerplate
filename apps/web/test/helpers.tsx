import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { render } from '@testing-library/react'

import routes from '../src/routes'

export const renderRoute = (route: string) => {
  const router = createMemoryRouter(routes, { initialEntries: [route] })
  return render(<RouterProvider router={router} />)
}
