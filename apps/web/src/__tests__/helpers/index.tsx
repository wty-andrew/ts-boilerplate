import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, RenderResult } from '@testing-library/react'

export const renderWithRouter = (
  ui: Parameters<typeof render>[0],
  route = '/'
): RenderResult => {
  return render(ui, {
    wrapper: (props) => <MemoryRouter {...props} initialEntries={[route]} />,
  })
}
