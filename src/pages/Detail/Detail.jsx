import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import tmdpApi, { category as cate } from "../../api/tmdbApi";
import apiConfig from "../../api/apiConfig";
import "./Detail.scss";
import { Swiper, SwiperSlide } from "swiper/react";

import { FreeMode, Navigation, Pagination } from "swiper/modules";
import ItemCard from "../../templates/HomeLayout/components/ItemSlider/ItemCard";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const Detail = () => {
  const { category, id } = useParams();
  const [item, setItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cast, setCast] = useState([]);
  const [posters, setPosters] = useState([]);

  useEffect(() => {
    const getDetail = async () => {
      try {
        const response = await tmdpApi.detail(category, id, { params: {} });
        setItem(response);
        console.log(response);
        window.scrollTo(0, 0);

        // Fetch related items
        if (response.genres && response.genres.length > 0) {
          const genreId = response.genres[0].id;
          console.log(genreId);
          const relatedResponse = await tmdpApi.discover(category, {
            params: {
              with_genres: genreId,
              page: 1,
            },
          });
          console.log("Related Response", relatedItems);
          if (relatedResponse && relatedResponse.results) {
            const filteredRelatedItems = relatedResponse.results.filter(
              (relatedItem) => relatedItem.id !== parseInt(id, 10)
            );
            setRelatedItems(filteredRelatedItems.slice(0, 10));
          } else {
            console.error("Related Response error");
          }
        }
        //fetch casts
        const creditsResponse = await tmdpApi.credits(category, id);
        console.log(creditsResponse);
        setCast(creditsResponse.cast.slice(0, 4)); // Get first 4 cast members
        //fetch images
        const imagesResponse = await tmdpApi.getImages(category, id);
        setPosters(imagesResponse.backdrops.slice(0, 5));
        console.log(imagesResponse);
      } catch (error) {
        console.error("Failed to fetch item details or related items", error);
      } finally {
        setLoading(false);
      }
    };
    getDetail();
  }, [category, id]);

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <>
      {item ? (
        <div className="detail-page">
          <div
            className="detail-header"
            style={{
              backgroundImage: `url(${apiConfig.originalImage(
                item.backdrop_path || item.poster_path
              )})`,
            }}
          >
            <div className="overlay"></div>
            <div className="detail-grid container">
              <div className="detail-header-content">
                <h1 className="detail-title">{item.title || item.name}</h1>
                <div className="detail-info">
                  <span className="rating">
                    {Math.floor(item.vote_average)}{" "}
                    <i className="fas fa-star"></i>
                  </span>
                  <span className="duration">
                    {item.runtime || item.episode_run_time[0]} min
                  </span>
                  <span className="genres">
                    {item.genres.map((genre) => genre.name).join(", ")}
                  </span>
                  <span className="release-year">
                    {item.release_date
                      ? item.release_date.split("-")[0]
                      : item.first_air_date.split("-")[0]}
                  </span>
                </div>
                <p className="detail-overview">
                  {truncateText(item.overview, 200)}
                </p>
                <div className="detail-actions">
                  <button className="play-button">PLAY NOW</button>
                  <button className="trailer-button">TRAILER</button>
                </div>
              </div>
              <div className="detail-content">
                <div className="posters">
                  <h2>Posters</h2>
                  <div className="posters-list">
                    {posters.map((poster) => (
                      <img
                        key={poster.file_path}
                        src={apiConfig.w500Image(poster.file_path)}
                        alt="Poster"
                      />
                    ))}
                  </div>
                </div>
                <div className="cast-crew">
                  <h2>Actors</h2>
                  <div className="cast-list">
                    {cast.map((member) => (
                      <div key={member.id} className="cast-member">
                        <img
                          src={apiConfig.w500Image(member.profile_path)}
                          alt={member.name}
                        />
                        <p>{member.name}</p>
                      </div>
                    ))}
                    <button className="view-all-button">VIEW ALL</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
      <div className="related-items container">
        <h2>Related {category === cate.movie ? "Movies" : "TV Shows"}</h2>
        <div className="">
          {relatedItems.length > 0 ? (
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
                  slidesPerView: 4,
                  spaceBetween: 10,
                },
                576: {
                  slidesPerView: 6,
                  spaceBetween: 10,
                },
                768: {
                  slidesPerView: 8,
                  spaceBetween: 10,
                },
              }}
              modules={[Pagination, FreeMode, Navigation]}
              className="related-swiper"
            >
              {relatedItems.map((relatedItem) => (
                <SwiperSlide key={relatedItem.id}>
                  <ItemCard
                    cate={category}
                    item={relatedItem}
                    background={apiConfig.originalImage(
                      relatedItem.poster_path
                    )}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p>No related items found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Detail;
