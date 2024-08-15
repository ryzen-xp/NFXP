import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import Web3 from "web3";
import axios from "axios";
import { Loading, Account } from "../../components/loading";

export default function Purchased({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);

  const pinataGatewayUrl = (ipfsUrl) => {
    return ipfsUrl.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
  };

  const loadPurchasedItems = useCallback(async () => {
    try {
      if (!account) return;

      const events = await marketplace.getPastEvents("Bought", {
        filter: { buyer: account },
        fromBlock: 0,
        toBlock: "latest",
      });

      const purchases = await Promise.all(
        events.map(async (event) => {
          const item = event.returnValues;

          const uri = await nft.methods.tokenURI(item.tokenId).call();
          const gatewayUri = pinataGatewayUrl(uri);

          const response = await axios.get(gatewayUri);
          const metadata = response.data;

          const totalPrice = await marketplace.methods
            .getTotalPrice(item.itemId)
            .call();

          return {
            totalPrice,
            price: item.price,
            itemId: item.itemId,
            name: metadata.name,
            description: metadata.description,
            image: pinataGatewayUrl(metadata.image),
            nftAddress: item.nft,
            tokenId: item.tokenId,
          };
        })
      );

      setPurchases(purchases);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching purchased items:", error);
      setLoading(false);
    }
  }, [account, marketplace, nft]);

  useEffect(() => {
    if (account) {
      loadPurchasedItems();
    }
  }, [account, loadPurchasedItems]);

  if (!account) {
    return <Account />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="grid">
      {purchases.length > 0 ? (
        purchases.map((item, idx) => (
          <article key={idx}>
            <img src={item.image} alt={item.name} />
            <div className="text">
              <div className="title-price">
                <h3>{item.name}</h3>
                <p className="price">
                  {Web3.utils.fromWei(item.totalPrice, "ether")} ETH
                </p>
              </div>
              <p>{item.description}</p>
            </div>
          </article>
        ))
      ) : (
        <h2>No purchased assets</h2>
      )}
    </main>
  );
}

Purchased.propTypes = {
  nft: PropTypes.object.isRequired,
  marketplace: PropTypes.object.isRequired,
  account: PropTypes.string,
};
