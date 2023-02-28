const API_KEY = "29a901df37269d1e2e2c2ce87d8ec576";
const BASE_URL = "https://api.themoviedb.org/3";

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

export function getMovies() {
  return fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
