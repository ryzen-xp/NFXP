import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Web3 from "web3";
import { Loading, Account } from "../../components/loading";

export default function Mynft({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);

  const pinataGatewayUrl = (ipfsUrl) => {
    return ipfsUrl.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
  };

  const mynft = useCallback(async () => {
    try {
      const itemCount = await marketplace.methods.itemCount().call();
      let listed = [];

      for (let i = 1; i <= itemCount; i++) {
        const item = await marketplace.methods.items(i).call();
        if (item.seller.toLowerCase() === account.toLowerCase()) {
          const uri = await nft.methods.tokenURI(item.tokenId).call();
          const gatewayUri = pinataGatewayUrl(uri);

          const response = await axios.get(gatewayUri);

          const totalPrice = await marketplace.methods
            .getTotalPrice(item.itemId)
            .call();
          const nftData = {
            totalPrice,
            sold: item.sold,
            itemId: item.itemId,
            tokenId: item.tokenId,
            seller: item.seller,
            name: response.data.name,
            description: response.data.description,
            image: pinataGatewayUrl(response.data.image),
          };

          listed.push(nftData);
        }
      }

      setList(listed);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching NFT data:", error);
      setLoading(false);
    }
  }, [marketplace, nft, account]);

  useEffect(() => {
    if (account) {
      mynft();
    }
  }, [mynft, account]);

  if (!account) {
    return <Account />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="grid">
      {list.length > 0 ? (
        list.map((item, idx) => (
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
              <h3>{item.sold ? "Sold" : "Unsold"}</h3>
            </div>
          </article>
        ))
      ) : (
        <h2>No listed assets</h2>
      )}
    </main>
  );
}

Mynft.propTypes = {
  nft: PropTypes.object.isRequired,
  marketplace: PropTypes.object.isRequired,
  account: PropTypes.string.isRequired,
};
