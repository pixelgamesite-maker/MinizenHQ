import { Switch, Route } from 'wouter';
import Home from './pages/Home';

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route>
        {() => { window.location.href = '/'; return null; }}
      </Route>
    </Switch>
  );
}

export default App;
