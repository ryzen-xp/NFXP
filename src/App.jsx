import Web3 from "web3"; // Correct import statement
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home/Home";
import Create from "./pages/Create/Create";
import Mynft from "./pages/mynft/Mynft";
import NFXP from "./metadata/NFXP.json";
import Marketplace from "./metadata/Marketplace.json";
import Purchased from "./pages/purchase/purchase";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [nft, setNft] = useState({});
  const [marketplace, setMarket] = useState({});
  const [account, setAccount] = useState(null);

  const connect = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        console.log("Connected account:", accounts[0]);
      } catch (error) {
        console.error("User denied account access", error);
      }
    } else {
      console.error("MetaMask not detected");
    }
  };

  const load = async () => {
    const web3 = new Web3(window.ethereum);
    const nft = new web3.eth.Contract(
      NFXP.abi,
      "0x72Fd3A12d0480a3bBc891d326A14cBea98baF0eD"
    );
    const marketplace = new web3.eth.Contract(
      Marketplace.abi,
      "0x48d9a9d33CDB8F83c7AA53A53250912E5DC053AD"
    );
    setNft(nft);
    setMarket(marketplace);
  };

  useEffect(() => {
    load();
  }, [account]);

  return (
    <BrowserRouter>
      <div className="sticky-navbar">
        <Navbar connect={connect} account={account} />{" "}
        {/* Corrected prop name */}
      </div>
      <div className="apex">
        <Routes>
          <Route
            path="/"
            element={<Home marketplace={marketplace} nft={nft} />}
          />
          <Route
            path="/create"
            element={<Create marketplace={marketplace} nft={nft} />}
          />
          <Route
            path="/my-nft"
            element={
              <Mynft marketplace={marketplace} nft={nft} account={account} />
            }
          />
          <Route
            path="/list"
            element={
              <Purchased
                marketplace={marketplace}
                nft={nft}
                account={account}
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
