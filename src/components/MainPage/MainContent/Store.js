import React, { useContext } from 'react';

import { ModalContext } from '../../Modals/ModalContext';
import BuyNowModal from '../../Modals/BuyNowModal';

import coinImage from '../../../images/lifeinvadercoin.png';

const Store = () => {
  const { setBuyNowModalIsOpen } = useContext(ModalContext);

  const buyCoins = () => {
    setBuyNowModalIsOpen(true);
  };
  return (
    <div>
      <BuyNowModal />
      <h1 className="main-content-heading">lifeinvader store</h1>
      <div className="store-description">
        <h2>lifeinvader coins</h2>
        <p>
          Purchase lifeinvader coins to make posts and comments. Every post and comment costs 1
          lifeinvader coin.
        </p>
        <p>You currently have 10 lifeinvader coins.</p>
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
            <button className="btn btn-fill btn-buy" onClick={buyCoins}>
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
            <button className="btn btn-fill btn-buy" onClick={buyCoins}>
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
            <button className="btn btn-fill btn-buy" onClick={buyCoins}>
              Buy now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;
