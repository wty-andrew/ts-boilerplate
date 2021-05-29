import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, RenderResult } from '@testing-library/react'

export const renderWithRouter = (
  ui: Parameters<typeof render>[0],
  route = '/'
): RenderResult => {
  return render(ui, {
    // eslint-disable-next-line react/display-name
    wrapper: (props) => <MemoryRouter {...props} initialEntries={[route]} />,
  })
}
