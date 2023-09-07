import { createRoutesFromElements, Route } from 'react-router-dom'

import Layout from '../layout'
import Home from './home'
import Settings from './settings'

const routes = createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="settings" element={<Settings />} />
  </Route>
)

export default routes
