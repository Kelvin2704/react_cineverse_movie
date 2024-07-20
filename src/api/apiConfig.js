const apiConfig = {
  baseUrl: "https://api.themoviedb.org/3/",
  apiKey: "cadf3572cef1420299b6f2138e8fc22e",
  originalImage: (imgPath) => `https://image.tmdb.org/t/p/original/${imgPath}`,
  w500Image: (imgPath) => `https://image.tmdb.org/t/p/w500/${imgPath}`,
};

export default apiConfig;
