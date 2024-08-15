import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Web3 from "web3";
import "./Create.css";

const ApiKey = "e3ca2dc80d92e683085d";
const key = "b93cdddc3fbebe22dbebca62b19a8e97088ea3ed2d693c8abf299fe13313cabe";

const Create = ({ nft, marketplace }) => {
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!nft || !marketplace) {
      console.error("NFT or Marketplace contract not initialized");
    }
  }, [nft, marketplace]);

  const uploadToIPFS = async (e) => {
    const fileImg = e.target.files[0];
    if (fileImg) {
      try {
        const formData = new FormData();
        formData.append("file", fileImg);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: ApiKey,
            pinata_secret_api_key: key,
            "Content-Type": "multipart/form-data",
          },
        });

        const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
        setImage(ImgHash);
        console.log(ImgHash);
      } catch (error) {
        console.error("Error sending file to IPFS:", error);
      }
    }
  };

  const mintThenList = async (res) => {
    if (!nft || !marketplace) {
      console.error("NFT or Marketplace contract not initialized");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const uri = `ipfs://${res.data.IpfsHash}`;

      await nft.methods.mint(uri).send({ from: accounts[0] });
      const id = await nft.methods.tokenCount().call();

      await nft.methods
        .setApprovalForAll(marketplace.options.address, true)
        .send({ from: accounts[0] });

      const listingPrice = Web3.utils.toWei(price, "ether");
      await marketplace.methods
        .makeItem(nft.options.address, id, listingPrice)
        .send({ from: accounts[0] });
      alert("NFT created  and  Listed !!");
    } catch (error) {
      alert("Error minting and listing NFT");
      console.error("Error minting and listing NFT:", error);
    }
  };

  const createNFT = async () => {
    if (!image || !price || !name || !description) return;
    try {
      const result = JSON.stringify({ image, price, name, description });
      const res = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: result,
        headers: {
          pinata_api_key: ApiKey,
          pinata_secret_api_key: key,
          "Content-Type": "application/json",
        },
      });
      mintThenList(res);
    } catch (error) {
      console.log("IPFS URI upload error: ", error);
    }
  };

  return (
    <div className="create-container">
      <div className="create-content">
        <form onSubmit={(e) => e.preventDefault()} className="create-form">
          <div className="form-group">
            <label htmlFor="file">Upload Image</label>
            <input type="file" id="file" required onChange={uploadToIPFS} />
          </div>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              required
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="price">Price (ETH)</label>
            <input
              type="number"
              id="price"
              value={price}
              required
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <button type="button" onClick={createNFT}>
            Create & List NFT!
          </button>
        </form>
      </div>
    </div>
  );
};

Create.propTypes = {
  nft: PropTypes.object.isRequired,
  marketplace: PropTypes.object.isRequired,
};

export default Create;
