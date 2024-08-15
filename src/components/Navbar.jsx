import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import "./NavBar.css";

const Navbar = ({ connect, account }) => {
  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <img src={logo} alt="logo" />
        </div>
        <ul className="navbar-links">
          <li>
            <Link to="/">HOME</Link>
          </li>
          <li>
            <Link to="/create">CREATE NFT</Link>
          </li>
          <li>
            <Link to="/list">PURCHASES</Link>
          </li>
          <li>
            <Link to="/my-nft">MY NFT</Link>
          </li>
          <li>
            <button className="navbar-button" onClick={connect}>
              {account
                ? `${account.slice(0, 3)}...${account.slice(
                    account.length - 4
                  )}`
                : "Connect"}
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

Navbar.propTypes = {
  connect: PropTypes.func.isRequired,
  account: PropTypes.string,
};

export default Navbar;
