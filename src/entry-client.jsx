import { render, Portal } from 'solid-js/web'
// import { MetaProvider } from 'solid-meta'
import { Router } from '@solidjs/router'
import App from './App'
import { Meta } from './components/Layout'

if (import.meta.env.DEV) {
  render(
    () => (
      <Router>
        {/* <MetaProvider> */}
        <App />
        {/* </MetaProvider> */}
        <Portal mount={document.head}>
          <Meta />
        </Portal>
      </Router>
    ),
    document.getElementById('app')
  )
}
