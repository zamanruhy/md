import Footer from './Footer'
import Header from './Header'

export function Layout(props) {
  return (
    <>
      <Header />
      <main class="app__main">{props.children}</main>
      <Footer />
    </>
  )
}

export function Meta() {
  return (
    <>
      <MetaSocial />
    </>
  )
}

export function MetaSocial() {
  return (
    <>
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Site title" />
      <meta property="og:description" content="Site description" />
      <meta
        property="og:image"
        content="http://via.placeholder.com/1200x630.jpg"
      />
      <meta property="og:url" content="" />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  )
}
