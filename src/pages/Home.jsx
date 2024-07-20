import React, { useEffect, useRef, useState } from "react";
import MovieSlider from "../templates/HomeLayout/components/MovieSlider/MovieSlider";
import ItemSlider from "../templates/HomeLayout/components/ItemSlider/ItemSlider";
import tmdpApi, { category, movieType, tvType } from "../api/tmdbApi";
import useLazyLoad from "../hooks/useOnScreen";

const Home = () => {
  const [vertical, setVertical] = useState(true);
  const [popularRef, isPopularVisible] = useLazyLoad();
  const [topRatedTvRef, isTopRatedTvVisible] = useLazyLoad();
  const [upcomingRef, isUpcomingVisible] = useLazyLoad();
  const [topRatedMoviesRef, isTopRatedMoviesVisible] = useLazyLoad();
  return (
    <>
      <div id="top-slider" className="home_top-slider">
        <MovieSlider />
      </div>
      <div className="home_category-slider container">
        <section id="popularMovies" ref={popularRef}>
          <ItemSlider
            isVisbleEl={isPopularVisible}
            title={"Popular Movies"}
            slidesPerView={3.5}
            cate={category.movie}
            type={movieType.popular}
          />
        </section>
        <section ref={topRatedTvRef} id="topRatedTv">
          <ItemSlider
            isVisbleEl={isTopRatedTvVisible}
            slidesPerView={5.5}
            displayType={vertical}
            title={"Top Rated TV shows"}
            cate={category.tv}
            type={tvType.top_rated}
          />
        </section>
        <section id="upcommingMovies" ref={upcomingRef}>
          <ItemSlider
            isVisbleEl={isUpcomingVisible}
            slidesPerView={5.5}
            title={"Upcoming Movies"}
            cate={category.movie}
            type={movieType.upcoming}
          />
        </section>
        <section id="topRatedMovies" ref={topRatedMoviesRef}>
          <ItemSlider
            isVisbleEl={isTopRatedMoviesVisible}
            displayType={vertical}
            slidesPerView={5.5}
            title={"Top Rated Movies"}
            cate={category.movie}
            type={movieType.top_rated}
          />
        </section>
      </div>
    </>
  );
};

export default Home;
