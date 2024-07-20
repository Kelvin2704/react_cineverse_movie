import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
// import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
//css
import "./MovieSlider.scss";
import playbutton from "../../../../assets/playbutton.svg";
import trailerbutton from "../../../../assets/trailerbutton.svg";
import "../../../../components/button/Button";
import tmdpApi, { category, movieType } from "../../../../api/tmdbApi";
import apiConfig from "../../../../api/apiConfig";
import { useNavigate, Link } from "react-router-dom";
import Button, { OutlineButton } from "../../../../components/button/Button";
import TrailerModal from "../TrailerModal/TrailerModal";

const MovieSlider = () => {
  const [movies, setMovies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMovie, setActiveMovie] = useState(null);

  const handleOpenModal = (movie) => {
    setActiveMovie(movie);
    setIsModalOpen(true);
  };
  const handleCloseModal = (movie) => {
    setIsModalOpen(false);
    setTimeout(() => {
      setActiveMovie(movie);
    }, 300);
  };
  useEffect(() => {
    const getMovies = async () => {
      const params = { page: 1 };
      try {
        const response = await tmdpApi.getMovieList(movieType.popular, {
          params,
        });
        setMovies(response.results.slice(0, 5));
        console.log(response);
      } catch {
        console.log("error");
      }
    };
    getMovies();
  }, []);

  return (
    <div className="movie-slider">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ dynamicBullets: true, clickable: true }}
        speed={2000}
        centeredSlides={true}
        loop={true}
        modules={[Pagination, Autoplay]}
        onSlideChange={() => handleCloseModal()}
      >
        {movies.map((movie, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              <MovieSliderItem
                cate={category.movie}
                movie={movie}
                className={`${isActive ? "active" : ""}`}
                onOpenModal={() => handleOpenModal(movie)}
                isModalOpen={isModalOpen && activeMovie === movie}
                onCloseModal={()=>handleCloseModal(movie)}
              />
            )}
          </SwiperSlide>
        ))}
        
      </Swiper>
    </div>
  );
};

const MovieSliderItem = ({
  className,
  cate,
  movie,
  onOpenModal,
  isModalOpen,
  onCloseModal,
}) => {
  const navigate = useNavigate();
  const background = apiConfig.originalImage(
    movie.backdrop_path ? movie.backdrop_path : movie.poster_path
  );

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };



  return (
    <div
      className={`movie-slide_item ${className}`}
      style={{
        backgroundImage: `url(${background})`,
        transition: "transform 2s ease-in-out",
      }}
    >
      <div className="movie-slide_item_content container">
        <div className="movie-slide_item_content_info">
          <h2 className="title">{movie.title}</h2>
          <div className="overview">
            {truncateText(movie.overview, 150)} <br />
            <Link style={{ opacity: "0.5" }} to={"/movie/" + movie.id}>
              More details
            </Link>{" "}
          </div>
          <div className="btns">
            <Button onClick={() => navigate("/movie/" + movie.id)}>
              <span>
                <img src={playbutton} alt="" />
              </span>
              Watch now{" "}
            </Button>
            <OutlineButton onClick={onOpenModal}>
              <span>
                <img src={trailerbutton} alt="" />
              </span>
              Trailer
            </OutlineButton>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <TrailerModal cate={cate} id={movie.id} onClose={onCloseModal} />
      )}
    </div>
  );
};

export default MovieSlider;
