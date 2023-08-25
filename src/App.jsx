import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ListAll from "./ListAll";
import Create from "./create_nft"
import Shop from "./shop"

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/list" element={<ListAll />} />
          <Route exact path="/" element={<Shop />} />
          <Route exact path="/create" element={<Create />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
