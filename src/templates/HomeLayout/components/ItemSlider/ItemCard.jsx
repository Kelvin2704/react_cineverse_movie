import React from "react";
import playbutton from "../../../../assets/playbutton.svg";
import { Link } from "react-router-dom";

const ItemCard = ({ type, cate, item, background }) => {
  const link = `/${cate}/${item.id}`;
  return (
    <div className="slide-item_card">
      <div className="slide-item-img">
        <img
          className="background-img"
          loading="lazy"
          src={background}
          alt=""
        />
        <Link to={link} className="overlay">
          <div>
            <img src={playbutton} alt="Play" className="play-button" />
          </div>
        </Link>
      </div>

      <h3>
        {!item.title ? item.name : item.title} {type ? `in ${type} ` : ""}
      </h3>
    </div>
  );
};

export default ItemCard;
