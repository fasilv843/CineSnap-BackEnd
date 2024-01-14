import { ID } from "../common";
import { IMovie, ITMDBMovie } from "../schema/movieSchema";

export interface IMovieRepo {
    saveMovieDetails(movie: ITMDBMovie): Promise<IMovie | null>
    // findAllMovies(): Promise<IMovie[]>
    findMovieByLanguage(lang:string): Promise<IMovie[]>
    findMovieByGenre(genreId: number): Promise<IMovie[]>
    findMovieByTitle(title: string, isAdmin: boolean): Promise<IMovie[]>
    findMovieById(id: ID): Promise<IMovie | null>
    findUpcomingMovies(): Promise<IMovie[]>
    findMovieByTmdbId(id: number): Promise<IMovie | null>
    deleteMovie(id: ID): Promise<void | null>
}