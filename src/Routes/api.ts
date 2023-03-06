export const API_KEY = "29a901df37269d1e2e2c2ce87d8ec576";
export const BASE_URL = "https://api.themoviedb.org/3";
export const VIDEO_URL = "https://www.youtube.com/watch";

export interface IMovie {
  id: number;
  backdrop_path: string;
  title: string;
  overview: string;
  poster_path: string;
}

export interface ITv {
  id: number;
  backdrop_path: string;
  name: string;
  overview: string;
  vote_average: number;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IVideo {
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

export interface IGetVideoResult {
  id: number;
  results: IVideo[];
}

export interface IGetPopularResult {
  results: IMovie[];
}

export interface IGetTopRatedResult {
  results: IMovie[];
}

export interface IGetUpcomingResult {
  results: IMovie[];
}

export interface IGetPopularTvResult {
  results: ITv[];
}

export interface IGetSearchMovieResult {
  results: IMovie[];
}

export function getMovies() {
  return fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getPopulationMovies() {
  return fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getVideos(id: number) {
  return fetch(
    `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
  ).then((response) => response.json());
}

export function getTopRatedMovies() {
  return fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getUpcommingMovies() {
  return fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getPopularTv() {
  return fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export function getVideosTv(id: number) {
  return fetch(
    `${BASE_URL}/tv/${id}/videos?api_key=${API_KEY}&language=en-US`
  ).then((response) => response.json());
}

export function getSearchMovies(keyword: string) {
  return fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${keyword}&page=1&include_adult=false`
  ).then((response) => response.json());
}
