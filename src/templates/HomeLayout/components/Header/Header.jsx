import React, { useEffect, useRef, useState } from "react";
import "./header.scss";

import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import searchbutton from "../../../../assets/searchbutton.svg";
import tmdpApi from "../../../../api/tmdbApi";
import apiConfig from "../../../../api/apiConfig";
import ItemCard from "../ItemSlider/ItemCard";

import placeholder from "../../../../assets/image placeholder.png";

const headerNav = [
  { display: "Home", path: "/" },
  { display: "Movies", path: "/movie" },
  { display: "TV Series", path: "/tv" },
];

const Header = () => {
  const [isHidden, setIsHidden] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { pathname } = useLocation();
  const headerRef = useRef(null);
  const active = headerNav.findIndex((item) => item.path === pathname);
  const navigate = useNavigate();

  useEffect(() => {
    let lastScrollTop = 0;
    const handleScroll = () => {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      // console.log(scrollTop);
      if (scrollTop > lastScrollTop) {
        // Scroll down
        setIsHidden(true);
      } else {
        // Scroll up
        setIsHidden(false);
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isOverlayVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOverlayVisible]);

  useEffect(() => {
    setIsOverlayVisible(false);
    setSearchQuery("");
    setSearchResults([]);
  }, [pathname]);

  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    console.log("searchQuery", event.target.value);

    if (query.trim()) {
      try {
        const response = await tmdpApi.searchMulti(query);
        setSearchResults(response.results.slice(0, 5));
        // console.log("Search results:", response.results);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    // console.log("Searching for:", searchQuery.trim());

    if (searchQuery.trim()) {
      setIsOverlayVisible(false);
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearchSubmit(event);
    }
  };

  const handleSearchButtonClick = () => {
    setIsOverlayVisible(!isOverlayVisible);
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleOverlayClose = () => {
    setIsOverlayVisible(false);
    setSearchResults([]);
    setSearchQuery("");
  };
  return (
    <>
      <header ref={headerRef} className={`header ${isHidden ? "hidden" : ""}`}>
        <div className="header__wrap container">
          <div className="logo">
            {/* <img src={logo} alt="" /> */}
            <Link to="/">CineVerse</Link>
          </div>
          <ul className="header__nav">
            {headerNav.map((item, index) => (
              <li
                key={index}
                className={`${index === active ? "active" : " "}`}
              >
                <NavLink exact={item.path === "/"} to={item.path}>
                  {item.display}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="header__search">
            <button onClick={handleSearchButtonClick}>
              <img src={searchbutton} alt="" />
            </button>
          </div>
        </div>
      </header>

      <div className={`search-overlay ${isOverlayVisible ? "visible" : ""}`}>
        <div className="search-overlay__content">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              placeholder="Search for a movie, tv show..."
            />
            <button
              className="search-overlay__close"
              onClick={handleOverlayClose}
            >
              X
            </button>
            {/* <button type="submit">Search</button> */}
          </form>
        </div>

        {/* Render Search Results */}
        <div className="search-results">
          {searchResults.length > 0 && (
            <div className="search-items">
              {searchResults.map((result) => {
                const bg = result.backdrop_path
                  ? apiConfig.w500Image(result.backdrop_path)
                  : placeholder;
                return (
                  <ItemCard
                    background={bg}
                    key={result.id}
                    cate={result.media_type}
                    item={result}
                    type={result.media_type}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
