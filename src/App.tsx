import { BrowserRouter, Route, Switch } from "react-router-dom";
import Headers from "./components/Headers";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {
  return (
    <BrowserRouter>
      <Headers />
      <Switch>
        <Route path="/">
          <Home />
        </Route>
        <Route path="/tv">
          <Tv />
        </Route>
        <Route path="/search">
          <Search />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

export default App;