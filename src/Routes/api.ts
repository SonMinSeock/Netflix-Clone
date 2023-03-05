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

export function getMovies() {
  return fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getVideos(id: number) {
  return fetch(
    `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
  ).then((response) => response.json());
}
