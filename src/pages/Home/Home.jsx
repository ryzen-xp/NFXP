import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import Web3 from "web3";
import axios from "axios";
import { Loading } from "../../components/loading";

import "./Home.css";

const Home = ({ marketplace, nft }) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const web3 = new Web3(window.ethereum);

  const pinataGatewayUrl = (ipfsUrl) => {
    return ipfsUrl.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
  };

  const loadMarketplaceItems = useCallback(async () => {
    try {
      const itemCount = await marketplace.methods.itemCount().call();

      let items = [];
      for (let i = 1; i <= itemCount; i++) {
        const item = await marketplace.methods.items(i).call();

        if (!item.sold) {
          const uri = await nft.methods.tokenURI(item.tokenId).call();
          const gatewayUri = pinataGatewayUrl(uri);
          // console.log("URI:", gatewayUri);

          const response = await axios.get(gatewayUri);
          // console.log("Metadata:", response.data);

          const totalPrice = await marketplace.methods
            .getTotalPrice(item.itemId)
            .call();

          items.push({
            totalPrice,
            itemId: item.itemId,
            tokenId: item.tokenId,
            seller: item.seller,
            name: response.data.name,
            description: response.data.description,
            image: pinataGatewayUrl(response.data.image),
          });
        }
      }
      setLoading(false);
      setItems(items);
    } catch (error) {
      console.error("Error loading marketplace items:", error);
      setLoading(false);
    }
  }, [marketplace, nft]);

  const buyMarketItem = async (item) => {
    try {
      const accounts = await web3.eth.getAccounts();
      const priceInWei = item.totalPrice;

      await marketplace.methods.purchaseItem(item.itemId).send({
        from: accounts[0],
        value: priceInWei,
      });
      loadMarketplaceItems();
      alert("Purchased Code: OK");
    } catch (error) {
      console.error("Error purchasing market item:", error);
    }
  };

  useEffect(() => {
    loadMarketplaceItems();
  }, [loadMarketplaceItems]);

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="grid">
      {items.length > 0 ? (
        items.map((item, idx) => (
          <article key={idx}>
            <img src={item.image} alt={item.name} />
            <div className="text">
              <div className="title-price">
                <h3>{item.name}</h3>
                <p className="price">
                  {web3.utils.fromWei(item.totalPrice, "ether")} ETH
                </p>
              </div>
              <p>{item.description}</p>

              <button onClick={() => buyMarketItem(item)}>BUY</button>
            </div>
          </article>
        ))
      ) : (
        <Loading />
      )}
    </main>
  );
};

Home.propTypes = {
  nft: PropTypes.object.isRequired,
  marketplace: PropTypes.object.isRequired,
};

export default Home;
