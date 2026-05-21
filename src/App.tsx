import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Expertise from './components/Expertise'
import Strengths from './components/Strengths'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Admin from './pages/Admin'

function App() {
  const isAdminPage = window.location.pathname === '/admin'

  if (isAdminPage) {
    return <Admin />
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <Hero />
        <About />
        <Services />
        <Expertise />
        <Strengths />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}

export default App
