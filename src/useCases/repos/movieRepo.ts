import { IMovie } from "../../entities/movie";
import { ITMDBMovie } from "../../interfaces/schema/movieSchema";

export interface IMovieRepo {
    saveMovieDetails(movie: ITMDBMovie): Promise<IMovie | null>
    findMoviesLazily(page: number, genreFilters: number[], langFilters: string[], availability: string): Promise<IMovie[]>
    findMovieByTmdbId(id: number): Promise<IMovie | null>
    findMovieByLanguage(lang: string): Promise<IMovie[]>
    findMovieByGenre(genreId: number): Promise<IMovie[]>
    findMovieByTitle(title: string, isAdmin: boolean): Promise<IMovie[]>
    findMovieById(movieId: string): Promise<IMovie | null>
    findUpcomingMovies(): Promise<IMovie[]>
    deleteMovie(id: string): Promise<void | null>
    findBannerMovies(): Promise<IMovie[]>
    fetchTmdbMovieIds(): Promise<number[]>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getFilters(): Promise<any> //! Create a type 
}
