import './App.css'
import Header from './components/Header';
import {
  HashRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import SellNft from './components/SellNft';
import Home from './components/Home';
import { useQuery } from '@apollo/client';
import GET_ACTIVE_ITEMS from "./constants/subgraphQueries.js"
function App() {
  const { loading, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS);
  return (
    <>
      <Router>
        <div style={{
          backgroundImage: "url(" + require("./img/nftbgimage.jpg") + ")",
          backgroundRepeat: "repeat", minWidth: "100vw", minHeight: "100vh",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          overflowX: "scroll"
        }}>
          <Header />
          <Routes>
            <Route exact path="/" element={<Home loading={loading} listedNfts={listedNfts} />}></Route>
            <Route exact path="/sell-nft" element={<SellNft />}></Route>
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
