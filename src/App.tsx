import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Achievements from './components/Achievements';
import Services from './components/Services';
import Expertise from './components/Expertise';
import Strengths from './components/Strengths';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Admin from './pages/Admin';
import {
  AutomotiveSemiconductorPage,
  ColletChuckPage,
  CompanyPage,
  MctCncPage,
  PrecisionMachiningPage,
} from './pages/SeoPages';

function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Achievements />
      <Services />
      <Expertise />
      <Strengths />
      <Contact />
    </>
  );
}

function App() {
  const normalizedPath = window.location.pathname.replace(/\/$/, '') || '/';

  if (normalizedPath === '/admin') {
    return <Admin />;
  }

  const pageMap: Record<string, JSX.Element> = {
    '/': <HomePage />,
    '/company': <CompanyPage />,
    '/precision-machining': <PrecisionMachiningPage />,
    '/mct-cnc': <MctCncPage />,
    '/collet-chuck': <ColletChuckPage />,
    '/automotive-semiconductor': <AutomotiveSemiconductorPage />,
  };

  const currentPage = pageMap[normalizedPath] || <HomePage />;

  return (
    <>
      <Header />
      {currentPage}
      <Footer />
    </>
  );
}

export default App;
