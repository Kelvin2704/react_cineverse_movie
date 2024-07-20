import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import tmdpApi from "../../api/tmdbApi";
import ItemCard from "../../templates/HomeLayout/components/ItemSlider/ItemCard";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import apiConfig from "../../api/apiConfig";
import "./SearchPage.scss";
import placeholder from "../../assets/image placeholder.png";
import verticalPlaceholder from "../../assets/image placeholder (vertical).png";
import PageHeader from "../../templates/HomeLayout/components/PageHeader/PageHeader";

const mediaTypes = [
  "movie",
  "tv",
  "person",
  // "collection",
  // "company",
  // "keyword",
  // "network",
];

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(mediaTypes[0]);
  const [totalPages, setTotalPages] = useState(1);

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query");
  const currentPage = parseInt(searchParams.get("page")) || 1;
  console.log("currentpage", currentPage);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);

      try {
        const params = { query, page: currentPage };
        console.log(params);
        const response = await tmdpApi.search(selectedType, params);
        console.log(response);

        if (response && response.results) {
          setResults(response.results);
          setTotalPages(response.total_pages);
        }
      } catch (error) {
        console.log("Failed to fetch search results", error);
      }
      setLoading(false);
    };
    if (query) {
      fetchResults();
    }
  }, [query, currentPage, selectedType]);

  const handleTypeCHange = (selectedType) => {
    navigate(`/search/${selectedType}?query=${encodeURIComponent(query)}`);
  };
  const handlePageChange = (newPage) => {
    navigate(
      `/search/${selectedType}?query=${encodeURIComponent(
        query
      )}&page=${newPage}`
    );
    window.scrollTo(0, 0);
  };
  const capitalizeFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const renderPagination = () => {
    const pages = [];
    console.log(pages);
    const totalPagesToShow = 4;
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    if (currentPage > 2) {
      pages.push(
        <button key={1} onClick={() => handlePageChange(1)}>
          1
        </button>
      );
      if (currentPage > 3) {
        pages.push(<span key="start-ellipsis">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={i === currentPage ? "active" : ""}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) {
        pages.push(<span key="end-ellipsis">...</span>);
      }
      pages.push(
        <button key={totalPages} onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </button>
      );
    }

    return (
      <div className="pagination">
        {currentPage > 1 && (
          <button onClick={() => handlePageChange(currentPage - 1)}>
            &lt;
          </button>
        )}
        {pages}
        {currentPage < totalPages && (
          <button onClick={() => handlePageChange(currentPage + 1)}>
            &gt;
          </button>
        )}
      </div>
    );
  };
  return (
    <>
      <PageHeader>
        <h2>
          Search for: {query} in {selectedType}{" "}
        </h2>
      </PageHeader>
      <div className="search-page">
        <div className="search-page__nav">
          <ul>
            {mediaTypes.map((type) => (
              <li key={type}>
                <button
                  className={type === selectedType ? "active" : ""}
                  onClick={() => {
                    setSelectedType(type);
                    handleTypeCHange(type);
                  }}
                >
                  {capitalizeFirst(type)}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="search-page__results">
          {loading ? (
            <LoadingSpinner />
          ) : (
            results.map((result) => {
              const bg =
                result.poster_path || result.profile_path
                  ? apiConfig.w500Image(
                      result.poster_path || result.profile_path
                    )
                  : verticalPlaceholder;
              return (
                <div className="search-page__item">
                  <ItemCard
                    background={bg}
                    key={result.id}
                    cate={selectedType}
                    item={result}
                    type={result.media_type}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
      {renderPagination()}
    </>
  );
};

export default SearchPage;
