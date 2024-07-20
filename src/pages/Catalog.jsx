import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import tmdpApi, { category as cate, movieType, tvType } from "../api/tmdbApi";
import apiConfig from "../api/apiConfig";

import PageHeader from "../templates/HomeLayout/components/PageHeader/PageHeader";
import ItemCard from "../templates/HomeLayout/components/ItemSlider/ItemCard";

import "../scss/categoryGrid.scss";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

const Catalog = () => {
  const { category } = useParams();
  // const location = useLocation();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchItems = async (currentPage, reset = false) => {
    setLoading(true);
    try {
      const params = { page: currentPage };
      console.log(params);
      const response = await tmdpApi.getMovieTv(
        category,
        category === cate.movie ? movieType.popular : tvType.popular,
        { params }
      ); // const searchParams = new URLSearchParams(location.search);
      // const query = searchParams.get("query");

      // if (query) {
      //   response = await tmdpApi.searchMulti(query, params);
      //   console.log("response", response);
      // } else if (category) {
      //   response = await tmdpApi.getMovieTv(
      //     category,
      //     category === cate.movie ? movieType.popular : tvType.popular,
      //     { params }
      //   );
      // }

      if (response && response.results) {
        setItems((prevItems) => {
          const newItems = reset
            ? response.results
            : [...prevItems, ...response.results];
          // Ensure no duplicates by using a Set to filter unique items:
          // newItems.map((item) => item.id)) creates an array of item IDs from the combined newItems array.
          // new Set is a collection of unique values, so this removes any duplicate IDs
          //Array.from() converts the Set back into an array of unique IDs.
          const uniqueItems = Array.from(
            new Set(newItems.map((item) => item.id))
          ).map((id) => newItems.find((item) => item.id === id));
          return uniqueItems;
        });
        setHasMore(response.page < response.total_pages);

        console.log("hasmore", hasMore);
      }
    } catch (error) {
      console.log("Failed to fetch items", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Reset items and page when category changes
    setItems([]);
    setPage(1);
    setHasMore(true);
    fetchItems(1, true);
  }, [category]);

  useEffect(() => {
    console.log("page", page);
    if (page > 1) {
      fetchItems(page);
    }
  }, [page]);

  useEffect(() => {
    const debounce = (func, wait) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    };
    const handleScroll = debounce(() => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 500 &&
        !loading &&
        hasMore
      ) {
        setPage((prevPage) => {
          console.log("prevPage", prevPage);
          return prevPage + 1;
        });
      }
    }, 300);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, hasMore]);

  return (
    <>
      <PageHeader>
        <h2>
          {category === cate.movie ? "Popular Movies" : "Popular TV Shows"}
        </h2>
      </PageHeader>
      <div className="container category-grid">
        {items.map((item, index) => {
          const bg = apiConfig.w500Image(item.backdrop_path);
          return (
            <ItemCard
              background={bg}
              key={item.id}
              cate={category}
              item={item}
            />
          );
        })}
      </div>
      {loading && <LoadingSpinner />}
    </>
  );
};

export default Catalog;
