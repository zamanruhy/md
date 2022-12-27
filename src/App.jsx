import './styles/base.css'
import './styles/components.css'

import { Route, Routes } from '@solidjs/router'
import { Layout } from './components/Layout'
import Home from './pages/Home'

import './styles/utilities.css'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path={'/'} element={<Home />} />
      </Routes>
    </Layout>
  )
}
