import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ListAll from "./ListAll";
import Create from "./create_nft";
import Shop from "./shop";
import Nft from "./myNFT";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/list" element={<ListAll />} />
          <Route exact path="/" element={<Shop />} />
          <Route exact path="/create" element={<Create />} />
          <Route exact path="/myNFT" element={<Nft />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
