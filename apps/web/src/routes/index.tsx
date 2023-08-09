import { createRoutesFromElements, Route } from 'react-router-dom'

import Home from './home'
import About from './about'
import NotFound from './not-found'

export const routes = createRoutesFromElements(
  <Route path="/">
    <Route index element={<Home />} />
    <Route path="about" element={<About />} />
    <Route path="*" element={<NotFound />} />
  </Route>
)

export default routes
