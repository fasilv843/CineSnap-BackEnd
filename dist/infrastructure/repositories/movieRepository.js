"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieRepository = void 0;
const console_1 = require("console");
const movieModel_1 = require("../../entities/models/movieModel");
class MovieRepository {
    saveMovieDetails(movie) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield movieModel_1.movieModel.findOneAndUpdate({ tmdbId: movie.tmdbId }, {
                title: movie.title,
                original_title: movie.original_title,
                poster_path: movie.poster_path,
                backdrop_path: movie.backdrop_path,
                overview: movie.overview,
                language: movie.language,
                tmdbId: movie.tmdbId,
                release_date: movie.release_date,
                genre_ids: movie.genre_ids
            }, { upsert: true });
        });
    }
    // async findAllMovies(): Promise<IMovie[]> {
    //     return await movieModel.find({})
    // }
    // async findAvailableMovies(): Promise<IMovie[]> {
    //     return await movieModel.find({ isDeleted: false })
    // }
    findMoviesLazily(page, genreFilters, langFilters, availability = 'Available') {
        return __awaiter(this, void 0, void 0, function* () {
            (0, console_1.log)(genreFilters, 'genreFilters number array');
            const query = {};
            if (genreFilters.length > 0)
                query.genre_ids = { $in: genreFilters };
            if (langFilters.length > 0)
                query.language = { $in: langFilters };
            if (availability === 'Available') {
                query.isDeleted = false;
            }
            else if (availability === 'Deleted') {
                query.isDeleted = true;
            }
            (0, console_1.log)(query, 'query for finding movies');
            return yield movieModel_1.movieModel.find(query).skip((page - 1) * 10).limit(10);
        });
    }
    findMovieByTmdbId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield movieModel_1.movieModel.findOne({ tmdbId: id });
        });
    }
    findMovieByLanguage(lang) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield movieModel_1.movieModel.find({ language: lang }).hint({ language: 1 });
        });
    }
    findMovieByGenre(genreId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield movieModel_1.movieModel.find({ genre_ids: { $in: [genreId] } }).hint({ genre_ids: 1 });
        });
    }
    findMovieByTitle(title, isAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { title: new RegExp(title, 'i') };
            if (!isAdmin)
                query.isDeleted = false;
            return yield movieModel_1.movieModel.find(query);
        });
    }
    // async findMovieByTitleAdmin(title: string): Promise<IMovie[]> {
    //     const regex = new RegExp(title, 'i'); // 'i' for case-insensitive search
    //     return await movieModel.find({ title: regex });
    // }
    findMovieById(movieId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield movieModel_1.movieModel.findById({ _id: movieId });
        });
    }
    findUpcomingMovies() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield movieModel_1.movieModel.find({ release_date: { $gt: new Date() } });
        });
    }
    deleteMovie(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const movie = yield movieModel_1.movieModel.findById({ _id: id });
            (0, console_1.log)('movie to delete', movie);
            if (movie !== null) {
                movie.isDeleted = !movie.isDeleted;
                yield movie.save();
            }
            else {
                throw Error('Something went wrong, movieId didt received');
            }
        });
    }
    findBannerMovies() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield movieModel_1.movieModel.find({
                backdrop_path: { $ne: null },
                release_date: { $lte: new Date() }
            })
                .sort({ release_date: -1 })
                .limit(5);
        });
    }
    fetchTmdbMovieIds() {
        return __awaiter(this, void 0, void 0, function* () {
            const tmdbIds = yield movieModel_1.movieModel.aggregate([
                {
                    $group: { _id: '$tmdbId' }
                }
            ]);
            return tmdbIds.map(item => item._id);
        });
    }
    getFilters() {
        return __awaiter(this, void 0, void 0, function* () {
            const languages = yield movieModel_1.movieModel.distinct('language').exec();
            const result = yield movieModel_1.movieModel.aggregate([
                { $unwind: '$genre_ids' },
                { $group: { _id: '$genre_ids' } },
                { $project: { _id: 0, genreId: '$_id' } }, // Project to rename _id to genreId
            ]).exec();
            const genres = result.map(entry => entry.genreId);
            return { languages, genres };
        });
    }
}
exports.MovieRepository = MovieRepository;
