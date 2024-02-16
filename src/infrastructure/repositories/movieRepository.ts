import { log } from "console";
import { movieModel } from "../db/movieModel";
import { IMovieRepo } from "../../interfaces/repos/movieRepo";
import { IMovie, ITMDBMovie } from "../../interfaces/schema/movieSchema";

interface IMovieQuery {
    language?: { $in: string[] };
    genre_ids?: { $in: number[] };
    isDeleted?: boolean;
}


export class MovieRepository implements IMovieRepo {

    async saveMovieDetails(movie: ITMDBMovie): Promise<IMovie | null> {

        return await movieModel.findOneAndUpdate(
            { tmdbId: movie.tmdbId },
            {
                title: movie.title,
                original_title: movie.original_title,
                poster_path: movie.poster_path,
                backdrop_path: movie.backdrop_path,
                overview: movie.overview,
                language: movie.language,
                tmdbId: movie.tmdbId,
                release_date: movie.release_date,
                genre_ids: movie.genre_ids
            },
            { upsert: true }
        )
    }

    async findMoviesLazily(page: number, genreFilters: number[], langFilters: string[], availability: string = 'Available'): Promise<IMovie[]> {

        log(genreFilters, 'genreFilters number array')
        const query: IMovieQuery = {};

        if (genreFilters.length > 0) query.genre_ids = { $in: genreFilters }
        if (langFilters.length > 0) query.language = { $in: langFilters }

        if (availability === 'Available') {
            query.isDeleted = false;
        } else if (availability === 'Deleted') {
            query.isDeleted = true;
        }

        log(query, 'query for finding movies')

        return await movieModel.find(query).skip((page - 1) * 10).limit(10)
    }

    async findMovieByTmdbId(id: number): Promise<IMovie | null> {
        return await movieModel.findOne({ tmdbId: id })
    }

    async findMovieByLanguage(lang: string): Promise<IMovie[]> {
        return await movieModel.find({ language: lang }).hint({ language: 1 });
    }

    async findMovieByGenre(genreId: number): Promise<IMovie[]> {
        return await movieModel.find({ genre_ids: { $in: [genreId] } }).hint({ genre_ids: 1 });
    }

    async findMovieByTitle(title: string, isAdmin: boolean): Promise<IMovie[]> {
        const query = { title: new RegExp(title, 'i') } as { title: RegExp, isDeleted?: boolean }
        if (!isAdmin) query.isDeleted = false
        return await movieModel.find(query);
    }

    async findMovieById(movieId: string): Promise<IMovie | null> {
        return await movieModel.findById({ _id: movieId })
    }

    async findUpcomingMovies(): Promise<IMovie[]> {
        return await movieModel.find({ release_date: { $gt: new Date() } })
    }

    async deleteMovie(id: string): Promise<void | null> {
        const movie = await movieModel.findById({ _id: id })
        log('movie to delete', movie)
        if (movie !== null) {
            movie.isDeleted = !movie.isDeleted
            await movie.save()
        } else {
            throw Error('Something went wrong, movieId didt received')
        }
    }

    async findBannerMovies(): Promise<IMovie[]> {
        return await movieModel.find({
            backdrop_path: { $ne: null },
            release_date: { $lte: new Date() }
        })
        .sort({ release_date: -1 })
        .limit(5);
    }

    async fetchTmdbMovieIds(): Promise<number[]> {
        const tmdbIds = await movieModel.aggregate([
            {
                $group: { _id: '$tmdbId' }
            }
        ])
        return tmdbIds.map(item => item._id)
    }

    async getFilters() {
        const languages = await movieModel.distinct('language').exec()
        const result = await movieModel.aggregate([
            { $unwind: '$genre_ids' }, // Unwind the array to individual documents
            { $group: { _id: '$genre_ids' } }, // Group by genre_ids to get unique values
            { $project: { _id: 0, genreId: '$_id' } }, // Project to rename _id to genreId
        ]).exec();

        const genres = result.map(entry => entry.genreId);
        return { languages, genres }
    }
}