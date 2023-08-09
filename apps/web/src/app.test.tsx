import { vi } from 'vitest'
import { render } from '@testing-library/react'

import { renderRoute } from '../test/helpers'
import App from './app'

/* eslint-disable react/display-name */
vi.mock('./routes/home', () => ({
  default: () => <div>Home Page</div>,
}))
vi.mock('./routes/about', () => ({
  default: () => <div>About Page</div>,
}))
vi.mock('./routes/not-found', () => ({
  default: () => <div>Not Found</div>,
}))

describe('<App />', () => {
  it('renders Home page on /', () => {
    const { getByText } = render(<App />)
    expect(getByText(/home page/i)).toBeInTheDocument()
  })

  it('renders About page on /about', () => {
    const { getByText } = renderRoute('/about')
    expect(getByText(/about page/i)).toBeInTheDocument()
  })

  it('renders NotFound page when landing on a bad route', () => {
    const { getByText } = renderRoute('/non-exist-route')
    expect(getByText(/not found/i)).toBeInTheDocument()
  })
})
