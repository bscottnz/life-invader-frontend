import React, { useContext, useState, useEffect } from 'react';

import { ModalContext } from '../../Modals/ModalContext';
import BuyNowModal from '../../Modals/BuyNowModal';
import NoCoinsModal from '../../Modals/NoCoinsModal';

import axios from 'axios';

import coinImage from '../../../images/lifeinvadercoin.png';

const Store = ({ currentUser, setCurrentUser, popup }) => {
  const { setBuyNowModalIsOpen, setNoCoinsModalIsOpen } = useContext(ModalContext);

  // number of joins the current user has
  const [userCoins, setUserCoins] = useState(currentUser.coins ? currentUser.coins : 0);

  useEffect(() => {
    // has been redirected from failed post. display popup explaining why
    if (popup === true && userCoins === 0) {
      setTimeout(() => {
        setNoCoinsModalIsOpen(true);
      }, 0);
    }
  }, []);

  const buyCoins = (numCoins) => {
    setBuyNowModalIsOpen(true);
    axios({
      method: 'put',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/users/shop/${userCoins + numCoins}`,
      // send the amount of coins to update user data with
    })
      .then((res) => {
        setCurrentUser(res.data);
        setUserCoins((prevCoins) => prevCoins + numCoins);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <BuyNowModal />
      <NoCoinsModal />
      <h1 className="main-content-heading">lifeinvader store</h1>
      <div className="store-description">
        <h2>lifeinvader coins</h2>
        <p>
          Purchase lifeinvader coins to make posts and comments. Every post and comment costs 1
          lifeinvader coin.
        </p>
        <p>{`You currently have ${userCoins} lifeinvader coin${userCoins === 1 ? '' : 's'}.`}</p>
        <p className="disclaimer">
          Note: This is not a real store and is just for fun. Clicking Buy now will add the coins to
          your account.
        </p>
      </div>
      <div className="shop-items-container">
        <div className="shop-item">
          <div className="shop-item-card">
            <div className="shop-img-container">
              <img src={coinImage} alt="lifeinvader coin image" />
            </div>
            <div className="coin-amount">10 coins</div>
          </div>
          <div className="shop-item-description">
            <div className="shop-item-price">Only $8.99!</div>
            <button className="btn btn-fill btn-buy" onClick={() => buyCoins(10)}>
              Buy now
            </button>
          </div>
        </div>

        <div className="shop-item">
          <div className="shop-item-card">
            <div className="shop-img-container">
              <img src={coinImage} alt="lifeinvader coin image" />
            </div>
            <div className="coin-amount">50 coins</div>
          </div>
          <div className="shop-item-description">
            <div className="shop-item-price">Only $42.99!</div>
            <button className="btn btn-fill btn-buy" onClick={() => buyCoins(50)}>
              Buy now
            </button>
          </div>
        </div>

        <div className="shop-item">
          <div className="shop-item-card">
            <div className="shop-img-container">
              <img src={coinImage} alt="lifeinvader coin image" />
            </div>
            <div className="coin-amount">250 coins</div>
          </div>
          <div className="shop-item-description">
            <div className="shop-item-price">Only $199.99!</div>
            <button className="btn btn-fill btn-buy" onClick={() => buyCoins(250)}>
              Buy now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Store.defaultProps = {
  popup: false, // when redirecting to shop on failed post, display popup explaining why
};

export default Store;
