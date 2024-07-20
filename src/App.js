import "./App.scss";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  BrowserRouter,
  Routes,
} from "react-router-dom";
import Home from "./pages/Home";
import Detail from "./pages/Detail/Detail";
import Catalog from "./pages/Catalog";
import HomeLayout from "./templates/HomeLayout/HomeLayout";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import SearchPage from "./pages/SearchPage/SearchPage";
// import { createBrowserHistory } from "history";

function App() {
  // const history = createBrowserHistory();
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/:category" element={<Catalog />} />
          <Route path="/:category/:id" element={<Detail />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/search/:type" element={<SearchPage />} />
        </Route>
      </Routes>
      <ScrollToTop />

    </BrowserRouter>
  );
}

export default App;
