import { movieModel } from "../../entities/models/movieModel";
import { ID } from "../../interfaces/common";
import { IMovieRepo } from "../../interfaces/repos/movieRepo";
import { IMovie, ITMDBMovie } from "../../interfaces/schema/movieSchema";




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

    async findAllMovies(): Promise<IMovie[]> {
        return await movieModel.find({})
    }

    async findAvailableMovies(): Promise<IMovie[]> {
        return await movieModel.find({ isDeleted: false })
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

    async findMovieByTitle(title: string): Promise<IMovie[]> {
        const regex = new RegExp(title, 'i'); // 'i' for case-insensitive search
        return await movieModel.find({ title: regex, isDeleted: false });
    }
    

    async findMovieById(id: string): Promise<IMovie | null> {
        return await movieModel.findById({ _id: id })
    }

    async findUpcomingMovies(): Promise<IMovie[]> {
        return await movieModel.find({ release_date: { $gt: new Date() } })
    }

    async deleteMovie(id: ID): Promise<void | null> {
        const movie = await movieModel.findById({ _id: id })
        if (movie !== null) {
            movie.isDeleted = !movie.isDeleted
            await movie.save()
        } else {
            throw Error('Something went wrong, movieId didt received')
        }
    }

    async findBannerMovies(): Promise<IMovie[]> {
        const last10Days = new Date();
        const upcoming15Days = new Date();

        // Set last 10 days
        last10Days.setDate(new Date().getDate() - 10);

        // Set upcoming 15 days
        upcoming15Days.setDate(new Date().getDate() + 15);

        return await movieModel.find(
            {
                backdrop_path: { $ne: null },
                release_date: {
                    $gte: last10Days,
                    $lte: upcoming15Days
                }
            }
        ).limit(5)
    }

    async fetchTmdbMovieIds (): Promise<number[]> {
        const tmdbIds = await movieModel.aggregate([
            {
                $group: { _id: '$tmdbId' }
            }
        ])
        return tmdbIds.map(item => item._id)
    }

    async getFilters () {
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