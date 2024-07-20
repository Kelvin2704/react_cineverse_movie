import React, { useEffect, useState } from "react";
import useOnScreen from "../../../../hooks/useOnScreen";
import "./ItemSlider.scss";
import tmdpApi from "../../../../api/tmdbApi";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FreeMode, Pagination, Navigation } from "swiper/modules";

import "./ItemSlider.scss";

import apiConfig from "../../../../api/apiConfig";
import ItemCard from "./ItemCard";

const ItemSlider = ({
  isVisbleEl,
  slidesPerView,
  displayType,
  title,
  cate,
  type,
}) => {
  const [itemSlider, setItemSlider] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    // if (isIntersecting && itemSlider.length === 0) {
    if (isVisbleEl && !isDataFetched) {
      const getItem = async () => {
        const params = { page: 1 };
        try {
          const response = await tmdpApi.getMovieTv(cate, type, {
            params,
          });
          setItemSlider(response.results.slice(0, 10));
          setIsDataFetched(true)
          console.log(response);
        } catch {
          console.log("error");
        }
      };
      getItem();
    }
    // }
    // console.log(itemSlider);
  }, [isVisbleEl, cate, type, isDataFetched]);
  return (
    <div id="item-slider" className={`item-slider ${isDataFetched ? "animate" : ""}`}>
      <div className="vertical-slider">
        <div className="title">
          <h2>{title}</h2>
          <a href="">See All </a>
        </div>
        <Swiper
          slidesPerView={5}
          spaceBetween={10}
          freeMode={true}
          freeModeMomentum={true}
          freeModeSticky={true}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          breakpoints={{
            320: {
              slidesPerView: displayType ? 2.5 : 1.5,
              spaceBetween: 10,
            },
            576: {
              slidesPerView: displayType ? 3.5 : 2.5,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: displayType ? slidesPerView : slidesPerView,
              spaceBetween: 10,
            },
          }}
          modules={[Pagination, FreeMode, Navigation]}
        >
          {itemSlider.map((item, index) => {
            const background = apiConfig.originalImage(
              displayType ? item.poster_path : item.backdrop_path
            );
            return (
              <SwiperSlide key={index}>
                <ItemCard background={background} cate={cate} item={item}/>
              </SwiperSlide>
            );
          })}

          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
        </Swiper>
      </div>
    </div>
  );
};

export default ItemSlider;
