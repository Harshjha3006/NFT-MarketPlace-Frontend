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
        <Header />
        <Routes>
          <Route exact path="/" element={<Home loading={loading} listedNfts={listedNfts} />}></Route>
          <Route exact path="/sell-nft" element={<SellNft />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
