import { Switch, Route, useLocation } from 'wouter';
import Layout from './components/Layout';
import Home from './pages/Home';
import FAQ from './pages/FAQ';
import About from './pages/About';

function App() {
  const [location] = useLocation();

  return (
    <Layout currentPath={location}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/faq" component={FAQ} />
        <Route path="/about" component={About} />
        <Route>
          {() => { window.location.href = '/'; return null; }}
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
