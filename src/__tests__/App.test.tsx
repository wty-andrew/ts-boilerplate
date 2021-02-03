import * as React from 'react'
import { render } from '@testing-library/react'

import App from '../App'

describe('<App />', () => {
  it('renders correctly', () => {
    const { getByText, asFragment } = render(<App />)
    expect(getByText('Hello World')).toBeInTheDocument()
    expect(asFragment()).toMatchSnapshot()
  })
})
