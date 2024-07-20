import axiosClient from "./axiosClient";

export const category = {
  movie: "movie",
  tv: "tv",
};

export const movieType = {
  now_playing: "now_playing",
  popular: "popular",
  top_rated: "top_rated",
  upcoming: "upcoming",
};

export const tvType = {
  airing_today: "airing_today",
  popular: "popular",
  on_the_air: "on_the_air",
  top_rated: "top_rated",
};

export const movieTvType = {
  now_playing: "now_playing",
  airing_today: "airing_today",
  popular: "popular",
  on_the_air: "on_the_air",
  top_rated: "top_rated",
  upcoming: "upcoming",
};

const tmdpApi = {
  getMovieList: (type, params) => {
    const url = "movie/" + movieType[type];
    return axiosClient.get(url, params);
  },
  getTvList: (type, params) => {
    const url = "tv/" + tvType[type];
    return axiosClient.get(url, params);
  },
  getMovieTv: (cate, type, params) => {
    const url = `${cate}/` + type;
    return axiosClient.get(url, params);
  },
  getVideo: (cate, id) => {
    const url = category[cate] + "/" + id + "/videos";
    return axiosClient.get(url, { params: {} });
  },
  search: (cate, params) => {
    const url = "search/" + category[cate];
    return axiosClient.get(url, params);
  },
  detail: (cate, id, params) => {
    const url = category[cate] + "/" + id;
    return axiosClient.get(url, params);
  },
  discover: (cate, params) => {
    const url = `/discover/${cate}`;
    return axiosClient.get(url, params);
  },
  credits: (cate, id) => {
    const url = `/${cate}/${id}/credits`;
    return axiosClient.get(url, { params: {} });
  },
  similar: (cate, id) => {
    const url = category[cate] + "/" + id + "/similar";
    return axiosClient.get(url, { params: {} });
  },
  getImages: (cate, id) => {
    const url = `/${cate}/${id}/images`;
    return axiosClient.get(url, { params: {} });
  },
  searchMulti: (query, selectedType, params) => {
    const url = "/search/multi";
    return axiosClient.get(url, { params: { query, ...params } });
    // return axiosClient.get(url, { params: { query: query } });
  },
  search: (selectedType, params) => {
    const url = `/search/${selectedType}`;
    return axiosClient.get(url, { params });
  },
};

export default tmdpApi;
