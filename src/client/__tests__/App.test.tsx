import React from 'react'
import { renderWithRouter } from './helpers'

import App from '../App'

/* eslint-disable react/display-name */
jest.mock('../pages/Home', () => {
  return () => <div>Home Page</div>
})
jest.mock('../pages/About', () => {
  return () => <div>About Page</div>
})
jest.mock('../pages/NotFound', () => {
  return () => <div>404 Not Found</div>
})

describe('<App />', () => {
  it('renders Home page on /', () => {
    const { getByText } = renderWithRouter(<App />)
    expect(getByText(/home page/i)).toBeInTheDocument()
  })

  it('renders About page on /about', () => {
    const { getByText } = renderWithRouter(<App />, '/about')
    expect(getByText(/about page/i)).toBeInTheDocument()
  })

  it('renders NotFound page when landing on a bad route', () => {
    const { getByText } = renderWithRouter(<App />, '/non-exist-route')
    expect(getByText(/404 not found/i)).toBeInTheDocument()
  })
})
