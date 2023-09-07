import { render, screen } from '@testing-library/react'

import App from './app'

vi.mock('./routes/home/index.js', () => ({
  default: () => <div>Hello World</div>,
}))

describe('App', () => {
  it('renders correctly', () => {
    render(<App />)

    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })
})
