import { IMovie } from "../schema/movieSchema";

export interface IMovieRepo {
    saveMovieDetails(movie: IMovie): Promise<IMovie>
    findAllMovies(): Promise<IMovie[]>
    findMovieByLanguage(lang:string): Promise<IMovie[]>
    findMovieByGenre(genreId: number): Promise<IMovie[]>
    findMovieByTitle(title: string): Promise<IMovie[]>
    findMovieById(id: string): Promise<IMovie | null>
    findUpcomingMovies(): Promise<IMovie[]>
    findMovieByTmdbId(id: number): Promise<IMovie | null>
    deleteMovie(id: string):Promise<void | null>
}